<?php
namespace Vitrina\Controllers;

use Vitrina\Core\Config;
use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Archivo;

/* Entrega y recepción de los archivos de los proyectos. */
final class ArchivoController extends Controlador
{
    public function descargar()
    {
        $this->auth->requerirUsuario();
        $sha = $this->peticion->query('sha') !== null ? (string) $this->peticion->query('sha') : '';
        if (!esSha($sha)) {
            Respuesta::error('Archivo no válido.');
        }
        $ruta = Archivo::ruta($sha);
        if (!is_file($ruta)) {
            Respuesta::error('No se encontró el archivo.', 404);
        }
        if (ini_get('zlib.output_compression')) {
            ini_set('zlib.output_compression', 'Off');
        }
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        header('Content-Type: application/octet-stream');
        header('Content-Length: ' . filesize($ruta));
        header('Content-Disposition: attachment; filename="' . $sha . '"');
        header('Content-Security-Policy: sandbox');
        header('Cache-Control: private, max-age=31536000, immutable');
        readfile($ruta);
        exit;
    }

    public function existentes()
    {
        $this->auth->requerirUsuario();
        $shas = is_array($this->campo('shas')) ? array_slice($this->campo('shas'), 0, 3000) : [];
        $existentes = [];
        foreach ($shas as $s) {
            if (esSha($s) && Archivo::existe($s)) {
                $existentes[] = $s;
            }
        }
        Respuesta::json(['existentes' => $existentes]);
    }

    /* Recibe un archivo por partes; al llegar la última verifica el SHA-256 y lo guarda. */
    public function subirParte()
    {
        $this->auth->requerirUsuario();
        $q = $this->peticion;
        $sha = $q->query('sha') !== null ? (string) $q->query('sha') : '';
        $off = $q->query('off') !== null ? (int) $q->query('off') : -1;
        $total = $q->query('total') !== null ? (int) $q->query('total') : -1;
        $tk = $q->query('tk') !== null ? (string) $q->query('tk') : '';
        $maxMb = (int) Config::get('max_archivo_mb', 100);
        if (!esSha($sha) || $off < 0 || $total < 0 || !preg_match('/^[a-z0-9]{6,24}$/', $tk)) {
            Respuesta::error('Parte no válida.');
        }
        if ($total > $maxMb * 1048576) {
            Respuesta::error('El archivo supera el máximo de ' . $maxMb . ' MB.', 413);
        }
        $destino = Archivo::ruta($sha);
        if (is_file($destino)) {
            Respuesta::json(['listo' => true]);
        }
        if (!is_dir(VT_DIR_TMP) && !@mkdir(VT_DIR_TMP, 0755, true)) {
            Respuesta::error('No se pudo crear la carpeta temporal en datos/.', 500);
        }
        if (mt_rand(1, 40) === 1) {
            Archivo::limpiarTemporales();
        }
        $tmp = Archivo::rutaTemporal($sha, $tk);
        clearstatcache();
        $actual = is_file($tmp) ? filesize($tmp) : 0;
        if ($off !== 0 && $off !== $actual) {
            Respuesta::error('Parte fuera de orden.', 409);
        }
        $antes = $off === 0 ? 0 : $actual;
        /* La parte llega como cuerpo binario o, si el firewall del hosting lo bloquea, como formulario. */
        $origen = 'php://input';
        $esperado = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : -1;
        if (isset($_FILES['parte'])) {
            $parte = $_FILES['parte'];
            if (!is_array($parte) || !isset($parte['error']) || $parte['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($parte['tmp_name'])) {
                Respuesta::error('La parte del archivo no llegó completa al servidor.', 500);
            }
            $origen = $parte['tmp_name'];
            $esperado = (int) $parte['size'];
        }
        $entrada = fopen($origen, 'rb');
        $salida = fopen($tmp, $off === 0 ? 'wb' : 'ab');
        if (!$entrada || !$salida) {
            Respuesta::error('No se pudo guardar la parte del archivo en datos/tmp.', 500);
        }
        $escritos = stream_copy_to_stream($entrada, $salida, $total - $off + 1);
        fclose($entrada);
        fclose($salida);
        clearstatcache(true, $tmp);
        $tam = is_file($tmp) ? filesize($tmp) : 0;
        if ($escritos === false || ($esperado >= 0 && $tam < $antes + min($esperado, $total - $off))) {
            @unlink($tmp);
            Respuesta::error('El servidor no pudo guardar el archivo completo. Revisa el espacio libre del hosting.', 507, 'espacio');
        }
        if ($tam > $total) {
            @unlink($tmp);
            Respuesta::error('El archivo llegó con un tamaño incorrecto. Vuelve a subirlo.', 422);
        }
        if ($tam < $total) {
            Respuesta::json(['listo' => false, 'recibido' => $tam]);
        }
        if (hash_file('sha256', $tmp) !== $sha) {
            @unlink($tmp);
            Respuesta::error('El archivo llegó dañado. Vuelve a subirlo.', 422);
        }
        $carpeta = dirname($destino);
        if (!is_dir($carpeta) && !@mkdir($carpeta, 0755, true)) {
            @unlink($tmp);
            Respuesta::error('No se pudo crear la carpeta de archivos en datos/.', 500);
        }
        if (!@rename($tmp, $destino)) {
            @unlink($tmp);
            if (!is_file($destino)) {
                Respuesta::error('No se pudo guardar el archivo.', 500);
            }
        }
        Respuesta::json(['listo' => true]);
    }
}
