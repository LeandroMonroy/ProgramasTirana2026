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
              .setView([-20.0039, -69.6514], 15);

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri World Imagery', maxZoom: 20
  }).addTo(map);

  // FA-based map markers
  function faIcon(faClass, bg, color) {
    var html = '<div style="background:' + bg + ';color:' + color + ';width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 3px 10px rgba(0,0,0,0.4);border:2px solid rgba(255,255,255,0.7);"><i class="' + faClass + '"></i></div>';
    return L.divIcon({ html: html, iconSize: [34, 34], iconAnchor: [17, 34], className: '' });
  }

  var iconCamion = faIcon('fa-solid fa-truck-moving', '#1abc9c', '#fff');
  var iconSup    = faIcon('fa-solid fa-user-tie',     '#F5A800', '#0d3060');
  var iconBarr   = faIcon('fa-solid fa-broom',        '#2c3e50', '#fff');

  // Chevron zones (3 parallel cleaning lanes over La Tirana explanada)
  var zoneColor = '#e67e22';
  var zones = [
    [ [-20.0022,-69.6535], [-20.0022,-69.6490], [-20.0030,-69.6482], [-20.0030,-69.6527] ],
    [ [-20.0033,-69.6535], [-20.0033,-69.6490], [-20.0041,-69.6482], [-20.0041,-69.6527] ],
    [ [-20.0044,-69.6535], [-20.0044,-69.6490], [-20.0052,-69.6482], [-20.0052,-69.6527] ]
  ];
  zones.forEach(function(z) {
    L.polygon(z, { color: zoneColor, fillColor: zoneColor, fillOpacity: 0.45, weight: 2, opacity: 0.9 }).addTo(map);
  });

  // Zone markers: per zone [camion, supervisor, barrenderos x3]
  var zoneAnchors = [
    { lat: -20.0026, lng: -69.6512 },
    { lat: -20.0037, lng: -69.6512 },
    { lat: -20.0048, lng: -69.6512 }
  ];
  zoneAnchors.forEach(function(a) {
    L.marker([a.lat, a.lng - 0.0020], { icon: iconCamion }).addTo(map);
    L.marker([a.lat, a.lng - 0.0006], { icon: iconSup }).addTo(map);
    L.marker([a.lat, a.lng + 0.0006], { icon: iconBarr }).addTo(map);
    L.marker([a.lat, a.lng + 0.0016], { icon: iconBarr }).addTo(map);
    L.marker([a.lat, a.lng + 0.0024], { icon: iconCamion }).addTo(map);
  });
})();