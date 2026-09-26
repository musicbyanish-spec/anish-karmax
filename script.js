const intro = document.getElementById('intro');
const enter = document.getElementById('enterSite');
const cursor = document.getElementById('cursor');
const wipe = document.getElementById('transitionWipe');
const wipeLabel = document.getElementById('wipeLabel');

let mouseX = innerWidth / 2, mouseY = innerHeight / 2, cx = mouseX, cy = mouseY;

document.body.style.overflow = 'hidden';
setTimeout(() => enter.focus(), 250);

enter.addEventListener('click', () => {
  intro.classList.add('hide');
  document.body.style.overflow = '';
});

function animateCursor(){
  cx += (mouseX - cx) * .18;
  cy += (mouseY - cy) * .18;
  cursor.style.left = `${cx}px`;
  cursor.style.top = `${cy}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

document.querySelectorAll('button,a,.end-half,.visual,.showreel').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

function travelTo(id,label){
  wipeLabel.textContent = label || id.toUpperCase();
  wipe.classList.remove('run');
  void wipe.offsetWidth;
  wipe.classList.add('run');
  setTimeout(() => document.getElementById(id).scrollIntoView({behavior:'auto'}), 500);
}

document.querySelectorAll('[data-go]').forEach(el => {
  el.addEventListener('click', () => travelTo(el.dataset.go, el.dataset.label));
});

document.querySelectorAll('.press-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.press-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.press-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).classList.add('active');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in'); });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const cards = [...document.querySelectorAll('.parallax-card')];
const ambients = [...document.querySelectorAll('.ambient-word')];
let ticking = false;
function motionPass(){
  const h = innerHeight;
  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    if(r.bottom > 0 && r.top < h){
      const speed = Number(card.dataset.speed || .04);
      const offset = (r.top - h/2) * speed;
      card.style.transform = `translate3d(0,${offset}px,0)`;
    }
  });
  ambients.forEach(word => {
    const r = word.parentElement.getBoundingClientRect();
    word.style.transform = `translate3d(${r.top * -.018}px,0,0)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => { if(!ticking){requestAnimationFrame(motionPass);ticking=true;} }, {passive:true});
motionPass();
