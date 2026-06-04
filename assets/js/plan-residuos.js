'use strict';
(function () {
  // Reveal on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Hamburger nav
  const nav       = document.querySelector('nav');
  const navLinks  = document.querySelector('.nav-links');
  const navLogos  = document.querySelector('.nav-logos');
  const navToggle = document.querySelector('.nav-toggle');
  if (!nav || !navLinks || !navLogos || !navToggle) return;
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  function checkFit() {
    if (isMobile) { nav.classList.add('compact'); return; }
    nav.classList.remove('compact');
    navLinks.style.cssText = 'display:flex;position:static;flex-direction:row;visibility:hidden;';
    const navW = nav.clientWidth, logosW = navLogos.offsetWidth, linksW = navLinks.scrollWidth;
    const cs = getComputedStyle(nav), pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    navLinks.style.cssText = '';
    if (logosW + linksW + pad + 16 > navW) { nav.classList.add('compact'); }
    else { nav.classList.remove('compact'); navLinks.classList.remove('open'); navToggle.classList.remove('active'); document.body.style.overflow = ''; }
  }
  if (!isMobile) new ResizeObserver(checkFit).observe(nav);
  checkFit();
  navToggle.addEventListener('click', function () {
    this.classList.toggle('active'); navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.classList.remove('active'); navLinks.classList.remove('open'); document.body.style.overflow = '';
  }));
})();

