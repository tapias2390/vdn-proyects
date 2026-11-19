<?php
namespace Vitrina\Core;

/*
 * Configuración del panel. Lee el .env de la carpeta raíz y arma config/app.php.
 * Si no hay .env pero existe un config.php de una instalación anterior, lo usa igual.
 */
final class Config
{
    private static $datos = null;

    /* Devuelve false si el panel aún no está instalado. */
    public static function cargar()
    {
        if (self::$datos !== null) {
            return true;
        }
        $env = VT_RAIZ . '/.env';
        $antiguo = VT_RAIZ . '/config.php';
        if (is_file($env)) {
            Env::cargar($env);
        } elseif (is_file($antiguo)) {
            $cfg = require $antiguo;
            if (!is_array($cfg)) {
                return false;
            }
            Env::definir([
                'DB_DSN' => isset($cfg['db_dsn']) ? $cfg['db_dsn'] : null,
                'DB_USERNAME' => isset($cfg['db_usuario']) ? $cfg['db_usuario'] : null,
                'DB_PASSWORD' => isset($cfg['db_clave']) ? $cfg['db_clave'] : null,
                'APP_TIMEZONE' => isset($cfg['zona_horaria']) ? $cfg['zona_horaria'] : null,
                'UPLOAD_MAX_MB' => isset($cfg['max_archivo_mb']) ? $cfg['max_archivo_mb'] : null,
            ]);
        } else {
            return false;
        }
        self::$datos = require VT_RAIZ . '/config/app.php';
        return true;
    }

    /* Config::get('db.usuario') */
    public static function get($ruta, $porDefecto = null)
    {
        $v = self::$datos;
        foreach (explode('.', $ruta) as $parte) {
            if (!is_array($v) || !array_key_exists($parte, $v)) {
                return $porDefecto;
            }
            $v = $v[$parte];
        }
        return $v;
    }
}
