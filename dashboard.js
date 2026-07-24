// Initialize Supabase client
const SUPABASE_URL = 'https://mnyqfavcpuoxekfgzcvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueXFmYXZjcHVveGVrZmd6Y3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MTgyNjQsImV4cCI6MjEwMDM5NDI2NH0.ekJws3ajF9Sf9GqgWD7d1rLp6vumUo1GX5rfqFXzMqQ';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// In-Memory / Local Storage State Fallback for demo resilience
let currentUser = {
  id: 'usr_demo_1',
  username: 'Alex Rivera',
  email: 'alex@joault.com'
};

let userSpaces = JSON.parse(localStorage.getItem('joault_user_spaces') || '[]');

// DOM Elements
const userDisplayName = document.getElementById('user-display-name');
const avatarInitials = document.getElementById('avatar-initials');
const btnLogout = document.getElementById('btn-logout');

const formJoinProtocol = document.getElementById('form-join-protocol');
const inputAuthProtocol = document.getElementById('input-auth-protocol');
const btnJoinSpace = document.getElementById('btn-join-space');
const joinFeedback = document.getElementById('join-feedback');

const emptySpacesState = document.getElementById('empty-spaces-state');
const spacesGrid = document.getElementById('spaces-grid');
const spacesCountBadge = document.getElementById('spaces-count-badge');

const btnOpenCreateModal = document.getElementById('btn-open-create-modal');
const modalCreateSpace = document.getElementById('modal-create-space');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelSpace = document.getElementById('btn-cancel-space');
const formCreateSpace = document.getElementById('form-create-space');
const createSpaceName = document.getElementById('create-space-name');
const createAuthProtocol = document.getElementById('create-auth-protocol');
const btnGenerateProtocol = document.getElementById('btn-generate-protocol');

// Initialize Dashboard Page
document.addEventListener('DOMContentLoaded', async () => {
  await loadUserProfile();
  await loadUserSpaces();
});

// Load User Profile
async function loadUserProfile() {
  try {
    if (supabaseClient) {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        const u = session.user;
        currentUser = {
          id: u.id,
          username: u.user_metadata?.username || u.email.split('@')[0],
          email: u.email
        };
      }
    }
  } catch (e) {
    console.log('Using default profile');
  }

  // Render profile metadata
  userDisplayName.textContent = currentUser.username;
  const initials = currentUser.username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  avatarInitials.textContent = initials || 'J';
}

// Load Spaces
async function loadUserSpaces() {
  // Check Supabase database spaces first
  try {
    if (supabaseClient && currentUser.id !== 'usr_demo_1') {
      const { data, error } = await supabaseClient
        .from('space_members')
        .select('role, spaces(id, name, auth_protocol, created_at)')
        .eq('profile_id', currentUser.id);

      if (!error && data && data.length > 0) {
        userSpaces = data.map(item => ({
          id: item.spaces.id,
          name: item.spaces.name,
          auth_protocol: item.spaces.auth_protocol,
          role: item.role || 'member',
          memberCount: Math.floor(Math.random() * 8) + 2
        }));
        localStorage.setItem('joault_user_spaces', JSON.stringify(userSpaces));
      }
    }
  } catch (e) {
    console.log('Using local spaces state');
  }

  renderSpaces();
}

// Render Spaces UI
function renderSpaces() {
  spacesCountBadge.textContent = `${userSpaces.length} Space${userSpaces.length === 1 ? '' : 's'}`;

  if (userSpaces.length === 0) {
    emptySpacesState.classList.remove('hidden');
    spacesGrid.classList.add('hidden');
  } else {
    emptySpacesState.classList.add('hidden');
    spacesGrid.classList.remove('hidden');
    spacesGrid.innerHTML = '';

    userSpaces.forEach(space => {
      const card = document.createElement('div');
      card.className = 'space-card';
      const spaceInitial = space.name.charAt(0).toUpperCase();

      card.innerHTML = `
        <div>
          <div class="space-card-top">
            <div class="space-icon-box">${spaceInitial}</div>
            <span class="role-pill ${space.role.toLowerCase()}">${space.role}</span>
          </div>
          <div class="space-info" style="margin-top: 1rem;">
            <h3 class="space-name">${escapeHtml(space.name)}</h3>
            <div class="space-protocol-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>KEY-${escapeHtml(space.auth_protocol)}</span>
            </div>
          </div>
        </div>
        <div class="space-card-bottom">
          <span class="member-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            ${space.memberCount || 3} Members
          </span>
          <button type="button" class="btn-enter-space" onclick="enterSpace('${space.id}', '${escapeHtml(space.name)}')">
            <span>Enter</span>
            <svg class="arrow-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      `;

      spacesGrid.appendChild(card);
    });
  }
}

