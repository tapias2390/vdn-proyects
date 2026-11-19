<?php
namespace Vitrina\Models;

use PDO;

abstract class Modelo
{
    /** @var PDO */
    protected $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }
}
