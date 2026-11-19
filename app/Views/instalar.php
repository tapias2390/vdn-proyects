<?php /* Vista del instalador. Las variables vienen de instalar.php. */ ?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Instalar · Vitrina de Proyectos</title>
<style>
:root { --bg: #EDEFF3; --card: #FFFFFF; --soft: #F5F6F9; --line: #D8DDE5; --fg: #12151A; --fg2: #39404B; --muted: #646E7C; --ink: #12151A; --ok: #18834F; --okbg: #E6F4EC; --bad: #C23030; --badbg: #FBEAEA; --warn: #8A4E00; --warnbg: #FFF4E0; --focus: #3B66F5; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.wrap { max-width: 760px; margin: 0 auto; padding: 32px max(16px, env(safe-area-inset-right, 0px)) 64px max(16px, env(safe-area-inset-left, 0px)); }
.logo { display: block; height: 30px; width: auto; margin-bottom: 18px; }
h1 { font-size: 26px; line-height: 1.2; margin: 0 0 6px; letter-spacing: -0.01em; }
h2 { font-size: 17px; margin: 0 0 4px; }
p { margin: 0 0 10px; }
.lead { color: var(--fg2); margin-bottom: 22px; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 20px; margin-bottom: 16px; }
.muted { color: var(--muted); font-size: 13.5px; }
.req { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.req li { display: flex; gap: 10px; align-items: flex-start; }
.req b { font-weight: 600; }
.ico { flex: none; width: 20px; height: 20px; border-radius: 50%; display: inline-grid; place-items: center; font-size: 12px; font-weight: 700; color: #fff; margin-top: 2px; }
.ico.si { background: var(--ok); } .ico.no { background: var(--bad); } .ico.av { background: var(--warn); }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; }
label.f { display: grid; gap: 5px; align-content: start; font-size: 13.5px; font-weight: 600; color: var(--fg2); }
label.f small { font-weight: 400; color: var(--muted); }
input[type=text], input[type=password] { width: 100%; font: inherit; color: var(--fg); background: var(--card); border: 1px solid #C3CAD5; border-radius: 9px; padding: 9px 11px; }
input:focus { outline: 2px solid var(--focus); outline-offset: 1px; border-color: transparent; }
.mono { font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid var(--line); vertical-align: middle; }
th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); font-weight: 600; }
td.u { font-weight: 600; white-space: nowrap; }
td.c { width: 55%; }
td.a { white-space: nowrap; font-size: 13.5px; }
.btn { appearance: none; border: 0; border-radius: 10px; background: var(--ink); color: #fff; font: inherit; font-weight: 600; padding: 11px 18px; cursor: pointer; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.sec { background: var(--soft); color: var(--fg); border: 1px solid var(--line); }
.msg { border-radius: 12px; padding: 12px 14px; margin-bottom: 16px; }
.msg ul { margin: 6px 0 0; padding-left: 18px; }
.msg.bad { background: var(--badbg); color: #7A1616; border: 1px solid #F1C4C4; }
.msg.ok { background: var(--okbg); color: #0D5532; border: 1px solid #BFE3CD; }
.msg.warn { background: var(--warnbg); color: #6B3D00; border: 1px solid #F3D9A8; }
ol.pasos { margin: 0; padding-left: 20px; display: grid; gap: 6px; }
code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.92em; background: var(--soft); border: 1px solid var(--line); border-radius: 6px; padding: 1px 5px; }
textarea { width: 100%; min-height: 160px; font: 13px/1.45 ui-monospace, Menlo, Consolas, monospace; border: 1px solid var(--line); border-radius: 9px; padding: 10px; background: var(--soft); color: var(--fg); }
.fila { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: space-between; }
a { color: #2950D6; }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } td.c { width: auto; } th.a, td.a { display: none; } }
</style>
</head>
<body>
<div class="wrap">
<img class="logo" src="data:image/png;base64,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" alt="VDN Value" width="152" height="30">
<?php if ($resultado): ?>
  <h1>Listo, el panel quedó instalado</h1>
  <p class="lead">La Vitrina ya está conectada a <?php echo $resultado['motor'] ? e($resultado['motor']) : 'la base de datos'; ?>. <?php echo $resultado['previos'] ? 'Se conservaron los ' . (int) $resultado['previos'] . ' proyectos que ya había; solo cambiaron las contraseñas.' : ''; ?></p>
  <?php if ($resultado['config']): ?>
  <div class="msg warn"><b>Falta un paso.</b> PHP no pudo crear el archivo <code>.env</code>. Créalo a mano en la carpeta del panel (Administrador de archivos → Archivo nuevo) con este contenido exacto:</div>
  <div class="card"><textarea readonly spellcheck="false"><?php echo e($resultado['config']); ?></textarea></div>
  <?php endif; ?>
  <div class="card">
    <div class="fila"><h2>Accesos del equipo</h2><button type="button" class="btn sec" id="copiar">Copiar todo</button></div>
    <p class="muted">Guárdalos ahora: no se vuelven a mostrar. Comparte cada contraseña por un canal privado. Cada persona puede cambiar la suya desde su menú.</p>
    <table>
      <thead><tr><th>Usuario</th><th>Contraseña</th><th class="a">Rol</th></tr></thead>
      <tbody>
      <?php foreach ($resultado['usuarios'] as $id => $u): ?>
        <tr><td class="u"><?php echo e($id); ?></td><td class="c mono"><?php echo e($u['clave']); ?></td><td class="a"><?php echo $u['admin'] ? 'Administrador' : 'Equipo'; ?></td></tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    <textarea id="todo" hidden readonly><?php
        $lineas = "Vitrina de Proyectos · VDN Value\n" . $urlPanel . "\n";
        foreach ($resultado['usuarios'] as $id => $u) {
            $lineas .= "\n" . $id . ': ' . $u['clave'] . ($u['admin'] ? ' (administrador)' : '');
        }
        echo e($lineas);
    ?></textarea>
  </div>
  <div class="card">
    <h2>Ahora</h2>
    <ol class="pasos">
      <li>Borra el archivo <code>instalar.php</code> desde el Administrador de archivos del cPanel.</li>
      <li>Abre el panel: <a href="./"><?php echo e($urlPanel); ?></a></li>
      <li>Entra con tu usuario y la contraseña de arriba.</li>
    </ol>
  </div>
  <div class="msg" id="proteccion" hidden></div>
  <script>
  (function () {
    var b = document.getElementById('copiar'), t = document.getElementById('todo');
    b.addEventListener('click', function () {
      var listo = function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar todo'; }, 1800); };
      var manual = function () { t.hidden = false; t.focus(); t.select(); b.textContent = 'Cópialo con Ctrl + C'; };
      try { navigator.clipboard.writeText(t.value).then(listo, manual); } catch (x) { manual(); }
    });
    var p = document.getElementById('proteccion');
    fetch('datos/instalado.lock', { cache: 'no-store' }).then(function (r) {
      p.hidden = false;
      if (r.ok) { p.className = 'msg bad'; p.innerHTML = '<b>Cuidado:</b> la carpeta <code>datos/</code> se puede abrir desde internet. Revisa que el archivo <code>datos/.htaccess</code> se haya subido. Si tu hosting no usa Apache o LiteSpeed, pide a soporte que bloquee esa carpeta.'; }
      else { p.className = 'msg ok'; p.textContent = 'La carpeta datos/ está protegida: nadie puede abrir los archivos sin entrar al panel.'; }
    }).catch(function () {});
  })();
  </script>
<?php elseif ($instalado): ?>
  <h1>El panel ya está instalado</h1>
  <p class="lead">Por seguridad, borra este archivo (<code>instalar.php</code>) del hosting.</p>
  <div class="card">
    <p><a href="./">Abrir la Vitrina</a></p>
    <p class="muted" style="margin:0">¿Olvidaste las contraseñas o necesitas reinstalar? Borra solo <code>datos/instalado.lock</code> (deja el <code>.env</code>) y vuelve a abrir esta página: te pedirá la contraseña de MySQL del <code>.env</code> y creará accesos nuevos. Los proyectos se conservan; solo cambian las contraseñas.</p>
  </div>
<?php else: ?>
  <h1>Instalar la Vitrina de Proyectos</h1>
  <p class="lead">Conecta la base de datos MySQL del hosting y crea los accesos del equipo. Toma un minuto.</p>
  <?php if ($errores): ?>
  <div class="msg bad"><b>No se pudo instalar.</b><ul><?php foreach ($errores as $x): ?><li><?php echo e($x); ?></li><?php endforeach; ?></ul></div>
  <?php endif; ?>
  <div class="card">
    <h2>Requisitos</h2>
    <ul class="req">
      <?php foreach ($requisitos as $r): ?>
      <li><span class="ico <?php echo $r[1] ? 'si' : 'no'; ?>"><?php echo $r[1] ? '✓' : '!'; ?></span><span><b><?php echo e($r[0]); ?></b><?php echo $r[1] ? '' : '<br><span class="muted">' . e($r[2]) . '</span>'; ?></span></li>
      <?php endforeach; ?>
      <?php foreach ($avisos as $a): ?>
      <li><span class="ico av">!</span><span class="muted" style="font-size:14px"><?php echo e($a); ?></span></li>
      <?php endforeach; ?>
    </ul>
  </div>
  <form method="post" autocomplete="off">
    <input type="hidden" name="token" value="<?php echo e($token); ?>">
    <div class="card">
      <h2>1. Base de datos MySQL</h2>
      <p class="muted">Créala en cPanel → <b>Bases de datos MySQL</b>: una base, un usuario con contraseña y el usuario agregado a la base con <b>todos los privilegios</b>. cPanel les pone el prefijo de tu cuenta, por ejemplo <code>micuenta_vitrina</code>.</p>
      <?php if ($dsnPrueba): ?><p class="msg warn">Modo de prueba: se usará la base indicada en VITRINA_PRUEBA_DSN.</p><?php endif; ?>
      <?php if ($conEnv && !$dsnPrueba): ?>
      <p class="msg ok">Se usará la base de datos del archivo <code>.env</code> que ya está en el servidor. No se modifica.</p>
      <?php if ($envSinClave): ?>
      <p class="muted">El <code>.env</code> no tiene contraseña de MySQL (XAMPP local). Solo se puede instalar desde este mismo equipo.</p>
      <?php else: ?>
      <div class="grid">
        <label class="f">Contraseña de MySQL (la del .env)<input type="password" name="clave" value="" autocomplete="new-password"><small>Para confirmar que eres el dueño del servidor</small></label>
      </div>
      <?php endif; ?>
      <?php else: ?>
      <div class="grid">
        <label class="f">Servidor<input type="text" name="servidor" value="<?php echo e($v['servidor']); ?>" spellcheck="false"><small>Casi siempre localhost</small></label>
        <label class="f">Nombre de la base de datos<input type="text" name="base" value="<?php echo e($v['base']); ?>" placeholder="micuenta_vitrina" spellcheck="false"></label>
        <label class="f">Usuario de MySQL<input type="text" name="usuario" value="<?php echo e($v['usuario']); ?>" placeholder="micuenta_vitrina" spellcheck="false" autocomplete="off"></label>
        <label class="f">Contraseña de MySQL<input type="password" name="clave" value="<?php echo e($v['clave']); ?>" autocomplete="new-password"></label>
      </div>
      <?php endif; ?>
    </div>
    <div class="card">
      <h2>2. Accesos del equipo</h2>
      <p class="muted">Estas son las contraseñas iniciales. Puedes cambiarlas aquí (mínimo 8 caracteres). Los administradores pueden restablecer contraseñas y eliminar proyectos.</p>
      <table>
        <thead><tr><th>Usuario</th><th>Contraseña</th><th>Administrador</th></tr></thead>
        <tbody>
        <?php foreach ($VT_MIEMBROS as $id => $nombre): ?>
          <tr>
            <td class="u"><?php echo e($id); ?></td>
            <td class="c"><input class="mono" type="text" name="clave_<?php echo e($id); ?>" value="<?php echo e($claves[$id]); ?>" spellcheck="false" autocomplete="off" aria-label="Contraseña de <?php echo e($nombre); ?>"></td>
            <td><label><input type="checkbox" name="admin_<?php echo e($id); ?>" value="1"<?php echo in_array($id, $admins, true) ? ' checked' : ''; ?>> Sí</label></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
    <div class="fila">
      <p class="muted" style="margin:0">Se crean las tablas <code>vt_…</code> en la base de datos<?php echo $conEnv ? " (el <code>.env</code> no se modifica)" : " y el archivo <code>.env</code>"; ?>.</p>
      <button class="btn" type="submit"<?php echo $puedeInstalar ? '' : ' disabled'; ?>>Instalar</button>
    </div>
  </form>
<?php endif; ?>
</div>
</body>
</html>
