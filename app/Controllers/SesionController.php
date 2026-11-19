<?php
namespace Vitrina\Controllers;

use Vitrina\Core\Config;
use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Meta;
use Vitrina\Models\Sesion;
use Vitrina\Models\Usuario;
use Vitrina\Services\Limitador;

/* Entrar, salir y contraseñas. */
final class SesionController extends Controlador
{
    public function estado()
    {
        Respuesta::json(['usuario' => $this->auth->usuarioActual(), 'maxArchivoMb' => (int) Config::get('max_archivo_mb', 100), 'ahora' => ahora()]);
    }

    public function entrar()
    {
        $usuarios = new Usuario($this->db);
        $id = normUsuario($this->campo('usuario', ''));
        $clave = is_string($this->campo('clave')) ? $this->campo('clave') : '';
        if ($id === '' || $clave === '') {
            Respuesta::error('Escribe tu usuario y tu contraseña.');
        }
        if (strlen($clave) > 4096) {
            Respuesta::error('Usuario o contraseña incorrectos.', 401);
        }

        /* Límite por conexión: frena a quien prueba muchos usuarios desde la misma IP. */
        $ip = new Limitador('entrar|' . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''));
        $ventanaIp = (int) Config::get('acceso.ip_ventana_segundos', 900);
        $esperaIp = $ip->segundosBloqueado((int) Config::get('acceso.ip_max_intentos', 20), $ventanaIp);
        if ($esperaIp > 0) {
            Respuesta::error('Demasiados intentos desde esta conexión. Espera ' . (int) ceil($esperaIp / 60) . ' minutos.', 429);
        }

        $fila = $usuarios->buscar($id);
        $t = ahora();
        if ($fila && (int) $fila['bloqueado_hasta'] > $t) {
            Respuesta::error('Demasiados intentos. Espera ' . (int) ceil(((int) $fila['bloqueado_hasta'] - $t) / 1000) . ' segundos.', 429);
        }
        /* Si el usuario no existe se verifica contra un hash falso: tarda lo mismo y no delata qué usuarios existen. */
        $hash = $fila ? (string) $fila['clave_hash'] : self::hashFalso();
        $correcta = password_verify($clave, $hash);
        if (!$fila || !$correcta) {
            if ($fila) {
                $max = max(1, (int) Config::get('acceso.max_intentos', 5));
                $f = (int) $fila['fallos'] + 1;
                $bloqueo = 0;
                if ($f >= $max) {
                    /* 60 s, 120 s, 240 s... hasta el máximo. */
                    $seg = (int) Config::get('acceso.bloqueo_segundos', 60) * (2 ** min(10, $f - $max));
                    $bloqueo = $t + min($seg, (int) Config::get('acceso.bloqueo_max_segundos', 900)) * 1000;
                }
                $usuarios->guardarIntentos($id, $f, $bloqueo);
            }
            $ip->registrarFallo($ventanaIp);
            usleep(250000);
            Respuesta::error('Usuario o contraseña incorrectos.', 401);
        }
        $usuarios->limpiarIntentos($id);
        if (password_needs_rehash($fila['clave_hash'], PASSWORD_DEFAULT)) {
            $usuarios->actualizarHash($id, password_hash($clave, PASSWORD_DEFAULT));
        }
        (new Sesion($this->db))->borrarVencidas($t);
        $this->auth->abrirSesion($id, $fila['sello']);
        Respuesta::json(['usuario' => ['id' => $id, 'nombre' => $fila['nombre'], 'esAdmin' => (int) $fila['es_admin'] === 1]]);
    }

    private static function hashFalso()
    {
        static $h = null;
        if ($h === null) {
            $h = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
        }
        return $h;
    }

    public function salir()
    {
        $this->auth->cerrarSesion();
        Respuesta::json(['ok' => true]);
    }

    public function cambiarClave()
    {
        $u = $this->auth->requerirUsuario();
        $usuarios = new Usuario($this->db);
        $actual = is_string($this->campo('actual')) ? $this->campo('actual') : '';
        $nueva = is_string($this->campo('nueva')) ? $this->campo('nueva') : '';
        if (strlen($nueva) < 8) {
            Respuesta::error('La contraseña nueva debe tener al menos 8 caracteres.');
        }
        if (strlen($nueva) > 72) {
            Respuesta::error('La contraseña nueva puede tener máximo 72 caracteres.');
        }
        if (!password_verify($actual, $usuarios->hashClave($u['id']))) {
            Respuesta::error('La contraseña actual no es correcta.');
        }
        $sello = bin2hex(random_bytes(8));
        $usuarios->cambiarClave($u['id'], password_hash($nueva, PASSWORD_DEFAULT), $sello);
        (new Sesion($this->db))->borrarDeUsuario($u['id']);
        $this->auth->abrirSesion($u['id'], $sello);
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['ok' => true]);
    }

    public function restablecerClave()
    {
        $adm = $this->auth->requerirAdmin();
        $usuarios = new Usuario($this->db);
        $id = normUsuario($this->campo('usuario', ''));
        if (!$usuarios->existe($id)) {
            Respuesta::error('Ese usuario no existe.', 404);
        }
        $clave = claveAleatoria();
        $sello = bin2hex(random_bytes(8));
        $usuarios->restablecerClave($id, password_hash($clave, PASSWORD_DEFAULT), $sello);
        (new Sesion($this->db))->borrarDeUsuario($id);
        if ($id === $adm['id']) {
            $this->auth->abrirSesion($id, $sello);
        }
        (new Meta($this->db))->marcarCambio();
        Respuesta::json(['clave' => $clave]);
    }
}
