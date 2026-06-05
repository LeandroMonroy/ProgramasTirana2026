import re, os
src = 'c:/Users/LMonroy/ProgramasTirana2026'

with open(src+'/assets/nav_footer_tmp.txt', 'r', encoding='utf-8') as f:
    c = f.read()
parts = c.split('===FOOTER===')
nav = parts[0].replace('===NAV===\n','').strip()
footer = parts[1].strip()

footer = footer.replace('Departamento de Rentas Municipales', 'Direcci&oacute;n de Administraci&oacute;n y Finanzas')

nav_links_new = (
    '  <ul class="nav-links">'
    '<li><a href="index.html">Home</a></li>'
    '<li><a href="#analisis">An&aacute;lisis</a></li>'
    '</ul>'
)
nav = re.sub(r'<ul class="nav-links">.*?</ul>', nav_links_new, nav, flags=re.DOTALL)

head = '''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plan Gasto Personal - Festividad La Tirana 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
<link rel="stylesheet" href="assets/css/plan-personal.css">
</head>
<body>
'''

hero = '''
<!-- HERO -->
<section class="hero">
  <div class="hero-badge"><span>&#x1F4B0;</span> Ilustre Municipalidad de Pozo Almonte</div>
  <h1>An&aacute;lisis de<em>Gasto en Personal</em></h1>
  <div class="hero-divider"></div>
  <p class="hero-sub">Festividad Religiosa de <strong>La Tirana 2026</strong> &mdash; Direcci&oacute;n de Administraci&oacute;n y Finanzas &middot; Per&iacute;odo: 01&ndash;31 julio 2026</p>
  <div style="height:2rem"></div>
  <div class="hero-stats">
    <div class="hero-stat"><div class="num">$153M</div><div class="label">Presupuesto Total</div></div>
    <div class="hero-stat"><div class="num">183</div><div class="label">Personas</div></div>
    <div class="hero-stat"><div class="num">15</div><div class="label">Programas</div></div>
  </div>
</section>
'''

