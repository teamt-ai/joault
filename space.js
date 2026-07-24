// Joault Space Feed & Interactive Card Box Implementation with Double-Tap Emoji Reactions

const postsData = [
  {
    id: 'post_1',
    author: { name: 'Kofi Mensah', handle: '@kofimensah', avatar: 'KM' },
    time: '1h',
    content: "Hot take: remote work didn't level the playing field — it just moved the gatekeeping online. If you don't have the right network, stable power, and a decent camera setup, you're still locked out of the conversation.",
    likes: 1240,
    commentsCount: 289,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🔥': 42, '❤️': 95, '🚀': 18 }
  },
  {
    id: 'post_2',
    author: { name: 'Zara Ahmed', handle: '@zara_talks', avatar: 'ZA' },
    time: '2h',
    content: "Just hit 10,000 users on our platform with zero paid marketing. Community-led growth is the most underrated strategy in B2C. Your early users are your best salespeople — treat them like it. Everything else flows from there.",
    likes: 1520,
    commentsCount: 312,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💯': 64, '👏': 38, '🔥': 52 }
  },
  {
    id: 'post_3',
    author: { name: 'Amara Nwosu', handle: '@amara_n', avatar: 'AN' },
    time: '3h',
    content: "The way African tech is growing right now is genuinely exciting. We're not just consumers anymore — we're building the infrastructure the whole continent will run on for the next 50 years. The talent pipeline is world-class and capital is finally following.",
    likes: 847,
    commentsCount: 134,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '❤️': 124, '💡': 35, '🚀': 41 }
  },
  {
    id: 'post_4',
    author: { name: 'Chidi Eze', handle: '@chidieze', avatar: 'CE' },
    time: '4h',
    content: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.",
    likes: 420,
    commentsCount: 88,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💡': 29, '👍': 44 }
  },
  {
    id: 'post_5',
    author: { name: 'Farouk Bello', handle: '@faroukb', avatar: 'FB' },
    time: '5h',
    content: "Why is tech education still lagging behind industry needs? Bootcamps teach frameworks, but companies need problem solvers who understand data structures and core system architecture.",
    likes: 610,
    commentsCount: 94,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🔥': 31, '💡': 58, '👏': 20 }
  },
  {
    id: 'post_6',
    author: { name: 'Nneka Adeleke', handle: '@nneka_a', avatar: 'NA' },
    time: '6h',
    content: "Building products for cross-border payments requires deep understanding of local regulation, fraud prevention, and currency volatility. It's tough but extremely rewarding work.",
    likes: 930,
    commentsCount: 175,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🚀': 88, '💯': 45, '❤️': 32 }
  },
  {
    id: 'post_7',
    author: { name: 'Tunde Ojo', handle: '@tunde_ojo', avatar: 'TO' },
    time: '7h',
    content: "Solar power paired with low-latency satellite internet is the single biggest productivity unlock for remote African software engineers this decade.",
    likes: 1120,
    commentsCount: 204,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '👍': 67, '🔥': 92, '🎉': 25 }
  },
  {
    id: 'post_8',
    author: { name: 'Grace Emeka', handle: '@grace_e', avatar: 'GE' },
    time: '8h',
    content: "UI/UX design is not just making screens pretty — it's removing friction, understanding human behavior, and creating delight in subtle everyday micro-interactions.",
    likes: 780,
    commentsCount: 112,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '❤️': 110, '👏': 54, '💡': 38 }
  },
  {
    id: 'post_9',
    author: { name: 'Yusuf Sani', handle: '@yusuf_s', avatar: 'YS' },
    time: '9h',
    content: "Open-source software needs more African contributors. We use these tools daily; contributing back builds global visibility and elite technical skills.",
    likes: 540,
    commentsCount: 76,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💡': 40, '🚀': 33, '💯': 29 }
  },
  {
    id: 'post_10',
    author: { name: 'DevKev', handle: '@devkev', avatar: 'DK' },
    time: '10h',
    content: "Refactoring legacy code is an act of empathy for your future teammates. Leave the codebase cleaner than you found it!",
    likes: 890,
    commentsCount: 145,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '😂': 25, '💯': 89, '👍': 40 }
  },
  {
    id: 'post_11',
    author: { name: 'Sara Mustapha', handle: '@sara_m', avatar: 'SM' },
    time: '11h',
    content: "Mentorship matters! One 30-minute coffee chat with a senior dev completely transformed how I approach backend architecture. Always pass on what you learn.",
    likes: 1350,
    commentsCount: 220,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '❤️': 142, '🎉': 60, '👏': 48 }
  },
  {
    id: 'post_12',
    author: { name: 'Paul Kalu', handle: '@paul_k', avatar: 'PK' },
    time: '12h',
    content: "AI tools won't replace engineers, but engineers who master AI workflows will easily outperform those who refuse to adapt.",
    likes: 1680,
    commentsCount: 310,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🔥': 76, '💯': 93, '🚀': 55 }
  },
  {
    id: 'post_13',
    author: { name: 'Linda Mbatha', handle: '@linda_m', avatar: 'LM' },
    time: '13h',
    content: "Building in public is terrifying at first, but the community feedback and accountability make it 10x faster to find product-market fit.",
    likes: 910,
    commentsCount: 160,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '👏': 82, '🚀': 50, '💡': 33 }
  },
  {
    id: 'post_14',
    author: { name: 'Samuel Okon', handle: '@samuel_o', avatar: 'SO' },
    time: '14h',
    content: "Mobile-first isn't optional when 92% of users access your web app on mid-range Android smartphones over mobile data. Optimize every kilobyte!",
    likes: 740,
    commentsCount: 105,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💡': 61, '👍': 48, '🔥': 29 }
  },
  {
    id: 'post_15',
    author: { name: 'Evelyn Wambui', handle: '@evelyn_w', avatar: 'EW' },
    time: '15h',
    content: "Celebrating our first major enterprise contract today! 2 years of relentless iteration, late nights, and zero shortcuts paying off. Keep building!",
    likes: 2100,
    commentsCount: 450,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🎉': 155, '❤️': 130, '🚀': 90 }
  },
  {
    id: 'post_16',
    author: { name: 'Michael Tadesse', handle: '@michael_t', avatar: 'MT' },
    time: '16h',
    content: "Database schema design decisions made on Day 1 will either scale effortlessly or haunt your engineering team on Day 300. Choose wisely.",
    likes: 670,
    commentsCount: 92,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '😂': 44, '🔥': 65, '💯': 38 }
  },
  {
    id: 'post_17',
    author: { name: 'Funke Akindele', handle: '@funke_a', avatar: 'FA' },
    time: '17h',
    content: "Great engineering leadership is about absorbing organizational chaos and handing clear, executable context to your team.",
    likes: 1290,
    commentsCount: 188,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💯': 118, '👏': 72, '❤️': 50 }
  },
  {
    id: 'post_18',
    author: { name: 'Kwame Baah', handle: '@kwame_b', avatar: 'KB' },
    time: '18h',
    content: "Decentralized finance and stablecoins are solving real remittance friction for diaspora families across West Africa right now.",
    likes: 850,
    commentsCount: 140,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🚀': 94, '💡': 37, '🔥': 40 }
  },
  {
    id: 'post_19',
    author: { name: 'Amina Bello', handle: '@amina_b', avatar: 'AB' },
    time: '19h',
    content: "Don't measure developer productivity by hours sitting in front of a IDE — measure it by problems solved and business value delivered.",
    likes: 1420,
    commentsCount: 215,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '🔥': 81, '👍': 90, '👏': 64 }
  },
  {
    id: 'post_20',
    author: { name: 'David Osei', handle: '@david_o', avatar: 'DO' },
    time: '20h',
    content: "Never compromise on user data privacy or encryption. User trust takes years to earn, seconds to break, and a lifetime to rebuild.",
    likes: 1890,
    commentsCount: 320,
    liked: false,
    viewState: 'default',
    commentsPage: 1,
    reactions: { '💯': 135, '❤️': 78, '💡': 42 }
  }
];

