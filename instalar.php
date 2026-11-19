<?php
/*
 * Vitrina de Proyectos · VDN Value
 * Instalador: conecta la base de datos MySQL, crea las tablas, los accesos del equipo
 * y el archivo .env con los datos de conexión.
 * Úsalo una sola vez. Después bórralo del hosting.
 *
 *   app/Install/funciones.php  Funciones del instalador
 *   app/Views/instalar.php     Página (HTML)
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('America/Bogota');

define('VT_RAIZ', __DIR__);
define('VT_DATOS', VT_RAIZ . '/datos');
define('VT_CANDADO', VT_DATOS . '/instalado.lock');
define('VT_ENV', VT_RAIZ . '/.env');
/*
 * Seguridad: solo se acepta una base de datos en este mismo servidor (localhost).
 * Así nadie puede instalar el panel apuntando a una base suya mientras está sin instalar.
 * Cámbialo a false solo si tu MySQL está en otro servidor, y vuelve a ponerlo en true al terminar.
 */
define('VT_SOLO_BD_LOCAL', true);

$VT_MIEMBROS = ['david' => 'David', 'oscar' => 'Oscar', 'nicolas' => 'Nicolas', 'yhonatan' => 'Yhonatan', 'alejandro' => 'Alejandro'];
$VT_ADMINS = ['david', 'nicolas'];

require VT_RAIZ . '/app/Install/funciones.php';

if (defined('VT_SOLO_FUNCIONES')) {
    return;
}

/* ------------------------------------------------------------------ página */
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src data:; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443');
$carpetaWeb = rtrim(str_replace('\\', '/', dirname(isset($_SERVER['SCRIPT_NAME']) ? $_SERVER['SCRIPT_NAME'] : '/')), '/') . '/';
$urlPanel = ($https ? 'https://' : 'http://') . (isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'tu-dominio') . $carpetaWeb;
$dsnPrueba = getenv('VITRINA_PRUEBA_DSN');
$instalado = is_file(VT_CANDADO);

/*
 * Si ya existe un .env (o un config.php antiguo), el instalador usa esos datos de conexión
 * y nunca lo sobrescribe. Para probar que eres el dueño pide la contraseña de MySQL del .env;
 * si el .env no tiene contraseña (XAMPP local), solo se permite instalar desde este mismo equipo.
 */
$conEnv = !$instalado && (is_file(VT_ENV) || is_file(VT_RAIZ . '/config.php'));
$envDb = null;
if ($conEnv) {
    require_once VT_RAIZ . '/app/Core/Env.php';
    require_once VT_RAIZ . '/app/Core/Config.php';
    if (\Vitrina\Core\Config::cargar()) {
        $envDb = [
            'dsn' => (string) \Vitrina\Core\Config::get('db.dsn'),
            'usuario' => \Vitrina\Core\Config::get('db.usuario'),
            'clave' => \Vitrina\Core\Config::get('db.clave'),
        ];
    }
}
$envSinClave = $envDb && (string) $envDb['clave'] === '';
$desdeEsteEquipo = in_array(isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '', ['127.0.0.1', '::1'], true);

