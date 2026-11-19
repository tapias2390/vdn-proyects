<?php
namespace Vitrina\Models;

/* Tablas vt_versiones y vt_version_archivos. */
final class Version extends Modelo
{
    public function deProyecto($proyectoId)
    {
        $st = $this->db->prepare('SELECT id, n, entrada, paginas, nombre_zip, subido_por, fecha, bytes, archivos FROM vt_versiones WHERE proyecto_id = ? ORDER BY n DESC');
        $st->execute([$proyectoId]);
        return array_map(function ($r) {
            $pag = json_decode((string) $r['paginas'], true);
            return ['id' => $r['id'], 'n' => (int) $r['n'], 'entrada' => $r['entrada'], 'paginas' => is_array($pag) ? $pag : [], 'nombreZip' => $r['nombre_zip'], 'subidoPor' => $r['subido_por'], 'fecha' => (int) $r['fecha'], 'bytes' => (int) $r['bytes'], 'archivos' => (int) $r['archivos']];
        }, $st->fetchAll());
    }

    public function buscar($id)
    {
        $st = $this->db->prepare('SELECT * FROM vt_versiones WHERE id = ?');
        $st->execute([$id]);
        return $st->fetch();
    }

    public function archivos($versionId)
    {
        $st = $this->db->prepare('SELECT ruta, sha, mime, tamano FROM vt_version_archivos WHERE version_id = ? ORDER BY ruta');
        $st->execute([$versionId]);
        return array_map(function ($r) {
            return ['p' => $r['ruta'], 'sha' => $r['sha'], 'm' => $r['mime'], 's' => (int) $r['tamano']];
        }, $st->fetchAll());
    }

    public function siguienteNumero($proyectoId)
    {
        $st = $this->db->prepare('SELECT COALESCE(MAX(n), 0) FROM vt_versiones WHERE proyecto_id = ?');
        $st->execute([$proyectoId]);
        return (int) $st->fetchColumn() + 1;
    }

    public function crear(array $d)
    {
        $this->db->prepare('INSERT INTO vt_versiones (id, proyecto_id, n, entrada, paginas, nombre_zip, subido_por, fecha, bytes, archivos, omitidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')->execute([
            $d['id'], $d['proyecto_id'], $d['n'], $d['entrada'], jsonTexto($d['paginas']), $d['nombre_zip'], $d['subido_por'], $d['fecha'], $d['bytes'], $d['archivos'], jsonTexto($d['omitidos']),
        ]);
    }

    /* $archivos: [[ruta, sha, mime, tamano], ...] */
    public function agregarArchivos($versionId, array $archivos)
    {
        $ins = $this->db->prepare('INSERT INTO vt_version_archivos (version_id, ruta, sha, mime, tamano) VALUES (?, ?, ?, ?, ?)');
        foreach ($archivos as $f) {
            $ins->execute([$versionId, $f[0], $f[1], $f[2], $f[3]]);
        }
    }

    /* Cuántas versiones usan cada sha; los que queden en 0 se pueden borrar del disco. */
    public function contadorDeUsos()
    {
        $cuenta = $this->db->prepare('SELECT COUNT(*) FROM vt_version_archivos WHERE sha = ?');
        return function ($sha) use ($cuenta) {
            $cuenta->execute([$sha]);
            return (int) $cuenta->fetchColumn();
        };
    }

    /* Espacio total en disco (cada archivo cuenta una vez). */
    public function espacioUsado()
    {
        return (int) $this->db->query('SELECT COALESCE(SUM(t), 0) FROM (SELECT MAX(tamano) AS t FROM vt_version_archivos GROUP BY sha) x')->fetchColumn();
    }
}
