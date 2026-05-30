const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Leaflet map — La Tirana
  const map = L.map('mapa-tirana');
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, maxNativeZoom: 17, attribution: '© Esri World Imagery'
  }).addTo(map);

  // KMZ sectores
  const sectoresData = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"SECTOR SANTA ISABEL"},"geometry":{"type":"Polygon","coordinates":[[[-69.64975604630108,-20.34081348509203],[-69.6446923530397,-20.34088620784588],[-69.64476532721088,-20.32965153374837],[-69.64980521158968,-20.32965156731599],[-69.64975604630108,-20.34081348509203]]]}},{"type":"Feature","properties":{"name":"SECTOR SANTA EMILIA NORTE"},"geometry":{"type":"Polygon","coordinates":[[[-69.666210947811,-20.333573612962],[-69.66289235638519,-20.33394425082967],[-69.662871881677,-20.33376291868817],[-69.66029032026152,-20.33275220908236],[-69.6602834593195,-20.33115746534607],[-69.65865163900783,-20.33115976333973],[-69.65886868570891,-20.32751647603972],[-69.66609252415418,-20.32756668201462],[-69.66638761576809,-20.33202974976072],[-69.66644910971566,-20.3325399793573],[-69.666210947811,-20.333573612962]]]}},{"type":"Feature","properties":{"name":"SECTOR SANTA EMILIA SUR"},"geometry":{"type":"Polygon","coordinates":[[[-69.66118107182538,-20.33429759481959],[-69.66348516433516,-20.33394782587599],[-69.66621549984885,-20.33359820445165],[-69.66606596676093,-20.35038798661222],[-69.65905490081234,-20.3504625969256],[-69.65919753894121,-20.34096184263407],[-69.66257039996518,-20.34090379403521],[-69.66252975435401,-20.33785033963258],[-69.66101385394892,-20.3378250974943],[-69.66118107182538,-20.33429759481959]]]}},{"type":"Feature","properties":{"name":"APR"},"geometry":{"type":"Polygon","coordinates":[[[-69.6542206,-20.3590671],[-69.6541052,-20.3596329],[-69.6529009,-20.3593614],[-69.6530511,-20.3587956],[-69.6542206,-20.3590671]]]}},{"type":"Feature","properties":{"name":"Camping Bailes Religiosos"},"geometry":{"type":"Polygon","coordinates":[[[-69.6591915,-20.3377774],[-69.662555,-20.3378126],[-69.6627159,-20.3409664],[-69.6590842,-20.3410619],[-69.6590574,-20.3402068],[-69.6588321,-20.340066],[-69.6591915,-20.3377774]]]}},{"type":"Feature","properties":{"name":"SERVICIOS PÚBLICOS"},"geometry":{"type":"Polygon","coordinates":[[[-69.6617406,-20.3340502],[-69.6602171,-20.3343118],[-69.6593803,-20.3351166],[-69.6586078,-20.340549],[-69.6550673,-20.3406898],[-69.6530717,-20.3396436],[-69.6521061,-20.3379536],[-69.6519774,-20.3359818],[-69.6520847,-20.3353983],[-69.6533936,-20.3332655],[-69.6547884,-20.3311327],[-69.6577495,-20.3312333],[-69.6602386,-20.3311931],[-69.6602171,-20.3328631],[-69.6617406,-20.3340502]]]}}]};
  const sectorColors = {"SECTOR SANTA EMILIA NORTE":"#F5A800","SECTOR SANTA ISABEL":"#2a6fc4","SECTOR SANTA EMILIA SUR":"#27ae60","APR":"#e67e22","Camping Bailes Religiosos":"#9b59b6","SERVICIOS PÚBLICOS":"#c0392b","SERVICIOS PÚBLICOS":"#c0392b"};
  const sectoresLayer = L.geoJSON(sectoresData, {
    style: f => ({
      color: sectorColors[f.properties.name] || '#ffffff',
      weight: 2.5,
      opacity: 0.95,
      fillColor: sectorColors[f.properties.name] || '#ffffff',
      fillOpacity: 0.25
    }),
    onEachFeature: (f, layer) => {
      layer.bindPopup('<strong>' + f.properties.name + '</strong>');
      layer.on('mouseover', function() { this.setStyle({ fillOpacity: 0.45 }); });
      layer.on('mouseout',  function() { this.setStyle({ fillOpacity: 0.25 }); });
    }
  }).addTo(map);
  map.fitBounds(sectoresLayer.getBounds(), { padding: [30, 30] });
  // Círculos 100m radio en sectores con vim
  [
    [-20.33525070, -69.64725473], // Santa Isabel
    [-20.33160031, -69.66289985], // Santa Emilia Norte
    [-20.35921425, -69.65356945], // APR
  ].forEach(function(latlng) {
    L.circle(latlng, {
      radius: 100,
      color: '#e74c3c',
      weight: 2.5,
      dashArray: '8, 6',
      fillColor: '#e74c3c',
      fillOpacity: 0.12
    }).addTo(map);
  });
  // Clic en simbología → centrar mapa en polígono
  document.querySelectorAll('.legend-item[data-sector]').forEach(function(item) {
    item.addEventListener('click', function() {
      var name = this.dataset.sector;
      sectoresLayer.eachLayer(function(layer) {
        if (layer.feature.properties.name === name) {
          var bounds  = layer.getBounds();
          var mapEl   = map.getContainer();
          var mW = mapEl.offsetWidth, mH = mapEl.offsetHeight;
          var z  = map.getZoom();
          var ne = map.project(bounds.getNorthEast(), z);
          var sw = map.project(bounds.getSouthWest(), z);
          var bW = Math.abs(ne.x - sw.x), bH = Math.abs(ne.y - sw.y);
          var pad = 20;
          var padding;
          if (bW / bH > mW / mH) {
            // polygon wider than map → fill width: min horizontal pad, auto vertical
            var vPad = Math.max(pad, Math.round((mH - bH * (mW - 2*pad) / bW) / 2));
            padding = [pad, vPad];   // Leaflet: [x=horizontal, y=vertical]
          } else {
            // polygon taller than map → fill height: auto horizontal, min vertical pad
            var hPad = Math.max(pad, Math.round((mW - bW * (mH - 2*pad) / bH) / 2));
            padding = [hPad, pad];   // Leaflet: [x=horizontal, y=vertical]
          }
          map.fitBounds(bounds, { padding: padding });
        }
      });
    });
  });
  // Imágenes sobre polígonos – un solo marcador centrado por sector
  const camionSrc = document.querySelector('.dist-img').src;
  const vimSrc    = document.querySelector('.mejoras-img').src;
  const sz = 80;
  const gap = 6;

  function singleIcon(src) {
    return L.divIcon({
      html: '<div style="display:flex;align-items:center;justify-content:center;"><img src="' + src + '" style="width:' + sz + 'px;height:' + sz + 'px;object-fit:contain;filter:drop-shadow(0 3px 10px rgba(0,0,0,0.65));"></div>',
      iconSize: [sz, sz],
      iconAnchor: [sz / 2, sz / 2],
      className: 'map-sector-icon'
    });
  }

  function pairIcon(src1, src2) {
    const w = sz * 2 + gap;
    return L.divIcon({
      html: '<div style="display:flex;align-items:center;gap:' + gap + 'px;"><img src="' + src1 + '" style="width:' + sz + 'px;height:' + sz + 'px;object-fit:contain;filter:drop-shadow(0 3px 10px rgba(0,0,0,0.65));"><img src="' + src2 + '" style="width:' + sz + 'px;height:' + sz + 'px;object-fit:contain;filter:drop-shadow(0 3px 10px rgba(0,0,0,0.65));"></div>',
      iconSize: [w, sz],
      iconAnchor: [w / 2, sz / 2],
      className: 'map-sector-icon'
    });
  }

  [
    { lat: -20.33525070, lon: -69.64725473, icon: pairIcon(camionSrc, vimSrc) },   // Santa Isabel
    { lat: -20.33160031, lon: -69.66289985, icon: pairIcon(camionSrc, vimSrc) },   // Santa Emilia Norte
    { lat: -20.34600000, lon: -69.66236824, icon: singleIcon(camionSrc) },          // Santa Emilia Sur
    { lat: -20.35921425, lon: -69.65356945, icon: pairIcon(camionSrc, vimSrc) },   // APR
    { lat: -20.33964852, lon: -69.66023935, icon: singleIcon(camionSrc) },          // Camping Bailes
    { lat: -20.33591125, lon: -69.65685900, icon: singleIcon(camionSrc) },          // Servicios Públicos
  ].forEach(function(m) {
    L.marker([m.lat, m.lon], { icon: m.icon }).addTo(map);
  });


  function trimWhite(img) {
    if (img.dataset.trimmed) return;
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    try {
      const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
      const T = 235;
      // pixel is "empty" if transparent OR white/near-white
      const isEmpty = i => data[i+3] < 20 || (data[i] > T && data[i+1] > T && data[i+2] > T);
      const rowEmpty  = y => [...Array(width)].every((_,x)  => isEmpty((y*width+x)*4));
      const colEmpty  = x => [...Array(height)].every((_,y) => isEmpty((y*width+x)*4));
      let t = 0, b = height - 1, l = 0, r = width - 1;
      while (t < height && rowEmpty(t)) t++;
      while (b > t      && rowEmpty(b)) b--;
      while (l < width  && colEmpty(l)) l++;
      while (r > l      && colEmpty(r)) r--;
      const pad = 4;
      t = Math.max(0, t-pad); b = Math.min(height-1, b+pad);
      l = Math.max(0, l-pad); r = Math.min(width-1,  r+pad);
      const out = document.createElement('canvas');
      out.width = r-l+1; out.height = b-t+1;
      out.getContext('2d').drawImage(c, l, t, out.width, out.height, 0, 0, out.width, out.height);
      img.dataset.trimmed = '1';
      img.src = out.toDataURL('image/png');
    } catch(e) {}
  }

  document.querySelectorAll('.apoyo-logo').forEach(img => {
    img.complete ? trimWhite(img) : img.addEventListener('load', () => trimWhite(img), { once: true });
  });

  // Programacion de camiones
  (function(){
    var schedule = [
      { label:'L1 — Reparto', tipo:'reparto', days:[0,1,1,1,1,1,1,1,1,1,1,1,1] },
      { label:'L2 — Reparto', tipo:'reparto', days:[0,1,1,1,1,1,1,1,1,1,1,1,0] },
      { label:'L3 — Reparto', tipo:'reparto', days:[0,1,1,1,1,1,1,1,1,1,1,1,0] },
      { label:'L4 — Reparto', tipo:'reparto', days:[0,0,0,0,0,0,1,1,1,1,1,1,1] },
      { label:'L5 — Reparto', tipo:'reparto', days:[0,0,0,0,0,0,1,1,1,1,1,1,1] },
      { label:'L6 — Riego',   tipo:'riego',   days:[1,0,1,1,1,1,1,1,1,1,1,1,1] },
      { label:'L7 — Riego',   tipo:'riego',   days:[0,1,1,1,1,1,1,1,1,1,1,1,0] },
    ];
    var dates  = ['07','08','09','10','11','12','13','14','15','16','17','18','19'];
    var isPeak = [0,0,0,0,0,0,1,1,1,1,1,1,0];
    var counts = dates.map(function(_,i){ return schedule.reduce(function(s,l){ return s+l.days[i]; },0); });
    var maxC   = Math.max.apply(null, counts);

    function mk(cls,html){ var d=document.createElement('div'); d.className=cls; if(html!==undefined) d.innerHTML=html; return d; }

    var gantt = document.getElementById('prog-gantt');
    if(gantt){
      gantt.appendChild(mk('pg-cell pg-head pg-head-corner','LÍNEA / FECHA'));
      dates.forEach(function(d,i){
        var cls='pg-cell pg-head'+(isPeak[i]?' pg-head-peak':'')+(i===dates.length-1?' pg-head-last':'');
        gantt.appendChild(mk(cls,'<span class="pg-head-day">'+d+'</span><span class="pg-head-mes">jul</span>'));
      });
      schedule.forEach(function(line){
        gantt.appendChild(mk('pg-cell pg-label'+(line.tipo==='riego'?' pg-label-riego':''),line.label));
        line.days.forEach(function(active){
          var cls='pg-cell '+(active?(line.tipo==='reparto'?'pg-reparto':'pg-riego'):'pg-inactivo');
          gantt.appendChild(mk(cls,active?'&#10003;':''));
        });
      });
      gantt.appendChild(mk('pg-cell pg-count pg-count-label','TOTAL / DÍA'));
      counts.forEach(function(c,i){
        var peak=c===maxC;
        var cls='pg-cell pg-count'+(peak?' pg-count-peak':'')+(i===dates.length-1?' pg-count-last':'');
        gantt.appendChild(mk(cls,'<b>'+c+'</b><span class="pg-count-sub">cam.</span>'));
      });
    }

    var lineCanvas = document.getElementById('prog-line-chart');
    if(lineCanvas){
      var pointColors = counts.map(function(c){
        return c === maxC ? '#F5A800' : c === 1 ? '#2a6fc4' : '#1B4F8A';
      });
      new Chart(lineCanvas, {
        type: 'line',
        data: {
          labels: dates.map(function(d){ return d + ' Jul'; }),
          datasets: [{
            label: 'Camiones operativos',
            data: counts,
            borderColor: '#1B4F8A',
            backgroundColor: 'rgba(27,79,138,0.08)',
            borderWidth: 3,
            pointRadius: 7,
            pointHoverRadius: 9,
            pointBackgroundColor: pointColors,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            tension: 0,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(ctx){ return ' ' + ctx.parsed.y + ' camiones operativos'; }
              },
              backgroundColor: '#0d3060',
              titleColor: '#F5A800',
              bodyColor: '#fff',
              borderColor: '#F5A800',
              borderWidth: 1,
              padding: 10,
            }
          },
          scales: {
            y: {
              min: 0,
              max: 8,
              ticks: {
                stepSize: 1,
                color: '#6a8098',
                font: { family: 'Barlow Condensed', weight: '700', size: 13 },
                callback: function(v){ return v === 0 ? '' : v; }
              },
              grid: { color: 'rgba(200,214,232,0.4)' },
              border: { dash: [4,4] }
            },
            x: {
              ticks: {
                color: '#6a8098',
                font: { family: 'Barlow Condensed', weight: '700', size: 12 }
              },
              grid: { display: false }
            }
          }
        }
      });
    }
  })();


  // Hamburger: always on mobile, adaptive on desktop
  (function(){
    var nav       = document.querySelector('nav');
    var navLinks  = document.querySelector('.nav-links');
    var navLogos  = document.querySelector('.nav-logos');
    var navToggle = document.querySelector('.nav-toggle');
    if(!nav || !navLinks || !navLogos || !navToggle) return;
    var isMobile = /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
    function checkFit(){
      if(isMobile){ nav.classList.add('compact'); return; }
      nav.classList.remove('compact');
      navLinks.style.cssText = 'display:flex;position:static;flex-direction:row;visibility:hidden;';
      var navW=nav.clientWidth, logosW=navLogos.offsetWidth, linksW=navLinks.scrollWidth;
      var cs=getComputedStyle(nav), pad=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight);
      navLinks.style.cssText='';
      if(logosW+linksW+pad+16>navW){ nav.classList.add('compact'); }
      else { nav.classList.remove('compact'); navLinks.classList.remove('open'); navToggle.classList.remove('active'); document.body.style.overflow=''; }
    }
    if(!isMobile){ new ResizeObserver(checkFit).observe(nav); }
    checkFit();
    navToggle.addEventListener('click',function(){ this.classList.toggle('active'); navLinks.classList.toggle('open'); document.body.style.overflow=navLinks.classList.contains('open')?'hidden':''; });
    navLinks.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ navToggle.classList.remove('active'); navLinks.classList.remove('open'); document.body.style.overflow=''; }); });
  })();