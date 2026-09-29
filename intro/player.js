let active = false;

export function playIntro() {
  if (active) return;
  active = true;
  const root = document.documentElement;
  const previousFocus = document.activeElement;
  const english = root.lang.startsWith('en');
  if (!document.querySelector('link[href="/intro/player.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/intro/player.css';
    document.head.append(css);
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'intro-player';
  dialog.setAttribute('aria-label', english ? 'Meet Ignacio Palmeri' : 'Conocé a Ignacio Palmeri');
  const frame = document.createElement('iframe');
  frame.title = 'Soy Nacho. Arreglo cosas.';
  frame.allow = 'autoplay';
  const skip = document.createElement('button');
  skip.className = 'intro-player-skip';
  skip.type = 'button';
  skip.textContent = english ? 'Skip intro →' : 'Saltar intro →';
  let finished = false;
  let timeout;
  function finish(remember = true) {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    window.removeEventListener('message', onMessage);
    dialog.close();
    dialog.remove(); // Unloading the frame also stops its audio and animation.
    active = false;
    root.classList.remove('intro-pending', 'intro-on');
    if (remember) {
      try { localStorage.setItem('intro-interactive-v1-seen', '1'); } catch {}
    }
    window.dispatchEvent(new Event('intro-state'));
    if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus();
    else document.querySelector('[data-intro-replay]')?.focus({ preventScroll: true });
  }
  function onMessage(event) {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'portfolio:intro-ready') clearTimeout(timeout);
    if (event.data?.type === 'portfolio:intro-exit') finish();
  }
  window.addEventListener('message', onMessage);
  skip.addEventListener('click', () => finish());
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(); });
  frame.addEventListener('error', () => finish(false));
  frame.src = '/intro/interactive/index.html';
  dialog.append(frame, skip);
  document.body.append(dialog);
  dialog.showModal();
  skip.focus();
  window.__introReady = true;
  root.classList.add('intro-on');
  root.classList.remove('intro-pending');
  window.dispatchEvent(new Event('intro-state'));
  timeout = setTimeout(() => finish(false), 15000);
}
