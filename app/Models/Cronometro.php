<?php
namespace Vitrina\Models;

/* Tabla vt_cronometros: un cronómetro activo por miembro. */
final class Cronometro extends Modelo
{
    /* miembro => ['proyectoId' => ..., 'inicio' => ...] */
    public function activos()
    {
        $cronos = [];
        foreach ($this->db->query('SELECT * FROM vt_cronometros')->fetchAll() as $c) {
            $cronos[$c['miembro']] = ['proyectoId' => $c['proyecto_id'], 'inicio' => (int) $c['inicio']];
        }
        return $cronos;
    }

    public function iniciar($miembro, $proyectoId, $inicio)
    {
        $this->db->prepare('DELETE FROM vt_cronometros WHERE miembro = ?')->execute([$miembro]);
        $this->db->prepare('INSERT INTO vt_cronometros (miembro, proyecto_id, inicio) VALUES (?, ?, ?)')->execute([$miembro, $proyectoId, $inicio]);
    }

    /* Detiene el cronómetro del miembro y, si pasó al menos 1 minuto, lo guarda como horas. */
    public function detener($miembro, $fecha)
    {
        $st = $this->db->prepare('SELECT * FROM vt_cronometros WHERE miembro = ?');
        $st->execute([$miembro]);
        $c = $st->fetch();
        if (!$c) {
            return null;
        }
        $inicio = (int) $c['inicio'];
        $fin = ahora();
        $min = (int) round(($fin - $inicio) / 60000);
        if ($min >= 1) {
            (new Tiempo($this->db))->crear([
                'id' => nuevoId('t'), 'proyecto_id' => $c['proyecto_id'], 'miembro' => $miembro, 'minutos' => $min,
                'fecha' => esFecha($fecha) ? $fecha : date('Y-m-d', intdiv($inicio, 1000)),
                'inicio' => $inicio, 'fin' => $fin, 'nota' => '', 'origen' => 'cronometro', 'creado' => $fin, 'por' => $miembro,
            ]);
        }
        $this->db->prepare('DELETE FROM vt_cronometros WHERE miembro = ?')->execute([$miembro]);
        return ['minutos' => $min, 'proyectoId' => $c['proyecto_id']];
    }
}
