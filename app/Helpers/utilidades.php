<?php
/* Utilidades generales del panel (sin acceso a la base de datos). */

function ahora()
{
    return (int) round(microtime(true) * 1000);
}
function nuevoId($prefijo)
{
    return $prefijo . bin2hex(random_bytes(8));
}
function texto($valor, $max)
{
    $v = trim(is_scalar($valor) ? (string) $valor : '');
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}
function minusculas($v)
{
    return function_exists('mb_strtolower') ? mb_strtolower($v, 'UTF-8') : strtolower($v);
}
function normUsuario($u)
{
    $u = minusculas(trim(is_scalar($u) ? (string) $u : ''));
    return strtr($u, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n']);
}
function esSha($s)
{
    return is_string($s) && preg_match('/^[a-f0-9]{64}$/', $s) === 1;
}
function esFecha($s)
{
    return is_string($s) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) === 1;
}
function entero($v)
{
    return $v === null ? null : (int) $v;
}
function claveAleatoria()
{
    $abc = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $c = '';
    for ($i = 0; $i < 12; $i++) {
        $c .= $abc[random_int(0, strlen($abc) - 1)];
    }
    return substr($c, 0, 4) . '-' . substr($c, 4, 4) . '-' . substr($c, 8, 4);
}
/*
 * true si la petición viene de este mismo sitio. Revisa Sec-Fetch-Site y Origin,
 * que el navegador pone solo y una página ajena no puede falsificar.
 * "Origin: null" (iframes con sandbox, como la vista previa) se rechaza.
 */
function vt_mismo_origen()
{
    $sitio = isset($_SERVER['HTTP_SEC_FETCH_SITE']) ? strtolower((string) $_SERVER['HTTP_SEC_FETCH_SITE']) : '';
    if ($sitio !== '' && $sitio !== 'same-origin' && $sitio !== 'none') {
        return false;
    }
    if (!isset($_SERVER['HTTP_ORIGIN'])) {
        return true;
    }
    $o = parse_url((string) $_SERVER['HTTP_ORIGIN']);
    if (!is_array($o) || empty($o['host'])) {
        return false;
    }
    $origen = strtolower($o['host']) . (isset($o['port']) ? ':' . $o['port'] : '');
    $host = strtolower(isset($_SERVER['HTTP_HOST']) ? (string) $_SERVER['HTTP_HOST'] : '');
    /* Quita el puerto por defecto si el Host lo trae explícito. */
    $host = preg_replace('/:(80|443)$/', '', $host);
    $origen = preg_replace('/:(80|443)$/', '', $origen);
    return $origen === $host;
}

function jsonTexto($v)
{
    return json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
