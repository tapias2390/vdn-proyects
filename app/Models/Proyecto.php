<?php
namespace Vitrina\Models;

use PDO;
use Throwable;

/* Tabla vt_proyectos. */
final class Proyecto extends Modelo
{
    const ESTADOS = ['pendiente', 'progreso', 'revision', 'ajustes', 'terminado'];
    const PRIORIDADES = ['baja', 'media', 'alta'];

    public function buscar($id)
    {
        $st = $this->db->prepare('SELECT * FROM vt_proyectos WHERE id = ?');
        $st->execute([(string) $id]);
        return $st->fetch();
    }

    /* Todos los proyectos con los datos de su versión actual. */
    public function listar()
    {
        return array_map([self::class, 'mapear'], $this->db->query('SELECT p.*, v.id AS v_id, v.n AS v_n, v.entrada AS v_entrada, v.archivos AS v_archivos, v.bytes AS v_bytes, v.fecha AS v_fecha, v.subido_por AS v_por, v.nombre_zip AS v_zip FROM vt_proyectos p LEFT JOIN vt_versiones v ON v.id = p.version_id')->fetchAll());
    }

    public function crear(array $d)
    {
        $this->db->prepare('INSERT INTO vt_proyectos (id, nombre, descripcion, estado, estado_desde, encargado, prioridad, entrega, horas_estimadas, pagina_inicio, version_id, creado_por, creado, actualizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?)')->execute([
            $d['id'], $d['nombre'], $d['descripcion'], $d['estado'], $d['creado'],
            $d['encargado'], $d['prioridad'], $d['entrega'], $d['horas_estimadas'], $d['creado_por'], $d['creado'], $d['creado'],
        ]);
    }

    /* $set: ['columna = ?', ...] ya validadas por el controlador. */
    public function actualizar($id, array $set, array $vals)
    {
        $vals[] = $id;
        $this->db->prepare('UPDATE vt_proyectos SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($vals);
    }

    public function ponerVersion($id, $versionId, $t)
    {
        $this->db->prepare('UPDATE vt_proyectos SET version_id = ?, pagina_inicio = NULL, actualizado = ? WHERE id = ?')->execute([$versionId, $t, $id]);
    }

    /* Archivos (sha) que usan las versiones del proyecto. */
    public function shasDeArchivos($id)
    {
        $st = $this->db->prepare('SELECT DISTINCT a.sha FROM vt_version_archivos a JOIN vt_versiones v ON v.id = a.version_id WHERE v.proyecto_id = ?');
        $st->execute([$id]);
        return $st->fetchAll(PDO::FETCH_COLUMN);
    }

    /* Borra el proyecto y todo lo suyo en una transacción. */
    public function borrarConTodo($id, Meta $meta)
    {
        $this->db->beginTransaction();
        try {
            $this->db->prepare('DELETE FROM vt_version_archivos WHERE version_id IN (SELECT id FROM vt_versiones WHERE proyecto_id = ?)')->execute([$id]);
            foreach (['vt_versiones', 'vt_notas', 'vt_tiempos', 'vt_actividad', 'vt_cronometros'] as $tabla) {
                $this->db->prepare('DELETE FROM ' . $tabla . ' WHERE proyecto_id = ?')->execute([$id]);
            }
            $this->db->prepare('DELETE FROM vt_proyectos WHERE id = ?')->execute([$id]);
            $meta->marcarCambio();
            $this->db->commit();
        } catch (Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public static function mapear($r)
    {
        $p = [
            'id' => $r['id'], 'nombre' => $r['nombre'], 'descripcion' => (string) $r['descripcion'],
            'estado' => $r['estado'], 'estadoDesde' => entero($r['estado_desde']), 'encargado' => $r['encargado'],
            'prioridad' => $r['prioridad'], 'entrega' => $r['entrega'],
            'horasEstimadas' => $r['horas_estimadas'] === null ? null : (float) $r['horas_estimadas'],
            'paginaInicio' => $r['pagina_inicio'], 'creadoPor' => $r['creado_por'],
            'creado' => (int) $r['creado'], 'actualizado' => (int) $r['actualizado'], 'version' => null,
        ];
        if (!empty($r['v_id'])) {
            $p['version'] = ['id' => $r['v_id'], 'n' => (int) $r['v_n'], 'entrada' => $r['v_entrada'], 'archivos' => (int) $r['v_archivos'], 'bytes' => (int) $r['v_bytes'], 'fecha' => (int) $r['v_fecha'], 'por' => $r['v_por'], 'nombreZip' => $r['v_zip']];
        }
        return $p;
    }
}
