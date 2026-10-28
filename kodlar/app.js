/* Zərif Dad: telefon üçün sifariş saytı.
   Bütün məlumat data/ qovluğundakı .txt fayllardadır, bu faylı dəyişmək lazım deyil. */
(function () {
  'use strict';

  /* ---------- Kateqoriyalar: fayl adı data/<fayl>.txt, şəkil qovluğu images/<qovluq>/ ---------- */
  var CATS = [
    { id: 'salatlar',      ad: 'Salatlar',       qovluq: 'salatlar' },
    { id: 'isti-yemekler', ad: 'İsti yeməklər',  qovluq: 'isti yemekler' },
    { id: 'tortlar',       ad: 'Tortlar',        qovluq: 'tortlar' },
    { id: 'sirniyyatlar',  ad: 'Şirniyyatlar',   qovluq: 'sirniyyatlar' }
  ];

  /* Şəkil uzantısı yazılmayıbsa .jpg, .jpeg, .png, .webp ardıcıllıqla yoxlanır */
  window.__ni = function (img) {
    var l = (img.getAttribute('data-n') || '').split('|').filter(Boolean);
    if (!l.length) { img.remove(); return; }
    var n = l.shift();
    img.setAttribute('data-n', l.join('|'));
    img.src = n;
  };
  var EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG'];

  var IC = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    menu: '<path d="M7 3v8a2 2 0 0 0 2 2v8"/><path d="M5 3v6"/><path d="M9 3v6"/><path d="M17 3c-2.2 1.2-3 4-3 8h3v10"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
    check: '<path d="M5 13l4 4L19 7"/>',
    arrow: '<path d="M9 6l6 6-6 6"/>',
    sndon: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9c1.3 1.3 1.3 4.7 0 6"/><path d="M18.5 6.5c3 3 3 8 0 11"/>',
    sndoff: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    wa: '<path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.4-8.3zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 0 1-1.5-5.2C2.1 6.5 6.5 2.1 12 2.1c2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.4-4.4 9.8-9.8 9.8zm5.4-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1.8.8 2.5.9 3.4.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/>'
  };
  function svg(n) { return '<svg class="ic' + (n === 'wa' ? ' fill' : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>'; }

  /* ---------- Köməkçi funksiyalar ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function get(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; });
  }
  function intl(s) {
    var d = String(s || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.indexOf('994') === 0) return d;
    if (d.charAt(0) === '0') d = d.slice(1);
    return '994' + d;
  }
  function parsePrice(s) {
    var m = String(s || '').replace(',', '.').match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : null;
  }
  function fmt(n) { return (Math.round(n * 100) / 100).toString() + ' ₼'; }
  function fmtDate(s) { var m = String(s || '').match(/^(\d{4})-(\d\d)-(\d\d)$/); return m ? m[3] + '.' + m[2] + '.' + m[1] : s; }
  function imgSrc(folder, file) {
    if (/^https?:/i.test(file)) return file;
    return 'images/' + encodeURI(folder) + '/' + encodeURI(file);
  }

  /* ---------- Light / Dark (qazan düyməsi) ---------- */
  var THEME_KEY = 'zd_tema_v1';
  var POT = '<svg class="pot" viewBox="0 0 40 40" aria-hidden="true">' +
    '<g class="steam"><path d="M17 9c-2-2 2-3 0-6"/><path d="M24 8c-2-2 2-3 0-6"/><path d="M31 9c-2-2 2-3 0-6"/></g>' +
    '<path class="hd" d="M5 21H2M35 21h3"/>' +
    '<path class="body" d="M6 18h28v9a9 9 0 0 1-9 9H15a9 9 0 0 1-9-9z"/>' +
    '<path class="lid" d="M7 18a13 10 0 0 1 26 0z"/><circle class="knob" cx="20" cy="9.5" r="2.2"/></svg>';
  function savedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function sysTheme() { return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function curTheme() { return document.documentElement.getAttribute('data-theme') || savedTheme() || sysTheme(); }
  function setTheme(t, keep) {
    document.documentElement.setAttribute('data-theme', t);
    if (keep) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
    var b = $('#btnTheme'); if (!b) return;
    b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    b.setAttribute('aria-label', t === 'dark' ? 'Light rejimə keç (qapağı aç)' : 'Dark rejimə keç (qapağı bağla)');
    $('#tLabel').textContent = t === 'dark' ? 'Dark' : 'Light';
  }
  document.documentElement.setAttribute('data-theme', savedTheme() || sysTheme());

  /* ---------- Vəziyyət ---------- */
  var S = { cfg: {}, cats: [], P: {}, cart: {}, q: '', searchOpen: false, order: null, last: null };
  var CART_KEY = 'zd_sebet_v1', USER_KEY = 'zd_musteri_v1';

  function parseKV(txt) {
    var o = {};
    txt.split(/\r?\n/).forEach(function (l) {
      l = l.trim();
      if (!l || l.charAt(0) === '#') return;
      var i = l.indexOf(':');
      if (i < 1) return;
      o[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim();
    });
    return o;
  }

  function parseCat(txt, def) {
    var out = { id: def.id, ad: def.ad, qovluq: def.qovluq, cover: '', items: [] };
    txt.split(/\r?\n/).forEach(function (l) {
      l = l.trim();
      if (!l || l.charAt(0) === '#') return;
      var m = l.match(/^(folder|qovluq)\s*:\s*(.+)$/i);
      if (m) { out.qovluq = m[2].trim(); return; }
      m = l.match(/^cover\s*:\s*(.+)$/i);
      if (m) { out.cover = m[1].trim(); return; }
      var feat = false;
      if (l.charAt(0) === '*') { feat = true; l = l.slice(1).trim(); }
      var a = l.split('|').map(function (x) { return x.trim(); });
      var file = a[0];
      if (!file) return;
      var name = a[1] || file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      out.items.push({
        id: def.id + '|' + file,
        cat: def.id,
        file: file,
        name: name,
        price: parsePrice(a[2]),
        priceRaw: a[2] || '',
        w: a[3] || '',
        desc: a[4] || '',
        feat: feat
      });
    });
    out.items.forEach(function (p) {
      if (/\.[a-z0-9]{2,5}$/i.test(p.file)) p.srcs = [imgSrc(out.qovluq, p.file)];
      else p.srcs = EXTS.map(function (e) { return imgSrc(out.qovluq, p.file + e); });
      p.src = p.srcs[0];
    });
    return out;
  }

  function allItems() { var r = []; S.cats.forEach(function (c) { r = r.concat(c.items); }); return r; }

  /* ---------- Səbət ---------- */
  function cartLines() {
    var r = [];
    Object.keys(S.cart).forEach(function (id) { if (S.P[id]) r.push({ id: id, p: S.P[id], q: S.cart[id] }); });
    return r;
  }
  function totals(lines) {
    var t = 0, n = 0, unp = false;
    lines.forEach(function (l) {
      n += l.q;
      if (l.p.price != null) t += l.p.price * l.q; else unp = true;
    });
    return { total: t, count: n, unpriced: unp };
  }
  function cartSet(id, q) {
    if (!S.P[id]) return;
    if (q <= 0) delete S.cart[id]; else S.cart[id] = Math.min(q, 99);
    save(CART_KEY, S.cart);
    refreshCart(id);
  }
  function priceHtml(p) {
    return p.price != null ? esc(fmt(p.price)) : '<small>Qiyməti soruşun</small>';
  }
  function actHtml(p) {
    var q = S.cart[p.id] || 0, id = esc(p.id);
    return (q
      ? '<div class="step"><button type="button" data-act="dec" data-id="' + id + '" aria-label="Azalt">−</button><b>' + q + '</b><button type="button" data-act="inc" data-id="' + id + '" aria-label="Artır">+</button></div>'
      : '<button type="button" class="btn line" data-act="add" data-id="' + id + '">Səbətə əlavə et</button>') +
      '<button type="button" class="btn fill" data-act="order" data-id="' + id + '">Sifariş et</button>';
  }
  function imgTag(p, alt, lazy) {
    return '<img' + (lazy ? ' loading="lazy"' : '') + ' src="' + esc(p.src) + '" alt="' + esc(alt) + '" data-n="' + esc((p.srcs || []).slice(1).join('|')) + '" onerror="__ni(this)">';
  }
  function cardHtml(p) {
    var id = esc(p.id);
    return '<article class="card" data-id="' + id + '">' +
      '<div class="im" data-l="' + esc(p.name.charAt(0)) + '" data-act="zoom" data-id="' + id + '">' + imgTag(p, p.name, true) + '</div>' +
      '<div class="bd"><h3>' + esc(p.name) + '</h3>' +
      (p.w ? '<div class="meta">' + esc(p.w) + '</div>' : '') +
      (p.desc ? '<p class="ds">' + esc(p.desc) + '</p>' : '') +
      '<div class="pr">' + priceHtml(p) + '</div>' +
      '<div class="act">' + actHtml(p) + '</div></div></article>';
  }

  function refreshCart(id) {
    updateBadges();
    $$('.card').forEach(function (c) {
      if (c.getAttribute('data-id') === id) { var a = $('.act', c); if (a) a.innerHTML = actHtml(S.P[id]); }
    });
    if (S.route === 'sebet') render();
    if (S.order && S.order.mode === 'single') { /* sheet öz-özünə yenilənir */ }
  }
  function updateBadges() {
    var t = totals(cartLines());
    [['badgeTop', 1], ['badgeTab', 1]].forEach(function (x) {
      var b = $('#' + x[0]); b.textContent = t.count; b.hidden = !t.count;
    });
    var mc = $('#minicart');
    if (t.count && S.route !== 'sebet' && S.route !== 'tesekkur') {
      mc.hidden = false;
      mc.innerHTML = '<span>Səbət · ' + t.count + ' məhsul</span><span>' + (t.total ? esc(fmt(t.total)) : '') + svg('arrow') + '</span>';
    } else mc.hidden = true;
  }

  /* ---------- Görünüşlər ---------- */
  var HOW = '<div class="how"><h3>Necə sifariş verilir?</h3><ol>' +
    '<li><span>1</span><div><b>Seçin</b>Menyudan sevdiyiniz təamı tapın.</div></li>' +
    '<li><span>2</span><div><b>Sifariş edin</b>“Sifariş et” düyməsinə basın və ya əvvəl səbətə əlavə edin.</div></li>' +
    '<li><span>3</span><div><b>WhatsApp-da göndərin</b>Hazır mesajı göndərəndə sifarişiniz bizə çatır, biz sizinlə əlaqə saxlayırıq.</div></li></ol></div>';

  function noItemsHint() {
    return '<div class="empty"><b>Menyu hazırlanır</b>Məhsullar tezliklə əlavə olunacaq.</div>';
  }

  function viewHome() {
    var h = '<section class="hero"><small>' + esc(S.cfg.ad) + '</small><h1>' + esc(S.cfg.slogan) + '</h1><a class="hbtn" href="#menyu">Menyuya bax</a></section>';
    var vid = videoHtml();
    var feat = allItems().filter(function (p) { return p.feat; });
    if (vid) h += vid;
    else if (feat.length) h += '<h2 class="sec">Seçilmiş məhsullar</h2><div class="hrow">' + feat.map(cardHtml).join('') + '</div>';
    return h + HOW;
  }

  function videoHtml() {
    var f = S.cfg.video;
    if (!f) return '';
    var poster = S.cfg['video-poster'] ? ' poster="images/' + esc(encodeURI(S.cfg['video-poster'])) + '"' : '';
    var txt = S.cfg['video-yazi'] || 'Sifarişlər üçün menyu bölməsinə baxa bilərsiniz.';
    var ext = (f.match(/\.([^.]+)$/) || [, 'mp4'])[1].toLowerCase();
    var types = { mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', m4v: 'video/mp4' };
    var base = f.replace(/\.[^.]+$/, '');
    var src = '<source src="images/' + esc(encodeURI(f)) + '" type="' + (types[ext] || 'video/mp4') + '">';
    /* mp4 olarsa, eyni adlı .webm faylı da ehtiyat kimi yoxlanır (bəzi brauzerlər H.264 oynada bilmir) */
    if (ext === 'mp4' || ext === 'm4v' || ext === 'mov') src += '<source src="images/' + esc(encodeURI(base + '.webm')) + '" type="video/webm">';
    return '<section class="vid"><div class="vbox"><video id="homeVid"' + poster +
      ' muted loop playsinline preload="metadata" aria-label="Reklam videosu">' + src + '</video>' +
      '<button type="button" class="vsnd" id="vsnd" data-act="vsound" aria-label="Səsi aç">' + svg('sndoff') + '</button></div>' +
      '<div class="vcap"><p>' + esc(txt) + '</p><a class="hbtn2" href="#menyu" data-clearq>Menyuya bax</a></div></section>';
  }
  var vidObs = null;
  function setupVideo() {
    if (vidObs) { vidObs.disconnect(); vidObs = null; }
    var v = $('#homeVid'); if (!v) return;
    var drop = function () { var s = v.closest('.vid'); if (s) s.remove(); };
    v.addEventListener('error', drop);
    var srcs = v.querySelectorAll('source');
    if (srcs.length) srcs[srcs.length - 1].addEventListener('error', drop);
    if ('IntersectionObserver' in window) {
      vidObs = new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (x.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
        });
      }, { threshold: 0.4 });
      vidObs.observe(v);
    } else { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  }

  function viewMenu(cid) {
    var q = S.q.trim().toLowerCase(), h = '';
    h += '<div class="chips" id="chips"><a class="chip' + (!cid && !q ? ' on' : '') + '" href="#menyu" data-clearq>Hamısı</a>' +
      S.cats.map(function (c) {
        return '<a class="chip' + (c.id === cid && !q ? ' on' : '') + '" href="#menyu/' + c.id + '" data-clearq>' + esc(c.ad) + '</a>';
      }).join('') + '</div>';
    if (S.cfg['sifaris-qeydi']) h += '<div class="note">' + esc(S.cfg['sifaris-qeydi']) + '</div>';
    if (!allItems().length) return h + noItemsHint();
    if (q) {
      var res = allItems().filter(function (p) {
        return (p.name + ' ' + p.desc + ' ' + p.w).toLowerCase().indexOf(q) > -1;
      });
      return h + '<div class="rescount">' + res.length + ' nəticə</div>' +
        (res.length ? '<div class="grid" style="margin-top:10px">' + res.map(cardHtml).join('') + '</div>'
          : '<div class="empty"><b>Heç nə tapılmadı</b>Başqa söz yazın.</div>');
    }
    var cats = cid ? S.cats.filter(function (c) { return c.id === cid; }) : S.cats;
    cats.forEach(function (c) {
      h += '<h3 class="grp">' + esc(c.ad) + '</h3>';
      h += c.items.length ? '<div class="grid">' + c.items.map(cardHtml).join('') + '</div>'
        : '<div class="empty" style="padding:24px 20px">Bu bölməyə məhsullar tezliklə əlavə olunacaq.</div>';
    });
    return h;
  }

  function viewCart() {
    var lines = cartLines();
    if (!lines.length) {
      return '<div class="empty" style="padding:70px 20px"><b>Səbətiniz boşdur</b>Menyudan sevdiyiniz təamı əlavə edin.' +
        '<div style="margin-top:18px"><a class="btn fill" style="display:inline-flex;width:auto;padding:0 28px" href="#menyu">Menyuya keç</a></div></div>';
    }
    var t = totals(lines);
    var h = '<h2 class="pagetitle">Səbətim</h2>';
    lines.forEach(function (l) {
      var id = esc(l.id), p = l.p;
      h += '<div class="ci"><div class="th" data-l="">' + esc(p.name.charAt(0)) + imgTag(p, '', false) + '</div>' +
        '<div class="ib2"><h4>' + esc(p.name) + '</h4><div class="up">' + (p.price != null ? esc(fmt(p.price)) : 'Qiymət razılaşma ilə') + (p.w ? ' · ' + esc(p.w) : '') + '</div>' +
        '<div class="step"><button type="button" data-act="dec" data-id="' + id + '">−</button><b>' + l.q + '</b><button type="button" data-act="inc" data-id="' + id + '">+</button></div></div>' +
        '<div class="rt"><div class="lp">' + (p.price != null ? esc(fmt(p.price * l.q)) : '') + '</div><button type="button" class="rm" data-act="rem" data-id="' + id + '">Sil</button></div></div>';
    });
    h += '<div class="sum"><div class="row"><span>Cəmi</span><b>' + esc(fmt(t.total)) + '</b></div>' +
      '<p>' + (t.unpriced ? 'Qiyməti razılaşma ilə olan məhsullar cəmə daxil deyil. ' : '') +
      (S.cfg.catdirilma ? esc(S.cfg.catdirilma) : 'Çatdırılma qiyməti sifarişdən sonra bildirilir.') + '</p>' +
      '<button type="button" class="btn fill big" data-act="checkout">Sifarişi tamamla</button></div>' +
      '<a class="link" href="#menyu">+ Daha məhsul əlavə et</a>';
    return h;
  }

  function viewContact() {
    var c = S.cfg, tel = intl(c.telefon), wa = intl(c.whatsapp), ig = String(c.instagram || '').replace(/^.*instagram\.com\//i, '').replace(/^@/, '').replace(/\/.*$/, '');
    var h = '<div class="cont"><div class="logo big">' + logoInner() + '</div><h2>' + esc(c.ad) + '</h2><p class="cslogan">' + esc(c.slogan) + '</p><div class="clist">';
    if (tel) h += '<a class="cb" href="tel:+' + tel + '"><span class="ci2">' + svg('phone') + '</span><span><b>Zəng edin</b><small>' + esc(c.telefon) + '</small></span></a>';
    if (wa) h += '<a class="cb wa" href="https://wa.me/' + wa + '" target="_blank" rel="noopener"><span class="ci2">' + svg('wa') + '</span><span><b>WhatsApp-da yazın</b><small>' + esc(c.whatsapp) + '</small></span></a>';
    if (ig) h += '<a class="cb" href="https://instagram.com/' + esc(ig) + '" target="_blank" rel="noopener"><span class="ci2">' + svg('insta') + '</span><span><b>Instagram</b><small>@' + esc(ig) + '</small></span></a>';
    h += '</div>';
    if (c['is-saatlari']) h += '<div class="infobox"><b>İş saatları</b>' + esc(c['is-saatlari']) + '</div>';
    if (c.catdirilma) h += '<div class="infobox"><b>Çatdırılma</b>' + esc(c.catdirilma) + '</div>';
    if (c.unvan) h += '<div class="infobox"><b>Ünvan</b>' + esc(c.unvan) + '</div>';
    return h + '</div>';
  }

  function viewThanks() {
    var L = S.last;
    if (!L) return '<div class="empty"><b>Sifariş tapılmadı</b><a class="link" href="#menyu">Menyuya qayıt</a></div>';
    return '<div class="thx"><div class="ok">' + svg('check') + '</div><h2>Son addım qalıb!</h2>' +
      '<p>WhatsApp açıldı və sifarişiniz hazır mesaj kimi yazıldı.</p>' +
      '<div class="warn"><b>WhatsApp-da “Göndər” düyməsinə basın.</b><br>Mesajı göndərəndə sifarişiniz bizə çatır, sonra sizinlə əlaqə saxlayacağıq.</div>' +
      '<div class="no">Sifariş № ' + esc(L.no) + '</div>' +
      '<button type="button" class="btn fill big" data-act="reopen">' + svg('wa') + ' WhatsApp-u yenidən aç</button>' +
      '<button type="button" class="btn line big" style="margin-top:10px" data-act="sent">Mesajı göndərdim ✓</button></div>';
  }

  /* ---------- Marşrut ---------- */
  function render() {
    var h = location.hash.replace(/^#\/?/, '') || 'ana';
    var parts = h.split('/'), r = parts[0];
    if (['ana', 'menyu', 'sebet', 'elaqe', 'tesekkur'].indexOf(r) < 0) r = 'ana';
    var prev = S.route; S.route = r;
    var old = $('#chips'), sl = old ? old.scrollLeft : 0;
    var html = r === 'menyu' ? viewMenu(parts[1]) : r === 'sebet' ? viewCart() : r === 'elaqe' ? viewContact() : r === 'tesekkur' ? viewThanks() : viewHome();
    $('#view').innerHTML = html;
    var chips = $('#chips');
    if (chips) { chips.scrollLeft = sl; var on = $('.chip.on', chips); if (on && on.scrollIntoView) { var x = on.offsetLeft - 14; if (Math.abs(chips.scrollLeft - x) > 80) chips.scrollLeft = x; } }
    $$('#tabbar a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-tab') === r); });
    if (prev !== r || !prev) window.scrollTo(0, 0);
    updateBadges();
    setTop();
    setupVideo();
  }
  function setTop() {
    var sb = $('#searchbar'); sb.hidden = !(S.searchOpen || S.q);
    document.documentElement.style.setProperty('--topH', $('#top').offsetHeight + 'px');
  }

  /* ---------- Sifariş pəncərəsi ---------- */
  function orderLines() {
    if (!S.order) return [];
    if (S.order.mode === 'cart') return cartLines();
    return S.order.lines.map(function (l) { return { id: l.id, p: S.P[l.id], q: l.q }; });
  }
  function sheetItemsHtml() {
    var lines = orderLines(), single = S.order.mode === 'single', t = totals(lines);
    return lines.map(function (l) {
      var id = esc(l.id);
      return '<div class="sl"><div class="nm">' + esc(l.p.name) + (l.p.w ? '<small>' + esc(l.p.w) + '</small>' : '') + '</div>' +
        (single ? '<div class="step"><button type="button" data-act="s-dec" data-id="' + id + '">−</button><b>' + l.q + '</b><button type="button" data-act="s-inc" data-id="' + id + '">+</button></div>'
          : '<div class="meta">x' + l.q + '</div>') +
        '<div class="lp">' + (l.p.price != null ? esc(fmt(l.p.price * l.q)) : '—') + '</div></div>';
    }).join('') + '<div class="sh-total"><span>Cəmi</span><b>' + esc(fmt(t.total)) + '</b></div>' +
      (t.unpriced ? '<div class="oinfo">Qiyməti razılaşma ilə olan məhsullar cəmə daxil deyil.</div>' : '');
  }
  function openOrder(mode, id) {
    if (mode === 'cart' && !cartLines().length) return;
    S.order = { mode: mode, lines: mode === 'single' ? [{ id: id, q: 1 }] : [], dlv: 'catdirilma' };
    var u = load(USER_KEY, {});
    $('#sheetPn').innerHTML = '<div class="grab"></div><div class="sh-h"><h2>Sifarişi tamamla</h2><button type="button" class="x" data-act="sheet-close" aria-label="Bağla">×</button></div>' +
      '<div id="shItems">' + sheetItemsHtml() + '</div>' +
      (S.cfg['sifaris-qeydi'] ? '<div class="oinfo">' + esc(S.cfg['sifaris-qeydi']) + '</div>' : '') +
      '<form id="oform" novalidate>' +
      '<div class="fld" data-f="ad"><label for="fAd">Adınız</label><input id="fAd" autocomplete="name" value="' + esc(u.ad || '') + '"><div class="em">Adınızı yazın</div></div>' +
      '<div class="fld" data-f="tel"><label for="fTel">Telefon nömrəniz</label><input id="fTel" type="tel" inputmode="tel" autocomplete="tel" placeholder="05x xxx xx xx" value="' + esc(u.tel || '') + '"><div class="em">Düzgün telefon nömrəsi yazın</div></div>' +
      '<div class="seg"><button type="button" class="on" data-act="dlv" data-v="catdirilma">Ünvana çatdırılma</button><button type="button" data-act="dlv" data-v="goturme">Özüm götürəcəm</button></div>' +
      '<div class="fld" data-f="unvan" id="fUnvanBox"><label for="fUnvan">Çatdırılma ünvanı</label><textarea id="fUnvan" rows="2" autocomplete="street-address">' + esc(u.unvan || '') + '</textarea><div class="em">Ünvanı yazın</div></div>' +
      '<div class="two"><div class="fld"><label for="fTarix">Tarix (istəyə bağlı)</label><input id="fTarix" type="date"></div><div class="fld"><label for="fSaat">Saat (istəyə bağlı)</label><input id="fSaat" type="time"></div></div>' +
      '<div class="fld"><label for="fQeyd">Qeyd (istəyə bağlı)</label><textarea id="fQeyd" rows="2" placeholder="Məsələn: tortun üstündə yazı, əlavə istək"></textarea></div>' +
      '<button type="submit" class="btn fill big">' + svg('wa') + ' WhatsApp-da göndər</button>' +
      '<p class="hint">Düyməyə basanda WhatsApp açılacaq və sifarişiniz hazır mesaj kimi yazılacaq. Mesajı göndərəndə sifariş bizə çatır.</p></form>';
    var d = new Date(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
    $('#fTarix').min = d.getFullYear() + '-' + m + '-' + dd;
    $('#sheet').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#oform').addEventListener('submit', submitOrder);
  }
  function closeSheet() { $('#sheet').hidden = true; document.body.style.overflow = ''; }

  function submitOrder(e) {
    e.preventDefault();
    var f = {
      ad: $('#fAd').value.trim(), tel: $('#fTel').value.trim(), unvan: $('#fUnvan').value.trim(),
      tarix: $('#fTarix').value, saat: $('#fSaat').value, qeyd: $('#fQeyd').value.trim(), dlv: S.order.dlv
    };
    var bad = [];
    if (!f.ad) bad.push('ad');
    if (f.tel.replace(/\D/g, '').length < 9) bad.push('tel');
    if (f.dlv === 'catdirilma' && !f.unvan) bad.push('unvan');
    $$('#oform .fld').forEach(function (x) { x.classList.toggle('err', bad.indexOf(x.getAttribute('data-f')) > -1); });
    if (bad.length) { var first = $('#oform .fld.err'); if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    save(USER_KEY, { ad: f.ad, tel: f.tel, unvan: f.unvan });
    var lines = orderLines(), d = new Date();
    var no = (S.cfg.ad || 'Z').charAt(0).toUpperCase() + String(d.getDate()).padStart(2, '0') + String(d.getMonth() + 1).padStart(2, '0') + '-' + Math.floor(100 + Math.random() * 900);
    var msg = buildMsg(lines, f, no);
    var url = 'https://wa.me/' + intl(S.cfg.whatsapp) + '?text=' + encodeURIComponent(msg);
    S.last = { no: no, url: url, mode: S.order.mode };
    closeSheet();
    location.hash = '#tesekkur';
    openWa(url);
  }
  function openWa(url) {
    var w = window.open(url, '_blank');
    if (!w) location.href = url;
  }
  function buildMsg(lines, f, no) {
    var t = totals(lines);
    var L = ['Salam, ' + S.cfg.ad + '! Sifariş vermək istəyirəm.', 'Sifariş nömrəsi: ' + no, ''];
    lines.forEach(function (l, i) {
      var s = (i + 1) + ') ' + l.p.name + (l.p.w ? ' (' + l.p.w + ')' : '') + ' x' + l.q;
      s += l.p.price != null ? ' - ' + fmt(l.p.price * l.q) : ' - qiymət razılaşma ilə';
      L.push(s);
    });
    L.push('');
    L.push('Cəmi: ' + fmt(t.total) + (t.unpriced ? ' (+ qiyməti razılaşma ilə olan məhsullar)' : ''));
    L.push('');
    L.push('Ad: ' + f.ad);
    L.push('Telefon: ' + f.tel);
    L.push('Çatdırılma: ' + (f.dlv === 'catdirilma' ? 'Ünvana çatdırılma' : 'Özüm götürəcəm'));
    if (f.dlv === 'catdirilma') L.push('Ünvan: ' + f.unvan);
    if (f.tarix || f.saat) L.push('Nə vaxt: ' + [fmtDate(f.tarix), f.saat].filter(Boolean).join(' '));
    if (f.qeyd) L.push('Qeyd: ' + f.qeyd);
    return L.join('\n');
  }

  /* ---------- Şəkil böyütmə və bildiriş ---------- */
  function openZoom(id) {
    var p = S.P[id]; if (!p) return;
    $('#zoomBox').innerHTML = imgTag(p, p.name, false) + '<div class="zt"><h3>' + esc(p.name) + '</h3>' +
      (p.w ? '<p>' + esc(p.w) + '</p>' : '') + (p.desc ? '<p>' + esc(p.desc) + '</p>' : '') + '<div class="pr">' + priceHtml(p) + '</div></div>';
    $('#zoom').hidden = false;
  }
  var toastT;
  function toast(m) {
    var t = $('#toast'); t.textContent = m; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 1600);
  }

  /* ---------- Klik idarəsi ---------- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-clearq]')) { S.q = ''; S.searchOpen = false; $('#q').value = ''; }
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var a = t.getAttribute('data-act'), id = t.getAttribute('data-id');
    if (a === 'add') { cartSet(id, 1); toast('Səbətə əlavə edildi'); }
    else if (a === 'inc') cartSet(id, (S.cart[id] || 0) + 1);
    else if (a === 'dec') cartSet(id, (S.cart[id] || 0) - 1);
    else if (a === 'rem') cartSet(id, 0);
    else if (a === 'order') openOrder('single', id);
    else if (a === 'checkout') openOrder('cart');
    else if (a === 'sheet-close') closeSheet();
    else if (a === 'zoom') openZoom(id);
    else if (a === 'zoom-close') $('#zoom').hidden = true;
    else if (a === 's-inc' || a === 's-dec') {
      var ln = S.order.lines[0]; ln.q = Math.max(1, Math.min(99, ln.q + (a === 's-inc' ? 1 : -1)));
      $('#shItems').innerHTML = sheetItemsHtml();
    }
    else if (a === 'dlv') {
      S.order.dlv = t.getAttribute('data-v');
      $$('.seg button').forEach(function (b) { b.classList.toggle('on', b === t); });
      $('#fUnvanBox').hidden = S.order.dlv !== 'catdirilma';
    }
    else if (a === 'search') {
      if (S.route !== 'menyu') { S.searchOpen = true; location.hash = '#menyu'; }
      else { S.searchOpen = !S.searchOpen; if (!S.searchOpen) { S.q = ''; $('#q').value = ''; render(); } }
      setTop(); if (S.searchOpen) $('#q').focus();
    }
    else if (a === 'theme') {
      t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop');
      setTheme(curTheme() === 'dark' ? 'light' : 'dark', true);
    }
    else if (a === 'vsound') {
      var vv = $('#homeVid'); if (vv) { vv.muted = !vv.muted; t.innerHTML = svg(vv.muted ? 'sndoff' : 'sndon'); t.setAttribute('aria-label', vv.muted ? 'Səsi aç' : 'Səsi bağla'); }
    }
    else if (a === 'reopen') { if (S.last) openWa(S.last.url); }
    else if (a === 'sent') {
      if (S.last && S.last.mode === 'cart') { S.cart = {}; save(CART_KEY, S.cart); }
      S.last = null; toast('Təşəkkür edirik!'); location.hash = '#ana'; updateBadges();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSheet(); $('#zoom').hidden = true; }
  });
  $('#q').addEventListener('input', function () {
    S.q = this.value;
    if (S.route !== 'menyu') location.hash = '#menyu'; else render();
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('resize', setTop);

  /* ---------- Yükləmə ---------- */
  function logoInner() {
    return S.cfg.logo ? '<img src="images/' + esc(encodeURI(S.cfg.logo)) + '" alt="" onerror="this.remove()">' + esc((S.cfg.ad || 'Z').charAt(0)) : esc((S.cfg.ad || 'Z').charAt(0));
  }
  function init(settings, texts) {
    var c = parseKV(settings);
    c.ad = c.ad || 'Zərif Dad';
    c.slogan = c.slogan || 'Ləziz təamlar hər zaman süfrənizdə olsun.';
    S.cfg = c;
    if (c.reng && /^#[0-9a-f]{3,8}$/i.test(c.reng)) {
      document.documentElement.style.setProperty('--brend', c.reng);
      var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', c.reng);
    }
    document.title = c.ad;
    if (c.logo) { $$('link[rel=icon],link[rel=apple-touch-icon]').forEach(function (l) { l.href = 'images/' + encodeURI(c.logo); }); }
    $('#bname').textContent = c.ad;
    $('#logo').innerHTML = logoInner();
    S.cats = CATS.map(function (def, i) { return parseCat(texts[i], def); });
    S.cats.forEach(function (cat) { cat.items.forEach(function (p) { S.P[p.id] = p; }); });
    var saved = load(CART_KEY, {}); S.cart = {};
    Object.keys(saved).forEach(function (id) { if (S.P[id] && saved[id] > 0) S.cart[id] = saved[id]; });
    render();
  }

  $$('[data-ic]').forEach(function (el) { el.innerHTML = svg(el.getAttribute('data-ic')); });
  $('.tools').insertAdjacentHTML('afterbegin', '<button class="ib themebtn" id="btnTheme" type="button" data-act="theme" aria-pressed="false">' + POT + '<span class="tlabel" id="tLabel">Light</span></button>');
  setTheme(curTheme(), false);
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onMq = function (e) { if (!savedTheme()) setTheme(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
  }
  $('#btnSearch').innerHTML = svg('search');
  $('#btnCart').insertAdjacentHTML('afterbegin', svg('cart'));

  Promise.all([get('data/ayarlar.txt')].concat(CATS.map(function (c) { return get('data/' + c.id + '.txt'); }))).then(function (r) {
    init(r[0], r.slice(1));
  });
})();
