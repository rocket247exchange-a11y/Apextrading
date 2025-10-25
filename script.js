/* script.js */

(function(){

  // DOM
  const carousel = document.querySelector('[data-track]');
  const tiles = Array.from(document.querySelectorAll('[data-tile]'));
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');
  const indicatorsWrap = document.querySelector('[data-indicators]');

  // state
  let current = 0;
  let autoplay = true;
  let autoplaySpeed = 4000;
  let autoplayTimer = null;

  // setup indicators
  tiles.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'indicator';
    btn.setAttribute('data-index', i);
    if (i === 0) btn.classList.add('active');
    indicatorsWrap.appendChild(btn);
  });

  const indicators = Array.from(indicatorsWrap.querySelectorAll('.indicator'));

  function updateIndicators(idx){
    indicators.forEach((b) => b.classList.remove('active'));
    const active = indicators[idx];
    if(active) active.classList.add('active');
  }

  function goTo(index){
    current = Math.max(0, Math.min(tiles.length - 1, index));
    const tile = tiles[current];
    const offset = tile.offsetLeft;
    carousel.style.transform = `translateX(-${offset}px)`;
    updateIndicators(current);
  }

  function prev(){
    goTo(current - 1);
  }

  function next(){
    goTo(current + 1);
  }

  function restartAutoplay(){
    if(!autoplay) return;
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(()=> {
      next();
    }, autoplaySpeed);
  }

  // events
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  indicators.forEach((b) => {
    b.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      goTo(idx);
      restartAutoplay();
    });
  });

  // drag to slide support
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
  });

  carousel.addEventListener('mouseup', (e) => {
    isDown = false;
  });

  carousel.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.2;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // touch support
  carousel.addEventListener('touchstart', (e)=> {
    isDown=true;
    startX = (e.touches && e.touches[0]) ? e.touches[0].clientX : 0;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('touchmove',(e)=> {
    if(!isDown) return;
    const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : 0;
    const walk = (x - startX) * 1.2;
    carousel.scrollLeft = scrollLeft - walk;
  });

  carousel.addEventListener('touchend',(e)=> {

    isDown=false;

    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;

    const diff = endX - startX;

    if(diff > 40) prev();

    else if(diff < -40) next();

    restartAutoplay();

  });

  // init
  goTo(0);
  restartAutoplay();

})();
