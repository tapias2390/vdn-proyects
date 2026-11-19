<?php
/*
 * Rutas del panel: api.php?accion=<nombre>.
 * 'post' => true obliga a usar POST (si no, responde 405).
 */
function vt_ruta($controlador, $metodo, $post)
{
    return ['controlador' => $controlador, 'metodo' => $metodo, 'post' => $post];
}

return [
    // Sesión y accesos
    'estado' => vt_ruta('SesionController', 'estado', false),
    'entrar' => vt_ruta('SesionController', 'entrar', true),
    'salir' => vt_ruta('SesionController', 'salir', true),
    'cambiarClave' => vt_ruta('SesionController', 'cambiarClave', true),
    'restablecerClave' => vt_ruta('SesionController', 'restablecerClave', true),

    // Tablero
    'datos' => vt_ruta('DatosController', 'datos', false),

    // Proyectos
    'detalle' => vt_ruta('ProyectoController', 'detalle', false),
    'crearProyecto' => vt_ruta('ProyectoController', 'crear', true),
    'actualizarProyecto' => vt_ruta('ProyectoController', 'actualizar', true),
    'borrarProyecto' => vt_ruta('ProyectoController', 'borrar', true),

    // Versiones y archivos
    'version' => vt_ruta('VersionController', 'ver', false),
    'crearVersion' => vt_ruta('VersionController', 'crear', true),
    'archivo' => vt_ruta('ArchivoController', 'descargar', false),
    'archivosExistentes' => vt_ruta('ArchivoController', 'existentes', true),
    'subirParte' => vt_ruta('ArchivoController', 'subirParte', true),

    // Notas
    'crearNota' => vt_ruta('NotaController', 'crear', true),
    'resolverNota' => vt_ruta('NotaController', 'resolver', true),
    'borrarNota' => vt_ruta('NotaController', 'borrar', true),

    // Horas y cronómetro
    'crearTiempo' => vt_ruta('TiempoController', 'crear', true),
    'borrarTiempo' => vt_ruta('TiempoController', 'borrar', true),
    'iniciarCrono' => vt_ruta('TiempoController', 'iniciarCrono', true),
    'detenerCrono' => vt_ruta('TiempoController', 'detenerCrono', true),
];
