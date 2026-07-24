/* JOAULT ANONYMOUS NIGHT MODE MODULE & DEDICATED ANONYMOUS FEED DATABASE */

let isAnonymousNightModeActive = localStorage.getItem('joault_anonymous_mode') === 'true';

// DEDICATED ANONYMOUS FEED FOR SINGLE SPACE (space.html)
const anonymousPostsData = [
  {
    id: 'anon_post_1',
    time: '25m ago',
    content: "Honestly, our engineering team is ignoring tech debt in the authentication microservice. If we don't refactor by Q3, we will face an emergency outage. Posting here anonymously so leadership addresses it safely.",
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
