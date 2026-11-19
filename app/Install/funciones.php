<?php
/*
 * Funciones del instalador: tablas, usuarios, carpetas y archivo .env.
 * Las usa instalar.php (y las pruebas, con VT_SOLO_FUNCIONES).
 */

/* Tablas del panel. "mysql" para el hosting; "sqlite" solo para pruebas locales. */
function vt_esquema($dialecto)
{
    $mysql = $dialecto === 'mysql';
    $auto = $mysql ? 'id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY' : 'id INTEGER PRIMARY KEY AUTOINCREMENT';
    $tablas = [
        'vt_meta' => [['clave VARCHAR(40) NOT NULL PRIMARY KEY', 'valor BIGINT NOT NULL DEFAULT 0'], []],
        'vt_usuarios' => [[
            'id VARCHAR(40) NOT NULL PRIMARY KEY', 'nombre VARCHAR(80) NOT NULL', 'clave_hash VARCHAR(255) NOT NULL',
            'es_admin TINYINT NOT NULL DEFAULT 0', 'sello VARCHAR(32) NOT NULL', 'fallos INT NOT NULL DEFAULT 0',
            'bloqueado_hasta BIGINT NOT NULL DEFAULT 0', 'actualizado BIGINT NOT NULL DEFAULT 0',
        ], []],
        'vt_sesiones' => [[
            'token CHAR(64) NOT NULL PRIMARY KEY', 'usuario VARCHAR(40) NOT NULL', 'sello VARCHAR(32) NOT NULL',
            'creada BIGINT NOT NULL', 'expira BIGINT NOT NULL',
        ], [['usuario', false]]],
        'vt_proyectos' => [[
            'id VARCHAR(40) NOT NULL PRIMARY KEY', 'nombre VARCHAR(160) NOT NULL', 'descripcion TEXT NULL',
            'estado VARCHAR(20) NOT NULL', 'estado_desde BIGINT NULL', 'encargado VARCHAR(40) NULL',
            "prioridad VARCHAR(10) NOT NULL DEFAULT 'media'", 'entrega VARCHAR(10) NULL', 'horas_estimadas DECIMAL(8,2) NULL',
            'pagina_inicio VARCHAR(500) NULL', 'version_id VARCHAR(40) NULL', 'creado_por VARCHAR(40) NULL',
            'creado BIGINT NOT NULL', 'actualizado BIGINT NOT NULL',
        ], []],
        'vt_versiones' => [[
            'id VARCHAR(40) NOT NULL PRIMARY KEY', 'proyecto_id VARCHAR(40) NOT NULL', 'n INT NOT NULL',
            'entrada VARCHAR(500) NOT NULL', 'paginas MEDIUMTEXT NULL', 'nombre_zip VARCHAR(200) NULL',
            'subido_por VARCHAR(40) NULL', 'fecha BIGINT NOT NULL', 'bytes BIGINT NOT NULL DEFAULT 0',
            'archivos INT NOT NULL DEFAULT 0', 'omitidos MEDIUMTEXT NULL',
        ], [['proyecto_id, n', true]]],
        'vt_version_archivos' => [[
            $auto, 'version_id VARCHAR(40) NOT NULL', 'ruta VARCHAR(500) NOT NULL', 'sha CHAR(64) NOT NULL',
            'mime VARCHAR(100) NOT NULL', 'tamano BIGINT NOT NULL DEFAULT 0',
        ], [['version_id', false], ['sha', false]]],
        'vt_notas' => [[
            'id VARCHAR(40) NOT NULL PRIMARY KEY', 'proyecto_id VARCHAR(40) NOT NULL', 'autor VARCHAR(40) NOT NULL',
            'texto TEXT NOT NULL', 'creada BIGINT NOT NULL', 'resuelta TINYINT NOT NULL DEFAULT 0',
            'resuelta_por VARCHAR(40) NULL', 'resuelta_en BIGINT NULL', 'pagina VARCHAR(500) NULL',
            'version_id VARCHAR(40) NULL', 'version_n INT NULL',
        ], [['proyecto_id', false]]],
        'vt_tiempos' => [[
            'id VARCHAR(40) NOT NULL PRIMARY KEY', 'proyecto_id VARCHAR(40) NOT NULL', 'miembro VARCHAR(40) NOT NULL',
            'minutos INT NOT NULL', 'fecha VARCHAR(10) NOT NULL', 'inicio BIGINT NULL', 'fin BIGINT NULL',
            'nota VARCHAR(255) NULL', "origen VARCHAR(20) NOT NULL DEFAULT 'manual'", 'creado BIGINT NOT NULL',
            'por VARCHAR(40) NULL',
        ], [['proyecto_id', false]]],
        'vt_actividad' => [[
            $auto, 'proyecto_id VARCHAR(40) NOT NULL', 'usuario VARCHAR(40) NULL', 'tipo VARCHAR(20) NOT NULL',
            'de VARCHAR(40) NULL', 'a VARCHAR(60) NULL', 'n INT NULL', 'detalle VARCHAR(400) NULL', 'fecha BIGINT NOT NULL',
        ], [['proyecto_id, fecha', false], ['fecha', false]]],
        'vt_cronometros' => [[
            'miembro VARCHAR(40) NOT NULL PRIMARY KEY', 'proyecto_id VARCHAR(40) NOT NULL', 'inicio BIGINT NOT NULL',
        ], []],
    ];
    $sql = [];
    foreach ($tablas as $tabla => $def) {
        $columnas = $def[0];
        $aparte = [];
        foreach ($def[1] as $i => $ix) {
            $nombre = 'ix_' . substr($tabla, 3) . '_' . ($i + 1);
            if ($mysql) {
                $columnas[] = ($ix[1] ? 'UNIQUE KEY ' : 'KEY ') . $nombre . ' (' . $ix[0] . ')';
            } else {
                $aparte[] = 'CREATE ' . ($ix[1] ? 'UNIQUE ' : '') . 'INDEX IF NOT EXISTS ' . $nombre . ' ON ' . $tabla . ' (' . $ix[0] . ')';
            }
        }
        $sql[] = 'CREATE TABLE IF NOT EXISTS ' . $tabla . " (\n  " . implode(",\n  ", $columnas) . "\n)" . ($mysql ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '');
        foreach ($aparte as $s) {
            $sql[] = $s;
        }
    }
    return $sql;
}

