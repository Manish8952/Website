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

// --- 3. ABOUT POP-UP ---
const aboutDialog = document.getElementById('about-dialog');
document.getElementById('about-link').addEventListener('click', (e) => {
    if (typeof aboutDialog.showModal !== 'function') return;  // old browser: fall back to normal link
    e.preventDefault();
    aboutDialog.showModal();
});
aboutDialog.querySelector('.about-close').addEventListener('click', () => aboutDialog.close());
aboutDialog.addEventListener('click', (e) => { if (e.target === aboutDialog) aboutDialog.close(); });  // click outside

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

// --- 5. LATEST PAGE (content comes from latest-data.js) ---
const latestDialog = document.getElementById('latest-dialog');
let latestRendered = false;

const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
};
const safeUrl = (u) => (/^(https?:\/\/|#|\/|latest\/|[\w-]+\.[\w]+$)/i.test(u || '') ? u : '#');
const niceDate = (d) => {
    const dt = new Date(d + 'T00:00:00');
    return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
const youtubeId = (v) => {
    const m = String(v || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/) || String(v || '').match(/^([\w-]{11})$/);
    return m ? m[1] : null;
};
const linkBtn = (l) => {
    const a = el('a', 'l-link', l.label || 'Open');
    a.href = safeUrl(l.url);
    if (/^https?:/i.test(a.href) && !a.href.startsWith(location.origin)) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
};

function renderLatest() {
    const d = window.LATEST || {};
    const $ = (id) => document.getElementById(id);

    $('latest-updated').textContent = d.lastUpdated ? 'Last updated ' + niceDate(d.lastUpdated) : '';

    if (d.announcement && d.announcement.text) {
        const box = el('div', 'l-announce');
        box.append(el('span', '', '📢 ' + d.announcement.text));
        if (d.announcement.link) box.append(linkBtn(d.announcement.link));
        $('latest-announce').replaceChildren(box);
    }

    const fill = (id, secId, items, build) => {
        $(secId).hidden = !(items && items.length);
        $(id).replaceChildren(...(items || []).map(build));
    };

    fill('latest-current', 'sec-current', d.current, (it) => {
        const c = el('div', 'l-card');
        c.append(el('h4', '', it.title), el('p', '', it.text));
        if (typeof it.progress === 'number') {
            const bar = el('div', 'l-bar'), fillBar = el('span');
            fillBar.style.width = Math.max(0, Math.min(100, it.progress)) + '%';
            bar.append(fillBar); c.append(bar);
        }
        return c;
    });

    fill('latest-upcoming', 'sec-upcoming', d.upcoming, (it) => {
        const li = el('li'), c = el('div', 'l-card');
        if (it.date) c.append(el('span', 'l-date', it.date));
        c.append(el('h4', '', it.title), el('p', '', it.text));
        li.append(c); return li;
    });

    const updates = (d.updates || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    fill('latest-feed', 'sec-feed', updates, (it) => {
        const c = el('article', 'l-card');
        c.append(el('span', 'l-date', niceDate(it.date)), el('h4', '', it.title));
        if (it.text) c.append(el('p', '', it.text));
        if (it.image) { const im = el('img', 'l-img'); im.src = safeUrl(it.image); im.alt = it.title || ''; im.loading = 'lazy'; c.append(im); }
        const yt = youtubeId(it.youtube);
        if (yt) {
            const w = el('div', 'l-video'), f = document.createElement('iframe');
            f.src = 'https://www.youtube-nocookie.com/embed/' + yt; f.title = it.title || 'YouTube video';
            f.loading = 'lazy'; f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
            f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            w.append(f); c.append(w);
        }
        if (it.link) c.append(linkBtn(it.link));
        return c;
    });
}

document.getElementById('latest-link').addEventListener('click', (e) => {
    if (typeof latestDialog.showModal !== 'function') return;
    e.preventDefault();
    if (!latestRendered) { renderLatest(); latestRendered = true; }
    latestDialog.showModal();
    latestDialog.scrollTop = 0;
});
latestDialog.querySelector('.latest-close').addEventListener('click', () => latestDialog.close());
// Links like "#contact" inside the Latest page: close it, then scroll to that part of the site
latestDialog.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    latestDialog.close();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
});

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