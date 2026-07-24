/**
 * In-page submission for the contact forms.
 *
 * Both forms (the modal and /sayhello/) POST straight to formsubmit.co, which
 * navigates the browser to a third-party confirmation page — the visitor leaves
 * the site entirely and gets no feedback from us. This intercepts the submit,
 * posts to FormSubmit's AJAX endpoint instead, and shows the result inline.
 *
 * Progressive enhancement: if JS never runs, the plain POST still works, so the
 * form is never worse off than before.
 *
 * NOTE FormSubmit requires a one-time activation — the very first submission to
 * a new address triggers a confirmation email that must be clicked before
 * messages are delivered. That applies to the AJAX endpoint too.
 */

const AJAX = 'https://formsubmit.co/ajax/';

function fieldError(input: HTMLInputElement | HTMLTextAreaElement, message: string): void {
  input.setAttribute('aria-invalid', 'true');
  const field = input.closest('.cm-field') ?? input.parentElement;
  if (!field || field.querySelector('.cm-error')) return;
  const p = document.createElement('p');
  p.className = 'cm-error';
  p.textContent = message;
  field.appendChild(p);
}

function clearErrors(form: HTMLFormElement): void {
  form.querySelectorAll('.cm-error').forEach((e) => e.remove());
  form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
}

/** The forms carry `novalidate`, so required/email checks are ours to do. */
function validate(form: HTMLFormElement): boolean {
  clearErrors(form);
  let ok = true;
  let firstBad: HTMLElement | null = null;

  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]').forEach((input) => {
    const value = input.value.trim();
    if (!value) {
      fieldError(input, 'This field is required.');
      ok = false;
      firstBad ??= input;
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      fieldError(input, 'Enter a valid email address.');
      ok = false;
      firstBad ??= input;
    }
  });

  firstBad?.focus();
  return ok;
}

function showStatus(form: HTMLFormElement, kind: 'ok' | 'error', html: string): void {
  let box = form.querySelector<HTMLElement>('.cm-status');
  if (!box) {
    box = document.createElement('div');
    box.className = 'cm-status';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    form.appendChild(box);
  }
  box.classList.toggle('cm-status--ok', kind === 'ok');
  box.classList.toggle('cm-status--error', kind === 'error');
  box.innerHTML = html;
}

async function send(form: HTMLFormElement): Promise<void> {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const original = button?.innerHTML;

  if (button) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending…';
  }

  // Preserve FormSubmit's _subject/_captcha/_template options and the honeypot.
  const payload: Record<string, string> = {};
  new FormData(form).forEach((v, k) => (payload[k] = String(v)));

  // The action holds the plain endpoint; the AJAX one is the same address under /ajax/.
  const to = (form.getAttribute('action') ?? '').split('formsubmit.co/').pop() ?? '';

  try {
    const res = await fetch(AJAX + to, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Hide everything the form contains except the status box. Done by
    // structure rather than class name: the modal uses .cm-field/.cm-row while
    // /sayhello/ uses .field/.field-row, and enumerating those would silently
    // miss any future form.
    [...form.children].forEach((el) => {
      if (!el.classList.contains('cm-status')) (el as HTMLElement).style.display = 'none';
    });
    showStatus(
      form,
      'ok',
      '<strong>Thank you — your message is on its way.</strong>' +
        '<span>We usually reply within a couple of working days.</span>',
    );
  } catch {
    showStatus(
      form,
      'error',
      '<strong>Sorry, that didn’t send.</strong>' +
        '<span>Please try again, or email us directly at ' +
        '<a href="mailto:studio@1947.io">studio@1947.io</a>.</span>',
    );
    if (button) {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      if (original) button.innerHTML = original;
    }
  }
}

export function contactForms(): void {
  const forms = document.querySelectorAll<HTMLFormElement>('form[action*="formsubmit.co"]');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Honeypot: a filled _honey means a bot. Feign success and drop it.
      const honey = form.querySelector<HTMLInputElement>('input[name="_honey"]');
      if (honey?.value) return;
      if (!validate(form)) return;
      void send(form);
    });

    // Clear a field's error as soon as the visitor starts fixing it.
    form.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.removeAttribute('aria-invalid');
        input.closest('.cm-field')?.querySelector('.cm-error')?.remove();
      });
    });
  });
}
