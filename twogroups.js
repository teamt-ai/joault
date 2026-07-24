// Joault Two-Groups Feed & 3-Second Auto-Rotating S-Line Card Implementation

// Sample Posts Dataset for Two-Groups
const twogroupsPostsData = [
  {
    id: 'tg_1',
    author: { name: 'Kofi Mensah', handle: '@kofimensah', avatar: 'KM' },
    time: '4h',
    content: "Hot take: remote work didn't level the playing field — it just moved the gatekeeping online. If you don't have the right network, stable power, and a decent camera setup, you're still locked out of the conversation.",
    likes: 1240,
    commentsCount: 289,
    liked: false,
    viewState: 'default', // 'default' (S-Line connected view) | 'comments' (8-at-a-time full comments list)
    activeReplyIndex: 0,
    commentsPage: 1
  },
  {
    id: 'tg_2',
    author: { name: 'Amara Nwosu', handle: '@amara_n', avatar: 'AN' },
    time: '2h',
    content: "The way African tech is growing right now is genuinely exciting. We're not just consumers anymore — we're building the infrastructure the whole continent will run on for the next 50 years. The talent pipeline is world-class and capital is finally following.",
    likes: 847,
    commentsCount: 134,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1
  },
  {
    id: 'tg_3',
    author: { name: 'Zara Ahmed', handle: '@zara_talks', avatar: 'ZA' },
    time: '6h',
    content: "Just hit 10,000 users on our platform with zero paid marketing. Community-led growth is the most underrated strategy in B2C. Your early users are your best salespeople — treat them like it. Everything else flows from there.",
    likes: 1520,
    commentsCount: 312,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1
  }
];

// Rich Replies Thread for 3-Second Auto-Rotation & 8-at-a-Time Pagination
const threadRepliesDatabase = {
  tg_1: [
    { id: 'r1', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'r2', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'r3', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'r4', author: 'Tunde O.', avatar: 'TO', time: '4h 10m', text: "Stable electricity alone determines whether an engineer can deliver or get fired.", likes: 92 },
    { id: 'r5', author: 'Sara M.', avatar: 'SM', time: '4h 25m', text: "Co-working hubs with backup power are helping, but infrastructure needs to catch up.", likes: 45 },
    { id: 'r6', author: 'DevKev', avatar: 'DK', time: '4h 30m', text: "Starlink and solar batteries are becoming essential dev gear nowadays.", likes: 112 },
    { id: 'r7', author: 'Nneka A.', avatar: 'NA', time: '4h 45m', text: "Spot on Kofi! Networking offline still plays a massive role in opening remote doors.", likes: 64 },
    { id: 'r8', author: 'Farouk B.', avatar: 'FB', time: '5h', text: "We need more decentralized remote hubs across smaller cities to level this out.", likes: 58 },
    { id: 'r9', author: 'Grace E.', avatar: 'GE', time: '5h 15m', text: "Camera setups are secondary compared to internet reliability IMO.", likes: 33 },
    { id: 'r10', author: 'Yusuf S.', avatar: 'YS', time: '5h 40m', text: "Great points all around. Infrastructure investment is key.", likes: 29 }
  ],
  tg_2: [
    { id: 'r101', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'r102', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'r103', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'r104', author: 'Zara Ahmed', avatar: 'ZA', time: '4h 15m', text: "Infrastructure first, applications follow. We're at a pivotal moment.", likes: 63 },
    { id: 'r105', author: 'Paul K.', avatar: 'PK', time: '4h 30m', text: "Venture capital inflow has tripled in the past 3 years.", likes: 89 },
    { id: 'r106', author: 'Linda M.', avatar: 'LM', time: '4h 45m', text: "Local solutions for local challenges — that's the superpower.", likes: 104 },
    { id: 'r107', author: 'Samuel O.', avatar: 'SO', time: '5h', text: "The next tech unicorns will emerge right here.", likes: 115 },
    { id: 'r108', author: 'Evelyn W.', avatar: 'EW', time: '5h 15m', text: "Exciting times ahead for African tech builders!", likes: 47 },
    { id: 'r109', author: 'Michael T.', avatar: 'MT', time: '5h 30m', text: "Engineering talent here is world-class.", likes: 72 }
  ]
};

// Fallback for tg_3
twogroupsPostsData.forEach(p => {
  if (!threadRepliesDatabase[p.id]) {
    threadRepliesDatabase[p.id] = threadRepliesDatabase.tg_1;
  }
});

// DOM Container
const container = document.getElementById('twogroups-posts-container');
let autoRotateTimer = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTwoGroupsFeed();
  startAutoRotationTimer();
});