analisis = '''
<!-- ANALISIS -->
<section id="analisis">
  <div class="container">
    <div class="section-tag">Direcci&oacute;n de Administraci&oacute;n y Finanzas</div>
    <h2 class="section-title">An&aacute;lisis de <span>Gasto en Personal</span></h2>
    <p class="section-desc">Festividad La Tirana 2026 &middot; Per&iacute;odo: 01&ndash;31 julio 2026</p>

    <div class="gasto-gadgets reveal">
      <div class="gasto-gadget gasto-gadget--presupuesto">
        <div class="gg-icon">&#x1F4B8;</div>
        <div class="gg-val">$153.348.380</div>
        <div class="gg-label">Presupuesto Total</div>
        <div class="gg-sub">CLP &middot; 15 programas</div>
      </div>
      <div class="gasto-gadget gasto-gadget--personas">
        <div class="gg-icon">&#x1F465;</div>
        <div class="gg-val">183</div>
        <div class="gg-label">N&ordm; de Personas</div>
        <div class="gg-sub">cargos contratados</div>
      </div>
      <div class="gasto-gadget gasto-gadget--programas">
        <div class="gg-icon">&#x1F4CB;</div>
        <div class="gg-val">15</div>
        <div class="gg-label">N&ordm; de Programas</div>
        <div class="gg-sub">l&iacute;neas de trabajo</div>
      </div>
    </div>

    <h3 class="gasto-table-title reveal">Detalle de Gasto por Programa Operativo</h3>
    <div class="compras-table-wrap reveal">
      <table class="compras-table">
        <thead><tr>
          <th>Programa / Unidad</th>
          <th>Per&iacute;odo</th>
          <th style="text-align:center;">N&ordm; Personas</th>
          <th style="text-align:right;">Total CLP</th>
          <th style="text-align:center;">% del Total</th>
          <th style="text-align:center;">Nivel de Gasto</th>
        </tr></thead>
        <tbody>
          <tr><td class="gasto-prog">Gesti&oacute;n de Residuos (01-25/07)</td><td class="gasto-periodo">01/07&ndash;25/07</td><td class="gasto-num">37</td><td class="td-val">$56.664.470</td><td class="gasto-pct">37,0%</td><td class="gasto-nivel"><span class="nivel nivel--alto">Alto</span></td></tr>
          <tr><td class="gasto-prog">Seguridad P&uacute;blica</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">42</td><td class="td-val">$20.180.280</td><td class="gasto-pct">13,2%</td><td class="gasto-nivel"><span class="nivel nivel--alto">Alto</span></td></tr>
          <tr><td class="gasto-prog">Gesti&oacute;n de Residuos (09-20/07)</td><td class="gasto-periodo">09/07&ndash;20/07</td><td class="gasto-num">19</td><td class="td-val">$13.950.959</td><td class="gasto-pct">9,1%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Rentas</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">13</td><td class="td-val">$8.987.590</td><td class="gasto-pct">5,9%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Administraci&oacute;n y Finanzas</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">12</td><td class="td-val">$8.320.080</td><td class="gasto-pct">5,4%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Personal Programa de Trabajo</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">11</td><td class="td-val">$7.497.590</td><td class="gasto-pct">4,9%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">DIMAO Residuos (09-19/07)</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">10</td><td class="td-val">$6.985.060</td><td class="gasto-pct">4,6%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Abastecimiento Agua Potable y Regad&iacute;o</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">10</td><td class="td-val">$6.675.100</td><td class="gasto-pct">4,4%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Mejoramiento Espacios P&uacute;blicos</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">9</td><td class="td-val">$6.007.590</td><td class="gasto-pct">3,9%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Barreras</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">9</td><td class="td-val">$6.007.590</td><td class="gasto-pct">3,9%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Gesti&oacute;n de Residuos (01-31/07)</td><td class="gasto-periodo">01/07&ndash;31/07</td><td class="gasto-num">3</td><td class="td-val">$5.647.131</td><td class="gasto-pct">3,7%</td><td class="gasto-nivel"><span class="nivel nivel--medio">Medio</span></td></tr>
          <tr><td class="gasto-prog">Control Interno</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">2</td><td class="td-val">$1.644.980</td><td class="gasto-pct">1,1%</td><td class="gasto-nivel"><span class="nivel nivel--bajo">Bajo</span></td></tr>
          <tr><td class="gasto-prog">Alcald&iacute;a</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">2</td><td class="td-val">$1.644.980</td><td class="gasto-pct">1,1%</td><td class="gasto-nivel"><span class="nivel nivel--bajo">Bajo</span></td></tr>
          <tr><td class="gasto-prog">Obras Municipales</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">2</td><td class="td-val">$1.644.980</td><td class="gasto-pct">1,1%</td><td class="gasto-nivel"><span class="nivel nivel--bajo">Bajo</span></td></tr>
          <tr><td class="gasto-prog">Secretar&iacute;a Municipal</td><td class="gasto-periodo">09/07&ndash;19/07</td><td class="gasto-num">2</td><td class="td-val">$1.490.000</td><td class="gasto-pct">1,0%</td><td class="gasto-nivel"><span class="nivel nivel--bajo">Bajo</span></td></tr>
        </tbody>
        <tfoot><tr>
          <td colspan="2" class="td-total-label">Total General</td>
          <td style="text-align:center;font-family:Barlow Condensed,sans-serif;font-weight:900;font-size:1.2rem;color:var(--dorado);">183</td>
          <td class="td-total-sum">$153.348.380</td>
          <td style="text-align:center;color:rgba(255,255,255,0.7);font-family:Barlow Condensed,sans-serif;font-weight:700;">100,0%</td>
          <td></td>
        </tr></tfoot>
      </table>
    </div>

    <div class="tasas-wrap reveal">
      <div class="tasas-header">
        <i class="fa-solid fa-scale-balanced"></i>
        <span>Tasas Diarias de Referencia &mdash; Ley de Remuneraciones</span>
      </div>
      <table class="tasas-table">
        <thead><tr><th>Fracci&oacute;n</th><th>Corte 1 (CLP/d&iacute;a)</th><th>Corte 2 (CLP/d&iacute;a)</th></tr></thead>
        <tbody>
          <tr><td>40%</td><td>$26.700</td><td>$32.900</td></tr>
          <tr><td>60%</td><td>$40.051</td><td>$49.349</td></tr>
          <tr><td>100%</td><td>$66.751</td><td>$82.249</td></tr>
        </tbody>
      </table>
    </div>

  </div>
</section>

<script>
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, {threshold:0.1});
  reveals.forEach(el => io.observe(el));
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const nav = document.querySelector("nav");
  if (toggle) {
    function updateNav() {
      if (window.innerWidth <= 900) { nav.classList.add("compact"); }
      else { nav.classList.remove("compact"); navLinks.classList.remove("open"); toggle.classList.remove("active"); }
    }
    updateNav(); window.addEventListener("resize", updateNav);
    toggle.addEventListener("click", () => { toggle.classList.toggle("active"); navLinks.classList.toggle("open"); });
  }
</script>
'''

full = head + '\n' + nav + '\n' + hero + analisis + '\n' + footer + '\n</body>\n</html>'

with open(src+'/PlanPersonal.html', 'w', encoding='utf-8') as f:
    f.write(full)
print('Done, size:', len(full))
