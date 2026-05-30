const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Hamburger: always on mobile, adaptive on desktop
  (function(){
    var nav=document.querySelector('nav'),navLinks=document.querySelector('.nav-links'),navLogos=document.querySelector('.nav-logos'),navToggle=document.querySelector('.nav-toggle');
    if(!nav||!navLinks||!navLogos||!navToggle) return;
    var isMobile=/Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
    function checkFit(){
      if(isMobile){nav.classList.add('compact');return;}
      nav.classList.remove('compact');
      navLinks.style.cssText='display:flex;position:static;flex-direction:row;visibility:hidden;';
      var navW=nav.clientWidth,logosW=navLogos.offsetWidth,linksW=navLinks.scrollWidth;
      var cs=getComputedStyle(nav),pad=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight);
      navLinks.style.cssText='';
      if(logosW+linksW+pad+16>navW){nav.classList.add('compact');}
      else{nav.classList.remove('compact');navLinks.classList.remove('open');navToggle.classList.remove('active');document.body.style.overflow='';}
    }
    if(!isMobile){new ResizeObserver(checkFit).observe(nav);}
    checkFit();
    navToggle.addEventListener('click',function(){this.classList.toggle('active');navLinks.classList.toggle('open');document.body.style.overflow=navLinks.classList.contains('open')?'hidden':'';});
    navLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){navToggle.classList.remove('active');navLinks.classList.remove('open');document.body.style.overflow='';});});
  })();