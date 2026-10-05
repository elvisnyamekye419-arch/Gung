// Header: shrink after scrolling, show back-to-top button
const header = document.getElementById('nav');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  toTop.classList.toggle('show', window.scrollY > 500);
};
window.addEventListener('scroll', onScroll); onScroll();

// Close mobile menu after choosing a link
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => {
  const m = document.getElementById('menu');
  if (m.classList.contains('show')) bootstrap.Collapse.getInstance(m)?.hide();
}));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Quote page only
const form = document.getElementById('contactForm');
if (form) {
  // Pre-select the service when arriving from a "Request this service" link
  const wanted = new URLSearchParams(location.search).get('service');
  const select = document.getElementById('service');
  if (wanted) [...select.options].forEach(o => { if (o.text === wanted) select.value = o.value || o.text; });

  // Numbers in international format, no + or spaces (Ghana 0243503620 -> 233243503620)
  const WHATSAPP = {
    ceo: '233243503620',     // Adam Issah, CEO
    deputy: '233531440799'   // Adam Mariam Timtooni, Deputy CEO
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const note = document.getElementById('formNote');
    if (!v('name') || !v('phone') || !v('message')) {
      note.textContent = 'Please fill in your name, phone number and project details.';
      return;
    }
    const text = `Hello Gung Construction, I would like to make an enquiry.\n\n*Name:* ${v('name')}\n*Phone:* ${v('phone')}\n*Service:* ${v('service')}\n*Project details:* ${v('message')}`;
    const number = WHATSAPP[v('sendto')] || WHATSAPP.ceo;
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    note.textContent = 'Opening WhatsApp. Tap send to deliver your message.';
    e.target.reset();
  });
}

// Respect visitors who prefer reduced motion: pause the hero video
const heroVideo = document.querySelector('.hero video');
if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) heroVideo.pause();

// Projects page: open a photo larger in a lightbox
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const modal = new bootstrap.Modal(lightbox);
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  document.querySelectorAll('.gal-item').forEach(b => b.addEventListener('click', () => {
    img.src = b.dataset.full;
    img.alt = b.dataset.caption;
    cap.textContent = b.dataset.caption;
    modal.show();
  }));
}

// Leadership photos: if a photo file is missing, show a neutral person icon instead of a broken image
document.querySelectorAll('.leader img').forEach(img => {
  const fallback = () => {
    const box = document.createElement('div');
    box.className = 'leader-avatar';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.alt);
    box.innerHTML = '<i class="bi bi-person-fill"></i>';
    img.replaceWith(box);
  };
  if (img.complete && img.naturalWidth === 0) fallback();
  else img.addEventListener('error', fallback, { once: true });
});