$token = isset($_COOKIE['vt_instalar']) && is_string($_COOKIE['vt_instalar']) && preg_match('/^[a-f0-9]{32}$/', $_COOKIE['vt_instalar']) ? $_COOKIE['vt_instalar'] : '';
if (!$instalado && $token === '') {
    $token = bin2hex(random_bytes(16));
    setcookie('vt_instalar', $token, ['expires' => 0, 'path' => $carpetaWeb, 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
}

$requisitos = [
    ['PHP ' . PHP_VERSION, version_compare(PHP_VERSION, '7.3.0', '>='), 'Se necesita PHP 7.3 o superior. Cámbialo en cPanel → Seleccionar versión de PHP.'],
    ['Extensión pdo_mysql', extension_loaded('pdo_mysql') || $dsnPrueba, 'Actívala en cPanel → Seleccionar versión de PHP → Extensiones.'],
    ['Permiso para crear la carpeta datos/', is_dir(VT_DATOS) ? is_writable(VT_DATOS) : is_writable(VT_RAIZ), 'Dale permisos 755 a la carpeta del panel (y a datos/ si ya existe).'],
];
$avisos = [];
if (!extension_loaded('mbstring')) {
    $avisos[] = 'La extensión mbstring no está activa. El panel funciona, pero conviene activarla en cPanel → Seleccionar versión de PHP.';
}
$esLocal = preg_match('/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i', isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '') === 1;
if (!$https && !$esLocal) {
    $avisos[] = 'Estás entrando sin HTTPS. Activa el certificado SSL gratuito del hosting para que las contraseñas viajen cifradas.';
}
$puedeInstalar = true;
foreach ($requisitos as $r) {
    $puedeInstalar = $puedeInstalar && $r[1];
}

$v = ['servidor' => 'localhost', 'base' => '', 'usuario' => '', 'clave' => ''];
$claves = [];
foreach ($VT_MIEMBROS as $id => $nombre) {
    $claves[$id] = vt_clave_aleatoria();
}
$admins = $VT_ADMINS;
$errores = [];
$resultado = null;

if (!$instalado && isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $enviado = isset($_POST['token']) && is_string($_POST['token']) ? $_POST['token'] : '';
    foreach (['servidor', 'base', 'usuario', 'clave'] as $k) {
        $v[$k] = isset($_POST[$k]) && is_string($_POST[$k]) ? ($k === 'clave' ? $_POST[$k] : trim($_POST[$k])) : '';
    }
    $admins = [];
    foreach ($VT_MIEMBROS as $id => $nombre) {
        $claves[$id] = isset($_POST['clave_' . $id]) && is_string($_POST['clave_' . $id]) ? trim($_POST['clave_' . $id]) : '';
        if (!empty($_POST['admin_' . $id])) {
            $admins[] = $id;
        }
    }
    if ($token === '' || !hash_equals($token, $enviado)) {
        $errores[] = 'La página venció o el navegador bloqueó las cookies. Recárgala e inténtalo de nuevo.';
    }
    if (!$puedeInstalar) {
        $errores[] = 'Primero resuelve los requisitos marcados en rojo.';
    }
    if ($conEnv && !$dsnPrueba) {
        if (!$envDb) {
            $errores[] = 'No se pudo leer el archivo .env. Revisa que tenga el formato de .env.example.';
        } elseif ($envSinClave ? !$desdeEsteEquipo : !hash_equals((string) $envDb['clave'], $v['clave'])) {
            $errores[] = $envSinClave
                ? 'El .env no tiene contraseña de MySQL: por seguridad solo se puede instalar desde el mismo equipo (localhost).'
                : 'La contraseña de MySQL no coincide con la del archivo .env.';
            usleep(500000);
        }
    } elseif (!$dsnPrueba) {
        if (!preg_match('/^[A-Za-z0-9.\-]+(:\d{2,5})?$/', $v['servidor'])) {
            $errores[] = 'Escribe el servidor de MySQL. En el hosting normalmente es localhost.';
        } elseif (VT_SOLO_BD_LOCAL && !preg_match('/^(localhost|127\.0\.0\.1)(:\d{2,5})?$/i', $v['servidor'])) {
            $errores[] = 'Por seguridad solo se acepta una base de datos en este servidor: escribe localhost.';
        }
        if (!preg_match('/^[A-Za-z0-9_\-]{1,64}$/', $v['base'])) {
            $errores[] = 'Escribe el nombre de la base de datos tal como aparece en cPanel (letras, números y guion bajo).';
        }
        if ($v['usuario'] === '' || strlen($v['usuario']) > 80) {
            $errores[] = 'Escribe el usuario de MySQL tal como aparece en cPanel.';
        }
    }
    foreach ($VT_MIEMBROS as $id => $nombre) {
        $largo = strlen($claves[$id]);
        if ($largo < 8 || $largo > 72) {
            $errores[] = 'La contraseña de ' . $nombre . ' debe tener entre 8 y 72 caracteres.';
        }
    }
    if (!$admins) {
        $errores[] = 'Marca al menos un administrador.';
    }

    if (!$errores) {
        $problema = vt_preparar_carpetas();
        if ($problema) {
            $errores[] = $problema;
        }
    }
    $db = null;
    $dsn = '';
    if (!$errores) {
        try {
            if ($dsnPrueba) {
                $dsn = $dsnPrueba;
                $db = new PDO($dsn, null, null, vt_opciones_pdo());
            } elseif ($conEnv) {
                $dsn = $envDb['dsn'];
                $db = new PDO($dsn, $envDb['usuario'], $envDb['clave'], vt_opciones_pdo());
            } else {
                $dsn = vt_dsn_mysql($v['servidor'], $v['base']);
                $db = new PDO($dsn, $v['usuario'], $v['clave'], vt_opciones_pdo());
            }
        } catch (Throwable $ex) {
            $errores[] = vt_explicar_error_mysql($ex);
        }
    }
    if (!$errores) {
        $dialecto = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite' ? 'sqlite' : 'mysql';
        try {
            $previos = 0;
            try {
                $previos = (int) $db->query('SELECT COUNT(*) FROM vt_proyectos')->fetchColumn();
            } catch (Throwable $ex) {
                $previos = 0;
            }
            vt_crear_tablas($db, $dialecto);
            $usuarios = [];
            foreach ($VT_MIEMBROS as $id => $nombre) {
                $usuarios[$id] = ['nombre' => $nombre, 'clave' => $claves[$id], 'admin' => in_array($id, $admins, true)];
            }
            vt_guardar_usuarios($db, $usuarios);
            $motor = '';
            if ($dialecto === 'mysql') {
                $motor = 'MySQL ' . (string) $db->query('SELECT VERSION()')->fetchColumn();
            }
            if ($conEnv) {
                /* El .env ya existe: no se toca. */
                $textoConfig = '';
                $configEscrito = true;
            } else {
            $textoConfig = vt_texto_env([
                'dsn' => $dsnPrueba ? $dsn : '',
                'servidor' => $v['servidor'],
                'base' => $v['base'],
                'usuario' => $v['usuario'],
                'clave' => $v['clave'],
            ]);
            $configEscrito = @file_put_contents(VT_ENV, $textoConfig, LOCK_EX) === strlen($textoConfig);
            if ($configEscrito) {
                @chmod(VT_ENV, 0600); /* solo el dueño de la cuenta lo puede leer */
            }
            }
            if ($configEscrito) {
                @file_put_contents(VT_CANDADO, 'Instalado el ' . date('Y-m-d H:i') . "\n");
            }
            $resultado = ['usuarios' => $usuarios, 'previos' => $previos, 'motor' => $motor, 'config' => $configEscrito ? null : $textoConfig];
        } catch (Throwable $ex) {
            error_log('Vitrina, instalador: ' . $ex->getMessage());
            $errores[] = 'Se conectó con la base de datos, pero no se pudieron crear las tablas. Revisa que el usuario tenga «Todos los privilegios» sobre la base. El detalle quedó en el registro de errores de PHP (error_log).';
        }
    }
}

require VT_RAIZ . '/app/Views/instalar.php';
