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

  // SVG icons
  function svgIcon(svg, size) {
    return L.divIcon({ html: svg, iconSize: size, iconAnchor: [size[0]/2, size[1]], className: '' });
  }

  var iconCamion = svgIcon('<svg xmlns="http://www.w3.org/2000/svg" width="42" height="30" viewBox="0 0 42 30"><rect x="1" y="8" width="26" height="18" rx="3" fill="#1abc9c" stroke="#0e8f6e" stroke-width="1.5"/><polygon points="27,11 40,11 40,26 27,26" fill="#16a085" stroke="#0e8f6e" stroke-width="1.5"/><circle cx="9" cy="28" r="4" fill="#2c3e50"/><circle cx="20" cy="28" r="4" fill="#2c3e50"/><circle cx="36" cy="28" r="4" fill="#2c3e50"/><rect x="28" y="12" width="10" height="8" rx="1" fill="#d5f5ef"/><text x="14" y="21" font-size="11" fill="white" text-anchor="middle" font-weight="bold">&#x267B;</text></svg>', [42, 30]);

  var iconSup = svgIcon('<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40"><circle cx="14" cy="9" r="6" fill="#F5C6A0"/><path d="M4 8 Q14 0 24 8 L26 12 H2Z" fill="#F5A800"/><rect x="2" y="12" width="24" height="3" fill="#F5A800" rx="1"/><rect x="6" y="18" width="16" height="14" rx="3" fill="#F5A800"/><rect x="6" y="30" width="6" height="10" rx="2" fill="#2c3e50"/><rect x="16" y="30" width="6" height="10" rx="2" fill="#2c3e50"/></svg>', [28, 40]);

  var iconBarr = svgIcon('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40"><circle cx="12" cy="7" r="5.5" fill="#2c3e50"/><rect x="5" y="14" width="14" height="14" rx="3" fill="#2c3e50"/><rect x="5" y="26" width="5" height="12" rx="2" fill="#1a252f"/><rect x="14" y="26" width="5" height="12" rx="2" fill="#1a252f"/><line x1="18" y1="20" x2="26" y2="35" stroke="#7f8c8d" stroke-width="2.5" stroke-linecap="round"/></svg>', [24, 40]);

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