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
    el.dataset.d = siblings.indexOf(el) * 80;
    revealObs.observe(el);
});

/* ─── ACTIVE NAV HIGHLIGHT ─── */
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => a.style.color = '');
            const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
            if (active) active.style.color = 'var(--accent)';
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

/* ─── THEME TOGGLE — dark by default, light opt-in ─── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('i');

/* The dark class is set pre-paint by an inline script in <head>. Sync the icon/label to it. */
const startsDark = document.documentElement.classList.contains('dark');
themeIcon.className = startsDark ? 'fas fa-sun' : 'fas fa-moon';
themeToggle.setAttribute('aria-label', startsDark ? 'Toggle light mode' : 'Toggle dark mode');

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', isDark ? 'Toggle light mode' : 'Toggle dark mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
