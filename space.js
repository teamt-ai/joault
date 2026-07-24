// Joault Space Feed & Interactive Card Box Implementation

// Initial Sample Posts Data (matching user's design screenshots)
const postsData = [
  {
    id: 'post_1',
    author: { name: 'Kofi Mensah', handle: '@kofimensah', avatar: 'KM' },
    time: '4h',
    content: "Hot take: remote work didn't level the playing field — it just moved the gatekeeping online. If you don't have the right network, stable power, and a decent camera setup, you're still locked out of the conversation.",
    likes: 1240,
    commentsCount: 289,
    liked: false,
    viewState: 'default', // 'default' | 'reply' | 'comments'
    commentsPage: 1
  },
  {
    id: 'post_2',
    author: { name: 'Zara Ahmed', handle: '@zara_talks', avatar: 'ZA' },
    time: '6h',
    content: "Just hit 10,000 users on our platform with zero paid marketing. Community-led growth is the most underrated strategy in B2C. Your early users are your best salespeople — treat them like it. Everything else flows from there.",
    likes: 1520,
    commentsCount: 312,
    liked: false,
    viewState: 'default',
    commentsPage: 1
  },
  {
    id: 'post_3',
    author: { name: 'Amara Nwosu', handle: '@amara_n', avatar: '2h' },
    time: '2h',
    content: "The way African tech is growing right now is genuinely exciting. We're not just consumers anymore — we're building the infrastructure the whole continent will run on for the next 50 years. The talent pipeline is world-class and capital is finally following.",
    likes: 847,
    commentsCount: 134,
    liked: false,
    viewState: 'default',
    commentsPage: 1
  },
  {
    id: 'post_4',
    author: { name: 'Chidi Eze', handle: '@chidieze', avatar: 'CE' },
    time: '3h',
    content: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.",
    likes: 420,
    commentsCount: 88,
    liked: false,
    viewState: 'default',
    commentsPage: 1
  }
];

// Generate sample comments database (16+ comments per post for 8-at-a-time pagination)
const commentsDatabase = {
  post_1: [
    { id: 'c1', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'c2', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'c3', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'c4', author: 'Tunde O.', avatar: 'TO', time: '4h 10m', text: "Stable electricity alone determines whether an engineer can deliver or get fired. It's a real issue.", likes: 92 },
    { id: 'c5', author: 'Sara M.', avatar: 'SM', time: '4h 25m', text: "Co-working hubs with backup power are helping, but infrastructure needs to catch up nationwide.", likes: 45 },
    { id: 'c6', author: 'DevKev', avatar: 'DK', time: '4h 30m', text: "Starlink and solar batteries are becoming essential dev gear nowadays.", likes: 112 },
    { id: 'c7', author: 'Nneka A.', avatar: 'NA', time: '4h 45m', text: "Spot on Kofi! Networking offline still plays a massive role in opening remote doors.", likes: 64 },
    { id: 'c8', author: 'Farouk B.', avatar: 'FB', time: '5h', text: "We need more decentralized remote hubs across smaller cities to level this out.", likes: 58 },
    { id: 'c9', author: 'Grace E.', avatar: 'GE', time: '5h 15m', text: "Camera setups are secondary compared to internet reliability IMO.", likes: 33 },
    { id: 'c10', author: 'Liam K.', avatar: 'LK', time: '5h 30m', text: "Agreed. Async work async protocols help offset timezone and connectivity gaps.", likes: 81 },
    { id: 'c11', author: 'Yusuf S.', avatar: 'YS', time: '5h 40m', text: "Great points all around. Infrastructure investment is key.", likes: 29 },
    { id: 'c12', author: 'Maya R.', avatar: 'MR', time: '5h 50m', text: "Community mentorship programs can bridge the network gap significantly.", likes: 42 },
    { id: 'c13', author: 'David O.', avatar: 'DO', time: '6h', text: "Building local tech hubs is the real long term fix.", likes: 37 },
    { id: 'c14', author: 'Zoe P.', avatar: 'ZP', time: '6h 15m', text: "Valid perspective Kofi. Thanks for highlighting this.", likes: 19 },
    { id: 'c15', author: 'Ibrahim H.', avatar: 'IH', time: '6h 30m', text: "Capital allocation to remote enablers is growing rapidly.", likes: 51 },
    { id: 'c16', author: 'Rita B.', avatar: 'RB', time: '6h 45m', text: "Couldn't agree more with this thread!", likes: 24 }
  ],
  post_3: [
    { id: 'c101', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'c102', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'c103', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'c104', author: 'Zara Ahmed', avatar: 'ZA', time: '4h 15m', text: "Infrastructure first, applications follow. We're at a pivotal moment.", likes: 63 },
    { id: 'c105', author: 'Paul K.', avatar: 'PK', time: '4h 30m', text: "Venture capital inflow has tripled in the past 3 years.", likes: 89 },
    { id: 'c106', author: 'Linda M.', avatar: 'LM', time: '4h 45m', text: "Local solutions for local challenges — that's the superpower.", likes: 104 },
    { id: 'c107', author: 'Samuel O.', avatar: 'SO', time: '5h', text: "The next tech unicorns will emerge right here.", likes: 115 },
    { id: 'c108', author: 'Evelyn W.', avatar: 'EW', time: '5h 15m', text: "Exciting times ahead for African tech builders!", likes: 47 },
    { id: 'c109', author: 'Michael T.', avatar: 'MT', time: '5h 30m', text: "Engineering talent here is world-class.", likes: 72 }
  ]
};

