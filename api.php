<?php
/*
 * Vitrina de Proyectos · VDN Value
 * Punto de entrada del servidor (front controller). Recibe api.php?accion=...
 * y la entrega al controlador que corresponde según app/rutas.php.
 *
 *   app/Core         Núcleo: .env, configuración, base de datos, petición, respuesta, rutas
 *   app/Models       Acceso a las tablas vt_* y a los archivos en datos/
 *   app/Controllers  Una clase por área (sesión, proyectos, versiones, notas, horas...)
 *   app/Services     Autenticación por cookie
 *   config/app.php   Valores de configuración (salen del archivo .env)
 *
 * Requiere PHP 7.3 o superior con PDO MySQL.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
header_remove('X-Powered-By');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

require __DIR__ . '/app/bootstrap.php';

use Vitrina\Core\BaseDatos;
use Vitrina\Core\Config;
use Vitrina\Core\Enrutador;
use Vitrina\Core\Peticion;
use Vitrina\Core\Respuesta;

if (!Config::cargar()) {
    Respuesta::error('El panel aún no está instalado. Abre instalar.php para configurarlo.', 503, 'sin_instalar');
}
date_default_timezone_set(Config::get('zona_horaria', 'America/Bogota'));

/* Todas las llamadas del panel llevan esta cabecera: otro sitio no puede enviarla. */
if ((isset($_SERVER['HTTP_X_VITRINA']) ? $_SERVER['HTTP_X_VITRINA'] : '') !== '1') {
    Respuesta::error('Solicitud no válida.', 403);
}
/* Segunda barrera: si el navegador dice de dónde viene la petición, debe ser este mismo sitio. */
if (!vt_mismo_origen()) {
    Respuesta::error('Solicitud no válida.', 403);
}

$db = BaseDatos::conectar();
(new Enrutador(require VT_APP . '/rutas.php'))->despachar($db, new Peticion());
