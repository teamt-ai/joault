/* JOAULT ANONYMOUS NIGHT MODE MODULE & DEDICATED ANONYMOUS FEED DATABASE */

let isAnonymousNightModeActive = localStorage.getItem('joault_anonymous_mode') === 'true';

// ATTACHMENT DRAFT STATE
let currentAttachedLink = null;
let currentAttachedImages = [];

// DEDICATED ANONYMOUS FEED FOR SINGLE SPACE (space.html)
const anonymousPostsData = [
  {
    id: 'anon_post_1',
    time: '25m ago',
    content: "Honestly, our engineering team is ignoring tech debt in the authentication microservice. If we don't refactor by Q3, we will face an emergency outage. Posting here anonymously so leadership addresses it safely.",
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80'
    ],
    likes: 124,
    commentsCount: 38,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🔥': 42, '💯': 29, '💡': 18 }
  },
  {
    id: 'anon_post_2',
    time: '1h ago',
    content: "Salary benchmarks in our tech ecosystem feel severely behind remote European contracts. Is anyone else willing to share compensation anonymously to establish fair pay standards?",
    link: 'https://github.com/teamt-ai/joault',
    likes: 198,
    commentsCount: 64,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '❤️': 85, '👍': 44, '🚀': 30 }
  },
  {
    id: 'anon_post_3',
    time: '3h ago',
    content: "Unfiltered feedback: 70% of weekly sync calls could be 2-minute text updates. We need to protect deep work time for dev flow.",
    images: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80'
    ],
    likes: 270,
    commentsCount: 92,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '👏': 110, '🔥': 75, '💯': 58 }
  },
  {
    id: 'anon_post_4',
    time: '5h ago',
    content: "I'm working on an open-source privacy protocol. Seeking anonymous beta testers who care about encrypted data ownership.",
    likes: 115,
    commentsCount: 22,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💡': 35, '🚀': 40 }
  }
];

// DEDICATED ANONYMOUS FEED FOR DUAL GROUPS (twogroups.html)
const anonymousTwogroupsPostsData = [
  {
    id: 'anon_tg_1',
    time: '35m ago',
    teamKey: 'team-a',
    content: "Cross-functional friction: Feature specs are being built without consulting engineering constraints. We need open anonymous alignment before sprint planning.",
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80'
    ],
    likes: 145,
    commentsCount: 42,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1,
    reactions: { '🔥': 52, '💯': 38, '💡': 24 }
  },
  {
    id: 'anon_tg_2',
    time: '2h ago',
    teamKey: 'team-b',
    content: "Both teams are working on duplicate API endpoints. Let's merge our schema definitions into a single repository to avoid wasted work.",
    link: 'https://github.com/teamt-ai/joault',
    likes: 210,
    commentsCount: 58,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1,
    reactions: { '🚀': 78, '👏': 45, '👍': 36 }
  }
];

// ANONYMOUS COMMENTS DATABASE
const anonymousCommentsDatabase = {
  anon_post_1: [
    { id: 'ac1', time: '18m ago', text: "100% agree! Auth latency spikes during peak hours have been worrying me too.", likes: 32 },
    { id: 'ac2', time: '12m ago', text: "Thank you for posting this anonymously. Refactoring must be scheduled.", likes: 21 },
    { id: 'ac3', time: '5m ago', text: "We should present a unified refactoring plan next sprint.", likes: 15 }
  ],
  anon_post_2: [
    { id: 'ac10', time: '45m ago', text: "Count me in! Anonymous salary transparency benefits all engineers.", likes: 48 },
    { id: 'ac11', time: '20m ago', text: "Agreed. Market rates have moved significantly in 2026.", likes: 36 }
  ],
  anon_tg_1: [
    { id: 'atg1', time: '22m ago', teamKey: 'team-b', text: "Fully support this! We need early design input to prevent rewrites.", likes: 39 },
    { id: 'atg2', time: '10m ago', teamKey: 'team-a', text: "Let's use this anonymous channel to align on API contracts weekly.", likes: 27 }
  ]
};

