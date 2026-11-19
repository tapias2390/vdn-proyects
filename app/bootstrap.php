<?php
/*
 * Vitrina de Proyectos · arranque común.
 * Define las rutas, registra el autocargador de clases y las utilidades.
 * No envía cabeceras ni salida: eso lo decide cada punto de entrada (api.php).
 */

define('VT_RAIZ', dirname(__DIR__));
define('VT_APP', __DIR__);
define('VT_DIR_DATOS', VT_RAIZ . '/datos');
define('VT_DIR_ARCHIVOS', VT_DIR_DATOS . '/archivos');
define('VT_DIR_TMP', VT_DIR_DATOS . '/tmp');

/* Vitrina\Core\Env -> app/Core/Env.php */
spl_autoload_register(function ($clase) {
    $prefijo = 'Vitrina\\';
    if (strncmp($clase, $prefijo, strlen($prefijo)) !== 0) {
        return;
    }
    $archivo = VT_APP . '/' . str_replace('\\', '/', substr($clase, strlen($prefijo))) . '.php';
    if (is_file($archivo)) {
        require $archivo;
    }
});

require VT_APP . '/Helpers/utilidades.php';