// Render Feed
function renderTwoGroupsFeed() {
  container.innerHTML = '';

  twogroupsPostsData.forEach(post => {
    const cardBox = document.createElement('div');
    cardBox.className = 'twogroup-card-box';
    cardBox.dataset.postId = post.id;

    if (post.viewState === 'comments') {
      cardBox.innerHTML = renderFullCommentsView(post);
    } else {
      cardBox.innerHTML = renderConnectedSLineView(post);
    }

    container.appendChild(cardBox);
    setupTwoGroupCardGestures(cardBox, post);
  });
}

// 1. RENDER CONNECTED S-LINE VIEW (MATCHING USER'S DRAWING)
function renderConnectedSLineView(post) {
  const replies = threadRepliesDatabase[post.id] || threadRepliesDatabase.tg_1;
  const currentReply = replies[post.activeReplyIndex % replies.length];

  return `
    <div class="card-sline-layout">
      
      <!-- TOP ROW: ORIGINAL MESSAGE AT TOP LEFT, ORIGINAL AVATAR AT TOP RIGHT -->
      <div class="sline-top-row">
        <div class="original-sender-info">
          <div class="original-header-line">
            <span class="original-author-name">${escapeHtml(post.author.name)}</span>
            <span class="original-author-handle">${escapeHtml(post.author.handle)}</span>
            <span class="original-time">· ${post.time}</span>
          </div>
          <div class="original-msg-content">${escapeHtml(post.content)}</div>
        </div>

        <div class="original-avatar-right" title="${escapeHtml(post.author.name)}">
          ${post.author.avatar}
        </div>
      </div>

      <!-- MIDDLE SVG CONNECTING S-LINE -->
      <div class="sline-svg-container">
        <svg width="100%" height="48" viewBox="0 0 500 48" preserveAspectRatio="none">
          <path d="M 40 4 C 40 44, 460 4, 460 44" class="sline-path" />
        </svg>
      </div>

      <!-- BOTTOM ROW: COMMENTER AT BOTTOM LEFT, COMMENT AT BOTTOM RIGHT (AUTO-ROTATES EVERY 3s) -->
      <div class="sline-bottom-row" id="bottom-row-${post.id}">
        <div class="commenter-avatar-left">
          <div class="commenter-avatar-circle">${currentReply.avatar}</div>
          <span class="commenter-name-tag">${escapeHtml(currentReply.author)}</span>
        </div>

        <div class="comment-content-right">
          <p class="comment-text-body">${escapeHtml(currentReply.text)}</p>
          <div class="comment-meta-row">
            <span class="comment-time-stamp">${currentReply.time} · ❤️ ${currentReply.likes}</span>
            <span class="auto-rotate-badge">
              <span class="rotate-pulse-dot"></span>
              Reply ${post.activeReplyIndex + 1} of ${replies.length} (3s)
            </span>
          </div>
        </div>
      </div>

      <!-- FOOTER ACTION BAR -->
      <div class="twogroup-card-footer">
        <div class="swipe-hints-row" style="margin: 0; padding: 0;">
          <span>👉 Swipe right (or tap button) for all ${replies.length} replies</span>
        </div>
        <button type="button" class="btn-view-all-replies" onclick="switchTwoGroupView('${post.id}', 'comments')">
          <span>All Replies (8 at a time)</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

    </div>
  `;
}

