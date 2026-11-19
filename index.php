<?php
/*
 * Vitrina de Proyectos · VDN Value
 * Página del panel. Todo el trabajo lo hace assets/js/app.js hablando con api.php.
 */
header_remove('X-Powered-By');
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: same-origin');

/* ?v= cambia cuando cambia el archivo, así el navegador nunca usa una copia vieja. */
function vt_asset($ruta)
{
    $archivo = __DIR__ . '/' . $ruta;
    return htmlspecialchars($ruta . '?v=' . (is_file($archivo) ? filemtime($archivo) : '0'), ENT_QUOTES, 'UTF-8');
}
?><!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Vitrina de Proyectos · VDN Value</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2312151A'/%3E%3Cpath d='M8.5 9.5 16 23l7.5-13.5' fill='none' stroke='%23fff' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Schibsted+Grotesk:wght@600;700;800&display=swap">
<link rel="stylesheet" href="<?php echo vt_asset('assets/css/app.css'); ?>">
</head>
<body>

<header class="top">
  <div class="top-in">
    <a class="brand" href="#" id="marca" aria-label="Vitrina de Proyectos de VDN Value, inicio">
      <span class="logo" role="img" aria-label="VDN Value"></span>
      <span class="brand-div" aria-hidden="true"></span>
      <span class="brand-name">Vitrina</span>
      <span class="brand-sub">proyectos html</span>
    </a>
    <span class="conn" id="conn" role="status"><span class="t">Conectando…</span></span>
    <div class="run" id="topRun" hidden></div>
    <button type="button" class="me" id="btnYo" aria-haspopup="menu" aria-expanded="false" aria-controls="menuYo" aria-label="Tu cuenta"></button>
  </div>
</header>
<div class="banner" id="banner" hidden><div class="banner-in"><span data-ic="alert"></span><span id="bannerTxt"></span></div></div>

