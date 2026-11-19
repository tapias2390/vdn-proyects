<?php
namespace Vitrina\Models;

use PDO;

/* Tabla vt_usuarios. */
final class Usuario extends Modelo
{
    private static $ids = null;

    public function buscar($id)
    {
        $st = $this->db->prepare('SELECT * FROM vt_usuarios WHERE id = ?');
        $st->execute([$id]);
        return $st->fetch();
    }

    public function existe($id)
    {
        if (self::$ids === null) {
            self::$ids = $this->db->query('SELECT id FROM vt_usuarios')->fetchAll(PDO::FETCH_COLUMN);
        }
        return is_string($id) && in_array($id, self::$ids, true);
    }

    public function hashClave($id)
    {
        $st = $this->db->prepare('SELECT clave_hash FROM vt_usuarios WHERE id = ?');
        $st->execute([$id]);
        return (string) $st->fetchColumn();
    }

    public function guardarIntentos($id, $fallos, $bloqueadoHasta)
    {
        $this->db->prepare('UPDATE vt_usuarios SET fallos = ?, bloqueado_hasta = ? WHERE id = ?')->execute([$fallos, $bloqueadoHasta, $id]);
    }

    public function limpiarIntentos($id)
    {
        $this->db->prepare('UPDATE vt_usuarios SET fallos = 0, bloqueado_hasta = 0 WHERE id = ?')->execute([$id]);
    }

    public function actualizarHash($id, $hash)
    {
        $this->db->prepare('UPDATE vt_usuarios SET clave_hash = ? WHERE id = ?')->execute([$hash, $id]);
    }

    public function cambiarClave($id, $hash, $sello)
    {
        $this->db->prepare('UPDATE vt_usuarios SET clave_hash = ?, sello = ?, actualizado = ? WHERE id = ?')->execute([$hash, $sello, ahora(), $id]);
    }

    public function restablecerClave($id, $hash, $sello)
    {
        $this->db->prepare('UPDATE vt_usuarios SET clave_hash = ?, sello = ?, actualizado = ?, fallos = 0, bloqueado_hasta = 0 WHERE id = ?')->execute([$hash, $sello, ahora(), $id]);
    }

    public function listar()
    {
        return array_map(function ($r) {
            return ['id' => $r['id'], 'nombre' => $r['nombre'], 'esAdmin' => (int) $r['es_admin'] === 1, 'actualizado' => (int) $r['actualizado']];
        }, $this->db->query('SELECT id, nombre, es_admin, actualizado FROM vt_usuarios ORDER BY id')->fetchAll());
    }
}