// Fill fallback comments for other posts dynamically
postsData.forEach(p => {
  if (!commentsDatabase[p.id]) {
    commentsDatabase[p.id] = commentsDatabase.post_1;
  }
});

// DOM Elements
const feedPostsContainer = document.getElementById('feed-posts-container');
const composeCollapsed = document.getElementById('compose-collapsed');
const composeExpanded = document.getElementById('compose-expanded');
const formCreatePost = document.getElementById('form-create-post');
const postTextarea = document.getElementById('post-textarea');
const btnCancelPost = document.getElementById('btn-cancel-post');
const postCharCount = document.getElementById('post-char-count');
const btnSpaceHelp = document.getElementById('btn-space-help');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderFeed();
  setupComposer();
});

// Render Main Feed
function renderFeed() {
  feedPostsContainer.innerHTML = '';

  postsData.forEach(post => {
    const cardBox = document.createElement('div');
    cardBox.className = 'post-card-box';
    cardBox.dataset.postId = post.id;

    // Render depending on card viewState ('default' | 'reply' | 'comments')
    if (post.viewState === 'reply') {
      cardBox.innerHTML = renderReplyView(post);
    } else if (post.viewState === 'comments') {
      cardBox.innerHTML = renderCommentsView(post);
    } else {
      cardBox.innerHTML = renderDefaultView(post);
    }

    feedPostsContainer.appendChild(cardBox);

    // Attach Touch & Drag Swipe Listeners to Card Box
    setupCardSwipeGestures(cardBox, post);
  });
}