<main class="wrap" id="tablero">
  <div class="dash-grid">
    <div class="ventana" id="principal">
      <section class="hero" id="hero" aria-label="Resumen del equipo">
        <div class="hero-art" aria-hidden="true">
          <svg viewBox="0 0 132 104" fill="none">
            <defs>
              <linearGradient id="haFrente" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--surface)"/><stop offset="1" style="stop-color:var(--surface-2)"/></linearGradient>
              <linearGradient id="haAtras" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in oklab, var(--st-revision) 28%, var(--surface))"/><stop offset="1" style="stop-color:color-mix(in oklab, var(--st-revision) 46%, var(--surface))"/></linearGradient>
              <linearGradient id="haAzul" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in oklab, var(--st-progreso) 60%, #fff)"/><stop offset="1" style="stop-color:var(--st-progreso)"/></linearGradient>
              <linearGradient id="haMorado" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in oklab, var(--st-revision) 60%, #fff)"/><stop offset="1" style="stop-color:var(--st-revision)"/></linearGradient>
              <linearGradient id="haVerde" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in oklab, var(--st-terminado) 60%, #fff)"/><stop offset="1" style="stop-color:var(--st-terminado)"/></linearGradient>
            </defs>
            <ellipse cx="62" cy="98" rx="50" ry="5" style="fill:rgb(18 21 26 / .13)"/>
            <rect x="36" y="4" width="88" height="66" rx="14" fill="url(#haAtras)"/>
            <rect x="36.5" y="4.5" width="87" height="65" rx="13.5" style="stroke:rgb(255 255 255 / .5)"/>
            <rect x="8" y="18" width="96" height="74" rx="15" fill="url(#haFrente)" style="stroke:var(--line-2)"/>
            <path d="M8.5 33.5h95" style="stroke:var(--line)"/>
            <circle cx="19" cy="26" r="2.4" style="fill:var(--st-ajustes)"/>
            <circle cx="27" cy="26" r="2.4" style="fill:var(--line-2)"/>
            <circle cx="35" cy="26" r="2.4" style="fill:var(--line-2)"/>
            <rect x="17" y="41" width="32" height="42" rx="8" fill="url(#haAzul)"/>
            <rect x="20.5" y="44.5" width="25" height="5" rx="2.5" style="fill:rgb(255 255 255 / .4)"/>
            <rect x="55" y="41" width="40" height="18" rx="7" fill="url(#haMorado)"/>
            <rect x="58.5" y="44.5" width="22" height="4" rx="2" style="fill:rgb(255 255 255 / .4)"/>
            <rect x="55" y="64" width="40" height="19" rx="7" fill="url(#haVerde)"/>
            <rect x="58.5" y="67.5" width="16" height="4" rx="2" style="fill:rgb(255 255 255 / .4)"/>
            <g class="ha-brillos">
              <path d="M114 74l2.2 5.3 5.3 2.2-5.3 2.2-2.2 5.3-2.2-5.3-5.3-2.2 5.3-2.2z" style="fill:var(--st-ajustes)"/>
              <path d="M125 62l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z" style="fill:var(--st-progreso)"/>
            </g>
          </svg>
        </div>
        <div class="hero-tx">
          <h2 class="hero-t" id="heroT">Hola <span aria-hidden="true">👋</span></h2>
          <p class="hero-s" id="heroS">Cargando los proyectos del equipo…</p>
          <div class="row hero-acc">
            <button type="button" class="btn btn-ink" id="btnSubir" hidden><span data-ic="upload"></span><span class="btn-label">Subir proyecto</span></button>
            <span id="heroExtra"></span>
          </div>
        </div>
        <div class="hero-chip" id="heroChip" hidden></div>
      </section>
      <section class="sum" aria-label="Resumen por estado">
        <div class="states" id="estados" role="group" aria-label="Filtrar por estado"></div>
      </section>
      <div class="toolbar">
        <label class="search"><span data-ic="search"></span><input id="buscar" type="search" placeholder="Buscar proyecto" aria-label="Buscar proyecto" autocomplete="off"><kbd aria-hidden="true" title="Atajo: tecla /">/</kbd></label>
        <div class="who-filter" id="filtroQuien" role="group" aria-label="Filtrar por encargado"></div>
        <div class="seg" id="segVista" role="group" aria-label="Vista">
          <span class="ind" aria-hidden="true"></span>
          <button type="button" data-vista="tablero" aria-pressed="true"><span data-ic="board"></span>Tablero</button>
          <button type="button" data-vista="lista" aria-pressed="false"><span data-ic="list"></span>Lista</button>
        </div>
      </div>
      <div class="dash-main" id="vistaProyectos"><div class="skel"></div></div>
    </div>
    <aside class="side" id="lateral" aria-label="Equipo"></aside>
  </div>
</main>

