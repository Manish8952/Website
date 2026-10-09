// Article page: builds the page from articles-data.js using  article.html?id=physics
(function () {
    // theme toggle (the saved choice is applied in <head>)
    var root = document.documentElement;
    document.getElementById('theme-toggle').addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    var box = document.getElementById('article');
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
    var safeUrl = function (u) { u = String(u || '').trim(); return /^(javascript|data|vbscript):/i.test(u) ? '#' : u; };
    var youtubeId = function (v) {
        var m = String(v || '').match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/) || String(v || '').match(/^([\w-]{11})$/);
        return m ? m[1] : null;
    };
    var driveId = function (u) { var m = String(u || '').match(/\/d\/([\w-]+)/) || String(u || '').match(/[?&]id=([\w-]+)/); return m ? m[1] : null; };
    var external = function (a) { if (/^https?:/i.test(a.href) && a.hostname !== location.hostname) { a.target = '_blank'; a.rel = 'noopener'; } };
    var niceDate = function (d) {
        var dt = new Date(d + 'T00:00:00');
        return isNaN(dt) ? d : dt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    var data = (window.ARTICLES || {})[id];

    if (!data) {
        document.title = 'Article not found | Manish Majhi';
        box.append(el('h1', 'article-title', 'Article not found'), el('p', '', 'Sorry, this article does not exist yet. Please go back and choose another one.'));
        return;
    }

    // Turns a list of blocks into a <div class="article-body">
    function renderBlocks(blocks) {
        var body = el('div', 'article-body');
        (blocks || []).forEach(function (b) {
            var n;
            switch (b.type) {
                case 'heading': n = el('h2', '', b.text); break;
                case 'text':
                    n = el('div'); String(b.text || '').split(/\n\s*\n/).forEach(function (p) { if (p.trim()) n.append(el('p', '', p.trim())); }); break;
                case 'list':
                    n = el('ul'); (b.items || []).forEach(function (t) { n.append(el('li', '', t)); }); break;
                case 'image':
                    n = el('figure'); var im = el('img'); im.src = safeUrl(b.src); im.alt = b.caption || data.title; im.loading = 'lazy'; n.append(im);
                    if (b.caption) n.append(el('figcaption', '', b.caption)); break;
                case 'youtube':
                    var yt = youtubeId(b.url); if (!yt) return;
                    n = el('div', 'video-frame'); var f = document.createElement('iframe');
                    f.src = 'https://www.youtube-nocookie.com/embed/' + yt + '?rel=0'; f.title = b.title || 'YouTube video'; f.loading = 'lazy'; f.allowFullscreen = true;
                    f.referrerPolicy = 'strict-origin-when-cross-origin';
                    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    n.append(f); break;
                case 'link':
                    n = el('div', 'a-link'); var a = el('a', 'btn btn-primary', b.label || 'Open link'); a.href = safeUrl(b.url); external(a); n.append(a);
                    if (b.note) n.append(el('span', '', b.note)); break;
                case 'drive':
                    n = el('div', 'a-drive'); var did = driveId(b.url);
                    if (b.embed && did) {
                        var fr = document.createElement('iframe'); fr.src = 'https://drive.google.com/file/d/' + did + '/preview'; fr.title = b.label || 'Google Drive file'; fr.loading = 'lazy'; fr.allowFullscreen = true;
                        var w = el('div', 'drive-embed'); w.append(fr); n.append(w);
                    }
                    var d = el('a', 'drive-card'); d.href = safeUrl(b.url); external(d);
                    var ic = el('i', 'fab fa-google-drive'); d.append(ic, el('span', '', b.label || 'Open in Google Drive'), el('em', '', 'Open ↗'));
                    n.append(d); break;
                default: return;
            }
            body.append(n);
        });
        return body;
    }

    document.title = data.title + ' | Manish Majhi';
    if (data.tag) box.append(el('span', 'tag', data.tag));
    box.append(el('h1', 'article-title', data.title));
    if (data.date) box.append(el('p', 'article-date', niceDate(data.date)));

    // Optional intro blocks shown above the list (or the only content if there are no parts)
    if (data.blocks && data.blocks.length) box.append(renderBlocks(data.blocks));

    // ----- Several articles inside one page -----
    var parts = data.parts || [];
    if (parts.length) {
        var list = el('div', 'part-list');
        list.setAttribute('role', 'tablist');
        var content = el('div', 'part-content');
        var buttons = [];

        var partKey = function (p, i) { return p.id || String(i + 1); };

        var show = function (i, scroll) {
            var p = parts[i];
            buttons.forEach(function (b, n) {
                b.classList.toggle('active', n === i);
                b.setAttribute('aria-selected', n === i ? 'true' : 'false');
            });
            var wrap = el('div', 'part');
            wrap.append(el('h2', 'part-title', p.title));
            if (p.date) wrap.append(el('p', 'article-date', niceDate(p.date)));
            wrap.append(renderBlocks(p.blocks));
            content.replaceChildren(wrap);
            document.title = p.title + ' | Manish Majhi';

            // keep the choice in the address so the link can be shared
            try {
                var url = new URL(location.href);
                url.searchParams.set('part', partKey(p, i));
                history.replaceState(null, '', url);
            } catch (e) { /* file:// pages may not allow this; safe to ignore */ }

            if (scroll) content.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        parts.forEach(function (p, i) {
            var b = el('button', 'part-btn'); b.type = 'button'; b.setAttribute('role', 'tab');
            b.append(el('span', 'part-btn-title', p.title));
            if (p.date) b.append(el('small', '', niceDate(p.date)));
            b.addEventListener('click', function () { show(i, true); });
            buttons.push(b); list.append(b);
        });

        box.append(list, content);

        // open the part named in the address (?part=...), otherwise the first one
        var want = params.get('part'), start = 0;
        parts.forEach(function (p, i) { if (partKey(p, i) === want) start = i; });
        show(start, false);
    }
})();
