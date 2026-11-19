<?php
/*
 * Configuración del panel. Los valores salen del archivo .env;
 * aquí solo se definen los valores por defecto.
 */
use Vitrina\Core\Env;

$host = Env::get('DB_HOST', 'localhost');
$puerto = Env::get('DB_PORT', '');
$dsn = Env::get('DB_DSN', '');
if ($dsn === '') {
    $dsn = 'mysql:host=' . $host . ($puerto !== '' ? ';port=' . $puerto : '') . ';dbname=' . Env::get('DB_DATABASE', '') . ';charset=utf8mb4';
}
$usuario = Env::get('DB_USERNAME', '');
$clave = Env::get('DB_PASSWORD', '');

return [
    'db' => [
        'dsn' => $dsn,
        'usuario' => $usuario === '' ? null : $usuario,
        'clave' => $clave === '' ? null : $clave,
    ],
    'zona_horaria' => Env::get('APP_TIMEZONE', 'America/Bogota'),
    'max_archivo_mb' => (int) Env::get('UPLOAD_MAX_MB', 100),
    'sesion' => [
        'cookie' => Env::get('SESSION_COOKIE', 'vitrina_sesion'),
        'dias' => (int) Env::get('SESSION_DAYS', 30),
    ],
    'acceso' => [
        // Por usuario: tras N fallos se bloquea; cada fallo extra duplica la espera hasta el máximo.
        'max_intentos' => (int) Env::get('LOGIN_MAX_ATTEMPTS', 5),
        'bloqueo_segundos' => (int) Env::get('LOGIN_LOCK_SECONDS', 60),
        'bloqueo_max_segundos' => (int) Env::get('LOGIN_LOCK_MAX_SECONDS', 900),
        // Por conexión (IP): fallos permitidos dentro de la ventana, sin importar el usuario.
        'ip_max_intentos' => (int) Env::get('LOGIN_IP_MAX_ATTEMPTS', 20),
        'ip_ventana_segundos' => (int) Env::get('LOGIN_IP_WINDOW_SECONDS', 900),
    ],
];
