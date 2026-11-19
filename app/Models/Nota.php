<?php
namespace Vitrina\Models;

/* Tabla vt_notas. */
final class Nota extends Modelo
{
    public function listar()
    {
        return array_map([self::class, 'mapear'], $this->db->query('SELECT * FROM vt_notas ORDER BY creada')->fetchAll());
    }

    public function crear($id, $proyectoId, $autor, $texto, $creada, $pagina, $versionId, $versionN)
    {
        $this->db->prepare('INSERT INTO vt_notas (id, proyecto_id, autor, texto, creada, resuelta, pagina, version_id, version_n) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)')
            ->execute([$id, $proyectoId, $autor, $texto, $creada, $pagina, $versionId, $versionN]);
    }

    public function resolver($id, $resuelta, $usuario)
    {
        $this->db->prepare('UPDATE vt_notas SET resuelta = ?, resuelta_por = ?, resuelta_en = ? WHERE id = ?')
            ->execute([$resuelta ? 1 : 0, $resuelta ? $usuario : null, $resuelta ? ahora() : null, $id]);
    }

    /* Autor de la nota, o false si no existe. */
    public function autor($id)
    {
        $st = $this->db->prepare('SELECT autor FROM vt_notas WHERE id = ?');
        $st->execute([$id]);
        return $st->fetchColumn();
    }

    public function borrar($id)
    {
        $this->db->prepare('DELETE FROM vt_notas WHERE id = ?')->execute([$id]);
    }

    public static function mapear($r)
    {
        return ['id' => $r['id'], 'proyectoId' => $r['proyecto_id'], 'autor' => $r['autor'], 'texto' => $r['texto'], 'creada' => (int) $r['creada'], 'resuelta' => (int) $r['resuelta'] === 1, 'resueltaPor' => $r['resuelta_por'], 'resueltaEn' => entero($r['resuelta_en']), 'pagina' => $r['pagina'], 'versionId' => $r['version_id'], 'versionN' => entero($r['version_n'])];
    }
}
