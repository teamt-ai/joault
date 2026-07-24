/* JOAULT ANONYMOUS NIGHT MODE MODULE */

let isAnonymousNightModeActive = localStorage.getItem('joault_anonymous_mode') === 'true';

document.addEventListener('DOMContentLoaded', () => {
  applyAnonymousModeDOMState();
});

function applyAnonymousModeDOMState() {
  const body = document.body;
  const toggleBtn = document.getElementById('btn-night-toggle');

  if (isAnonymousNightModeActive) {
    body.classList.add('anonymous-night-mode');
    if (toggleBtn) {
      toggleBtn.classList.add('active');
      toggleBtn.title = 'Switch to Identity Mode';
      toggleBtn.innerHTML = `
        <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span class="night-toggle-text">Anonymous On</span>
      `;
    }
  } else {
    body.classList.remove('anonymous-night-mode');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.title = 'Switch to Anonymous Night Mode';
      toggleBtn.innerHTML = `
        <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span class="night-toggle-text">Anonymous</span>
      `;
    }
  }
}

function toggleAnonymousNightMode() {
  isAnonymousNightModeActive = !isAnonymousNightModeActive;
  localStorage.setItem('joault_anonymous_mode', isAnonymousNightModeActive ? 'true' : 'false');
  applyAnonymousModeDOMState();

  if (isAnonymousNightModeActive) {
    showAnonymousToast("🌙 Anonymous Night Mode Active — Identities Hidden");
  } else {
    showAnonymousToast("☀️ Identity Mode Active — Names Shown");
  }

  // Re-render feeds
  if (typeof renderFeed === 'function') {
    renderFeed();
  }
  if (typeof renderTwoGroupsFeed === 'function') {
    renderTwoGroupsFeed();
  }
}

function showAnonymousToast(msg) {
  let toast = document.getElementById('anonymous-toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'anonymous-toast-msg';
    toast.className = 'anonymous-toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