function vt_crear_tablas(PDO $db, $dialecto)
{
    foreach (vt_esquema($dialecto) as $sql) {
        $db->exec($sql);
    }
    $hay = $db->prepare('SELECT COUNT(*) FROM vt_meta WHERE clave = ?');
    $ins = $db->prepare('INSERT INTO vt_meta (clave, valor) VALUES (?, ?)');
    foreach (['cambios' => 1, 'esquema' => 1] as $clave => $valor) {
        $hay->execute([$clave]);
        $n = (int) $hay->fetchColumn();
        $hay->closeCursor();
        if ($n === 0) {
            $ins->execute([$clave, $valor]);
        }
    }
}

/* $usuarios: id => ['nombre' => ..., 'clave' => ..., 'admin' => bool]. Crea o reemplaza cada acceso. */
function vt_guardar_usuarios(PDO $db, array $usuarios)
{
    $t = (int) round(microtime(true) * 1000);
    $existe = $db->prepare('SELECT COUNT(*) FROM vt_usuarios WHERE id = ?');
    $ins = $db->prepare('INSERT INTO vt_usuarios (id, nombre, clave_hash, es_admin, sello, fallos, bloqueado_hasta, actualizado) VALUES (?, ?, ?, ?, ?, 0, 0, ?)');
    $upd = $db->prepare('UPDATE vt_usuarios SET nombre = ?, clave_hash = ?, es_admin = ?, sello = ?, fallos = 0, bloqueado_hasta = 0, actualizado = ? WHERE id = ?');
    $ses = $db->prepare('DELETE FROM vt_sesiones WHERE usuario = ?');
    foreach ($usuarios as $id => $u) {
        $hash = password_hash($u['clave'], PASSWORD_DEFAULT);
        $sello = bin2hex(random_bytes(8));
        $existe->execute([$id]);
        $ya = (int) $existe->fetchColumn() > 0;
        $existe->closeCursor();
        if ($ya) {
            $upd->execute([$u['nombre'], $hash, $u['admin'] ? 1 : 0, $sello, $t, $id]);
            $ses->execute([$id]);
        } else {
            $ins->execute([$id, $u['nombre'], $hash, $u['admin'] ? 1 : 0, $sello, $t]);
        }
    }
    $db->exec("UPDATE vt_meta SET valor = valor + 1 WHERE clave = 'cambios'");
}

/* Escapa un valor para una línea CLAVE="valor" del .env (lo lee app/Core/Env.php). */
function vt_env_linea($clave, $valor)
{
    $v = str_replace(['\\', '"', "\n", "\r"], ['\\\\', '\\"', '\\n', '\\r'], (string) $valor);
    return $clave . '="' . $v . '"';
}

