<?php
namespace Vitrina\Controllers;

use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Actividad;
use Vitrina\Models\Archivo;
use Vitrina\Models\Meta;
use Vitrina\Models\Proyecto;
use Vitrina\Models\Usuario;
use Vitrina\Models\Version;

final class ProyectoController extends Controlador
{
    public function detalle()
    {
        $this->auth->requerirUsuario();
        $id = $this->peticion->query('id') !== null ? (string) $this->peticion->query('id') : '';
        Respuesta::json([
            'versiones' => (new Version($this->db))->deProyecto($id),
            'actividad' => (new Actividad($this->db))->deProyecto($id, 200),
        ]);
    }

    public function crear()
    {
        $u = $this->auth->requerirUsuario();
        $usuarios = new Usuario($this->db);
        $nombre = texto($this->campo('nombre', ''), 120);
        if ($nombre === '') {
            Respuesta::error('Escribe un nombre para el proyecto.');
        }
        $estado = in_array($this->campo('estado'), Proyecto::ESTADOS, true) ? $this->campo('estado') : 'progreso';
        $prioridad = in_array($this->campo('prioridad'), Proyecto::PRIORIDADES, true) ? $this->campo('prioridad') : 'media';
        $enc = normUsuario($this->campo('encargado', ''));
        $h = $this->campo('horasEstimadas');
        $horas = $h !== null && is_numeric($h) && $h > 0 ? round((float) $h, 2) : null;
        $id = nuevoId('p');
        (new Proyecto($this->db))->crear([
            'id' => $id,
            'nombre' => $nombre,
            'descripcion' => texto($this->campo('descripcion', ''), 2000),
            'estado' => $estado,
            'encargado' => $usuarios->existe($enc) ? $enc : null,
            'prioridad' => $prioridad,
            'entrega' => esFecha($this->campo('entrega')) ? $this->campo('entrega') : null,
            'horas_estimadas' => $horas,
            'creado_por' => $u['id'],
            'creado' => ahora(),
        ]);
        (new Actividad($this->db))->registrar($id, $u['id'], 'creado');
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['id' => $id]);
    }

    public function actualizar()
    {
        $u = $this->auth->requerirUsuario();
        $usuarios = new Usuario($this->db);
        $p = $this->proyectoOFallar($this->campo('id', ''));
        $c = is_array($this->campo('campos')) ? $this->campo('campos') : [];
        $set = [];
        $vals = [];
        $logs = [];
        if (array_key_exists('nombre', $c)) {
            $n = texto($c['nombre'], 120);
            if ($n !== '' && $n !== $p['nombre']) {
                $set[] = 'nombre = ?';
                $vals[] = $n;
            }
        }
        if (array_key_exists('descripcion', $c)) {
            $set[] = 'descripcion = ?';
            $vals[] = texto($c['descripcion'], 2000);
        }
        if (array_key_exists('estado', $c) && in_array($c['estado'], Proyecto::ESTADOS, true) && $c['estado'] !== $p['estado']) {
            $set[] = 'estado = ?';
            $vals[] = $c['estado'];
            $set[] = 'estado_desde = ?';
            $vals[] = ahora();
            $logs[] = ['estado', ['de' => $p['estado'], 'a' => $c['estado']]];
        }
        if (array_key_exists('encargado', $c)) {
            $e = normUsuario($c['encargado']);
            $e = $usuarios->existe($e) ? $e : null;
            if ($e !== $p['encargado']) {
                $set[] = 'encargado = ?';
                $vals[] = $e;
                $logs[] = ['encargado', ['a' => $e === null ? '' : $e]];
            }
        }
        if (array_key_exists('prioridad', $c) && in_array($c['prioridad'], Proyecto::PRIORIDADES, true) && $c['prioridad'] !== $p['prioridad']) {
            $set[] = 'prioridad = ?';
            $vals[] = $c['prioridad'];
            $logs[] = ['prioridad', ['a' => $c['prioridad']]];
        }
        if (array_key_exists('entrega', $c)) {
            $f = esFecha($c['entrega']) ? $c['entrega'] : null;
            if ($f !== $p['entrega']) {
                $set[] = 'entrega = ?';
                $vals[] = $f;
                $logs[] = ['entrega', ['a' => $f === null ? '' : $f]];
            }
        }
        if (array_key_exists('horasEstimadas', $c)) {
            $set[] = 'horas_estimadas = ?';
            $vals[] = is_numeric($c['horasEstimadas']) && $c['horasEstimadas'] > 0 ? round((float) $c['horasEstimadas'], 2) : null;
        }
        if (array_key_exists('paginaInicio', $c)) {
            $set[] = 'pagina_inicio = ?';
            $vals[] = is_string($c['paginaInicio']) && $c['paginaInicio'] !== '' ? texto($c['paginaInicio'], 500) : null;
        }
        if (!$set) {
            Respuesta::json(['ok' => true]);
        }
        $set[] = 'actualizado = ?';
        $vals[] = ahora();
        (new Proyecto($this->db))->actualizar($p['id'], $set, $vals);
        $actividad = new Actividad($this->db);
        foreach ($logs as $l) {
            $actividad->registrar($p['id'], $u['id'], $l[0], $l[1]);
        }
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['ok' => true]);
    }

    public function borrar()
    {
        $this->auth->requerirAdmin();
        $p = $this->proyectoOFallar($this->campo('id', ''));
        $proyectos = new Proyecto($this->db);
        $shas = $proyectos->shasDeArchivos($p['id']);
        $proyectos->borrarConTodo($p['id'], new Meta($this->db));
        /* Solo se borran del disco los archivos que ya no usa ninguna otra versión. */
        $usos = (new Version($this->db))->contadorDeUsos();
        $borrados = 0;
        foreach ($shas as $s) {
            if ($usos($s) === 0 && esSha($s) && Archivo::borrar($s)) {
                $borrados++;
            }
        }
        Respuesta::json(['ok' => true, 'archivosBorrados' => $borrados]);
    }
}
