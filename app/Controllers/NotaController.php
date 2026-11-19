<?php
namespace Vitrina\Controllers;

use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Meta;
use Vitrina\Models\Nota;

final class NotaController extends Controlador
{
    public function crear()
    {
        $u = $this->auth->requerirUsuario();
        $p = $this->proyectoOFallar($this->campo('proyectoId', ''));
        $txt = texto($this->campo('texto', ''), 4000);
        if ($txt === '') {
            Respuesta::error('Escribe la nota.');
        }
        $vn = $this->campo('versionN');
        $id = nuevoId('n');
        (new Nota($this->db))->crear(
            $id, $p['id'], $u['id'], $txt, ahora(),
            $this->campo('pagina') ? texto($this->campo('pagina'), 500) : null,
            $this->campo('versionId') ? texto($this->campo('versionId'), 40) : null,
            $vn !== null && is_numeric($vn) ? (int) $vn : null
        );
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['id' => $id]);
    }

    public function resolver()
    {
        $u = $this->auth->requerirUsuario();
        (new Nota($this->db))->resolver((string) $this->campo('id', ''), (bool) $this->campo('resuelta'), $u['id']);
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['ok' => true]);
    }

    public function borrar()
    {
        $u = $this->auth->requerirUsuario();
        $notas = new Nota($this->db);
        $id = (string) $this->campo('id', '');
        $autor = $notas->autor($id);
        if ($autor === false) {
            Respuesta::json(['ok' => true]);
        }
        if ($autor !== $u['id'] && !$u['esAdmin']) {
            Respuesta::error('Solo quien escribió la nota puede borrarla.', 403);
        }
        $notas->borrar($id);
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['ok' => true]);
    }
}
