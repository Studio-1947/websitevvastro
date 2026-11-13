/*
  Studio 1947 creator call form.

  SUBMISSIONS
  Answers are sent to the "Creator Collaboration" Google Form, which saves them
  to its linked Google Sheet. Each field maps to a form question by its entry ID.
  To find IDs after changing the form: Form > ⋮ > Get pre-filled link.
  Google doesn't let the page read the reply, so a send counts as saved unless
  the network request itself fails.
*/
const FORM_ID = '1FAIpQLSdg026O7y36juJDis8ja24-1--UAzal1iRCMyFvz7Ow4YsQew';
const FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/' + FORM_ID + '/formResponse';
const ENTRY = {
  name: 'entry.1767801549',
  whatsapp: 'entry.104102510',
  handle: 'entry.886771994',
  reels: 'entry.736468158',
  lang: 'entry.159818366',
  followers: 'entry.2081332503',
  engagement: 'entry.1004960599',
  address: 'entry.2118388149',
  deal: 'entry.1314099831',
  rate: 'entry.390257086',
  consent: 'entry.37014283',
  usage: 'entry.548370017',
  // niche: 'entry.XXXX',  // add once the Google Form has a Niche question
};
// Must match the form's checkbox options word for word
const CONSENT_TEXT = 'I confirm the details above are accurate and agree to be contacted on WhatsApp about this collaboration.';
// Collaboration type options in the form; must match word for word
const PASS_PAID = 'Paid Collaboration';
const PASS_BARTER = 'Barter Collaboration';
const USAGE_TEXT = 'I allow my reels to be reposted and my name/handle to be used to promote this collaboration.';
const CONTACT_EMAIL = 'studio@1947.io';