<section class="detail" id="detalle" hidden aria-label="Proyecto">
  <header class="d-head">
    <button type="button" class="btn btn-ghost btn-sm" id="dVolver"><span data-ic="back"></span>Proyectos</button>
    <input class="d-name" id="dNombre" maxlength="120" aria-label="Nombre del proyecto" autocomplete="off">
    <span class="pill demo-tag" style="--c: var(--warn)">Ejemplo · no se guarda</span>
    <div class="d-ctrls">
      <label class="ctl ctl-estado" id="dEstadoCtl"><span class="dot"></span><select id="dEstado" aria-label="Estado"></select></label>
      <label class="ctl"><span class="av av-sm" id="dEncAv"></span><select id="dEncargado" aria-label="Encargado"></select></label>
      <span class="d-due" id="dEntrega"></span>
      <span class="live" id="dLive" hidden></span>
    </div>
  </header>
  <div class="d-body">
    <div class="stage">
      <div class="v-bar">
        <label class="addr" title="Página del proyecto"><span data-ic="file"></span><select id="vPagina" aria-label="Página del proyecto"></select></label>
        <div class="seg seg-sm" id="vDisp" role="group" aria-label="Tamaño de pantalla">
          <span class="ind" aria-hidden="true"></span>
          <button type="button" data-disp="escritorio" title="Escritorio · 1440 × 900"><span data-ic="monitor"></span><span>Escritorio</span></button>
          <button type="button" data-disp="tablet" title="Tablet · 820 × 1180"><span data-ic="tablet"></span><span>Tablet</span></button>
          <button type="button" data-disp="movil" title="Móvil · 390 × 844"><span data-ic="phone"></span><span>Móvil</span></button>
          <button type="button" data-disp="libre" title="Ocupar todo el espacio, sin escala"><span data-ic="fit"></span><span>Libre</span></button>
        </div>
        <span class="zoom" id="vZoom"></span>
        <select class="select select-sm" id="vVersion" aria-label="Versión" hidden></select>
        <button type="button" class="btn btn-sm probs" id="vProblemas" hidden></button>
        <button type="button" class="btn btn-ghost btn-sm btn-icon" id="vRecargar" title="Recargar la vista previa" aria-label="Recargar la vista previa"><span data-ic="refresh"></span></button>
        <button type="button" class="btn btn-ghost btn-sm btn-icon" id="vAmpliar" title="Ampliar la vista previa" aria-label="Ampliar la vista previa"><span data-ic="expand"></span></button>
      </div>
      <div class="v-pop" id="vPop" hidden></div>
      <div class="v-stage" id="vStage">
        <div class="v-msg" id="vMsg" hidden></div>
        <div class="dev" id="vBox" hidden></div>
      </div>
    </div>
    <aside class="desk" aria-label="Seguimiento del proyecto">
      <div class="tabs" role="tablist">
        <span class="ind" aria-hidden="true"></span>
        <button type="button" class="tab" role="tab" data-tab="notas" aria-selected="true" aria-controls="tp-notas">Notas <span class="n" id="nNotas">0</span></button>
        <button type="button" class="tab" role="tab" data-tab="tiempo" aria-selected="false" aria-controls="tp-tiempo">Tiempo <span class="n" id="nTiempo">0 h</span></button>
        <button type="button" class="tab" role="tab" data-tab="detalles" aria-selected="false" aria-controls="tp-detalles">Detalles</button>
        <button type="button" class="tab" role="tab" data-tab="historial" aria-selected="false" aria-controls="tp-historial">Historial</button>
        <button type="button" class="tab" role="tab" data-tab="archivos" aria-selected="false" aria-controls="tp-archivos">Archivos</button>
      </div>
      <div class="tab-panel" id="tp-notas" role="tabpanel">
        <div class="composer">
          <textarea class="textarea" id="nTexto" placeholder="Escribe una nota para el equipo. Ctrl + Enter para guardar." aria-label="Nueva nota"></textarea>
          <div class="row">
            <label class="check" id="nCtxWrap"><input type="checkbox" id="nCtx" checked> Sobre <code id="nCtxTxt"></code></label>
            <button type="button" class="btn btn-ink btn-sm" id="nGuardar">Agregar nota</button>
          </div>
        </div>
        <div class="row" style="justify-content: space-between">
          <h3 class="sec-t" id="nTitulo">Pendientes</h3>
          <label class="check"><input type="checkbox" id="nVerResueltas"> Mostrar resueltas</label>
        </div>
        <div class="notes" id="nLista"></div>
      </div>
      <div class="tab-panel" id="tp-tiempo" role="tabpanel" hidden>
        <div id="tCrono"></div>
        <div id="tResumen"></div>
        <form class="time-form" id="tForm">
          <h3 class="sec-t full">Agregar horas a mano</h3>
          <label class="field"><span>Horas</span><input class="input" id="tHoras" type="number" min="0.25" max="24" step="0.25" placeholder="1.5" required></label>
          <label class="field"><span>Fecha</span><input class="input" id="tFecha" type="date" required></label>
          <label class="field"><span>Quién</span><select class="select" id="tQuien"></select></label>
          <label class="field"><span>¿En qué?</span><input class="input" id="tNota" maxlength="140" placeholder="Maquetación del inicio"></label>
          <div class="full row" style="justify-content: flex-end"><button class="btn btn-sm" type="submit"><span data-ic="plus"></span>Agregar</button></div>
        </form>
        <div><h3 class="sec-t">Registros <span class="n" id="tCuenta"></span></h3><ul class="entries" id="tLista"></ul></div>
      </div>
      <div class="tab-panel" id="tp-detalles" role="tabpanel" hidden>
        <label class="field"><span>Descripción</span><textarea class="textarea" id="fDesc" maxlength="2000" placeholder="Cliente, alcance, enlaces útiles…"></textarea></label>
        <div class="grid2">
          <label class="field"><span>Prioridad</span><select class="select" id="fPrio"></select></label>
          <label class="field"><span>Fecha de entrega</span><input class="input" id="fEntrega" type="date"></label>
          <label class="field"><span>Horas estimadas</span><input class="input" id="fHoras" type="number" min="0" step="0.5" placeholder="Sin estimar"></label>
          <label class="field"><span>Página de inicio</span><select class="select" id="fInicio"></select></label>
        </div>
        <dl class="kv" id="fInfo"></dl>
        <div class="danger-zone" id="fBorrar" hidden></div>
      </div>
      <div class="tab-panel" id="tp-historial" role="tabpanel" hidden>
        <div class="row" style="justify-content: space-between"><h3 class="sec-t">Versiones</h3><button type="button" class="btn btn-sm" id="hSubir" hidden><span data-ic="upload"></span>Subir nueva versión</button></div>
        <ul class="versions" id="hVersiones"></ul>
        <h3 class="sec-t">Actividad</h3>
        <ul class="acts" id="hActividad"></ul>
      </div>
      <div class="tab-panel" id="tp-archivos" role="tabpanel" hidden>
        <div id="aResumen" class="muted"></div>
        <ul class="files" id="aLista"></ul>
      </div>
    </aside>
  </div>
