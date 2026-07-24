// Initialize Supabase client
const SUPABASE_URL = 'https://mnyqfavcpuoxekfgzcvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueXFmYXZjcHVveGVrZmd6Y3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MTgyNjQsImV4cCI6MjEwMDM5NDI2NH0.ekJws3ajF9Sf9GqgWD7d1rLp6vumUo1GX5rfqFXzMqQ';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// DOM Element References
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const groupUsername = document.getElementById('group-username');
const inputUsername = document.getElementById('input-username');
const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');
const btnSubmitText = document.getElementById('btn-submit-text');
const btnSubmit = document.getElementById('btn-submit');
const toggleAccountPrompt = document.getElementById('toggle-account-prompt');
const linkToggleMode = document.getElementById('link-toggle-mode');
const btnTogglePassword = document.getElementById('btn-toggle-password');
const btnForgotPassword = document.getElementById('btn-forgot-password');
const btnGoogle = document.getElementById('btn-google');
const btnHelp = document.getElementById('btn-help');
const errorBox = document.getElementById('error-box');
const errorMessage = document.getElementById('error-message');
const authForm = document.getElementById('auth-form');

// State
let currentMode = 'login'; // 'login' or 'signup'
let isPasswordVisible = false;

// Helper: Show Error
function showError(msg) {
  if (!msg) {
    errorBox.classList.add('hidden');
    return;
  }
  errorMessage.textContent = msg;
  errorBox.classList.remove('hidden');
}

// Switch Mode (Log in vs Create account)
function setAuthMode(mode) {
  currentMode = mode;
  showError(null);

  if (mode === 'login') {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    formTitle.textContent = 'Welcome back';
    formSubtitle.textContent = 'Sign in to access your spaces.';
    groupUsername.classList.add('hidden');
    inputUsername.removeAttribute('required');
    btnSubmitText.textContent = 'Log in to Joault';
    btnForgotPassword.classList.remove('hidden');
    toggleAccountPrompt.innerHTML = 'Don\'t have an account? <button type="button" id="link-toggle-mode" class="link-action">Create one</button>';
  } else {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    formTitle.textContent = 'Create an account';
    formSubtitle.textContent = 'Sign up to create and join your spaces.';
    groupUsername.classList.remove('hidden');
    inputUsername.setAttribute('required', 'true');
    btnSubmitText.textContent = 'Create Joault Account';
    btnForgotPassword.classList.add('hidden');
    toggleAccountPrompt.innerHTML = 'Already have an account? <button type="button" id="link-toggle-mode" class="link-action">Log in</button>';
  }

  // Re-bind the toggle mode link since innerHTML changed
  document.getElementById('link-toggle-mode').addEventListener('click', () => {
    setAuthMode(currentMode === 'login' ? 'signup' : 'login');
  });
}

// Tab Click Handlers
tabLogin.addEventListener('click', () => setAuthMode('login'));
tabSignup.addEventListener('click', () => setAuthMode('signup'));

// Re-bind initial toggle mode link
if (linkToggleMode) {
  linkToggleMode.addEventListener('click', () => {
    setAuthMode(currentMode === 'login' ? 'signup' : 'login');
  });
}

// Password Visibility Toggle
btnTogglePassword.addEventListener('click', () => {
  isPasswordVisible = !isPasswordVisible;
  inputPassword.type = isPasswordVisible ? 'text' : 'password';
});

// Forgot Password Handler
btnForgotPassword.addEventListener('click', () => {
  showError('Password reset instructions have been sent if an account exists for this email.');
});

// Google Sign-In Demo Handler
btnGoogle.addEventListener('click', async () => {
  showError(null);
  btnGoogle.disabled = true;
  btnGoogle.style.opacity = '0.7';

  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } else {
      alert('Google Sign-In initialized in demo mode.');
    }
  } catch (err) {
    showError(err.message || 'Google Authentication failed.');
  } finally {
    btnGoogle.disabled = false;
    btnGoogle.style.opacity = '1';
  }
});

// Auth Form Submit Handler
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError(null);

  const email = inputEmail.value.trim();
  const password = inputPassword.value;
  const username = inputUsername.value.trim();

  if (!email || !password) {
    showError('Please fill in all required fields.');
    return;
  }

  btnSubmit.disabled = true;
  btnSubmitText.textContent = currentMode === 'login' ? 'Logging in...' : 'Creating account...';

  try {
    if (supabaseClient) {
      if (currentMode === 'signup') {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { username: username || email.split('@')[0] }
          }
        });
        if (error) throw error;
        alert('Account created successfully! Redirecting to your dashboard...');
        window.location.href = 'dashboard.html';
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (error) throw error;
        window.location.href = 'dashboard.html';
      }
    } else {
      // Fallback demo behavior
      window.location.href = 'dashboard.html';
    }

  } catch (err) {
    showError(err.message || 'Authentication failed. Please check your credentials.');
  } finally {
    btnSubmit.disabled = false;
    btnSubmitText.textContent = currentMode === 'login' ? 'Log in to Joault' : 'Create Joault Account';
  }
});

// Floating Help Button
btnHelp.addEventListener('click', () => {
  alert('Joault Auth Help: Sign in with your email or Google account to access your collaborative spaces.');
});
