<?php
namespace Vitrina\Models;

/* Tabla vt_tiempos: horas trabajadas (manuales o del cronómetro). */
final class Tiempo extends Modelo
{
    public function listar()
    {
        return array_map([self::class, 'mapear'], $this->db->query('SELECT * FROM vt_tiempos ORDER BY creado')->fetchAll());
    }

    public function crear(array $d)
    {
        $this->db->prepare('INSERT INTO vt_tiempos (id, proyecto_id, miembro, minutos, fecha, inicio, fin, nota, origen, creado, por) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([
            $d['id'], $d['proyecto_id'], $d['miembro'], $d['minutos'], $d['fecha'], $d['inicio'], $d['fin'], $d['nota'], $d['origen'], $d['creado'], $d['por'],
        ]);
    }

    /* ['miembro' => ..., 'por' => ...] o false. */
    public function duenos($id)
    {
        $st = $this->db->prepare('SELECT miembro, por FROM vt_tiempos WHERE id = ?');
        $st->execute([$id]);
        return $st->fetch();
    }

    public function borrar($id)
    {
        $this->db->prepare('DELETE FROM vt_tiempos WHERE id = ?')->execute([$id]);
    }

    public static function mapear($r)
    {
        return ['id' => $r['id'], 'proyectoId' => $r['proyecto_id'], 'miembro' => $r['miembro'], 'minutos' => (int) $r['minutos'], 'fecha' => $r['fecha'], 'inicio' => entero($r['inicio']), 'fin' => entero($r['fin']), 'nota' => (string) $r['nota'], 'origen' => $r['origen'], 'creado' => (int) $r['creado'], 'por' => $r['por']];
    }
}
