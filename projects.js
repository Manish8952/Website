// Projects slider: builds the slides from projects-data.js (window.PROJECTS)
(function () {
    var list = (window.PROJECTS || []).filter(function (p) { return p && p.title; });
    var section = document.getElementById('projects');
    var track = document.getElementById('pj-track');
    if (!section || !track || !list.length) return;      // no projects: section stays hidden

    var dotsBox = document.getElementById('pj-dots');
    var controls = document.getElementById('pj-controls');
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    var safeUrl = function (u) { u = String(u || '').trim(); return /^(javascript|data|vbscript):/i.test(u) ? '#' : u; };

    var current = 0, timer = null, dots = [];
    var DELAY = 6000;                                    // milliseconds each project stays (6 seconds)
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----- build the slides -----
    list.forEach(function (p, i) {
        var slide = el('article', 'pj-slide');
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', (i + 1) + ' of ' + list.length);

        var card = el('div', 'glass pj-card');
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        var hasPct = typeof p.progress === 'number';
        var pct = hasPct ? Math.max(0, Math.min(100, p.progress)) : 0;

        var info = el('div', 'pj-info');
        if (p.status) info.append(el('span', 'pj-status', p.status));
        info.append(el('h3', 'pj-title', p.title));
        if (p.text) info.append(el('p', 'pj-text', p.text));

        // progress bar only when there is a photo (otherwise the ring on the right shows it)
        if (hasPct && p.image) {
            var wrap = el('div', 'pj-progress');
            var bar = el('div', 'pj-bar'), fill = el('span');
            fill.style.width = pct + '%'; bar.append(fill);
            wrap.append(bar, el('small', '', pct + '% complete'));
            info.append(wrap);
        }

        if (p.tags && p.tags.length) {
            var tags = el('div', 'pj-tags');
            p.tags.forEach(function (t) { tags.append(el('span', '', t)); });
            info.append(tags);
        }

        if (p.link && p.link.url) {
            var a = el('a', 'btn btn-primary pj-link', p.link.label || 'Learn more');
            a.href = safeUrl(p.link.url);
            if (/^https?:/i.test(a.href) && a.hostname !== location.hostname) { a.target = '_blank'; a.rel = 'noopener'; }
            info.append(a);
        }
        card.append(info);

        // right-hand visual: the photo, or a gradient panel with a progress ring
        var visual;
        if (p.image) {
            visual = el('div', 'pj-visual has-img');
            var im = el('img', 'pj-img'); im.src = safeUrl(p.image); im.alt = p.title; im.loading = 'lazy';
            visual.append(im);
        } else {
            visual = el('div', 'pj-visual');
            if (hasPct) {
                var ring = el('div', 'pj-ring');
                ring.style.setProperty('--p', pct);
                ring.append(el('strong', '', pct + '%'), el('small', '', 'complete'));
                visual.append(ring);
            } else {
                visual.append(el('i', 'fa-solid fa-rocket pj-rocket'));
            }
        }
        visual.append(el('span', 'pj-num', pad(i + 1) + ' / ' + pad(list.length)));
        card.append(visual);

        slide.append(card); track.append(slide);

        var d = el('button', 'pj-dot'); d.type = 'button';
        d.setAttribute('aria-label', 'Show project ' + (i + 1) + ': ' + p.title);
        d.addEventListener('click', function () { go(i); restart(); });
        dots.push(d); dotsBox.append(d);
    });

    // ----- moving between slides -----
    function mark(i) {
        current = i;
        dots.forEach(function (d, n) { d.classList.toggle('active', n === i); d.setAttribute('aria-current', n === i ? 'true' : 'false'); });
    }
    function go(i) {
        i = (i + list.length) % list.length;
        mark(i);
        track.scrollTo({ left: i * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
    }
    function restart() {
        clearInterval(timer);
        if (reduced || list.length < 2) return;
        timer = setInterval(function () { go(current + 1); }, DELAY);
    }

    // follows manual swiping / scrolling
    var scrollWait = null;
    track.addEventListener('scroll', function () {
        clearTimeout(scrollWait);
        scrollWait = setTimeout(function () {
            var i = Math.round(track.scrollLeft / (track.clientWidth || 1));
            if (i !== current && i >= 0 && i < list.length) mark(i);
        }, 80);
    });
    window.addEventListener('resize', function () { track.scrollTo({ left: current * track.clientWidth, behavior: 'auto' }); });

    // one project: no arrows or dots
    if (list.length < 2) controls.hidden = true;
    else {
        document.getElementById('pj-prev').addEventListener('click', function () { go(current - 1); restart(); });
        document.getElementById('pj-next').addEventListener('click', function () { go(current + 1); restart(); });
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); restart(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); restart(); }
        });
        // pause while the visitor is pointing at or focused on the slider
        ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { section.addEventListener(ev, function () { clearInterval(timer); }, { passive: true }); });
        ['mouseleave', 'focusout', 'touchend'].forEach(function (ev) { section.addEventListener(ev, restart, { passive: true }); });
    }

    mark(0);
    restart();
    section.hidden = false;
})();