(function(){
  var top=document.getElementById('top'),bg=document.getElementById('burger');
  function zamknij(){top.classList.remove('open');bg.setAttribute('aria-expanded','false');bg.setAttribute('aria-label','Otwórz menu')}
  bg.addEventListener('click',function(){var o=top.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
  document.querySelectorAll('.menu a').forEach(function(a){a.addEventListener('click',zamknij)});
  var tk=false;function sc(){if(tk)return;tk=true;requestAnimationFrame(function(){top.classList.toggle('sc',window.pageYOffset>30);tk=false})}
  addEventListener('scroll',sc,{passive:true});sc();

  var links=[].slice.call(document.querySelectorAll('.menu a[href^="#"]:not(.mk)'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    ['start','kategorie','wanny','premium','bieznie','dostawa','firma','kontakt'].forEach(function(id){var t=document.getElementById(id);if(t)io.observe(t)});
    var mob=document.getElementById('mob');
    if(mob)new IntersectionObserver(function(es){mob.classList.toggle('widac',!es[0].isIntersecting&&es[0].boundingClientRect.top<0)},{threshold:0}).observe(document.querySelector('.hero .btn'));
  }

  /* przeciaganie mysza: pasy kart i galerie w kartach */
  function przeciagaj(el,krok){
    var down=false,sx=0,sl=0,moved=false;
    el.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0||el.scrollWidth<=el.clientWidth+2)return;e.stopPropagation();down=true;moved=false;sx=e.clientX;sl=el.scrollLeft});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){moved=true;el.classList.add('drag');el.style.scrollSnapType='none'}el.scrollLeft=sl-dx});
    addEventListener('pointerup',function(){if(!down)return;down=false;el.classList.remove('drag');if(moved){var w=krok();var cel=Math.round(el.scrollLeft/w)*w;el.style.scrollSnapType='';el.scrollTo({left:cel,behavior:'smooth'})}else el.style.scrollSnapType='';setTimeout(function(){moved=false},0)});
    el.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    el.addEventListener('dragstart',function(e){e.preventDefault()});
  }
  document.querySelectorAll('[data-tor]').forEach(function(tor){
    function step(){var k=tor.children[0];return k?k.getBoundingClientRect().width+parseFloat(getComputedStyle(tor).columnGap||0):300}
    przeciagaj(tor,step);
    var nav=document.querySelector('[data-nav="'+tor.id+'"]');
    if(nav){var bs=nav.querySelectorAll('button');
      bs.forEach(function(b){b.addEventListener('click',function(){tor.scrollBy({left:step()*(+b.dataset.k),behavior:'smooth'})})});
      function upd(){bs[0].disabled=tor.scrollLeft<4;bs[1].disabled=tor.scrollLeft+tor.clientWidth>=tor.scrollWidth-4;nav.style.visibility=tor.scrollWidth<=tor.clientWidth+2?'hidden':''}
      tor.addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
    }
  });
  document.querySelectorAll('.gal').forEach(function(g){
    var gt=g.querySelector('.gt'),kr=g.querySelectorAll('.kr i'),p=g.querySelector('.gp'),n=g.querySelector('.gn');
    function w(){return gt.clientWidth||1}
    var zal=false;function wczytaj(){if(zal)return;zal=true;gt.querySelectorAll('img[data-src]').forEach(function(i){i.src=i.dataset.src;i.removeAttribute('data-src')})}
    ['pointerenter','touchstart','focusin','scroll'].forEach(function(ev){gt.addEventListener(ev,wczytaj,{passive:true,once:true})});
    if(p){p.addEventListener('pointerenter',wczytaj,{once:true});n.addEventListener('pointerenter',wczytaj,{once:true})}
    przeciagaj(gt,w);
    function upd(){var i=Math.round(gt.scrollLeft/w());kr.forEach(function(k,j){k.classList.toggle('on',j===i)});if(p){p.disabled=i<=0;n.disabled=i>=gt.children.length-1}}
    gt.addEventListener('scroll',upd,{passive:true});upd();
    if(p){p.addEventListener('click',function(){gt.scrollBy({left:-w(),behavior:'smooth'})});n.addEventListener('click',function(){gt.scrollBy({left:w(),behavior:'smooth'})})}
  });

  /* koszyk - tylko element wygladu podgladu */
  var ile=0,kosz=document.getElementById('kosz'),lk=document.getElementById('ile');
  document.querySelectorAll('[data-kosz]').forEach(function(b){b.addEventListener('click',function(){
    if(b.classList.contains('ok'))return;ile++;lk.textContent=ile;kosz.setAttribute('aria-label','Koszyk, produktów: '+ile);
    b.classList.add('ok');b.textContent='W koszyku';kosz.classList.add('pop');setTimeout(function(){kosz.classList.remove('pop')},250)})});

  /* lightbox */
  var lb=document.getElementById('lb'),li=lb.querySelector('img'),lp=lb.querySelector('p'),cur=0,last=null,grp=[];
  function opis(b){var im=b.querySelector('img');var a=b.closest('.prod');var h=a&&a.querySelector('h3');return h?h.textContent:(im?im.alt:'')}
  function pokaz(i){cur=(i+grp.length)%grp.length;var b=grp[cur];li.src=b.dataset.lb;var im=b.querySelector('img');li.alt=im?im.alt:'';lp.textContent=opis(b)+(grp.length>1?'  ('+(cur+1)+'/'+grp.length+')':'')}
  document.querySelectorAll('[data-lb]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();last=b;var g=b.closest('[data-grupa]');grp=g?[].slice.call(g.querySelectorAll('[data-lb]')):[b];pokaz(grp.indexOf(b));lb.classList.add('otw');document.body.style.overflow='hidden';lb.querySelector('.x').focus()})});
  function zam(){lb.classList.remove('otw');document.body.style.overflow='';li.removeAttribute('src');if(last)last.focus()}
  lb.querySelector('.x').addEventListener('click',zam);
  lb.querySelector('.p').addEventListener('click',function(){pokaz(cur-1)});
  lb.querySelector('.n').addEventListener('click',function(){pokaz(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)zam()});
  var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)pokaz(cur+(d<0?1:-1))});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(lb.classList.contains('otw'))zam();else zamknij()}
    if(!lb.classList.contains('otw'))return;
    if(e.key==='ArrowRight')pokaz(cur+1);if(e.key==='ArrowLeft')pokaz(cur-1);
  });

  var f=document.getElementById('form'),msg=document.getElementById('msg');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var ok=true;[].forEach.call(f.querySelectorAll('[required]'),function(i){var v=i.type==='checkbox'?(i.checked?'1':''):i.value.trim();var bad=!v;i.setAttribute('aria-invalid',bad);if(bad&&ok){ok=false;i.focus()}});if(!ok)return;msg.hidden=false;f.reset()});
  var r=document.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
