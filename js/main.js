/* ─── PARTICLE CANVAS ─── */
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
let pts = [];

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.init(); }
    init() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.r  = Math.random() * 1.8 + .4;
        this.vx = (Math.random() - .5) * .35;
        this.vy = (Math.random() - .5) * .35;
        this.a  = Math.random() * .45 + .08;
        this.c  = Math.random() > .5 ? '#22d3ee' : '#a855f7';
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.init();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.a;
        ctx.fillStyle   = this.c;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function buildParticles() {
    pts = [];
    const n = Math.min(Math.floor(canvas.width * canvas.height / 11000), 120);
    for (let i = 0; i < n; i++) pts.push(new Particle());
}

function drawLines() {
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 130) {
                ctx.save();
                ctx.globalAlpha = (1 - d / 130) * .12;
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth   = .6;
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    pts.forEach(p => { p.move(); p.draw(); });
    requestAnimationFrame(animateCanvas);
}

resize();
buildParticles();
animateCanvas();
window.addEventListener('resize', () => { resize(); buildParticles(); });

/* ─── TYPEWRITER ─── */
const phrases = [
    'scalable Angular frontends.',
    'robust Node.js backends.',
    'distributed NestJS services.',
    'high-concurrency systems.',
    'healthcare enterprise apps.',
    'production-grade AWS solutions.',
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typewriter() {
    const current = phrases[phraseIndex];
    const el      = document.getElementById('tw');
    if (deleting) {
        el.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
            deleting     = false;
            phraseIndex  = (phraseIndex + 1) % phrases.length;
            return setTimeout(typewriter, 480);
        }
        return setTimeout(typewriter, 46);
    }
    el.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
        deleting = true;
        return setTimeout(typewriter, 2200);
    }
    setTimeout(typewriter, 95);
}
setTimeout(typewriter, 1400);

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));

/* ─── HAMBURGER ─── */
const ham     = document.getElementById('ham');
const mobMenu = document.getElementById('mobMenu');

ham.addEventListener('click', () => {
    const isOpen = ham.classList.toggle('open');
    mobMenu.classList.toggle('open');
    ham.setAttribute('aria-expanded', isOpen);
    ham.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    mobMenu.setAttribute('aria-hidden', !isOpen);
});

function closeMob() {
    ham.classList.remove('open');
    mobMenu.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    ham.setAttribute('aria-label', 'Open navigation menu');
    mobMenu.setAttribute('aria-hidden', 'true');
}

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const delay = +e.target.dataset.d || 0;
        setTimeout(() => e.target.classList.add('in'), delay);
        revealObs.unobserve(e.target);
    });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr,.sr-l,.sr-r').forEach(el => {
    const siblings = Array.from(el.parentElement.children).filter(c =>
        c.classList.contains('sr') || c.classList.contains('sr-l') || c.classList.contains('sr-r')
    );
    el.dataset.d = siblings.indexOf(el) * 90;
    revealObs.observe(el);
});

/* ─── COUNTERS ─── */
function animateCounter(el, target) {
    let current = 0;
    const step  = target / 38;
    (function run() {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (current >= target ? '+' : '');
        if (current < target) requestAnimationFrame(run);
    })();
}

const statsObs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('[data-t]').forEach(el => animateCounter(el, +el.dataset.t));
    statsObs.disconnect();
}, { threshold: .6 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

/* ─── ACTIVE NAV HIGHLIGHT ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => a.style.color = '');
            const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
            if (active) active.style.color = 'var(--cyan)';
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObs.observe(s));

/* ─── THEME TOGGLE ─── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('i');

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', isLight ? 'Toggle dark mode' : 'Toggle light mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

/* ─── COPY TO CLIPBOARD ─── */
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
        });
    });
});

/* ─── CONTACT FORM ─── */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.form-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>Sending…';
        try {
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(contactForm)).toString()
            });
            contactForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle" aria-hidden="true"></i>
                    <p>Message sent! I'll get back to you within 24 hours.</p>
                </div>`;
        } catch {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i>Send Message';
        }
    });
}