// ── MAPA OPERATIVO ──────────────────────────────────────────────
(function () {
  var el = document.getElementById('mapa-operativo');
  if (!el || typeof L === 'undefined') return;

  var map = L.map('mapa-operativo', { zoomControl: true, scrollWheelZoom: false })
              .setView([-20.3361, -69.6569], 15);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri World Imagery', maxZoom: 20
  }).addTo(map);

  // ── Polígonos del KMZ BASURA ────────────────────────────────
  var polyData = [
    { num: 1, coords: [[-20.3356376,-69.6567405],[-20.3354464,-69.6548308],[-20.3310702,-69.6550239],[-20.3311306,-69.6569122]] },
    { num: 2, coords: [[-20.3356376,-69.6567405],[-20.3400377,-69.6565551],[-20.340088,-69.6564264],[-20.3402288,-69.6562869],[-20.3405306,-69.6562869],[-20.3405005,-69.656008],[-20.3399874,-69.6552248],[-20.3391826,-69.6552784],[-20.33875,-69.655096],[-20.3368085,-69.6548063],[-20.3354464,-69.6548308]] },
    { num: 3, coords: [[-20.3326536,-69.6549351],[-20.3368789,-69.6547849],[-20.3391826,-69.6552784],[-20.3399975,-69.6551389],[-20.3399774,-69.6535618],[-20.3391826,-69.6527464],[-20.3377843,-69.6519739],[-20.3359818,-69.6519774],[-20.3351988,-69.65221],[-20.3326234,-69.6537656]] },
    { num: 4, coords: [[-20.3356376,-69.6567405],[-20.335722,-69.6581323],[-20.335551,-69.6588833],[-20.3352693,-69.6592159],[-20.3400002,-69.6588248],[-20.3404803,-69.6585722],[-20.3405005,-69.6579499],[-20.3404401,-69.6570487],[-20.3403294,-69.6569092],[-20.3401484,-69.6567697],[-20.3400377,-69.6565551]] },
    { num: 5, coords: [[-20.3318989,-69.6569365],[-20.3318084,-69.6589857],[-20.3326434,-69.6590072],[-20.3347259,-69.6589535],[-20.3355609,-69.6587604],[-20.335722,-69.6581323],[-20.3356376,-69.6567405]] },
    { num: 6, coords: [[-20.3311947,-69.6590072],[-20.3311645,-69.6600264],[-20.3312651,-69.6602624],[-20.3326434,-69.6602195],[-20.3342631,-69.6604234],[-20.3343118,-69.6602171],[-20.3344844,-69.6598762],[-20.3349271,-69.6593827],[-20.3352693,-69.6592159],[-20.3355609,-69.6587604],[-20.3347259,-69.6589535],[-20.3333074,-69.6589857]] },
    { num: 7, coords: [[-20.3400002,-69.6588248],[-20.3352693,-69.6592159],[-20.3349271,-69.6593827],[-20.3346554,-69.6596831],[-20.3344542,-69.6599942],[-20.3343118,-69.6602171],[-20.3342128,-69.6606272],[-20.3341524,-69.6611529],[-20.3376936,-69.6610135],[-20.3376735,-69.6607989],[-20.3402891,-69.6607345],[-20.340279,-69.6603912],[-20.3403394,-69.6598011],[-20.3402589,-69.6593612],[-20.3401482,-69.6588784]] }
  ];

  // Centroides (promedio de vértices)
  var centroids = {
    1: [-20.3333212, -69.6558768],
    2: [-20.3388362, -69.6557764],
    3: [-20.3369461, -69.6536372],
    4: [-20.3385560, -69.6577820],
    5: [-20.3339996, -69.6582166],
    6: [-20.3335931, -69.6596109],
    7: [-20.3372443, -69.6600051]
  };

  // Color único por polígono
  var polyColors = {
    1: '#e74c3c',
    2: '#9b59b6',
    3: '#3498db',
    4: '#2ecc71',
    5: '#f39c12',
    6: '#1abc9c',
    7: '#e91e63'
  };

  function polyType(num) {
    if ([1,5,6].indexOf(num) >= 0) return 'A';
    if ([2,4,7].indexOf(num) >= 0) return 'B';
    return 'C';
  }

  polyData.forEach(function(pd) {
    var col = polyColors[pd.num];
    L.polygon(pd.coords, {
      color: col, fillColor: col,
      fillOpacity: 0.25, weight: 2.5, opacity: 0.85
    }).addTo(map);
  });

  // ── Construcción de ícono de grupo ──────────────────────────
  var S  = 30;  // px de cada ícono
  var G  = 3;   // gap en px
  var W  = 4 * S + 3 * G; // ancho total = 129px
  var H4 = 4 * S + 3 * G; // alto total (4 filas) = 129px

  function iconDiv(faClass, bg, color) {
    return '<div style="width:' + S + 'px;height:' + S + 'px;border-radius:50%;' +
           'background:' + bg + ';color:' + color + ';' +
           'display:flex;align-items:center;justify-content:center;' +
           'font-size:' + Math.round(S * 0.5) + 'px;' +
           'box-shadow:0 2px 8px rgba(0,0,0,0.5);' +
           'border:2px solid rgba(255,255,255,0.85);flex-shrink:0;">' +
           '<i class="' + faClass + '"></i></div>';
  }

  var htmlCamion = iconDiv('fa-solid fa-truck-moving', '#1abc9c', '#fff');
  var htmlSup    = iconDiv('fa-solid fa-user-tie',     '#F5A800', '#0d3060');
  var htmlBarr   = iconDiv('fa-solid fa-broom',        '#2c3e50', '#fff');

  var rowBarr4 = '<div style="display:flex;gap:' + G + 'px;">' +
                 htmlBarr + htmlBarr + htmlBarr + htmlBarr + '</div>';

  function singleRow(html) {
    return '<div style="width:' + W + 'px;display:flex;justify-content:center;">' + html + '</div>';
  }

  function buildGroupIcon(type) {
    var inner, w, h, ax, ay;

    if (type === 'C') {
      // Solo camión, ligeramente más grande
      var sc = S + 6;
      inner = '<div style="width:' + sc + 'px;height:' + sc + 'px;border-radius:50%;' +
              'background:#1abc9c;color:#fff;' +
              'display:flex;align-items:center;justify-content:center;' +
              'font-size:' + Math.round(sc * 0.5) + 'px;' +
              'box-shadow:0 3px 12px rgba(0,0,0,0.55);' +
              'border:2.5px solid rgba(255,255,255,0.9);">' +
              '<i class="fa-solid fa-truck-moving"></i></div>';
      w = sc; h = sc; ax = sc / 2; ay = sc / 2;
    } else {
      var topIcon = (type === 'A') ? htmlCamion : htmlSup;
      var botIcon = (type === 'A') ? htmlSup    : htmlCamion;
      inner = '<div style="display:flex;flex-direction:column;align-items:center;gap:' + G + 'px;">' +
              singleRow(topIcon) +
              rowBarr4 +
              rowBarr4 +
              singleRow(botIcon) +
              '</div>';
      w = W; h = H4; ax = W / 2; ay = H4 / 2;
    }

    return L.divIcon({
      html: '<div style="position:relative;">' + inner + '</div>',
      iconSize: [w, h],
      iconAnchor: [ax, ay],
      className: ''
    });
  }

  // ── Colocar marcadores centrados en cada polígono ───────────
  polyData.forEach(function(pd) {
    var t    = polyType(pd.num);
    var icon = buildGroupIcon(t);
    var c    = centroids[pd.num];
    L.marker(c, { icon: icon }).addTo(map);
  });

  // ── Leyenda ────────────────────────────────────────────────
  // (se mantiene en el HTML)
})();
