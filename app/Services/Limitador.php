<?php
namespace Vitrina\Services;

/*
 * Cuenta intentos fallidos por clave (por ejemplo, la IP) dentro de una ventana de tiempo.
 * Se guarda en datos/limites/ (protegida por datos/.htaccess); el nombre del archivo
 * es el SHA-256 de la clave, así no queda la IP en claro.
 */
final class Limitador
{
    private $archivo;

    public function __construct($clave)
    {
        $dir = VT_DIR_DATOS . '/limites';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $this->archivo = $dir . '/' . hash('sha256', (string) $clave) . '.json';
        if (mt_rand(1, 50) === 1) {
            self::limpiarViejos($dir);
        }
    }

    /* Segundos que faltan para poder volver a intentar (0 si no está bloqueado). */
    public function segundosBloqueado($maxIntentos, $ventanaSegundos)
    {
        if ($maxIntentos <= 0) {
            return 0;
        }
        $marcas = $this->leer($ventanaSegundos);
        if (count($marcas) < $maxIntentos) {
            return 0;
        }
        sort($marcas);
        $libre = $marcas[count($marcas) - $maxIntentos] + $ventanaSegundos;
        return max(1, $libre - time());
    }

    public function registrarFallo($ventanaSegundos)
    {
        $f = @fopen($this->archivo, 'c+');
        if (!$f) {
            return;
        }
        if (flock($f, LOCK_EX)) {
            $marcas = self::filtrar(json_decode((string) stream_get_contents($f), true), $ventanaSegundos);
            $marcas[] = time();
            $marcas = array_slice($marcas, -200);
            ftruncate($f, 0);
            rewind($f);
            fwrite($f, json_encode($marcas));
            fflush($f);
            flock($f, LOCK_UN);
        }
        fclose($f);
    }

    private function leer($ventanaSegundos)
    {
        if (!is_file($this->archivo)) {
            return [];
        }
        return self::filtrar(json_decode((string) @file_get_contents($this->archivo), true), $ventanaSegundos);
    }

    private static function filtrar($marcas, $ventanaSegundos)
    {
        $desde = time() - $ventanaSegundos;
        $out = [];
        foreach (is_array($marcas) ? $marcas : [] as $t) {
            if (is_int($t) && $t > $desde) {
                $out[] = $t;
            }
        }
        return $out;
    }

    private static function limpiarViejos($dir)
    {
        foreach (glob($dir . '/*.json') ?: [] as $f) {
            if (is_file($f) && filemtime($f) < time() - 86400) {
                @unlink($f);
            }
        }
    }
}
