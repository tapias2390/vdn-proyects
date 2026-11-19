<?php
namespace Vitrina\Core;

final class Peticion
{
    public $accion;
    public $metodo;
    /* Cuerpo JSON ya decodificado (solo en POST). */
    public $cuerpo = [];

    public function __construct()
    {
        $this->accion = isset($_GET['accion']) ? (string) $_GET['accion'] : '';
        $this->metodo = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
    }

    public function leerCuerpoJson()
    {
        $crudo = file_get_contents('php://input');
        $E = $crudo === '' ? [] : json_decode($crudo, true);
        if (!is_array($E)) {
            Respuesta::error('Datos no válidos.');
        }
        $this->cuerpo = $E;
    }

    public function query($clave)
    {
        return isset($_GET[$clave]) ? $_GET[$clave] : null;
    }
}
