// Simulated forms: nothing is ever sent. Native constraints, Italian messages under
// each field, inline confirmation. The guided quote request shows one step at a time.
// Without JS the forms stay visible and the browser's own validation applies.
(() => {
  const DONE = "Richiesta ricevuta. Questa è un'anteprima: nessun dato è stato inviato.";

  function message(el) {
    const v = el.validity;
    if (v.valid) return '';
    if (el.type === 'checkbox') return 'Per procedere serve il consenso al trattamento dei dati.';
    if (el.type === 'radio') return "Scegli un'opzione.";
    if (v.valueMissing) return 'Compila questo campo.';
    if (v.typeMismatch && el.type === 'email') return 'Scrivi un indirizzo email valido, ad esempio nome@dominio.it.';
    if (v.rangeUnderflow) return `Il valore minimo è ${el.min}.`;
    if (v.badInput || v.stepMismatch) return 'Scrivi un numero intero.';
    return 'Controlla questo campo.';
  }

  // Shows (or clears) the message of one control; radios share one message per group.
  function check(el) {
    const msg = message(el);
    const field = el.closest('.field');
    const err = field && field.querySelector('.field-err');
    if (err) err.textContent = msg;
    const group = el.type === 'radio' ? el.form.querySelectorAll(`[name="${el.name}"]`) : [el];
    group.forEach((c) => (msg ? c.setAttribute('aria-invalid', 'true') : c.removeAttribute('aria-invalid')));
    return !msg;
  }

  // Validates every control inside scope; focuses the first invalid one.
  function validate(scope) {
    const seen = new Set();
    let first = null;
    scope.querySelectorAll('input, select, textarea').forEach((el) => {
      if (!el.willValidate || (el.type === 'radio' && seen.has(el.name))) return;
      seen.add(el.name);
      if (!check(el) && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }

  function clearErrors(form) {
    form.querySelectorAll('.field-err').forEach((e) => { e.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
  }

  function wizard(form) {
    const steps = [...form.querySelectorAll('.wiz-step')];
    const summary = form.querySelector('.wiz-summary');
    const status = form.querySelector('.wiz-status');
    const prev = form.querySelector('[data-prev]');
    const next = form.querySelector('[data-next]');
    const send = form.querySelector('[type="submit"]');
    let at = 0; // 0..2 = steps, 3 = summary

    function fillSummary() {
      const dl = summary.querySelector('dl');
      dl.replaceChildren();
      const done = new Set();
      form.querySelectorAll('[data-sum]').forEach((el) => {
        if (done.has(el.name)) return;
        done.add(el.name);
        let value = el.value.trim();
        if (el.type === 'radio') {
          const on = form.querySelector(`[name="${el.name}"]:checked`);
          value = on ? on.closest('label').textContent.trim() : '';
        } else if (el.tagName === 'SELECT') {
          value = el.value ? el.selectedOptions[0].text : '';
        }
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = el.dataset.sum;
        dd.textContent = value || 'Non indicato';
        row.append(dt, dd);
        dl.append(row);
      });
    }

    function show(n, focus) {
      at = n;
      steps.forEach((s, i) => { s.hidden = i !== n; });
      summary.hidden = n !== 3;
      if (n === 3) fillSummary();
      status.textContent = n < 3 ? `Passo ${n + 1} di 3` : 'Riepilogo prima dell\'invio';
      prev.hidden = n === 0;
      next.hidden = n === 3;
      send.hidden = n !== 3;
      if (focus) (n < 3 ? steps[n] : summary).querySelector('h3').focus();
    }

    next.addEventListener('click', () => { if (validate(steps[at])) show(at + 1, true); });
    prev.addEventListener('click', () => show(at - 1, true));
    show(0, false);

    return {
      // Enter in a field before the summary moves forward instead of sending.
      intercept() { if (at < 3) { next.click(); return true; } return false; },
      reset() { show(0, false); },
    };
  }

  document.querySelectorAll('form.sim').forEach((form) => {
    form.noValidate = true;
    const wiz = form.classList.contains('wizard') ? wizard(form) : null;

    // Confirmation lives next to the form; the message gets focus when shown.
    const done = document.createElement('div');
    done.className = 'form-done';
    done.hidden = true;
    const msg = document.createElement('p');
    msg.setAttribute('role', 'status');
    msg.tabIndex = -1;
    const again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn btn-line';
    again.textContent = 'Compila di nuovo';
    done.append(msg, again);
    form.after(done);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (wiz && wiz.intercept()) return;
      form.classList.add('tried');
      if (!validate(form)) return;
      form.hidden = true;
      done.hidden = false;
      msg.textContent = DONE;
      msg.focus();
    });

    // After the first attempt, messages follow the user's corrections.
    const live = (e) => {
      const el = e.target;
      if (el.willValidate && (form.classList.contains('tried') || el.hasAttribute('aria-invalid'))) check(el);
    };
    form.addEventListener('input', live);
    form.addEventListener('change', live);

    again.addEventListener('click', () => {
      form.reset();
      clearErrors(form);
      form.classList.remove('tried');
      if (wiz) wiz.reset();
      msg.textContent = '';
      done.hidden = true;
      form.hidden = false;
      form.querySelector('input:not([type="hidden"]), select, textarea').focus();
    });
  });
})();
