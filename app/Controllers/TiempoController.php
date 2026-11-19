<?php
namespace Vitrina\Controllers;

use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Cronometro;
use Vitrina\Models\Meta;
use Vitrina\Models\Tiempo;
use Vitrina\Models\Usuario;

/* Horas manuales y cronómetro. */
final class TiempoController extends Controlador
{
    public function crear()
    {
        $u = $this->auth->requerirUsuario();
        $p = $this->proyectoOFallar($this->campo('proyectoId', ''));
        $miembro = normUsuario($this->campo('miembro', ''));
        if (!(new Usuario($this->db))->existe($miembro)) {
            $miembro = $u['id'];
        }
        $m = $this->campo('minutos');
        $min = (int) round($m !== null && is_numeric($m) ? (float) $m : 0);
        if ($min < 1 || $min > 1440) {
            Respuesta::error('Escribe las horas trabajadas, entre 0,25 y 24.');
        }
        $id = nuevoId('t');
        (new Tiempo($this->db))->crear([
            'id' => $id, 'proyecto_id' => $p['id'], 'miembro' => $miembro, 'minutos' => $min,
            'fecha' => esFecha($this->campo('fecha')) ? $this->campo('fecha') : date('Y-m-d'),
            'inicio' => null, 'fin' => null,
            'nota' => texto($this->campo('nota', ''), 140), 'origen' => 'manual', 'creado' => ahora(), 'por' => $u['id'],
        ]);
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['id' => $id]);
    }

    public function borrar()
    {
        $u = $this->auth->requerirUsuario();
        $tiempos = new Tiempo($this->db);
        $id = (string) $this->campo('id', '');
        $fila = $tiempos->duenos($id);
        if (!$fila) {
            Respuesta::json(['ok' => true]);
        }
        if ($fila['miembro'] !== $u['id'] && $fila['por'] !== $u['id'] && !$u['esAdmin']) {
            Respuesta::error('Solo puedes borrar tus propias horas.', 403);
        }
        $tiempos->borrar($id);
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['ok' => true]);
    }

    public function iniciarCrono()
    {
        $u = $this->auth->requerirUsuario();
        $p = $this->proyectoOFallar($this->campo('proyectoId', ''));
        $cronos = new Cronometro($this->db);
        $previo = $cronos->detener($u['id'], $this->campo('fecha'));
        $inicio = ahora();
        $cronos->iniciar($u['id'], $p['id'], $inicio);
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['inicio' => $inicio, 'previo' => $previo]);
    }

    public function detenerCrono()
    {
        $u = $this->auth->requerirUsuario();
        $r = (new Cronometro($this->db))->detener($u['id'], $this->campo('fecha'));
        (new Meta($this->db))->marcarCambio();
        Respuesta::json($r ? $r : ['minutos' => 0, 'proyectoId' => null]);
    }
}
