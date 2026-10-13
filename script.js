// --- 1. THEME TOGGLE (saved choice is applied early in <head>) ---
const root = document.documentElement;
document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// --- 2. CONTACT FORM (messages arrive in your email via Web3Forms) ---
// 1) Go to https://web3forms.com, enter your email, and they email you an "Access Key".
// 2) Paste that key between the quotes below. Done: every message goes to your inbox.
const WEB3FORMS_KEY = "a3d1ae7a-1abf-4298-8484-26800c336b27";

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const sendBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const setStatus = (msg, cls) => { status.textContent = msg; status.className = 'form-status ' + (cls || ''); };

    if (WEB3FORMS_KEY.startsWith('PASTE_')) {
        setStatus('The contact form is not connected yet. Please email me directly instead.', 'error');
        return;
    }

    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_KEY);
    data.append('subject', 'New message from your website');
    data.append('from_name', 'MKM website');

    sendBtn.disabled = true;
    setStatus('Sending message...');
    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: data
        });
        const json = await res.json();
        if (res.ok && json.success) {
            setStatus(`Thank you, ${form.elements.name.value.trim()}! Your message has been sent.`, 'success');
            form.reset();
        } else {
            setStatus(json.message || 'Sorry, something went wrong. Please try again.', 'error');
        }
    } catch (err) {
        setStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
        sendBtn.disabled = false;
    }
});

// --- 4. CONTACT FULL-PAGE VIEW ---
const contactDialog = document.getElementById('contact-dialog');
const contactMap = document.getElementById('contact-map');
const mapQuery = encodeURIComponent(contactDialog.dataset.mapQuery);

document.getElementById('contact-link').addEventListener('click', (e) => {
    if (typeof contactDialog.showModal !== 'function') return;  // old browser: normal link to the form
    e.preventDefault();
    if (!contactMap.src) {  // load the map only the first time it is opened
        contactMap.src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
        document.getElementById('contact-maps-link').href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
    }
    contactDialog.showModal();
});
contactDialog.querySelector('.contact-close').addEventListener('click', () => contactDialog.close());
document.getElementById('contact-form-link').addEventListener('click', (e) => {
    e.preventDefault();
    contactDialog.close();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

// --- 5. HELPERS (used by the videos section) ---
const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
};
const youtubeId = (v) => {
    const m = String(v || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/) || String(v || '').match(/^([\w-]{11})$/);
    return m ? m[1] : null;
};
// --- 6. YOUTUBE VIDEOS above "Let's Connect" (list comes from latest-data.js) ---
(function () {
    const vids = ((window.LATEST && window.LATEST.videos) || [])
        .map((v) => ({ id: youtubeId(v.youtube), title: v.title || '' }))
        .filter((v) => v.id);
    if (!vids.length) return;                       // no videos yet: section stays hidden

    const section = document.getElementById('videos');
    const player = document.getElementById('video-player');
    const title = document.getElementById('video-title');
    const list = document.getElementById('video-list');

    const show = (i, autoplay) => {
        player.src = 'https://www.youtube-nocookie.com/embed/' + vids[i].id + '?rel=0' + (autoplay ? '&autoplay=1' : '');
        title.textContent = vids[i].title;
        document.getElementById('video-yt').href = 'https://www.youtube.com/watch?v=' + vids[i].id;
        [...list.children].forEach((b, n) => b.classList.toggle('active', n === i));
    };

    if (vids.length > 1) {
        vids.forEach((v, i) => {
            const b = el('button', 'video-thumb'), im = document.createElement('img');
            b.type = 'button'; b.title = v.title || 'Play video'; b.setAttribute('aria-label', v.title || 'Play video ' + (i + 1));
            im.src = 'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg'; im.alt = ''; im.loading = 'lazy';
            b.append(im); b.addEventListener('click', () => show(i, true));
            list.append(b);
        });
    }
    show(0, false);
    section.hidden = false;
})();
// --- 7. HERO SLIDER: previous / next buttons, auto-play, and captions ---
(function () {
    const hero = document.querySelector('.hero');
    const box = document.getElementById('hero-caption');
    if (!hero || !box) return;
    const slides = [...hero.querySelectorAll('.slide')];
    if (!slides.length) return;
    const tEl = document.getElementById('hero-caption-title');
    const pEl = document.getElementById('hero-caption-text');
    const DELAY = 5000;                      // milliseconds each image stays (5 seconds)
    let current = 0, timer = null;

    const show = (i) => {
        current = (i + slides.length) % slides.length;
        slides.forEach((s, n) => s.classList.toggle('active', n === current));

        const s = slides[current];
        const title = (s.dataset.title || '').trim();
        const text = (s.dataset.text || '').trim();
        box.classList.remove('pop');
        if (!title && !text) { box.hidden = true; return; }   // no text: hide the box
        tEl.textContent = title; tEl.hidden = !title;
        pEl.textContent = text;  pEl.hidden = !text;
        box.hidden = false;
        void box.offsetWidth;                                   // restart the pop-up animation
        box.classList.add('pop');
    };

    const start = () => {
        clearInterval(timer);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        timer = setInterval(() => show(current + 1), DELAY);
    };

    document.getElementById('hero-prev').addEventListener('click', () => { show(current - 1); start(); });
    document.getElementById('hero-next').addEventListener('click', () => { show(current + 1); start(); });

    show(0);
    start();
})();
// --- 8. OPEN THE CONTACT POP-UP when arriving from another page (index.html?open=contact) ---
if (new URLSearchParams(location.search).get('open') === 'contact') {
    document.getElementById('contact-link').click();   // same as clicking Contact in the navbar
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore on file:// */ }
}