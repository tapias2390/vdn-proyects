<?php
namespace Vitrina\Core;

/*
 * Lector del archivo .env (CLAVE=valor, una por línea).
 * Admite comentarios con #, valores entre comillas simples o dobles
 * y secuencias \" \\ \n dentro de comillas dobles.
 */
final class Env
{
    private static $valores = [];

    public static function cargar($archivo)
    {
        $lineas = @file($archivo, FILE_IGNORE_NEW_LINES);
        if ($lineas === false) {
            return false;
        }
        foreach ($lineas as $linea) {
            $linea = trim($linea);
            if ($linea === '' || $linea[0] === '#') {
                continue;
            }
            if (strncmp($linea, 'export ', 7) === 0) {
                $linea = ltrim(substr($linea, 7));
            }
            $pos = strpos($linea, '=');
            if ($pos === false) {
                continue;
            }
            $clave = trim(substr($linea, 0, $pos));
            if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $clave)) {
                continue;
            }
            self::$valores[$clave] = self::leerValor(ltrim(substr($linea, $pos + 1)));
        }
        return true;
    }

    private static function leerValor($v)
    {
        if ($v === '') {
            return '';
        }
        $q = $v[0];
        if ($q === '"') {
            $out = '';
            $n = strlen($v);
            for ($i = 1; $i < $n; $i++) {
                $c = $v[$i];
                if ($c === '\\' && $i + 1 < $n) {
                    $s = $v[++$i];
                    $out .= $s === 'n' ? "\n" : ($s === 'r' ? "\r" : ($s === 't' ? "\t" : $s));
                } elseif ($c === '"') {
                    return $out;
                } else {
                    $out .= $c;
                }
            }
            return $out;
        }
        if ($q === "'") {
            $fin = strpos($v, "'", 1);
            return $fin === false ? substr($v, 1) : substr($v, 1, $fin - 1);
        }
        /* Sin comillas: lo que sigue a " #" es comentario. */
        $hash = strpos($v, ' #');
        return rtrim($hash === false ? $v : substr($v, 0, $hash));
    }

    /* Define valores a mano (por ejemplo, desde un config.php antiguo). */
    public static function definir(array $valores)
    {
        foreach ($valores as $k => $v) {
            if ($v !== null) {
                self::$valores[$k] = (string) $v;
            }
        }
    }

    public static function get($clave, $porDefecto = null)
    {
        if (array_key_exists($clave, self::$valores)) {
            return self::$valores[$clave];
        }
        $g = getenv($clave);
        return $g === false ? $porDefecto : $g;
    }
}