// 2. RENDER FULL COMMENTS VIEW (SWIPE RIGHT RESULT - 8 AT A TIME)
function renderFullCommentsView(post) {
  const allReplies = threadRepliesDatabase[post.id] || threadRepliesDatabase.tg_1;
  const visibleCount = post.commentsPage * 8;
  const visibleReplies = allReplies.slice(0, visibleCount);
  const hasMore = visibleCount < allReplies.length;

  let repliesHTML = visibleReplies.map(r => `
    <div class="comment-item">
      <div class="avatar-circle-sm" style="width: 1.875rem; height: 1.875rem; font-size: 0.75rem;">${r.avatar}</div>
      <div class="comment-content-meta">
        <div class="comment-author-line">
          <span class="comment-author">${escapeHtml(r.author)}</span>
          <span class="comment-time">${r.time}</span>
        </div>
        <p class="comment-body">${escapeHtml(r.text)}</p>
        <button type="button" class="comment-like-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>${r.likes}</span>
        </button>
      </div>
    </div>
  `).join('');

  return `
    <div class="card-comments-view">
      <div class="comments-header-bar">
        <span class="comments-title-text">CONNECTED THREAD REPLIES (${allReplies.length})</span>
        <button type="button" class="btn-back-link" onclick="switchTwoGroupView('${post.id}', 'default')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to S-Line View</span>
        </button>
      </div>

      <div class="comments-list-box">
        ${repliesHTML}
      </div>

      ${hasMore ? `
        <button type="button" class="btn-load-more-comments" onclick="loadMoreTwoGroupComments('${post.id}')">
          Load 8 more comments
        </button>
      ` : ''}

      <div class="add-comment-row">
        <input type="text" id="input-tg-comment-${post.id}" class="comment-input-field" placeholder="Add a reply to this connected thread...">
        <button type="button" class="btn-send-comment" onclick="addTwoGroupComment('${post.id}')" title="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// 3-SECOND AUTOMATIC COMMENT ROTATION TIMER
function startAutoRotationTimer() {
  if (autoRotateTimer) clearInterval(autoRotateTimer);

  autoRotateTimer = setInterval(() => {
    twogroupsPostsData.forEach(post => {
      // Only rotate if card is currently in 'default' S-Line view
      if (post.viewState === 'default') {
        const replies = threadRepliesDatabase[post.id] || threadRepliesDatabase.tg_1;
        const bottomRowEl = document.getElementById(`bottom-row-${post.id}`);

        if (bottomRowEl) {
          bottomRowEl.classList.add('fade-out');

          setTimeout(() => {
            post.activeReplyIndex = (post.activeReplyIndex + 1) % replies.length;
            const nextReply = replies[post.activeReplyIndex];

            const avatarEl = bottomRowEl.querySelector('.commenter-avatar-circle');
            const nameEl = bottomRowEl.querySelector('.commenter-name-tag');
            const textEl = bottomRowEl.querySelector('.comment-text-body');
            const metaEl = bottomRowEl.querySelector('.comment-time-stamp');
            const badgeEl = bottomRowEl.querySelector('.auto-rotate-badge');

            if (avatarEl) avatarEl.textContent = nextReply.avatar;
            if (nameEl) nameEl.textContent = nextReply.author;
            if (textEl) textEl.textContent = nextReply.text;
            if (metaEl) metaEl.textContent = `${nextReply.time} · ❤️ ${nextReply.likes}`;
            if (badgeEl) badgeEl.innerHTML = `<span class="rotate-pulse-dot"></span> Reply ${post.activeReplyIndex + 1} of ${replies.length} (3s)`;

            bottomRowEl.classList.remove('fade-out');
          }, 350);
        }
      }
    });
  }, 3000); // 3 seconds interval
}

// Switch View State
function switchTwoGroupView(postId, targetView) {
  const p = twogroupsPostsData.find(item => item.id === postId);
  if (p) {
    p.viewState = targetView;
    renderTwoGroupsFeed();
  }
}

// Load 8 More Comments
function loadMoreTwoGroupComments(postId) {
  const p = twogroupsPostsData.find(item => item.id === postId);
  if (p) {
    p.commentsPage += 1;
    renderTwoGroupsFeed();
  }
}

// Add New Comment to Thread
function addTwoGroupComment(postId) {
  const input = document.getElementById(`input-tg-comment-${postId}`);
  if (input && input.value.trim()) {
    const text = input.value.trim();
    if (!threadRepliesDatabase[postId]) threadRepliesDatabase[postId] = [];

    threadRepliesDatabase[postId].unshift({
      id: 'r_' + Date.now(),
      author: 'Amara Nwosu',
      avatar: 'AN',
      time: 'Just now',
      text: text,
      likes: 1
    });

    input.value = '';
    renderTwoGroupsFeed();
  }
}

// Touch & Mouse Drag Swipe Gesture Setup for twogroups.html
function setupTwoGroupCardGestures(cardElement, post) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Touch
  cardElement.addEventListener('touchstart', (e) => {
    if (e.target.closest('button, input, textarea, a')) return;
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

  cardElement.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    cardElement.classList.remove('swiping');
    cardElement.style.transform = '';

    const deltaX = currentX - startX;
    if (deltaX > 40) {
      // Swipe Right -> Show All Comments (8 at a time)!
      switchTwoGroupView(post.id, 'comments');
    }
    startX = 0;
    currentX = 0;
  });

  // Mouse Drag
  cardElement.addEventListener('mousedown', (e) => {
    if (e.target.closest('button, input, textarea, a')) return;
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
    cardElement.style.cursor = 'grabbing';
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
    cardElement.style.cursor = '';
    cardElement.classList.remove('swiping');
    cardElement.style.transform = '';

    const deltaX = currentX - startX;
    if (deltaX > 40) {
      // Mouse Drag Right -> Show All Comments (8 at a time)!
      switchTwoGroupView(post.id, 'comments');
    }
    startX = 0;
    currentX = 0;
  });
}

// Help Alert
const btnTwogroupsHelp = document.getElementById('btn-twogroups-help');
if (btnTwogroupsHelp) {
  btnTwogroupsHelp.addEventListener('click', () => {
    alert('Joault Two-Groups Feed Help:\n\n• Replies auto-rotate every 3 seconds at the bottom right of each connected message card box.\n• Swipe Right (or click "All Replies") on any message card box to view all replies 8 at a time.');
  });
}

// XSS Escape Helper
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