// Available Custom Website Emojis
const AVAILABLE_EMOJIS = ['❤️', '🔥', '👍', '👏', '🚀', '😂', '💡', '🎉', '💯'];

// Comments Database
const commentsDatabase = {
  post_1: [
    { id: 'c1', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'c2', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'c3', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'c4', author: 'Tunde O.', avatar: 'TO', time: '4h 10m', text: "Stable electricity alone determines whether an engineer can deliver or get fired.", likes: 92 },
    { id: 'c5', author: 'Sara M.', avatar: 'SM', time: '4h 25m', text: "Co-working hubs with backup power are helping, but infrastructure needs to catch up.", likes: 45 },
    { id: 'c6', author: 'DevKev', avatar: 'DK', time: '4h 30m', text: "Starlink and solar batteries are becoming essential dev gear nowadays.", likes: 112 },
    { id: 'c7', author: 'Nneka A.', avatar: 'NA', time: '4h 45m', text: "Spot on Kofi! Networking offline still plays a massive role in opening remote doors.", likes: 64 },
    { id: 'c8', author: 'Farouk B.', avatar: 'FB', time: '5h', text: "We need more decentralized remote hubs across smaller cities to level this out.", likes: 58 },
    { id: 'c9', author: 'Grace E.', avatar: 'GE', time: '5h 15m', text: "Camera setups are secondary compared to internet reliability IMO.", likes: 33 },
    { id: 'c10', author: 'Yusuf S.', avatar: 'YS', time: '5h 40m', text: "Great points all around. Infrastructure investment is key.", likes: 29 }
  ],
  post_3: [
    { id: 'c101', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'c102', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'c103', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'c104', author: 'Zara Ahmed', avatar: 'ZA', time: '4h 15m', text: "Infrastructure first, applications follow. We're at a pivotal moment.", likes: 63 }
  ]
};

