/* JOAULT SUPABASE AUTHENTICATION MODULE & EXECUTIVE AUTH MODAL */

const SUPABASE_URL = "https://mnyqfavcpuoxekfgzcvn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueXFmYXZjcHVveGVrZmd6Y3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MTgyNjQsImV4cCI6MjEwMDM5NDI2NH0.ekJws3ajF9Sf9GqgWD7d1rLp6vumUo1GX5rfqFXzMqQ";

let supabaseClient = null;
let currentJoaultUser = null;

if (typeof window !== 'undefined' && window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthSession();
  injectAuthModalDOM();
});

async function initAuthSession() {
  if (!supabaseClient) return;

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
      currentJoaultUser = session.user;
      updateAuthUIState(true, session.user);
    } else {
      updateAuthUIState(false, null);
    }

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        currentJoaultUser = session.user;
        updateAuthUIState(true, session.user);
      } else {
        currentJoaultUser = null;
        updateAuthUIState(false, null);
      }
    });
  } catch (err) {
    console.warn("Supabase Auth initialization notice:", err);
  }
}

function updateAuthUIState(isLoggedIn, user) {
  const userAvatars = document.querySelectorAll('.avatar-circle-sm, .user-avatar-pill span');
  const userNames = document.querySelectorAll('.user-name-text');

  if (isLoggedIn && user) {
    const initials = getInitials(user.user_metadata?.full_name || user.email || 'User');
    userAvatars.forEach(el => {
      el.textContent = initials;
    });
    userNames.forEach(el => {
      el.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
    });
  }
}

function getInitials(name) {
  if (!name) return 'JU';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function injectAuthModalDOM() {
  if (document.getElementById('joault-auth-modal')) return;

  const modalHTML = `
    <div id="joault-auth-modal" class="auth-modal-overlay hidden" onclick="closeAuthModal(event)">
      <div class="auth-card-box" onclick="event.stopPropagation()">
        <span class="auth-close-btn" onclick="closeAuthModal(event)">&times;</span>
        
        <div class="auth-header">
          <div class="auth-brand-logo">J</div>
          <h2 id="auth-modal-title" class="auth-title">Welcome to Joault</h2>
          <p id="auth-modal-subtitle" class="auth-subtitle">Sign in to join connected spaces and dual-group channels</p>
        </div>

        <form id="auth-form" onsubmit="handleAuthSubmit(event)">
          <div id="auth-name-field-group" class="auth-field-group hidden">
            <label class="auth-label">Full Name</label>
            <input type="text" id="auth-input-fullname" class="auth-input" placeholder="e.g. Amara Nwosu">
          </div>

          <div class="auth-field-group">
            <label class="auth-label">Email Address</label>
            <input type="email" id="auth-input-email" class="auth-input" placeholder="name@company.com" required>
          </div>

          <div class="auth-field-group">
            <label class="auth-label">Password</label>
            <input type="password" id="auth-input-password" class="auth-input" placeholder="••••••••" required minlength="6">
          </div>

          <button type="submit" id="auth-submit-btn" class="auth-primary-btn">Sign In</button>
        </form>

        <div class="auth-footer-toggle">
          <span id="auth-toggle-text">Don't have an account?</span>
          <button type="button" id="auth-toggle-btn" class="auth-link-btn" onclick="toggleAuthMode()">Sign Up</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

let isSignUpMode = false;

function openAuthModal(mode = 'signin') {
  const modal = document.getElementById('joault-auth-modal');
  if (!modal) return;

  isSignUpMode = mode === 'signup';
  updateAuthModalFormUI();
  modal.classList.remove('hidden');
}

function closeAuthModal(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('joault-auth-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  updateAuthModalFormUI();
}

function updateAuthModalFormUI() {
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('auth-modal-subtitle');
  const nameField = document.getElementById('auth-name-field-group');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleText = document.getElementById('auth-toggle-text');
  const toggleBtn = document.getElementById('auth-toggle-btn');

  if (isSignUpMode) {
    if (title) title.textContent = "Create Your Account";
    if (subtitle) subtitle.textContent = "Join Joault to collaborate openly and anonymously";
    if (nameField) nameField.classList.remove('hidden');
    if (submitBtn) submitBtn.textContent = "Create Account";
    if (toggleText) toggleText.textContent = "Already have an account?";
    if (toggleBtn) toggleBtn.textContent = "Sign In";
  } else {
    if (title) title.textContent = "Welcome to Joault";
    if (subtitle) subtitle.textContent = "Sign in to join connected spaces and dual-group channels";
    if (nameField) nameField.classList.add('hidden');
    if (submitBtn) submitBtn.textContent = "Sign In";
    if (toggleText) toggleText.textContent = "Don't have an account?";
    if (toggleBtn) toggleBtn.textContent = "Sign Up";
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('auth-input-email').value.trim();
  const password = document.getElementById('auth-input-password').value.trim();
  const fullName = document.getElementById('auth-input-fullname')?.value.trim();

  if (!supabaseClient) {
    showAnonymousToast("⚠️ Supabase authentication client connecting...");
    closeAuthModal();
    return;
  }

  const submitBtn = document.getElementById('auth-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = isSignUpMode ? "Creating Account..." : "Signing In...";

  try {
    if (isSignUpMode) {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0]
          }
        }
      });
      if (error) throw error;

      if (data.user) {
        // Insert profile
        await supabaseClient.from('profiles').upsert({
          id: data.user.id,
          email: email,
          username: (fullName || email.split('@')[0]).toLowerCase().replace(/\s+/g, '_'),
          updated_at: new Date().toISOString()
        });
      }

      showAnonymousToast("🎉 Account created successfully! Signed in as " + (fullName || email));
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      showAnonymousToast("👋 Welcome back to Joault!");
    }

    closeAuthModal();
  } catch (err) {
    showAnonymousToast("⚠️ Auth Error: " + (err.message || "Failed to authenticate"));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isSignUpMode ? "Create Account" : "Sign In";
  }
}

async function signOutJoaultUser() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
    showAnonymousToast("👋 Signed out successfully");
    updateAuthUIState(false, null);
  }
}
