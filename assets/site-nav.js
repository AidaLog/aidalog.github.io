// Small site nav helper: toggle mobile menu and smooth page fade on navigation
document.addEventListener('DOMContentLoaded', function(){
  // mobile toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){ links.classList.toggle('show'); toggle.setAttribute('aria-expanded', links.classList.contains('show')) });
  }

  // fade transition for internal links
  var internal = Array.from(document.querySelectorAll('a[href]'))
    .filter(a=>a.getAttribute('href').indexOf('#')!==0 && new URL(a.href, location.href).origin===location.origin);
  internal.forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      // allow same-page anchors
      if(href.indexOf('#')===0) return;
      e.preventDefault();
      document.documentElement.classList.add('fade-out');
      setTimeout(function(){ location.href = href; }, 180);
    });
  });
});
