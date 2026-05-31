const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

(function(){
  var nav=document.querySelector('nav'),navLinks=document.querySelector('.nav-links'),navToggle=document.querySelector('.nav-toggle');
  if(!nav||!navLinks||!navToggle) return;
  navToggle.addEventListener('click',function(){
    this.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow=navLinks.classList.contains('open')?'hidden':'';
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow='';
    });
  });
})();
