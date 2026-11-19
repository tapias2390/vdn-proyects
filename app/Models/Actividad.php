<?php
namespace Vitrina\Models;

/* Tabla vt_actividad: historial de cambios de cada proyecto. */
final class Actividad extends Modelo
{
    public function registrar($proyectoId, $usuario, $tipo, $extra = [])
    {
        $this->db->prepare('INSERT INTO vt_actividad (proyecto_id, usuario, tipo, de, a, n, detalle, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')->execute([
            $proyectoId, $usuario, $tipo,
            isset($extra['de']) ? texto($extra['de'], 40) : null,
            isset($extra['a']) ? texto($extra['a'], 60) : null,
            isset($extra['n']) ? (int) $extra['n'] : null,
            isset($extra['detalle']) ? texto($extra['detalle'], 400) : null,
            ahora(),
        ]);
    }

    public function recientes($limite = 60)
    {
        return array_map([self::class, 'mapear'], $this->db->query('SELECT * FROM vt_actividad ORDER BY fecha DESC, id DESC LIMIT ' . (int) $limite)->fetchAll());
    }

    public function deProyecto($proyectoId, $limite = 200)
    {
        $st = $this->db->prepare('SELECT * FROM vt_actividad WHERE proyecto_id = ? ORDER BY fecha DESC, id DESC LIMIT ' . (int) $limite);
        $st->execute([$proyectoId]);
        return array_map([self::class, 'mapear'], $st->fetchAll());
    }

    public static function mapear($r)
    {
        return ['id' => (string) $r['id'], 'proyectoId' => $r['proyecto_id'], 'usuario' => $r['usuario'], 'tipo' => $r['tipo'], 'de' => $r['de'], 'a' => $r['a'], 'n' => entero($r['n']), 'detalle' => $r['detalle'], 'fecha' => (int) $r['fecha']];
    }
}