/* $cfg: servidor, base, usuario, clave y, solo en pruebas, dsn. */
function vt_texto_env(array $cfg)
{
    $host = $cfg['servidor'];
    $puerto = '';
    if (preg_match('/^(.+):(\d{2,5})$/', $host, $m)) {
        $host = $m[1];
        $puerto = $m[2];
    }
    $l = [];
    $l[] = '# Configuración de la Vitrina de Proyectos. La creó instalar.php el ' . date('Y-m-d H:i') . '.';
    $l[] = '# No compartas este archivo: tiene la contraseña de la base de datos.';
    $l[] = '';
    $l[] = '# Base de datos MySQL';
    if (!empty($cfg['dsn'])) {
        $l[] = vt_env_linea('DB_DSN', $cfg['dsn']);
    } else {
        $l[] = vt_env_linea('DB_HOST', $host);
        $l[] = vt_env_linea('DB_PORT', $puerto);
        $l[] = vt_env_linea('DB_DATABASE', $cfg['base']);
        $l[] = vt_env_linea('DB_USERNAME', $cfg['usuario']);
        $l[] = vt_env_linea('DB_PASSWORD', $cfg['clave']);
    }
    $l[] = '';
    $l[] = '# Panel';
    $l[] = vt_env_linea('APP_TIMEZONE', 'America/Bogota');
    $l[] = '# Tamaño máximo de cada archivo dentro del .zip, en MB';
    $l[] = vt_env_linea('UPLOAD_MAX_MB', 50);
    $l[] = '';
    $l[] = '# Seguridad de la sesión y del inicio de sesión';
    $l[] = vt_env_linea('SESSION_COOKIE', 'vitrina_sesion');
    $l[] = vt_env_linea('SESSION_DAYS', 30);
    $l[] = vt_env_linea('LOGIN_MAX_ATTEMPTS', 5);
    $l[] = vt_env_linea('LOGIN_LOCK_SECONDS', 60);
    $l[] = vt_env_linea('LOGIN_LOCK_MAX_SECONDS', 900);
    $l[] = vt_env_linea('LOGIN_IP_MAX_ATTEMPTS', 20);
    $l[] = vt_env_linea('LOGIN_IP_WINDOW_SECONDS', 900);
    return implode("\n", $l) . "\n";
}

function vt_preparar_carpetas()
{
    foreach (['' => VT_DATOS, '/archivos' => VT_DATOS . '/archivos', '/tmp' => VT_DATOS . '/tmp'] as $nombre => $dir) {
        if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
            return 'No se pudo crear la carpeta datos' . $nombre . '. Revisa que la carpeta del panel tenga permisos 755.';
        }
        if (!is_writable($dir)) {
            return 'PHP no puede escribir en la carpeta datos' . $nombre . '. Dale permisos 755 desde el Administrador de archivos.';
        }
    }
    if (!is_file(VT_DATOS . '/.htaccess')) {
        @file_put_contents(VT_DATOS . '/.htaccess', "# Nadie puede abrir esta carpeta desde el navegador. Los archivos se entregan por api.php.\n<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
    }
    if (!is_file(VT_DATOS . '/index.html')) {
        @file_put_contents(VT_DATOS . '/index.html', '');
    }
    $prueba = VT_DATOS . '/tmp/prueba-' . bin2hex(random_bytes(4));
    if (@file_put_contents($prueba, 'ok') !== 2) {
        return 'PHP no puede guardar archivos en datos/tmp. Revisa los permisos de la carpeta datos.';
    }
    @unlink($prueba);
    return null;
}

function vt_clave_aleatoria()
{
    $abc = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $c = '';
    for ($i = 0; $i < 12; $i++) {
        $c .= $abc[random_int(0, strlen($abc) - 1)];
    }
    return substr($c, 0, 4) . '-' . substr($c, 4, 4) . '-' . substr($c, 8, 4);
}

function vt_opciones_pdo()
{
    return [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 8,
    ];
}

function vt_dsn_mysql($servidor, $base)
{
    $puerto = '';
    if (preg_match('/^(.+):(\d{2,5})$/', $servidor, $m)) {
        $servidor = $m[1];
        $puerto = ';port=' . $m[2];
    }
    return 'mysql:host=' . $servidor . $puerto . ';dbname=' . $base . ';charset=utf8mb4';
}

function vt_explicar_error_mysql($e)
{
    $m = $e->getMessage();
    if (strpos($m, '[1045]') !== false) {
        return 'MySQL rechazó el usuario o la contraseña. En cPanel el usuario lleva el prefijo de tu cuenta (por ejemplo micuenta_vitrina). Revisa también la contraseña.';
    }
    if (strpos($m, '[1044]') !== false) {
        return 'Ese usuario no tiene permiso sobre la base de datos. En cPanel → Bases de datos MySQL, agrega el usuario a la base y marca «Todos los privilegios».';
    }
    if (strpos($m, '[1049]') !== false) {
        return 'No existe una base de datos con ese nombre. Cópialo completo desde cPanel, con el prefijo de tu cuenta.';
    }
    if (strpos($m, '[2002]') !== false || strpos($m, '[2005]') !== false || strpos($m, '[2006]') !== false) {
        return 'No se pudo llegar al servidor MySQL. En el hosting normalmente es «localhost».';
    }
    if (stripos($m, 'could not find driver') !== false) {
        return 'El hosting no tiene activa la extensión pdo_mysql de PHP. Actívala en cPanel → Seleccionar versión de PHP → Extensiones.';
    }
    error_log('Vitrina, instalador MySQL: ' . $m);
    return 'No se pudo conectar con MySQL. Revisa el servidor, la base, el usuario y la contraseña.';
}

function e($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}
