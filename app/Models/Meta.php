<?php
namespace Vitrina\Models;

/* Tabla vt_meta: contador de cambios que usa el panel para saber si recargar. */
final class Meta extends Modelo
{
    public function marcarCambio()
    {
        $this->db->exec("UPDATE vt_meta SET valor = valor + 1 WHERE clave = 'cambios'");
    }

    public function versionDatos()
    {
        return (int) $this->db->query("SELECT valor FROM vt_meta WHERE clave = 'cambios'")->fetchColumn();
    }
}
