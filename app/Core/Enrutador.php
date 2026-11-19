<?php
namespace Vitrina\Core;

use PDO;
use Throwable;

/* Busca la acción en app/rutas.php y llama al método del controlador. */
final class Enrutador
{
    private $rutas;

    public function __construct(array $rutas)
    {
        $this->rutas = $rutas;
    }

    public function despachar(PDO $db, Peticion $peticion)
    {
        $accion = $peticion->accion;
        $ruta = isset($this->rutas[$accion]) ? $this->rutas[$accion] : null;

        if ($ruta && $ruta['post'] && $peticion->metodo !== 'POST') {
            Respuesta::error('Método no permitido.', 405);
        }
        /* subirParte recibe binario, no JSON. */
        if ($peticion->metodo === 'POST' && $accion !== 'subirParte') {
            $peticion->leerCuerpoJson();
        }

        try {
            if (!$ruta) {
                Respuesta::error('Acción desconocida.', 404);
            }
            $clase = 'Vitrina\\Controllers\\' . $ruta['controlador'];
            $controlador = new $clase($db, $peticion);
            $controlador->{$ruta['metodo']}();
        } catch (Throwable $e) {
            error_log('Vitrina, error en "' . $accion . '": ' . $e->getMessage() . ' en ' . $e->getFile() . ':' . $e->getLine());
            Respuesta::error('Ocurrió un error en el servidor. Inténtalo de nuevo.', 500);
        }
    }
}