// 1. DEFAULT POST VIEW HTML
function renderDefaultView(post) {
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

      <div class="post-actions-bar">
        <button type="button" class="action-item ${post.liked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>${formatNumber(post.likes)}</span>
        </button>

        <button type="button" class="action-item" onclick="switchCardView('${post.id}', 'comments')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>${post.commentsCount}</span>
        </button>

        <button type="button" class="action-item" onclick="switchCardView('${post.id}', 'reply')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 17 4 12 9 7"></polyline>
            <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
          </svg>
          <span>Reply</span>
        </button>

        <button type="button" class="share-btn" title="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
      </div>

      <div class="swipe-hints-row">
        <span>← swipe right for comments</span>
        <span>swipe left to reply →</span>
      </div>
    </div>
  `;
}

// 2. REPLY VIEW HTML (SWIPE LEFT RESULT)
function renderReplyView(post) {
  const shortSnippet = post.content.length > 70 ? post.content.slice(0, 70) + '...' : post.content;
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

// 3. COMMENTS VIEW HTML (SWIPE RIGHT RESULT - SHOWS 8 AT A TIME)
function renderCommentsView(post) {
  const allComments = commentsDatabase[post.id] || commentsDatabase.post_1;
  const visibleCount = post.commentsPage * 8;
  const visibleComments = allComments.slice(0, visibleCount);
  const hasMore = visibleCount < allComments.length;

  let commentsHTML = visibleComments.map(c => `
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
  `).join('');

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
        <input type="text" id="input-comment-${post.id}" class="comment-input-field" placeholder="Add a reply...">
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

// Switch Card View ('default' | 'reply' | 'comments')
function switchCardView(postId, targetView) {
  const p = postsData.find(item => item.id === postId);
  if (p) {
    p.viewState = targetView;
    renderFeed();
  }
}

// Load 8 More Comments
function loadMoreComments(postId) {
  const p = postsData.find(item => item.id === postId);
  if (p) {
    p.commentsPage += 1;
    renderFeed();
  }
}

// Toggle Like
function toggleLike(postId) {
  const p = postsData.find(item => item.id === postId);
  if (p) {
    p.liked = !p.liked;
    p.likes += p.liked ? 1 : -1;
    renderFeed();
  }
}

// Submit Reply Action
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
  const p = postsData.find(item => item.id === postId);
  if (p) {
    // Append reply comment
    if (!commentsDatabase[postId]) commentsDatabase[postId] = [];
    commentsDatabase[postId].unshift({
      id: 'c_' + Date.now(),
      author: 'Amara Nwosu',
      avatar: 'AN',
      time: 'Just now',
      text: replyText,
      likes: 1
    });

    p.commentsCount += 1;
    p.viewState = 'comments'; // Automatically open comments view after replying!
    renderFeed();
  }
}

// Add direct comment from input
function addComment(postId) {
  const input = document.getElementById(`input-comment-${postId}`);
  if (input && input.value.trim()) {
    submitReplyInternal(postId, input.value.trim());
  }
}

// SWIPE GESTURE IMPLEMENTATION (Mobile Touch & Mouse Drag)
function setupCardSwipeGestures(cardElement, post) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Touch Events
  cardElement.addEventListener('touchstart', (e) => {
    if (e.target.closest('button, input, textarea, a')) return;
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  cardElement.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // Apply smooth dragging effect
    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) < 120) {
      cardElement.classList.add('swiping');
      cardElement.style.transform = `translateX(${deltaX * 0.4}px)`;
    }
  }, { passive: true });

  cardElement.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    cardElement.classList.remove('swiping');
    cardElement.style.transform = '';

    const deltaX = currentX - startX;
    if (deltaX < -50) {
      // Swiped Left -> Reply View!
      switchCardView(post.id, 'reply');
    } else if (deltaX > 50) {
      // Swiped Right -> Comments View!
      switchCardView(post.id, 'comments');
    }
    startX = 0;
    currentX = 0;
  });
}

// Setup Composer ("What's on your mind?")
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

    const newPost = {
      id: 'post_' + Date.now(),
      author: { name: 'Amara Nwosu', handle: '@amara_n', avatar: 'AN' },
      time: 'Just now',
      content: text,
      likes: 1,
      commentsCount: 0,
      liked: true,
      viewState: 'default',
      commentsPage: 1
    };

    postsData.unshift(newPost);
    commentsDatabase[newPost.id] = [];

    postTextarea.value = '';
    formCreatePost.classList.add('hidden');
    composeCollapsed.classList.remove('hidden');

    renderFeed();
  });
}

// Floating Help Alert
btnSpaceHelp.addEventListener('click', () => {
  alert('Joault Space Feed Help:\n\n• Swipe Left (or click Reply) on any post box to reply.\n• Swipe Right (or click comments count) on any post box to view comments 8 at a time.');
});

// Helper XSS Escape & Number Format
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
}