(function () {
  const form = document.getElementById('form');
  const err = document.getElementById('err');
  const go = document.getElementById('go');
  const GO_LABEL = go.innerHTML;
  const rateField = document.getElementById('rate-field');

  // The Paid / Barter toggle decides the pass sent to the form
  function syncCollab() {
    // Charge per reel only applies to Paid
    rateField.hidden = !document.getElementById('c-paid').checked;
  }
  document.querySelectorAll('input[name=collab]').forEach((r) => r.addEventListener('change', syncCollab));

  // Followers wheel: scroll, drag or tap; the row in the middle band is the pick
  function makeWheel(wheel, inputId) {
    const wrap = wheel.closest('.wheel-wrap');
    const rows = [...wheel.querySelectorAll('.wi')];
    const ROW = () => rows[0].offsetHeight;
    const up = wrap.querySelector('.wheel-btn.up'), down = wrap.querySelector('.wheel-btn.down');
    let idx = -1;
    function pick(i) {
      i = Math.max(0, Math.min(rows.length - 1, i));
      if (i === idx) return;
      idx = i;
      rows.forEach((r, n) => r.classList.toggle('on', n === i));
      document.getElementById(inputId).value = rows[i].dataset.v;
      wheel.setAttribute('aria-valuenow', i);
      wheel.setAttribute('aria-valuetext', rows[i].textContent);
      up.disabled = i === 0;
      down.disabled = i === rows.length - 1;
    }
    let raf = 0;
    wheel.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => pick(Math.round(wheel.scrollTop / ROW())));
    });
    const go = (n) => wheel.scrollTo({ top: Math.max(0, Math.min(rows.length - 1, n)) * ROW(), behavior: 'smooth' });
    rows.forEach((r, n) => r.addEventListener('click', () => go(n)));
    [up, down].forEach((btn) => btn.addEventListener('click', () => go(idx + Number(btn.dataset.step))));
    wheel.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      go(idx + step);
    });
    // Mouse drag for desktop; touch scrolls natively
    let drag = null;
    wheel.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') drag = { y: e.clientY, top: wheel.scrollTop }; });
    window.addEventListener('pointermove', (e) => { if (drag) wheel.scrollTop = drag.top - (e.clientY - drag.y); });
    window.addEventListener('pointerup', () => { if (drag) { drag = null; go(idx); } });
    // Stop the arrows blinking once someone has used the wheel
    const stopHint = () => wrap.classList.add('used');
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((ev) => wrap.addEventListener(ev, stopHint, { passive: true }));
    pick(0);
  }
  makeWheel(document.getElementById('fol-wheel'), 'f-fol');
  // Platform logo sits inside the dropdown, before the name
  const PLAT_IC = {  // line-art logos, stroke only
    Instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    Facebook: '<path d="M14 21v-7.5h2.7l.4-3H14V8.8c0-.9.3-1.5 1.6-1.5h1.6V4.6a20 20 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v1.9H8.2v3h2.6V21"/>',
    YouTube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.4v5.2l4.4-2.6z"/>',
  };
  const platSel = document.getElementById('f-plat');
  const syncPlat = () => { document.getElementById('plat-ic').innerHTML = PLAT_IC[platSel.value] || ''; };
  platSel.addEventListener('change', syncPlat);
  syncPlat();

  // Content language: dropdown on the main page, copied into the form's hidden field
  const langPick = document.getElementById('lang-pick');
  langPick.addEventListener('change', () => { document.getElementById('f-lang').value = langPick.value; });

  // Toggle note changes with the choice
  const NOTES = {
    paid: 'A proper brief and a fee for your reels.',
    barter: 'A homestay booking or a dinner coupon.',
  };
  const theme = document.querySelector('meta[name=theme-color]');
  function syncTheme() {
    const paid = document.getElementById('c-paid').checked;
    document.body.classList.toggle('paid', paid);
    document.documentElement.classList.toggle('paid', paid);
    theme.setAttribute('content', paid ? '#2C2123' : '#062A30');
  }
  document.querySelectorAll('input[name=collab]').forEach((r) => r.addEventListener('change', () => {
    document.getElementById('collab-note').textContent = NOTES[r.value];
    syncTheme();
  }));
  syncTheme();

  // Barter is picked by default; a hint points at Paid until they tap the toggle
  const tip = document.getElementById('collab-tip');
  const hideTip = () => { tip.classList.add('gone'); setTimeout(() => { tip.hidden = true; }, 300); };
  document.querySelectorAll('input[name=collab]').forEach((r) => r.addEventListener('change', hideTip));
  document.querySelector('.toggle').addEventListener('click', hideTip);
  setTimeout(hideTip, 7000);
  syncCollab();


  // Slider bars. Top-reel views sit on the main page, charge per reel in the form
  // (Paid only). Each writes its value into a hidden form field.
  const BANDS = {
    // Views on the creator's most-watched reel: Not sure, then 1K up to 5M+
    eng: { input: 'f-eng', steps: [['', 'Not sure']].concat([1e3, 2e3, 5e3, 10e3, 20e3, 50e3, 75e3, 100e3, 200e3, 300e3, 500e3, 750e3, 1e6, 2e6, 3e6, 4e6, 5e6].map((v, i, a) => {
      const n = v >= 1e6 ? v / 1e6 + 'M' : v / 1e3 + 'K';
      return [String(v), n + (i === a.length - 1 ? '+' : '') + ' views'];
    })) },
    // ₹500 to ₹2,000 in ₹100 steps
    rate: { input: 'f-rate', steps: Array.from({ length: 16 }, (_, i) => [String(500 + i * 100), '₹' + (500 + i * 100).toLocaleString('en-IN')]) },
  };
  const touched = {};
  function setBand(key, idx) {
    const band = BANDS[key];
    const [value, label] = band.steps[idx];
    document.querySelectorAll('[data-band=' + key + ']').forEach((wrap) => {
      const range = wrap.querySelector('input[type=range]');
      range.value = idx;
      range.setAttribute('aria-valuetext', label);
      range.style.setProperty('--p', (idx / range.max) * 100 + '%');
      const out = wrap.querySelector('output');
      // Engagement shows a "Move" prompt until the bar is first dragged
      if (key === 'eng' && !touched.eng) return;
      out.textContent = label;
      out.classList.remove('nudge');
    });
    document.getElementById(band.input).value = value;
  }
  Object.keys(BANDS).forEach((key) => {
    document.querySelectorAll('[data-band=' + key + '] input[type=range]').forEach((range) => {
      range.addEventListener('input', () => { touched[key] = true; setBand(key, Number(range.value)); });
    });
    setBand(key, Number(document.querySelector('[data-band=' + key + '] input[type=range]').value));
  });


  // "Apply to collaborate" opens the form as a full-screen sheet over the page.
  // Back, the X, Escape and the phone's own back button all close it.
  const sheet = document.getElementById('sheet');
  function openSheet() {
    if (sheet.open) return;
    sheet.showModal();
    document.documentElement.classList.add('sheet-open');
    sheet.querySelector('.sheet-body').scrollTop = 0;
    history.pushState({ sheet: true }, '');
  }
  function closeSheet(fromHistory) {
    if (!sheet.open) return;
    // Half-filled? Ask whether to keep the answers before leaving
    if (formDirty() && document.getElementById('done').hidden) return askLeave(fromHistory);
    reallyClose(fromHistory);
  }
  function reallyClose(fromHistory) {
    sheet.close();
    if (!fromHistory && history.state && history.state.sheet) history.back();
  }

  // Draft: answers typed into the form, kept on this device only
  const DRAFT_KEY = 'creator-call-draft';
  const textFields = () => form.querySelectorAll('input[type=text]:not([hidden]),input[type=tel],textarea');
  function formDirty() {
    return [...textFields()].some((f) => f.value.trim()) || !!document.getElementById('f-handle').value.trim() ||
      form.querySelector('#f-ok:checked') !== null;
  }
  function saveDraft() {
    const draft = { fields: {}, checks: [] };
    form.querySelectorAll('input[type=text],input[type=tel],textarea,select').forEach((f) => { if (f.id) draft.fields[f.id] = f.value; });
    form.querySelectorAll('input[type=radio]:checked,input[type=checkbox]:checked').forEach((c) => draft.checks.push(c.id));
    draft.fields['f-handle'] = document.getElementById('f-handle').value;
    draft.fields['f-plat'] = document.getElementById('f-plat').value;
    draft.rate = touched.rate ? document.getElementById('s-rate').value : null;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) { /* private mode: answers still stay for this visit */ }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
  }
  function discardForm() {
    form.querySelectorAll('input[type=text],input[type=tel],textarea').forEach((f) => { f.value = ''; });
    form.querySelectorAll('input[type=radio],input[type=checkbox]').forEach((c) => { c.checked = false; });
    document.getElementById('f-handle').value = '';
    document.getElementById('f-plat').value = 'Instagram';
    syncPlat();
    touched.rate = false;
    setBand('rate', 5);
    err.hidden = true;
    setPinStatus('', '');
    pinInfo = null;
    syncCollab();
    clearDraft();
  }
  function restoreDraft() {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (_) {}
    if (!draft) return;
    Object.entries(draft.fields || {}).forEach(([id, v]) => { const f = document.getElementById(id); if (f) f.value = v; });
    (draft.checks || []).forEach((id) => { const c = document.getElementById(id); if (c && form.contains(c)) c.checked = true; });
    if (draft.rate !== null && draft.rate !== undefined) { touched.rate = true; setBand('rate', Number(draft.rate)); }
  }

  const leave = document.getElementById('leave');
  let leaveFromHistory = false;
  function askLeave(fromHistory) {
    leaveFromHistory = fromHistory;
    leave.showModal();
  }
  leave.addEventListener('cancel', (e) => { e.preventDefault(); stayInForm(); });
  function stayInForm() {
    leave.close();
    // The phone's back button already left our history entry; put it back so Back works again
    if (leaveFromHistory) history.pushState({ sheet: true }, '');
  }
  leave.querySelectorAll('[data-leave]').forEach((btn) => btn.addEventListener('click', () => {
    const choice = btn.dataset.leave;
    if (choice === 'stay') return stayInForm();
    if (choice === 'save') saveDraft(); else discardForm();
    leave.close();
    reallyClose(leaveFromHistory);
  }));
  sheet.addEventListener('close', () => document.documentElement.classList.remove('sheet-open'));
  sheet.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(); });
  sheet.querySelectorAll('[data-close]').forEach((btn) => btn.addEventListener('click', () => closeSheet()));
  window.addEventListener('popstate', () => closeSheet(true));
  document.getElementById('cta').addEventListener('click', openSheet);


  // PIN code: digits only; once 6 are typed, look up the area, district and state.
  // Data is India Post's directory split into small files by the first two digits.
  const pinBox = document.getElementById('f-pin');
  const pinStatus = document.getElementById('pin-status');
  const pinCache = {};
  let pinInfo = null;      // [area, district, state] for a known PIN
  let pinLookupDown = false;
  function loadPinShard(pre) {
    if (!pinCache[pre]) {
      pinCache[pre] = fetch('data/pin/' + pre + '.json')
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => { pinLookupDown = true; return null; });
    }
    return pinCache[pre];
  }
  function setPinStatus(text, kind) {
    pinStatus.textContent = text;
    pinStatus.className = 'pin-status' + (kind ? ' ' + kind : '');
    pinBox.classList.toggle('bad', kind === 'bad');
  }
  async function checkPin() {
    const pin = pinBox.value;
    pinInfo = null;
    if (pin.length < 6) return setPinStatus('', '');
    if (pin[0] === '0') return setPinStatus('PIN codes don\u2019t start with 0.', 'bad');
    const shard = await loadPinShard(pin.slice(0, 2));
    if (pinBox.value !== pin) return; // they kept typing
    if (shard === null) return setPinStatus('Couldn\u2019t check this PIN right now. We\u2019ll verify it later.', '');
    const hit = shard[pin];
    if (!hit) return setPinStatus('We couldn\u2019t find this PIN code. Please check it.', 'bad');
    pinInfo = hit;
    setPinStatus('\u2713 ' + hit[0], 'ok');  // just the area name; district and state still go to the form
  }
  pinBox.addEventListener('input', () => {
    const digits = pinBox.value.replace(/\D/g, '').slice(0, 6);
    if (digits !== pinBox.value) pinBox.value = digits;
    checkPin();
  });
  // Start fetching the right file as soon as two digits are in
  pinBox.addEventListener('keyup', () => { if (pinBox.value.length >= 2 && pinBox.value[0] !== '0') loadPinShard(pinBox.value.slice(0, 2)); });

  // Niche "Other" pill turns into a text field in place, then shows what was typed
  const nicheOther = document.getElementById('niche-other');
  const otherBox = document.getElementById('n11');
  const otherLabel = document.getElementById('n11-label');
  const nicheOtherOn = () => otherBox.checked && !!nicheOther.value.trim();
  function editOther() {
    otherLabel.hidden = true;
    nicheOther.hidden = false;
    nicheOther.focus();
  }
  function doneOther() {
    const text = nicheOther.value.trim();
    nicheOther.hidden = true;
    otherLabel.hidden = false;
    otherBox.checked = !!text;
    otherLabel.textContent = text || '+ Add';
    otherLabel.classList.toggle('add-pill', !text);
  }
  otherLabel.addEventListener('click', (e) => { e.preventDefault(); if (!otherBox.disabled || otherBox.checked) editOther(); });
  // Niche: one pick only; choosing a chip (or typing your own) replaces the previous pick
  const nicheCard = document.querySelector('.niche-card');
  const nicheBoxes = () => [...nicheCard.querySelectorAll('.chips input[type=checkbox]')];
  function onlyNiche(keep) { nicheBoxes().forEach((b) => { if (b !== keep) b.checked = false; }); }
  nicheCard.addEventListener('change', (e) => { if (e.target.closest('.chips') && e.target.checked) onlyNiche(e.target); });
  nicheOther.addEventListener('blur', () => setTimeout(() => { if (otherBox.checked) onlyNiche(otherBox); }));

  // UGC is a single optional radio: a second tap clears it
  const ugc = document.getElementById('f-ugc');
  let ugcOn = false;
  ugc.addEventListener('click', () => { if (ugcOn) ugc.checked = false; ugcOn = ugc.checked; });

  // Keyboard users toggle the hidden checkbox with Space; open the field for them too
  otherBox.addEventListener('change', () => { if (otherBox.checked && !nicheOther.value.trim()) editOther(); });
  nicheOther.addEventListener('blur', doneOther);
  nicheOther.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); nicheOther.blur(); } });

  // Clear the "Almost there" message as soon as they start fixing things
  ['input', 'change'].forEach((ev) => form.addEventListener(ev, () => { err.hidden = true; }));


  // The Google Form only accepts plain numbers in these fields, so tidy what people type
  function phone(v) {
    const digits = v.replace(/\D/g, '');
    return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  }
  function wholeNumber(v) {
    const m = v.toLowerCase().replace(/[,\s₹]/g, '').match(/^(\d+(?:\.\d+)?)(k|m|l|lakh)?$/);
    if (!m) return '';
    const mult = { k: 1e3, m: 1e6, l: 1e5, lakh: 1e5 }[m[2]] || 1;
    return String(Math.round(parseFloat(m[1]) * mult));
  }
  function decimal(v) {
    const m = v.replace(/[%\s]/g, '').match(/^\d+(?:\.\d+)?$/);
    return m ? m[0] : '';
  }

  function collect() {
    const fd = new FormData(form);
    return {
      name: (fd.get('name') || '').trim(),
      whatsapp: phone(fd.get('whatsapp') || ''),
      // Asked on the main page: platform picked from the dropdown, then the link
      handle: (() => { const v = document.getElementById('f-handle').value.trim(); return v ? document.getElementById('f-plat').value + ': ' + v : ''; })(),
      reels: (fd.get('reels') || '').trim(),
      lang: fd.get('lang') || '',
      langOther: '',  // language is picked from the wheel on the main page
      followers: wholeNumber(fd.get('followers') || ''),
      engagement: decimal(fd.get('engagement') || ''),
      pin: (fd.get('pin') || '').trim(),
      deal: document.getElementById('c-paid').checked ? PASS_PAID : PASS_BARTER,
      rate: wholeNumber(fd.get('rate') || ''),
      ugc: document.getElementById('f-ugc').checked,  // sits on the main page, outside the form
      consent: !!fd.get('consent'),
      usage: !!fd.get('consent'),  // one tick covers both consents in the form
      // Niche capsules sit on the main page, outside the form
      niche: [...document.querySelectorAll('input[name=niche]:checked')].map((c) => c.value)
        .concat(nicheOtherOn() ? [nicheOther.value.trim()] : []).filter(Boolean).join(', '),
    };
  }

  function validate(d) {
    const miss = [];
    if (!d.name) miss.push('your name');
    if (d.whatsapp.length !== 10) miss.push('a 10-digit WhatsApp number');
    if (!d.handle) miss.push('your profile link on the first page');
    if (!d.lang || (d.lang === '__other__' && !d.langOther)) miss.push('your content language on the first page');
    if (!d.followers) miss.push('your follower range');

    if (!/^[1-9]\d{5}$/.test(d.pin)) miss.push('a 6-digit PIN code');
    else if (!pinInfo && !pinLookupDown) miss.push('a PIN code we can find');
    if (isPaid(d) && !touched.rate) miss.push('your remuneration (move the bar)');
    if (!d.consent) miss.push('the consent tick');
    return miss;
  }

  function asText(d) {
    return [
      'Creator application for Studio 1947',
      'Name: ' + d.name,
      'WhatsApp: ' + d.whatsapp,
      'Profile link: ' + d.handle,
      'Best reels: ' + (d.reels || 'not given'),
      'Language: ' + (d.lang === '__other__' ? d.langOther : d.lang),
      'Followers: ' + d.followers,
      'Top reel views: ' + (d.engagement ? Number(d.engagement).toLocaleString('en-IN') : 'not given'),
      'Address: ' + fullAddress(d),
      'Niche: ' + (d.niche || 'not given'),
      'UGC creator: ' + (d.ugc ? 'yes' : 'no'),
      'Pass: ' + d.deal.split(' - ')[0],
      'Remuneration per reel: ' + (isPaid(d) ? '₹' + d.rate : 'N/A'),
    ].join('\n');
  }

  // The form's address question gets the looked-up area, district and state, then the PIN
  function fullAddress(d) {
    const place = pinInfo ? [...new Set(pinInfo)].join(', ') : '';
    return (place ? place + ' - ' : '') + d.pin;
  }

  function isPaid(d) {
    return d.deal === PASS_PAID;
  }

  async function send(d) {
    const body = new URLSearchParams();
    body.append(ENTRY.name, d.name);
    body.append(ENTRY.whatsapp, d.whatsapp);
    body.append(ENTRY.handle, d.handle);
    body.append(ENTRY.reels, d.reels);
    if (d.lang === '__other__') {
      // Google Forms' "Other" choice is sent as a marker plus the typed text
      body.append(ENTRY.lang, '__other_option__');
      body.append(ENTRY.lang + '.other_option_response', d.langOther);
    } else {
      body.append(ENTRY.lang, d.lang);
    }
    body.append(ENTRY.followers, d.followers);
    body.append(ENTRY.engagement, d.engagement);
    body.append(ENTRY.address, fullAddress(d));
    body.append(ENTRY.deal, d.deal);
    // Required and numbers-only in the form, so barter-only applicants send 0
    body.append(ENTRY.rate, isPaid(d) ? d.rate : '0');
    body.append(ENTRY.consent, CONSENT_TEXT);
    body.append(ENTRY.usage, USAGE_TEXT);
    if (ENTRY.niche) body.append(ENTRY.niche, d.niche);
    try {
      // no-cors: Google accepts the post but hides the response from the page
      await fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body });
      return true;
    } catch (e) {
      return false;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = collect();
    const miss = validate(d);
    if (miss.length) {
      err.textContent = 'Almost there. Add ' + miss.join(', ') + '.';
      err.hidden = false;
      err.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    err.hidden = true;
    go.disabled = true;
    go.textContent = 'Sending…';
    const saved = await send(d);
    go.disabled = false;
    go.innerHTML = GO_LABEL;

    if (saved) {
      clearDraft();
      form.hidden = true;
      const done = document.getElementById('done');
      done.hidden = false;
      done.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else {
      const t = asText(d);
      document.getElementById('copytext').textContent = t;
      document.getElementById('mailbtn').href =
        'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('Creator application: ' + d.handle) +
        '&body=' + encodeURIComponent(t);
      const fb = document.getElementById('fallback');
      fb.hidden = false;
      fb.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  });

  document.getElementById('again').addEventListener('click', () => {
    document.getElementById('done').hidden = true;
    form.hidden = false;
    form.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  document.getElementById('copybtn').addEventListener('click', async (e) => {
    const t = document.getElementById('copytext').textContent;
    try {
      await navigator.clipboard.writeText(t);
      e.target.textContent = 'Copied';
    } catch (_) {
      const r = document.createRange();
      r.selectNodeContents(document.getElementById('copytext'));
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      e.target.textContent = 'Selected, copy it now';
    }
  });

  // Restore a saved draft last, once every control above is set up
  restoreDraft();
  syncPlat();
  if (pinBox.value) checkPin();
  syncCollab();
})();
