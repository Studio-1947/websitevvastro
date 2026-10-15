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
  const langOther = document.getElementById('f-lang-other');

  // The Paid / Barter toggle decides the pass sent to the form
  function syncCollab() {
    // Charge per reel only applies to Paid
    rateField.hidden = !document.getElementById('c-paid').checked;
  }
  document.querySelectorAll('input[name=collab]').forEach((r) => r.addEventListener('change', syncCollab));

  // Followers wheel: scroll, drag or tap; the row in the middle band is the pick
  const wheel = document.getElementById('fol-wheel');
  const rows = [...wheel.querySelectorAll('.wi')];
  const ROW = () => rows[0].offsetHeight;
  let folIdx = -1;
  function pickFol(i) {
    i = Math.max(0, Math.min(rows.length - 1, i));
    if (i === folIdx) return;
    folIdx = i;
    rows.forEach((r, n) => r.classList.toggle('on', n === i));
    document.getElementById('f-fol').value = rows[i].dataset.v;
    wheel.setAttribute('aria-valuenow', i);
    wheel.setAttribute('aria-valuetext', rows[i].textContent);
    document.querySelector('.wheel-btn.up').disabled = i === 0;
    document.querySelector('.wheel-btn.down').disabled = i === rows.length - 1;
  }
  let raf = 0;
  wheel.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => pickFol(Math.round(wheel.scrollTop / ROW())));
  });
  const goFol = (n) => wheel.scrollTo({ top: Math.max(0, Math.min(rows.length - 1, n)) * ROW(), behavior: 'smooth' });
  rows.forEach((r, n) => r.addEventListener('click', () => goFol(n)));
  document.querySelectorAll('.wheel-btn').forEach((btn) => btn.addEventListener('click', () => goFol(folIdx + Number(btn.dataset.step))));
  wheel.addEventListener('keydown', (e) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    goFol(folIdx + step);
  });
  // Mouse drag for desktop; touch scrolls natively
  let drag = null;
  wheel.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') drag = { y: e.clientY, top: wheel.scrollTop }; });
  window.addEventListener('pointermove', (e) => { if (drag) wheel.scrollTop = drag.top - (e.clientY - drag.y); });
  window.addEventListener('pointerup', () => { if (drag) { drag = null; goFol(folIdx); } });
  // Stop the arrows blinking once someone has used the wheel
  const wheelWrap = wheel.closest('.wheel-wrap');
  const stopHint = () => wheelWrap.classList.add('used');
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((ev) => wheelWrap.addEventListener(ev, stopHint, { passive: true }));
  pickFol(0);

  // Toggle note changes with the choice
  const NOTES = {
    paid: 'A proper brief and a fee for your reels.',
    barter: 'A homestay night or a dinner coupon.',
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


  // Slider bars. Engagement sits on the main page, charge per reel in the form
  // (Paid only). Each writes its value into a hidden form field.
  const BANDS = {
    eng: { input: 'f-eng', steps: [['', 'Not sure'], ['0.5', '0.5%'], ['1', '1%'], ['2', '2%'], ['3', '3%'], ['4', '4%'], ['5', '5%'], ['7', '7%'], ['10', '10%'], ['15', '15%+']] },
    rate: { input: 'f-rate', steps: [['500', '₹500'], ['1000', '₹1k'], ['2000', '₹2k'], ['3000', '₹3k'], ['5000', '₹5k'], ['7500', '₹7.5k'], ['10000', '₹10k'], ['15000', '₹15k'], ['25000', '₹25k'], ['50000', '₹50k+']] },
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
    return [...textFields()].some((f) => f.value.trim()) ||
      !!document.getElementById('f-lang').value || form.querySelector('#f-ok:checked') !== null;
  }
  function saveDraft() {
    const draft = { fields: {}, checks: [] };
    form.querySelectorAll('input[type=text],input[type=tel],textarea,select').forEach((f) => { if (f.id) draft.fields[f.id] = f.value; });
    form.querySelectorAll('input[type=radio]:checked,input[type=checkbox]:checked').forEach((c) => draft.checks.push(c.id));
    draft.rate = touched.rate ? document.getElementById('s-rate').value : null;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) { /* private mode: answers still stay for this visit */ }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
  }
  function discardForm() {
    form.querySelectorAll('input[type=text],input[type=tel],textarea').forEach((f) => { f.value = ''; });
    form.querySelectorAll('input[type=radio],input[type=checkbox]').forEach((c) => { c.checked = false; });
    document.getElementById('f-lang').value = '';
    syncLang();
    touched.rate = false;
    setBand('rate', 4);
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
    syncLang();
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
    setPinStatus('\u2713 ' + [...new Set(hit)].join(', '), 'ok');
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
    otherLabel.textContent = text || '+ Add your niche';
    otherLabel.classList.toggle('add-pill', !text);
  }
  otherLabel.addEventListener('click', (e) => { e.preventDefault(); if (!otherBox.disabled || otherBox.checked) editOther(); });
  // Niche: pick at most 2 (a typed niche counts as one); the rest dim once 2 are chosen
  const NICHE_MAX = 2;
  const nicheCard = document.querySelector('.niche-card');
  function limitNiche() {
    const boxes = [...nicheCard.querySelectorAll('input[type=checkbox]')];
    const full = boxes.filter((b) => b.checked).length >= NICHE_MAX;
    boxes.forEach((b) => { b.disabled = full && !b.checked; });
  }
  nicheCard.addEventListener('change', limitNiche);
  nicheOther.addEventListener('blur', () => setTimeout(limitNiche));

  // Keyboard users toggle the hidden checkbox with Space; open the field for them too
  otherBox.addEventListener('change', () => { if (otherBox.checked && !nicheOther.value.trim()) editOther(); });
  nicheOther.addEventListener('blur', doneOther);
  nicheOther.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); nicheOther.blur(); } });

  // Show the "which language" box only when Other is picked
  // Clear the "Almost there" message as soon as they start fixing things
  ['input', 'change'].forEach((ev) => form.addEventListener(ev, () => { err.hidden = true; }));

  // Language dropdown: Other opens a box to type it
  const langSelect = document.getElementById('f-lang');
  const langOtherField = document.getElementById('lang-other-field');
  function syncLang() { langOtherField.hidden = langSelect.value !== '__other__'; }
  langSelect.addEventListener('change', () => { syncLang(); if (!langOtherField.hidden) langOther.focus(); });

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
      handle: (fd.get('handle') || '').trim(),
      reels: (fd.get('reels') || '').trim(),
      lang: fd.get('lang') || '',
      langOther: (fd.get('langOther') || '').trim(),
      followers: wholeNumber(fd.get('followers') || ''),
      engagement: decimal(fd.get('engagement') || ''),
      pin: (fd.get('pin') || '').trim(),
      deal: document.getElementById('c-paid').checked ? PASS_PAID : PASS_BARTER,
      rate: wholeNumber(fd.get('rate') || ''),
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
    if (!d.handle) miss.push('your Instagram / YouTube profile link');
    if (!d.lang || (d.lang === '__other__' && !d.langOther)) miss.push('your language');
    if (!d.followers) miss.push('your follower range');

    if (!/^[1-9]\d{5}$/.test(d.pin)) miss.push('a 6-digit PIN code');
    else if (!pinInfo && !pinLookupDown) miss.push('a PIN code we can find');
    if (isPaid(d) && !touched.rate) miss.push('your charge per reel (move the bar)');
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
      'Engagement rate: ' + (d.engagement ? d.engagement + '%' : 'not given'),
      'Address: ' + fullAddress(d),
      'Niche: ' + (d.niche || 'not given'),
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
    return d.deal.startsWith('Paid campaign');
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
  if (pinBox.value) checkPin();
  syncCollab();
})();