// Fallback comments
postsData.forEach(p => {
  if (!commentsDatabase[p.id]) {
    commentsDatabase[p.id] = commentsDatabase.post_1;
  }
});

// DOM Elements & Observers
const feedPostsContainer = document.getElementById('feed-posts-container');
const composeCollapsed = document.getElementById('compose-collapsed');
const formCreatePost = document.getElementById('form-create-post');
const postTextarea = document.getElementById('post-textarea');
const btnCancelPost = document.getElementById('btn-cancel-post');
const postCharCount = document.getElementById('post-char-count');
const btnSpaceHelp = document.getElementById('btn-space-help');

let scrollObserver = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderFeed();
  setupComposer();
  setupScrollReactionObserver();
});

// Render Feed
function renderFeed() {
  feedPostsContainer.innerHTML = '';

  const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;
  const currentFeedData = isAnon ? anonymousPostsData : postsData;

  currentFeedData.forEach(post => {
    const cardBox = document.createElement('div');
    cardBox.className = 'post-card-box';
    cardBox.dataset.postId = post.id;

    if (post.viewState === 'reply') {
      cardBox.innerHTML = renderReplyView(post);
    } else if (post.viewState === 'comments') {
      cardBox.innerHTML = renderCommentsView(post);
    } else {
      cardBox.innerHTML = renderDefaultView(post);
    }

    feedPostsContainer.appendChild(cardBox);

    // Setup Double Tap Reaction & Swipe Gestures
    setupDoubleTapAndSwipe(cardBox, post);
  });

  // Re-observe all rendered cards for scroll-into-view emoji reaction popups
  setupScrollReactionObserver();
  if (typeof setupSecretStickerHotzones === 'function') {
    setupSecretStickerHotzones();
  }
}