</section>

<div class="modal" id="mSubir" hidden role="dialog" aria-modal="true" aria-labelledby="mSubirT">
  <div class="sheet">
    <div class="sheet-h"><h2 id="mSubirT">Subir proyecto</h2><button type="button" class="btn btn-ghost btn-icon btn-sm" data-cerrar aria-label="Cerrar"><span data-ic="x"></span></button></div>
    <div class="sheet-b">
      <label class="drop" id="sDrop">
        <input type="file" id="sArchivo" accept=".zip,application/zip,application/x-zip-compressed" style="position:absolute;width:1px;height:1px;opacity:0">
        <span data-ic="box"></span>
        <strong id="sDropT">Arrastra aquí el .zip del proyecto</strong>
        <span class="muted" id="sDropS">o haz clic para elegirlo. Debe tener al menos un archivo .html.</span>
      </label>
      <div id="sZip" hidden></div>
      <div id="sCampos" class="sheet-b" style="padding: 0">
        <label class="field"><span>Nombre del proyecto</span><input class="input" id="sNombre" maxlength="120" required placeholder="Landing Team Gossa"></label>
        <div class="field"><span>Encargado</span><div class="who-pick" id="sEncargado"></div></div>
        <div class="grid2">
          <label class="field"><span>Estado</span><select class="select" id="sEstado"></select></label>
          <label class="field"><span>Prioridad</span><select class="select" id="sPrio"></select></label>
          <label class="field"><span>Fecha de entrega</span><input class="input" id="sEntrega" type="date"></label>
          <label class="field"><span>Horas estimadas</span><input class="input" id="sHoras" type="number" min="0" step="0.5" placeholder="Opcional"></label>
        </div>
        <label class="field"><span>Descripción</span><textarea class="textarea" id="sDesc" maxlength="2000" placeholder="Cliente, alcance, enlaces útiles… (opcional)"></textarea></label>
      </div>
      <label class="field" id="sCambiosWrap" hidden><span>¿Qué cambió en esta versión?</span><textarea class="textarea" id="sCambios" maxlength="600" placeholder="Opcional. Queda en el historial y como nota."></textarea></label>
      <p class="muted" id="sEspacio" style="margin:0;font-size:12px" hidden></p>
    </div>
    <div class="sheet-f">
      <div class="estado" id="sEstadoTxt"></div>
      <button type="button" class="btn" data-cerrar id="sCancelar">Cancelar</button>
      <button type="button" class="btn btn-ink" id="sEnviar">Crear proyecto</button>
    </div>
  </div>
