<?php
namespace Vitrina\Models;

/* Tabla vt_sesiones. Los tokens se guardan como hash SHA-256. */
final class Sesion extends Modelo
{
    public function crear($tokenHash, $usuario, $sello, $creada, $expira)
    {
        $this->db->prepare('INSERT INTO vt_sesiones (token, usuario, sello, creada, expira) VALUES (?, ?, ?, ?, ?)')
            ->execute([$tokenHash, $usuario, $sello, $creada, $expira]);
    }

    public function buscarPorToken($tokenHash)
    {
        $st = $this->db->prepare('SELECT s.usuario, s.sello AS sello_sesion, s.expira, u.nombre, u.es_admin, u.sello FROM vt_sesiones s JOIN vt_usuarios u ON u.id = s.usuario WHERE s.token = ?');
        $st->execute([$tokenHash]);
        return $st->fetch();
    }

    public function borrarToken($tokenHash)
    {
        $this->db->prepare('DELETE FROM vt_sesiones WHERE token = ?')->execute([$tokenHash]);
    }

    public function borrarDeUsuario($usuario)
    {
        $this->db->prepare('DELETE FROM vt_sesiones WHERE usuario = ?')->execute([$usuario]);
    }

    public function borrarVencidas($t)
    {
        $this->db->prepare('DELETE FROM vt_sesiones WHERE expira < ?')->execute([$t]);
    }
}
