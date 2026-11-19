<?php
namespace Vitrina\Controllers;

use Throwable;
use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Actividad;
use Vitrina\Models\Archivo;
use Vitrina\Models\Meta;
use Vitrina\Models\Nota;
use Vitrina\Models\Proyecto;
use Vitrina\Models\Version;

final class VersionController extends Controlador
{
    public function ver()
    {
        $this->auth->requerirUsuario();
        $versiones = new Version($this->db);
        $id = $this->peticion->query('id') !== null ? (string) $this->peticion->query('id') : '';
        $v = $versiones->buscar($id);
        if (!$v) {
            Respuesta::error('No se encontró esa versión.', 404);
        }
        $archivos = $versiones->archivos($id);
        $pag = json_decode((string) $v['paginas'], true);
        $omit = json_decode((string) $v['omitidos'], true);
        Respuesta::json(['id' => $v['id'], 'proyectoId' => $v['proyecto_id'], 'n' => (int) $v['n'], 'entrada' => $v['entrada'], 'paginas' => is_array($pag) ? $pag : [], 'nombreZip' => $v['nombre_zip'], 'subidoPor' => $v['subido_por'], 'fecha' => (int) $v['fecha'], 'bytes' => (int) $v['bytes'], 'omitidos' => is_array($omit) ? $omit : [], 'archivos' => $archivos]);
    }

    public function crear()
    {
        $u = $this->auth->requerirUsuario();
        $p = $this->proyectoOFallar($this->campo('proyectoId', ''));
        $lista = is_array($this->campo('archivos')) ? $this->campo('archivos') : [];
        if (!$lista) {
            Respuesta::error('La versión no tiene archivos.');
        }
        if (count($lista) > 3000) {
            Respuesta::error('La versión tiene demasiados archivos (máximo 3.000).');
        }
        $rutas = [];
        $limpia = [];
        $faltan = [];
        $total = 0;
        foreach ($lista as $f) {
            if (!is_array($f)) {
                continue;
            }
            $ruta = texto(isset($f['p']) ? $f['p'] : '', 500);
            $sha = isset($f['sha']) ? (string) $f['sha'] : '';
            if ($ruta === '' || !esSha($sha) || isset($rutas[$ruta])) {
                continue;
            }
            if (!Archivo::existe($sha)) {
                $faltan[] = $ruta;
                continue;
            }
            $tam = isset($f['s']) ? max(0, (int) $f['s']) : 0;
            $rutas[$ruta] = true;
            $total += $tam;
            $limpia[] = [$ruta, $sha, texto(isset($f['m']) ? $f['m'] : 'application/octet-stream', 100), $tam];
        }
        if ($faltan) {
            Respuesta::error('Faltan archivos por subir: ' . implode(', ', array_slice($faltan, 0, 5)), 409);
        }
        $entrada = texto($this->campo('entrada', ''), 500);
        if (!isset($rutas[$entrada])) {
            Respuesta::error('La página de inicio no está entre los archivos.');
        }
        $paginas = [];
        foreach (is_array($this->campo('paginas')) ? $this->campo('paginas') : [] as $x) {
            if (is_string($x) && isset($rutas[$x])) {
                $paginas[] = $x;
            }
        }
        $omitidos = [];
        foreach (is_array($this->campo('omitidos')) ? array_slice($this->campo('omitidos'), 0, 60) : [] as $o) {
            if (is_array($o)) {
                $omitidos[] = ['p' => texto(isset($o['p']) ? $o['p'] : '', 300), 'r' => texto(isset($o['r']) ? $o['r'] : '', 160)];
            }
        }
        $cambios = texto($this->campo('cambios', ''), 600);
        $nombreZip = texto($this->campo('nombreZip', ''), 200);
        $vid = nuevoId('m');
        $t = ahora();
        $versiones = new Version($this->db);

        $this->db->beginTransaction();
        try {
            $n = $versiones->siguienteNumero($p['id']);
            $versiones->crear([
                'id' => $vid, 'proyecto_id' => $p['id'], 'n' => $n, 'entrada' => $entrada, 'paginas' => $paginas,
                'nombre_zip' => $nombreZip, 'subido_por' => $u['id'], 'fecha' => $t, 'bytes' => $total,
                'archivos' => count($limpia), 'omitidos' => $omitidos,
            ]);
            $versiones->agregarArchivos($vid, $limpia);
            (new Proyecto($this->db))->ponerVersion($p['id'], $vid, $t);
            if ($n > 1 || $cambios !== '') {
                (new Actividad($this->db))->registrar($p['id'], $u['id'], 'version', ['n' => $n, 'detalle' => $cambios]);
            }
            if ($cambios !== '') {
                (new Nota($this->db))->crear(nuevoId('n'), $p['id'], $u['id'], 'Versión v' . $n . ': ' . $cambios, $t + 1, $entrada, $vid, $n);
            }
            (new Meta($this->db))->marcarCambio();
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
        Respuesta::json(['version' => ['id' => $vid, 'n' => $n, 'entrada' => $entrada, 'archivos' => count($limpia), 'bytes' => $total, 'fecha' => $t, 'por' => $u['id'], 'nombreZip' => $nombreZip]]);
    }
}