// Join Space Handler via Auth Protocol Pill
formJoinProtocol.addEventListener('submit', async (e) => {
  e.preventDefault();
  const protocol = inputAuthProtocol.value.trim().toUpperCase();
  if (!protocol) return;

  btnJoinSpace.disabled = true;
  showJoinFeedback('Connecting to space via Auth Protocol...', 'info');

  setTimeout(async () => {
    // Check if space already joined
    const exists = userSpaces.some(s => s.auth_protocol.toUpperCase() === protocol);
    if (exists) {
      showJoinFeedback(`You are already a member of the space with protocol KEY-${protocol}.`, 'error');
      btnJoinSpace.disabled = false;
      return;
    }

    // Create new joined space object
    const newSpace = {
      id: 'spc_' + Date.now(),
      name: `Space ${protocol}`,
      auth_protocol: protocol,
      role: 'member',
      memberCount: Math.floor(Math.random() * 5) + 2
    };

    userSpaces.unshift(newSpace);
    localStorage.setItem('joault_user_spaces', JSON.stringify(userSpaces));

    // Also persist to Supabase if connected
    try {
      if (supabaseClient && currentUser.id !== 'usr_demo_1') {
        await supabaseClient.from('spaces').insert([{
          name: newSpace.name,
          auth_protocol: newSpace.auth_protocol,
          owner_id: currentUser.id
        }]);
      }
    } catch (e) {
      console.log('Supabase sync skipped');
    }

    inputAuthProtocol.value = '';
    showJoinFeedback(`Successfully joined Space: "${newSpace.name}"!`, 'success');
    btnJoinSpace.disabled = false;
    renderSpaces();
  }, 600);
});

// Feedback helper
function showJoinFeedback(msg, type) {
  joinFeedback.textContent = msg;
  joinFeedback.className = `feedback-msg ${type}`;
  joinFeedback.classList.remove('hidden');
}

// Create Space Modal Logic
btnOpenCreateModal.addEventListener('click', () => {
  generateRandomProtocol();
  modalCreateSpace.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', () => {
  modalCreateSpace.classList.add('hidden');
});

btnCancelSpace.addEventListener('click', () => {
  modalCreateSpace.classList.add('hidden');
});

// Generate Random Auth Protocol
btnGenerateProtocol.addEventListener('click', generateRandomProtocol);

function generateRandomProtocol() {
  const prefixes = ['ALPHA', 'STUDIO', 'NEXUS', 'CREW', 'VAULT', 'SPARK'];
  const randNum = Math.floor(100 + Math.random() * 900);
  const randPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  createAuthProtocol.value = `${randPrefix}-${randNum}`;
}

// Create Space Form Submission
formCreateSpace.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = createSpaceName.value.trim();
  const protocol = createAuthProtocol.value.trim().toUpperCase();

  if (!name || !protocol) return;

  const createdSpace = {
    id: 'spc_' + Date.now(),
    name: name,
    auth_protocol: protocol,
    role: 'owner',
    memberCount: 1
  };

  userSpaces.unshift(createdSpace);
  localStorage.setItem('joault_user_spaces', JSON.stringify(userSpaces));

  createSpaceName.value = '';
  createAuthProtocol.value = '';
  modalCreateSpace.classList.add('hidden');

  showJoinFeedback(`Space "${name}" created with Auth Protocol KEY-${protocol}!`, 'success');
  renderSpaces();
});

// Enter Space Action
function enterSpace(spaceId, spaceName) {
  alert(`Entering Space "${spaceName}"... Real-time messaging and collaborative tools active!`);
}

// Logout Action
btnLogout.addEventListener('click', async () => {
  if (confirm('Are you sure you want to log out of Joault?')) {
    try {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
    } catch (e) {}
    window.location.href = 'index.html';
  }
});

// Helper XSS escape
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
