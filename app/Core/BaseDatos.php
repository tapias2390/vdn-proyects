<?php
namespace Vitrina\Core;

use PDO;
use Throwable;

final class BaseDatos
{
    public static function conectar()
    {
        try {
            $db = new PDO(Config::get('db.dsn'), Config::get('db.usuario'), Config::get('db.clave'), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (Throwable $e) {
            error_log('Vitrina, conexión a la base de datos: ' . $e->getMessage());
            Respuesta::error('No se pudo conectar con la base de datos MySQL. ' . self::causa($e->getMessage()), 503, 'sin_bd');
        }
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
            $db->exec('PRAGMA busy_timeout = 5000');
        }
        return $db;
    }

    /* Explica la causa sin mostrar datos del .env (el detalle completo queda en error_log). */
    private static function causa($m)
    {
        $usuario = (string) Config::get('db.usuario');
        if (strpos($m, '[1045]') !== false) {
            return $usuario === 'root'
                ? 'El .env tiene el usuario "root" de XAMPP: en el hosting usa el usuario MySQL de cPanel (con el prefijo de tu cuenta) en DB_USERNAME y su contraseña en DB_PASSWORD.'
                : 'MySQL rechazó el usuario o la contraseña. Revisa DB_USERNAME y DB_PASSWORD en el .env (en cPanel llevan el prefijo de tu cuenta).';
        }
        if (strpos($m, '[1044]') !== false) {
            return 'El usuario no tiene permiso sobre la base. En cPanel → Bases de datos MySQL, agrega el usuario a la base con «Todos los privilegios».';
        }
        if (strpos($m, '[1049]') !== false) {
            return 'No existe una base con el nombre de DB_DATABASE. Cópialo completo desde cPanel, con el prefijo de tu cuenta.';
        }
        if (strpos($m, '[2002]') !== false || strpos($m, '[2005]') !== false || strpos($m, '[2006]') !== false) {
            return 'No se pudo llegar al servidor MySQL. En el hosting DB_HOST normalmente es localhost.';
        }
        if (stripos($m, 'could not find driver') !== false) {
            return 'El hosting no tiene activa la extensión pdo_mysql de PHP.';
        }
        return 'Revisa los datos del archivo .env.';
    }
}