// 1. DEFAULT POST VIEW HTML
function renderDefaultView(post) {
  const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;

  if (isAnon) {
    return `
      <div class="card-default-view">
        <div class="post-anon-header">
          <span class="anon-badge-pill">● Anonymous</span>
          <span class="post-time">${post.time}</span>
        </div>

        <div class="post-text-body">${escapeHtml(post.content)}</div>

        <div class="post-card-bottom-row">
          <div class="swipe-hints-inline">
            <span>💡 Double tap to react · Swipe right for comments</span>
          </div>
          <button type="button" class="btn-comments-corner" onclick="switchCardView('${post.id}', 'comments')">
            ${post.commentsCount} comments
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="card-default-view">
      <div class="post-author-row">
        <div class="avatar-circle-sm">${post.author.avatar}</div>
        <div class="author-meta">
          <span class="author-name">${escapeHtml(post.author.name)}</span>
          <span class="author-handle">${escapeHtml(post.author.handle)}</span>
          <span class="post-time">${post.time}</span>
        </div>
      </div>

      <div class="post-text-body">${escapeHtml(post.content)}</div>

      <div class="post-card-bottom-row">
        <div class="swipe-hints-inline">
          <span>💡 Double tap to react with custom emojis</span>
        </div>
        <button type="button" class="btn-comments-corner" onclick="switchCardView('${post.id}', 'comments')">
          ${post.commentsCount} comments
        </button>
      </div>
    </div>
  `;
}

// 2. REPLY VIEW HTML
function renderReplyView(post) {
  const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;
  const shortSnippet = post.content.length > 70 ? post.content.slice(0, 70) + '...' : post.content;

  if (isAnon) {
    return `
      <div class="card-reply-view">
        <div class="reply-header-bar">
          <span class="reply-title-text">ANONYMOUS REPLY</span>
          <button type="button" class="btn-close-view" onclick="switchCardView('${post.id}', 'default')">&times;</button>
        </div>

        <div class="quote-snippet-box">
          <div class="quote-meta">
            <span class="anon-badge-pill" style="font-size: 0.65rem;">● Anonymous</span>
            <span class="quote-time">${post.time}</span>
          </div>
          <p class="quote-text">${escapeHtml(shortSnippet)}</p>
        </div>

        <form onsubmit="submitReply(event, '${post.id}')" class="reply-input-box">
          <textarea id="reply-text-${post.id}" class="reply-textarea" placeholder="Write your anonymous reply..." rows="3" required></textarea>
        </form>

        <div class="reply-footer-row">
          <span class="char-count">280</span>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn-cancel-sm" onclick="switchCardView('${post.id}', 'default')">Cancel</button>
            <button type="button" class="btn-post-gold" onclick="triggerReplySubmit('${post.id}')">Post Reply</button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="card-reply-view">
      <div class="reply-header-bar">
        <span class="reply-title-text">REPLYING TO ${post.author.handle.toUpperCase()}</span>
        <button type="button" class="btn-close-view" onclick="switchCardView('${post.id}', 'default')">&times;</button>
      </div>

      <div class="quote-snippet-box">
        <div class="quote-meta">
          <div class="avatar-circle-sm" style="width: 1.5rem; height: 1.5rem; font-size: 0.65rem;">${post.author.avatar}</div>
          <span class="quote-author">${escapeHtml(post.author.name)}</span>
          <span class="quote-time">${post.time}</span>
        </div>
        <p class="quote-text">${escapeHtml(shortSnippet)}</p>
      </div>

      <form onsubmit="submitReply(event, '${post.id}')" class="reply-input-box">
        <div class="avatar-circle-sm" style="margin-top: 0.2rem;">AN</div>
        <textarea id="reply-text-${post.id}" class="reply-textarea" placeholder="Write your reply..." rows="3" required></textarea>
      </form>

      <div class="reply-footer-row">
        <span class="char-count">280</span>
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn-cancel-sm" onclick="switchCardView('${post.id}', 'default')">Cancel</button>
          <button type="button" class="btn-post-gold" onclick="triggerReplySubmit('${post.id}')">Post Reply</button>
        </div>
      </div>
    </div>
  `;
}

// 3. COMMENTS VIEW HTML
function renderCommentsView(post) {
  const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;
  const db = isAnon ? anonymousCommentsDatabase : commentsDatabase;
  const fallback = isAnon ? (anonymousCommentsDatabase.anon_post_1 || []) : (commentsDatabase.post_1 || []);
  const allComments = db[post.id] || fallback;
  const visibleCount = post.commentsPage * 8;

  const visibleComments = allComments.slice(0, visibleCount);
  const hasMore = visibleCount < allComments.length;

  let commentsHTML = visibleComments.map(c => {
    if (isAnon) {
      return `
        <div class="comment-item anonymous-comment">
          <div class="comment-content-meta">
            <div class="comment-author-line">
              <span class="anon-badge-pill" style="font-size: 0.65rem;">● Anonymous</span>
              <span class="comment-time">${c.time}</span>
            </div>
            <p class="comment-body">${escapeHtml(c.text)}</p>
            <button type="button" class="comment-like-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>${c.likes}</span>
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="comment-item">
        <div class="avatar-circle-sm" style="width: 1.875rem; height: 1.875rem; font-size: 0.75rem;">${c.avatar}</div>
        <div class="comment-content-meta">
          <div class="comment-author-line">
            <span class="comment-author">${escapeHtml(c.author)}</span>
            <span class="comment-time">${c.time}</span>
          </div>
          <p class="comment-body">${escapeHtml(c.text)}</p>
          <button type="button" class="comment-like-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>${c.likes}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="card-comments-view">
      <div class="comments-header-bar">
        <span class="comments-title-text">COMMENTS (${allComments.length})</span>
        <button type="button" class="btn-back-link" onclick="switchCardView('${post.id}', 'default')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Post</span>
        </button>
      </div>

      <div class="comments-list-box">
        ${commentsHTML}
      </div>

      ${hasMore ? `
        <button type="button" class="btn-load-more-comments" onclick="loadMoreComments('${post.id}')">
          Load 8 more comments
        </button>
      ` : ''}

      <div class="add-comment-row">
        <input type="text" id="input-comment-${post.id}" class="comment-input-field" placeholder="Add an anonymous reply...">
        <button type="button" class="btn-send-comment" onclick="addComment('${post.id}')" title="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;
}


// DOUBLE TAP DETECTOR & CUSTOM WEBSITE EMOJI PICKER + SWIPE GESTURES
function setupDoubleTapAndSwipe(cardElement, post) {
  let lastTapTime = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // 1. DESKTOP DOUBLE CLICK EVENT
  cardElement.addEventListener('dblclick', (e) => {
    if (e.target.closest('button, input, textarea, a, .emoji-picker-box')) return;
    openWebsiteEmojiPicker(cardElement, post);
  });

  // 2. TOUCH EVENTS (Touch Swipe + Mobile Double Tap)
  cardElement.addEventListener('touchstart', (e) => {
    if (e.target.closest('button, input, textarea, a, .emoji-picker-box')) return;
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
  }, { passive: true });

  cardElement.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) < 140) {
      cardElement.classList.add('swiping');
      cardElement.style.transform = `translateX(${deltaX * 0.45}px)`;
    }
  }, { passive: true });

  cardElement.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    cardElement.classList.remove('swiping');
    cardElement.style.transform = '';

    const deltaX = currentX - startX;
    const now = Date.now();

    // Check for swipe gesture
    if (deltaX > 45) {
      // Swipe Right -> Show Comments View (8 at a time)!
      switchCardView(post.id, 'comments');
    } else if (deltaX < -45) {
      // Swipe Left -> Show Reply View!
      switchCardView(post.id, 'reply');
    } else if (Math.abs(deltaX) < 10) {
      // Tap/Double-tap check
      if (now - lastTapTime < 300) {
        openWebsiteEmojiPicker(cardElement, post);
        lastTapTime = 0;
      } else {
        lastTapTime = now;
      }
    }
    startX = 0;
    currentX = 0;
  });

  // 3. MOUSE DRAG EVENTS (Desktop Browsers)
  cardElement.addEventListener('mousedown', (e) => {
    if (e.target.closest('button, input, textarea, a, .emoji-picker-box')) return;
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) < 140) {
      cardElement.classList.add('swiping');
      cardElement.style.transform = `translateX(${deltaX * 0.45}px)`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    cardElement.classList.remove('swiping');
    cardElement.style.transform = '';

    const deltaX = currentX - startX;
    if (deltaX > 45) {
      // Mouse Drag Right -> Show Comments View (8 at a time)!
      switchCardView(post.id, 'comments');
    } else if (deltaX < -45) {
      // Mouse Drag Left -> Show Reply View!
      switchCardView(post.id, 'reply');
    }
    startX = 0;
    currentX = 0;
  });
}


// Open Custom Website Emoji Reaction Bar
function openWebsiteEmojiPicker(cardElement, post) {
  const existingPicker = cardElement.querySelector('.emoji-picker-box');
  if (existingPicker) existingPicker.remove();

  const pickerBox = document.createElement('div');
  pickerBox.className = 'emoji-picker-box';

  AVAILABLE_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-option-btn';
    btn.textContent = emoji;
    btn.onclick = (e) => {
      e.stopPropagation();
      addEmojiReaction(post.id, emoji, cardElement);
      pickerBox.remove();
    };
    pickerBox.appendChild(btn);
  });

  cardElement.appendChild(pickerBox);

  // Auto-remove picker after 4 seconds if no selection made
  setTimeout(() => {
    if (pickerBox.parentNode) pickerBox.remove();
  }, 4000);
}

// Add Emoji Reaction & Trigger 3-Second Beautiful Floating Burst Animation
function addEmojiReaction(postId, emoji, cardElement) {
  const post = postsData.find(p => p.id === postId);
  if (!post) return;

  if (!post.reactions) post.reactions = {};
  post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;

  // Create 3-Second Animated Floating Burst Pop Up
  triggerFloatingEmojiBurst(cardElement, emoji, post.reactions[emoji]);
}

// 3-SECOND BEAUTIFUL ANIMATED FLOATING BURST
function triggerFloatingEmojiBurst(cardElement, emoji, count) {
  const burst = document.createElement('div');
  burst.className = 'floating-emoji-burst';
  burst.innerHTML = `
    <span class="burst-emoji">${emoji}</span>
    <span class="burst-count">${count}</span>
  `;

  cardElement.appendChild(burst);

  // Automatically vanishes after 3 seconds!
  setTimeout(() => {
    if (burst.parentNode) burst.remove();
  }, 3000);
}

// SCROLL-INTO-VIEW OBSERVER: Pops up sent emojis for 3 seconds when message reaches middle of screen!
function setupScrollReactionObserver() {
  if (!('IntersectionObserver' in window)) return;

  if (scrollObserver) scrollObserver.disconnect();

  scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const cardBox = entry.target;
      const postId = cardBox.dataset.postId;
      const post = postsData.find(p => p.id === postId);

      if (entry.isIntersecting) {
        if (post && post.reactions && Object.keys(post.reactions).length > 0) {
          if (!cardBox.querySelector('.scroll-reaction-popup')) {
            showScrollReactionPopup(cardBox, post.reactions);
          }
        }
      } else {
        const existing = cardBox.querySelector('.scroll-reaction-popup');
        if (existing) existing.remove();
      }
    });
  }, { rootMargin: '-35% 0px -35% 0px', threshold: 0.1 });

  const cardBoxes = document.querySelectorAll('.post-card-box');
  cardBoxes.forEach(card => scrollObserver.observe(card));
}


// Show 3-Second Floating Reaction Strip when scrolling into view
function showScrollReactionPopup(cardBox, reactions) {
  const existing = cardBox.querySelector('.scroll-reaction-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.className = 'scroll-reaction-popup';

  const tagsHTML = Object.entries(reactions).map(([emoji, count]) => `
    <span class="scroll-emoji-tag">${emoji} ${count}</span>
  `).join('');

  popup.innerHTML = tagsHTML;
  cardBox.appendChild(popup);

  // Vanishes after 3 seconds!
  setTimeout(() => {
    if (popup.parentNode) popup.remove();
  }, 3000);
}



function getActivePostsDataset() {
  const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;
  return isAnon ? anonymousPostsData : postsData;
}

function getActiveCommentsDB() {
  const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;
  return isAnon ? anonymousCommentsDatabase : commentsDatabase;
}

// Switch Card View
function switchCardView(postId, targetView) {
  const dataset = getActivePostsDataset();
  const p = dataset.find(item => item.id === postId);
  if (p) {
    p.viewState = targetView;
    renderFeed();
  }
}

// Load 8 More Comments
function loadMoreComments(postId) {
  const dataset = getActivePostsDataset();
  const p = dataset.find(item => item.id === postId);
  if (p) {
    p.commentsPage += 1;
    renderFeed();
  }
}

// Submit Reply
function triggerReplySubmit(postId) {
  const textarea = document.getElementById(`reply-text-${postId}`);
  if (textarea && textarea.value.trim()) {
    submitReplyInternal(postId, textarea.value.trim());
  }
}

function submitReply(e, postId) {
  e.preventDefault();
  const textarea = document.getElementById(`reply-text-${postId}`);
  if (textarea && textarea.value.trim()) {
    submitReplyInternal(postId, textarea.value.trim());
  }
}

function submitReplyInternal(postId, replyText) {
  const dataset = getActivePostsDataset();
  const db = getActiveCommentsDB();
  const p = dataset.find(item => item.id === postId);
  if (p) {
    if (!db[postId]) db[postId] = [];
    db[postId].unshift({
      id: 'c_' + Date.now(),
      author: 'Anonymous',
      avatar: 'AN',
      time: 'Just now',
      text: replyText,
      likes: 1
    });

    p.commentsCount += 1;
    p.viewState = 'comments';
    renderFeed();
  }
}

function addComment(postId) {
  const input = document.getElementById(`input-comment-${postId}`);
  if (input && input.value.trim()) {
    submitReplyInternal(postId, input.value.trim());
  }
}


// Setup Composer
function setupComposer() {
  composeCollapsed.addEventListener('click', () => {
    composeCollapsed.classList.add('hidden');
    formCreatePost.classList.remove('hidden');
    postTextarea.focus();
  });

  btnCancelPost.addEventListener('click', () => {
    formCreatePost.classList.add('hidden');
    composeCollapsed.classList.remove('hidden');
    postTextarea.value = '';
  });

  postTextarea.addEventListener('input', () => {
    const len = postTextarea.value.length;
    postCharCount.textContent = 280 - len;
  });

  formCreatePost.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = postTextarea.value.trim();
    if (!text) return;

    const isAnon = typeof isAnonymousNightModeActive !== 'undefined' && isAnonymousNightModeActive;

    const newPost = {
      id: isAnon ? 'anon_post_' + Date.now() : 'post_' + Date.now(),
      author: { name: 'Amara Nwosu', handle: '@amara_n', avatar: 'AN' },
      time: 'Just now',
      content: text,
      likes: 1,
      commentsCount: 0,
      liked: true,
      viewState: 'default',
      commentsPage: 1,
      reactions: {}
    };

    if (isAnon) {
      anonymousPostsData.unshift(newPost);
      anonymousCommentsDatabase[newPost.id] = [];
    } else {
      postsData.unshift(newPost);
      commentsDatabase[newPost.id] = [];
    }

    postTextarea.value = '';
    formCreatePost.classList.add('hidden');
    composeCollapsed.classList.remove('hidden');

    renderFeed();
  });
}


// Help Alert
btnSpaceHelp.addEventListener('click', () => {
  alert('Joault Space Feed Help:\n\n• Double tap any message box to open custom website emoji reactions!\n• Emojis pop up floating on screen for 3 seconds then vanish.\n• When scrolling to a message, reaction numbers pop up on screen for 3 seconds.\n• Swipe Right to view all comments 8 at a time.');
});

// Helpers
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
