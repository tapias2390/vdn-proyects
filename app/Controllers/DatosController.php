<?php
namespace Vitrina\Controllers;

use Vitrina\Core\Controlador;
use Vitrina\Core\Respuesta;
use Vitrina\Models\Actividad;
use Vitrina\Models\Cronometro;
use Vitrina\Models\Meta;
use Vitrina\Models\Nota;
use Vitrina\Models\Proyecto;
use Vitrina\Models\Tiempo;
use Vitrina\Models\Usuario;
use Vitrina\Models\Version;

/* Todo lo que necesita el tablero en una sola respuesta. */
final class DatosController extends Controlador
{
    public function datos()
    {
        $u = $this->auth->requerirUsuario();
        $v = (new Meta($this->db))->versionDatos();
        $pedida = $this->peticion->query('v');
        if ($pedida !== null && (string) $pedida === (string) $v) {
            Respuesta::json(['sinCambios' => true, 'v' => $v, 'ahora' => ahora(), 'yo' => $u]);
        }
        Respuesta::json([
            'v' => $v,
            'ahora' => ahora(),
            'yo' => $u,
            'proyectos' => (new Proyecto($this->db))->listar(),
            'notas' => (new Nota($this->db))->listar(),
            'tiempos' => (new Tiempo($this->db))->listar(),
            'actividad' => (new Actividad($this->db))->recientes(60),
            'cronometros' => (object) (new Cronometro($this->db))->activos(),
            'usuarios' => (new Usuario($this->db))->listar(),
            'espacio' => (new Version($this->db))->espacioUsado(),
        ]);
    }
}