</div>

<div class="login" id="login" hidden>
  <form class="login-card" id="fLogin" novalidate>
    <span class="logo" role="img" aria-label="VDN Value"></span>
    <div><h1>Vitrina de proyectos</h1><p>Entra con tu usuario del equipo.</p></div>
    <label class="field"><span>Usuario</span><input class="input" id="lUsuario" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="nicolas"></label>
    <label class="field"><span>Contraseña</span><span class="pass"><input class="input" id="lClave" name="password" type="password" autocomplete="current-password"><button type="button" class="btn btn-ghost btn-sm btn-icon" id="lVer" aria-label="Mostrar la contraseña" title="Mostrar la contraseña"><span data-ic="eye"></span></button></span></label>
    <div class="login-err" id="lError" role="alert"></div>
    <button class="btn btn-ink" type="submit" id="lEntrar">Entrar</button>
    <p class="login-foot">¿Olvidaste tu contraseña? Pide a un administrador del panel que la restablezca.</p>
  </form>
</div>

<div class="menu" id="menuYo" hidden role="menu" aria-label="Tu cuenta">
  <div class="who" id="menuWho"></div>
  <button type="button" role="menuitem" data-accion="clave"><span data-ic="key"></span>Cambiar mi contraseña</button>
  <button type="button" role="menuitem" data-accion="accesos" id="menuAccesos" hidden><span data-ic="users"></span>Accesos del equipo</button>
  <button type="button" role="menuitem" data-accion="salir"><span data-ic="logout"></span>Cerrar sesión</button>
</div>

<div class="modal" id="mClave" hidden role="dialog" aria-modal="true" aria-labelledby="mClaveT">
  <form class="sheet sheet-sm" id="fClave" novalidate>
    <div class="sheet-h"><h2 id="mClaveT">Cambiar mi contraseña</h2><button type="button" class="btn btn-ghost btn-icon btn-sm" data-cerrar aria-label="Cerrar"><span data-ic="x"></span></button></div>
    <div class="sheet-b">
      <input id="cUsuario" name="username" autocomplete="username" hidden>
      <label class="field"><span>Contraseña actual</span><input class="input" id="cActual" type="password" autocomplete="current-password"></label>
      <label class="field"><span>Contraseña nueva</span><input class="input" id="cNueva" type="password" autocomplete="new-password"></label>
      <label class="field"><span>Repite la contraseña nueva</span><input class="input" id="cRepite" type="password" autocomplete="new-password"></label>
      <p class="muted" style="margin:0;font-size:12px">Mínimo 8 caracteres. Al cambiarla se cierra tu sesión en otros navegadores.</p>
      <div class="login-err" id="cError" role="alert"></div>
    </div>
    <div class="sheet-f"><button type="button" class="btn" data-cerrar>Cancelar</button><button type="submit" class="btn btn-ink" id="cGuardar">Guardar contraseña</button></div>
  </form>
</div>

<div class="modal" id="mAccesos" hidden role="dialog" aria-modal="true" aria-labelledby="mAccesosT">
  <div class="sheet sheet-sm">
    <div class="sheet-h"><h2 id="mAccesosT">Accesos del equipo</h2><button type="button" class="btn btn-ghost btn-icon btn-sm" data-cerrar aria-label="Cerrar"><span data-ic="x"></span></button></div>
    <div class="sheet-b">
      <p class="muted" style="margin:0;font-size:12.5px">Restablecer crea una contraseña nueva y cierra la sesión de esa persona. Compártela por un canal privado.</p>
      <ul class="accs" id="accLista"></ul>
      <div id="accNueva" hidden></div>
    </div>
  </div>
</div>

<div class="capa-fantasma" id="capaFantasma" aria-hidden="true"></div>
<div class="toasts" id="toasts" aria-live="polite"></div>

<script src="<?php echo vt_asset('assets/js/app.js'); ?>"></script>
</body>
</html>
