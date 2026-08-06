/**
 * In-page submission for the contact forms.
 *
 * Both forms (the modal and /sayhello/) POST to Web3Forms, which on a plain
 * submit navigates the browser to a third-party confirmation page — the visitor
 * leaves the site entirely and gets no feedback from us. This intercepts the
 * submit, posts the same data with fetch, and shows the result inline.
 *
 * Progressive enhancement: if JS never runs, the plain POST still works, so the
 * form is never worse off than before.
 *
 * Forms are found by `data-contact-form` rather than by their action URL, so
 * swapping form provider again does not mean editing this selector.
 */

/** Where the form posts. Read from the form's own action so the markup stays
 *  the single source of truth. */
const FALLBACK_ENDPOINT = 'https://api.web3forms.com/submit';

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

  const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]');
  for (const input of inputs) {
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
  }

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

  // FormData carries access_key/subject/from_name and the visitor's fields as-is.
  // (An unticked `botcheck` checkbox is simply not submitted, which is what
  // Web3Forms expects from a human.)
  const endpoint = form.getAttribute('action') || FALLBACK_ENDPOINT;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    // Web3Forms answers 200 with {success:false} for a rejected submission —
    // an invalid access key, say. Trusting the HTTP status alone would show the
    // visitor a thank-you while the message went nowhere, so the body decides.
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      throw new Error(data?.message ?? `HTTP ${res.status}`);
    }

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
  const forms = document.querySelectorAll<HTMLFormElement>('form[data-contact-form]');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Honeypot: a ticked `botcheck` means a bot. Feign success and drop it.
      const honey = form.querySelector<HTMLInputElement>('input[name="botcheck"]');
      if (honey?.checked) return;
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
