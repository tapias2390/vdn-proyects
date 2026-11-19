<?php
namespace Vitrina\Core;

use PDO;
use Vitrina\Models\Proyecto;
use Vitrina\Services\Auth;

abstract class Controlador
{
    /** @var PDO */
    protected $db;
    /** @var Peticion */
    protected $peticion;
    /** @var Auth */
    protected $auth;

    public function __construct(PDO $db, Peticion $peticion)
    {
        $this->db = $db;
        $this->peticion = $peticion;
        $this->auth = new Auth($db);
    }

    /* Campo del cuerpo JSON o $porDefecto si no viene. */
    protected function campo($clave, $porDefecto = null)
    {
        return isset($this->peticion->cuerpo[$clave]) ? $this->peticion->cuerpo[$clave] : $porDefecto;
    }

    protected function proyectoOFallar($id)
    {
        $p = (new Proyecto($this->db))->buscar($id);
        if (!$p) {
            Respuesta::error('Ese proyecto ya no existe.', 404);
        }
        return $p;
    }
}
