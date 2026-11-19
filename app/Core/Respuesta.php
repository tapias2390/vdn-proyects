<?php
namespace Vitrina\Core;

/* Respuestas JSON del panel. Ambas terminan la ejecución. */
final class Respuesta
{
    public static function json($datos, $codigo = 200)
    {
        http_response_code($codigo);
        echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error($mensaje, $codigo = 400, $clave = null)
    {
        $r = ['error' => $mensaje];
        if ($clave !== null) {
            $r['codigo'] = $clave;
        }
        self::json($r, $codigo);
    }
}
