<?php
namespace Vitrina\Models;

/*
 * Almacén de archivos en disco (datos/archivos). Cada archivo se guarda
 * una sola vez con su SHA-256 como nombre: datos/archivos/ab/abcdef...
 */
final class Archivo
{
    public static function ruta($sha)
    {
        return VT_DIR_ARCHIVOS . '/' . substr($sha, 0, 2) . '/' . $sha;
    }

    public static function existe($sha)
    {
        return is_file(self::ruta($sha));
    }

    public static function rutaTemporal($sha, $tk)
    {
        return VT_DIR_TMP . '/' . $sha . '.' . $tk . '.part';
    }

    /* Borra las partes a medio subir con más de un día. */
    public static function limpiarTemporales()
    {
        foreach (glob(VT_DIR_TMP . '/*.part') ?: [] as $f) {
            if (is_file($f) && filemtime($f) < time() - 86400) {
                @unlink($f);
            }
        }
    }

    public static function borrar($sha)
    {
        return @unlink(self::ruta($sha));
    }
}