// Fallbacks for anonymous comments
anonymousPostsData.forEach(p => {
  if (!anonymousCommentsDatabase[p.id]) {
    anonymousCommentsDatabase[p.id] = anonymousCommentsDatabase.anon_post_1;
  }
});

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  applyAnonymousModeDOMState();
  setupFileInputHandler();
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
    showAnonymousToast("🔒 Switched to Dedicated Anonymous Feed — Speak Freely");
  } else {
    showAnonymousToast("☀️ Switched to Standard Group Feed");
  }

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

/* GLOBAL LIGHTBOX MODAL HANDLERS FOR FULL-SIZE IMAGE PREVIEW */
function openLightboxModal(imgUrl) {
  const modal = document.getElementById('image-lightbox-modal');
  const img = document.getElementById('lightbox-full-img');
  if (modal && img) {
    img.src = imgUrl;
    modal.classList.remove('hidden');
  }
}

function closeLightboxModal(event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('image-lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/* ATTACHMENT ACTION TRIGGER HELPERS */
function triggerImagePicker() {
  const composeCollapsed = document.getElementById('compose-collapsed');
  const formCreatePost = document.getElementById('form-create-post');
  if (composeCollapsed && formCreatePost) {
    composeCollapsed.classList.add('hidden');
    formCreatePost.classList.remove('hidden');
  }
  const fileInput = document.getElementById('post-image-file-input');
  if (fileInput) fileInput.click();
}

function triggerLinkPicker() {
  const composeCollapsed = document.getElementById('compose-collapsed');
  const formCreatePost = document.getElementById('form-create-post');
  if (composeCollapsed && formCreatePost) {
    composeCollapsed.classList.add('hidden');
    formCreatePost.classList.remove('hidden');
  }
  promptAddLinkAttachment();
}

/* LINK ATTACHMENT PROMPT HELPER */
function promptAddLinkAttachment() {
  const url = prompt("Enter website or document link (URL):", "https://");
  if (url && url.trim() && url !== "https://") {
    currentAttachedLink = url.trim();
    renderAttachmentTray();
    showAnonymousToast("🔗 Link attached to post");
  }
}

function removeAttachedLink() {
  currentAttachedLink = null;
  renderAttachmentTray();
}

function removeAttachedImage(index) {
  currentAttachedImages.splice(index, 1);
  renderAttachmentTray();
}

function renderAttachmentTray() {
  const tray = document.getElementById('attachment-preview-tray');
  if (!tray) return;

  if (currentAttachedImages.length === 0 && !currentAttachedLink) {
    tray.classList.add('hidden');
    tray.innerHTML = '';
    return;
  }

  tray.classList.remove('hidden');
  let html = '';

  currentAttachedImages.forEach((imgSrc, idx) => {
    html += `
      <div class="preview-thumb-box">
        <img src="${imgSrc}" alt="Thumbnail">
        <button type="button" class="preview-thumb-remove" onclick="removeAttachedImage(${idx})" title="Remove image">&times;</button>
      </div>
    `;
  });

  if (currentAttachedLink) {
    html += `
      <div class="preview-link-box">
        <span>🔗 ${escapeHtml(currentAttachedLink)}</span>
        <button type="button" class="preview-thumb-remove" onclick="removeAttachedLink()" title="Remove link">&times;</button>
      </div>
    `;
  }

  tray.innerHTML = html;
}

// SETUP FILE INPUT DELEGATED LISTENER WITH VIDEO REJECTION VALIDATOR
document.addEventListener('change', (e) => {
  if (e.target && e.target.id === 'post-image-file-input') {
    handleImageFileSelect(e);
  }
});

function setupFileInputHandler() {
  const fileInput = document.getElementById('post-image-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageFileSelect);
  }
}

function handleImageFileSelect(e) {
  const files = Array.from(e.target.files);
  if (!files || files.length === 0) return;

  let rejectedVideosCount = 0;
  let processedCount = 0;

  files.forEach(file => {
    if (file.type.startsWith('video/')) {
      rejectedVideosCount++;
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentAttachedImages.push(event.target.result);
        renderAttachmentTray();
        processedCount++;
        if (processedCount === files.length - rejectedVideosCount) {
          showAnonymousToast(`📸 Attached ${processedCount} image(s)`);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  if (rejectedVideosCount > 0) {
    showAnonymousToast("⚠️ Video uploads are not supported. Only images and links can be attached.");
  }
  e.target.value = '';
}

