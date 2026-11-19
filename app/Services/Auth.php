<?php
namespace Vitrina\Services;

use PDO;
use Vitrina\Core\Config;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Sesion;

/* Sesión por cookie: abrir, leer el usuario actual y exigir permisos. */
final class Auth
{
    private $db;
    private $sesiones;
    private static $cache = false;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->sesiones = new Sesion($db);
    }

    public static function nombreCookie()
    {
        return Config::get('sesion.cookie', 'vitrina_sesion');
    }

    public static function rutaCookie()
    {
        $d = str_replace('\\', '/', dirname(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/'));
        return rtrim($d, '/') . '/';
    }

    public static function esHttps()
    {
        return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
            || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443');
    }

    public static function ponerCookie($valor, $expira)
    {
        if (PHP_VERSION_ID >= 70300) {
            setcookie(self::nombreCookie(), $valor, ['expires' => $expira, 'path' => self::rutaCookie(), 'secure' => self::esHttps(), 'httponly' => true, 'samesite' => 'Lax']);
        } else {
            setcookie(self::nombreCookie(), $valor, $expira, self::rutaCookie() . '; samesite=Lax', '', self::esHttps(), true);
        }
    }

    /* Token crudo de la cookie, o '' si no es válido. */
    public static function tokenCookie()
    {
        $tok = isset($_COOKIE[self::nombreCookie()]) ? $_COOKIE[self::nombreCookie()] : '';
        return is_string($tok) && preg_match('/^[a-f0-9]{64}$/', $tok) ? $tok : '';
    }

    public function abrirSesion($usuario, $sello)
    {
        $tok = bin2hex(random_bytes(32));
        $t = ahora();
        $exp = $t + (int) Config::get('sesion.dias', 30) * 86400000;
        $this->sesiones->crear(hash('sha256', $tok), $usuario, $sello, $t, $exp);
        self::ponerCookie($tok, intdiv($exp, 1000));
    }

    public function cerrarSesion()
    {
        $tok = self::tokenCookie();
        if ($tok !== '') {
            $this->sesiones->borrarToken(hash('sha256', $tok));
        }
        self::ponerCookie('', 1);
    }

    public function usuarioActual()
    {
        if (self::$cache !== false) {
            return self::$cache;
        }
        self::$cache = null;
        $tok = self::tokenCookie();
        if ($tok === '') {
            return null;
        }
        $r = $this->sesiones->buscarPorToken(hash('sha256', $tok));
        if (!$r || (int) $r['expira'] < ahora() || !hash_equals((string) $r['sello'], (string) $r['sello_sesion'])) {
            return null;
        }
        self::$cache = ['id' => $r['usuario'], 'nombre' => $r['nombre'], 'esAdmin' => (int) $r['es_admin'] === 1];
        return self::$cache;
    }

    public function requerirUsuario()
    {
        $u = $this->usuarioActual();
        if (!$u) {
            Respuesta::error('Tu sesión terminó. Vuelve a entrar.', 401, 'sesion');
        }
        return $u;
    }

    public function requerirAdmin()
    {
        $u = $this->requerirUsuario();
        if (!$u['esAdmin']) {
            Respuesta::error('Solo un administrador puede hacer esto.', 403, 'admin');
        }
        return $u;
    }
}
