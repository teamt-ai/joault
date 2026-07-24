// Joault Two-Groups Feed & 3-Second Auto-Rotating S-Line Card Implementation with Double-Tap Emoji Reactions

const twogroupsPostsData = [
  {
    id: 'tg_1',
    team: 'Tech Builders',
    teamKey: 'team-a',
    author: { name: 'Kofi Mensah', handle: '@kofimensah', avatar: 'KM' },
    time: '4h',
    content: "Hot take: remote work didn't level the playing field — it just moved the gatekeeping online. If you don't have the right network, stable power, and a decent camera setup, you're still locked out of the conversation.",
    likes: 1240,
    commentsCount: 289,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1,
    reactions: { '🔥': 12, '❤️': 45, '🚀': 8 }
  },
  {
    id: 'tg_2',
    team: 'Product Creators',
    teamKey: 'team-b',
    author: { name: 'Amara Nwosu', handle: '@amara_n', avatar: 'AN' },
    time: '2h',
    content: "The way African tech is growing right now is genuinely exciting. We're not just consumers anymore — we're building the infrastructure the whole continent will run on for the next 50 years. The talent pipeline is world-class and capital is finally following.",
    likes: 847,
    commentsCount: 134,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1,
    reactions: { '💯': 24, '👏': 18, '🔥': 32 }
  },
  {
    id: 'tg_3',
    team: 'Tech Builders',
    teamKey: 'team-a',
    author: { name: 'Zara Ahmed', handle: '@zara_talks', avatar: 'ZA' },
    time: '6h',
    content: "Just hit 10,000 users on our platform with zero paid marketing. Community-led growth is the most underrated strategy in B2C. Your early users are your best salespeople — treat them like it. Everything else flows from there.",
    likes: 1520,
    commentsCount: 312,
    liked: false,
    viewState: 'default',
    activeReplyIndex: 0,
    commentsPage: 1,
    reactions: { '❤️': 64, '💡': 15, '🚀': 21 }
  }
];

// Available Custom Website Emojis
const AVAILABLE_EMOJIS = ['❤️', '🔥', '👍', '👏', '🚀', '😂', '💡', '🎉', '💯'];

// Replies Thread
const threadRepliesDatabase = {
  tg_1: [
    { id: 'r1', team: 'Product Creators', teamKey: 'team-b', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'r2', team: 'Tech Builders', teamKey: 'team-a', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 },
    { id: 'r3', team: 'Tech Builders', teamKey: 'team-a', author: 'Kofi Mensah', avatar: 'KM', time: '4h', text: "I'd push back slightly — the conditions aren't the same. Context matters enormously.", likes: 77 },
    { id: 'r4', team: 'Product Creators', teamKey: 'team-b', author: 'Tunde O.', avatar: 'TO', time: '4h 10m', text: "Stable electricity alone determines whether an engineer can deliver or get fired.", likes: 92 },
    { id: 'r5', team: 'Tech Builders', teamKey: 'team-a', author: 'Sara M.', avatar: 'SM', time: '4h 25m', text: "Co-working hubs with backup power are helping, but infrastructure needs to catch up.", likes: 45 }
  ],
  tg_2: [
    { id: 'r101', team: 'Tech Builders', teamKey: 'team-a', author: 'Chidi Eze', avatar: 'CE', time: '3h', text: "Real question: how do we move from conversation to coordinated action? That's where I keep getting stuck.", likes: 130 },
    { id: 'r102', team: 'Product Creators', teamKey: 'team-b', author: 'Amara Nwosu', avatar: 'AN', time: '3h 45m', text: "The historical parallel here is sharper than most people realize. We've been here before.", likes: 140 }
  ]
};

twogroupsPostsData.forEach(p => {
  if (!threadRepliesDatabase[p.id]) {
    threadRepliesDatabase[p.id] = threadRepliesDatabase.tg_1;
  }
});

// DOM Elements
const container = document.getElementById('twogroups-posts-container');
let autoRotateTimer = null;
let twoGroupsScrollObserver = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTwoGroupsFeed();
  startAutoRotationTimer();
  setupTwoGroupsScrollObserver();
});

// Render Feed
function renderTwoGroupsFeed() {
  container.innerHTML = '';

  twogroupsPostsData.forEach(post => {
    const cardBox = document.createElement('div');
    cardBox.className = `twogroup-card-box ${post.teamKey}`;
    cardBox.dataset.postId = post.id;

    if (post.viewState === 'comments') {
      cardBox.innerHTML = renderFullCommentsView(post);
    } else {
      cardBox.innerHTML = renderConnectedSLineView(post);
    }

    container.appendChild(cardBox);
    setupDoubleTapAndSwipeTwoGroups(cardBox, post);

    if (twoGroupsScrollObserver) {
      twoGroupsScrollObserver.observe(cardBox);
    }
  });
}

// 1. RENDER CONNECTED S-LINE VIEW
function renderConnectedSLineView(post) {
  const replies = threadRepliesDatabase[post.id] || threadRepliesDatabase.tg_1;
  const currentReply = replies[post.activeReplyIndex % replies.length];

  return `
    <div class="card-sline-layout">
      <div class="sline-top-row">
        <div class="original-sender-info">
          <div class="original-header-line">
            <span class="team-tag-pill ${post.teamKey}-pill">${escapeHtml(post.team)}</span>
            <span class="original-author-name">${escapeHtml(post.author.name)}</span>
            <span class="original-author-handle">${escapeHtml(post.author.handle)}</span>
            <span class="original-time">· ${post.time}</span>
          </div>
          <div class="original-msg-content">${escapeHtml(post.content)}</div>
        </div>

        <div class="original-avatar-right ${post.teamKey}-avatar" title="${escapeHtml(post.author.name)}">
          ${post.author.avatar}
        </div>
      </div>

      <div class="sline-svg-container">
        <svg width="100%" height="48" viewBox="0 0 500 48" preserveAspectRatio="none">
          <path d="M 40 4 C 40 44, 460 4, 460 44" class="sline-path ${post.teamKey}-path" />
        </svg>
      </div>

      <div class="sline-bottom-row ${currentReply.teamKey}-comment-bg" id="bottom-row-${post.id}">
        <div class="commenter-avatar-left">
          <div class="commenter-avatar-circle ${currentReply.teamKey}-avatar">${currentReply.avatar}</div>
          <span class="commenter-name-tag">${escapeHtml(currentReply.author)}</span>
          <span class="team-mini-pill ${currentReply.teamKey}-pill">${currentReply.teamKey === 'team-a' ? 'Group A' : 'Group B'}</span>
        </div>

        <div class="comment-content-right">
          <p class="comment-text-body">${escapeHtml(currentReply.text)}</p>
          <div class="comment-meta-row">
            <span class="comment-time-stamp">${currentReply.time} · ❤️ ${currentReply.likes}</span>
            <span class="auto-rotate-badge ${currentReply.teamKey}-badge">
              <span class="rotate-pulse-dot"></span>
              ${currentReply.team} · Reply ${post.activeReplyIndex + 1} of ${replies.length} (3s)
            </span>
          </div>
        </div>
      </div>

      <div class="twogroup-card-footer">
        <div class="swipe-hints-row" style="margin: 0; padding: 0; width: 100%;">
          <span>👉 Double tap to react | Swipe right for all ${replies.length} replies</span>
        </div>
      </div>
    </div>
  `;
}

// 2. RENDER FULL COMMENTS VIEW
function renderFullCommentsView(post) {
  const allReplies = threadRepliesDatabase[post.id] || threadRepliesDatabase.tg_1;
  const visibleCount = post.commentsPage * 8;
  const visibleReplies = allReplies.slice(0, visibleCount);
  const hasMore = visibleCount < allReplies.length;

  let repliesHTML = visibleReplies.map(r => `
    <div class="comment-item ${r.teamKey}-item-bg">
      <div class="commenter-left-box">
        <div class="avatar-circle-sm ${r.teamKey}-avatar" style="width: 1.875rem; height: 1.875rem; font-size: 0.75rem;">${r.avatar}</div>
        <span class="team-tag-pill ${r.teamKey}-pill" style="font-size: 0.6rem; padding: 0.1rem 0.35rem; margin-top: 0.2rem;">${r.team}</span>
      </div>
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

// DOUBLE TAP DETECTOR & SWIPE GESTURES FOR TWOGROUPS
function setupDoubleTapAndSwipeTwoGroups(cardElement, post) {
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

  cardElement.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    cardElement.classList.remove('swiping');
    cardElement.style.transform = '';

    const deltaX = currentX - startX;
    const now = Date.now();

    if (deltaX > 45) {
      // Swipe Right -> Show All Comments (8 at a time)!
      switchTwoGroupView(post.id, 'comments');
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
      // Mouse Drag Right -> Show All Comments (8 at a time)!
      switchTwoGroupView(post.id, 'comments');
    }
    startX = 0;
    currentX = 0;
  });
}


// Open Website Emoji Picker Bar
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
      addEmojiReactionTwoGroups(post.id, emoji, cardElement);
      pickerBox.remove();
    };
    pickerBox.appendChild(btn);
  });

  cardElement.appendChild(pickerBox);

  setTimeout(() => {
    if (pickerBox.parentNode) pickerBox.remove();
  }, 4000);
}

// Add Emoji Reaction & Trigger 3-Second Burst
function addEmojiReactionTwoGroups(postId, emoji, cardElement) {
  const post = twogroupsPostsData.find(p => p.id === postId);
  if (!post) return;

  if (!post.reactions) post.reactions = {};
  post.reactions[emoji] = (post.reactions[emoji] || 0) + 1;

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

  setTimeout(() => {
    if (burst.parentNode) burst.remove();
  }, 3000);
}

// SCROLL-INTO-VIEW OBSERVER FOR TWOGROUPS: Pops up sent emojis EVERY TIME someone scrolls to a message card!
function setupTwoGroupsScrollObserver() {
  if (!('IntersectionObserver' in window)) return;

  twoGroupsScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const cardBox = entry.target;
      const postId = cardBox.dataset.postId;
      const post = twogroupsPostsData.find(p => p.id === postId);

      if (entry.isIntersecting) {
        if (post && post.reactions && Object.keys(post.reactions).length > 0) {
          showScrollReactionPopup(cardBox, post.reactions);
        }
      } else {
        const existing = cardBox.querySelector('.scroll-reaction-popup');
        if (existing) existing.remove();
      }
    });
  }, { threshold: 0.35 });
}

// Show 3-Second Scroll Reaction Popup
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

  setTimeout(() => {
    if (popup.parentNode) popup.remove();
  }, 3000);
}


// 3-SECOND AUTOMATIC COMMENT ROTATION TIMER
function startAutoRotationTimer() {
  if (autoRotateTimer) clearInterval(autoRotateTimer);

  autoRotateTimer = setInterval(() => {
    twogroupsPostsData.forEach(post => {
      if (post.viewState === 'default') {
        const replies = threadRepliesDatabase[post.id] || threadRepliesDatabase.tg_1;
        const bottomRowEl = document.getElementById(`bottom-row-${post.id}`);

        if (bottomRowEl) {
          bottomRowEl.classList.add('fade-out');

          setTimeout(() => {
            post.activeReplyIndex = (post.activeReplyIndex + 1) % replies.length;
            const nextReply = replies[post.activeReplyIndex];

            bottomRowEl.className = `sline-bottom-row ${nextReply.teamKey}-comment-bg fade-out`;

            const avatarEl = bottomRowEl.querySelector('.commenter-avatar-circle');
            const nameEl = bottomRowEl.querySelector('.commenter-name-tag');
            const teamPillEl = bottomRowEl.querySelector('.team-mini-pill');
            const textEl = bottomRowEl.querySelector('.comment-text-body');
            const metaEl = bottomRowEl.querySelector('.comment-time-stamp');
            const badgeEl = bottomRowEl.querySelector('.auto-rotate-badge');

            if (avatarEl) {
              avatarEl.textContent = nextReply.avatar;
              avatarEl.className = `commenter-avatar-circle ${nextReply.teamKey}-avatar`;
            }
            if (nameEl) nameEl.textContent = nextReply.author;
            if (teamPillEl) {
              teamPillEl.textContent = nextReply.teamKey === 'team-a' ? 'Group A' : 'Group B';
              teamPillEl.className = `team-mini-pill ${nextReply.teamKey}-pill`;
            }
            if (textEl) textEl.textContent = nextReply.text;
            if (metaEl) metaEl.textContent = `${nextReply.time} · ❤️ ${nextReply.likes}`;
            if (badgeEl) {
              badgeEl.className = `auto-rotate-badge ${nextReply.teamKey}-badge`;
              badgeEl.innerHTML = `<span class="rotate-pulse-dot"></span> ${nextReply.team} · Reply ${post.activeReplyIndex + 1} of ${replies.length} (3s)`;
            }

            bottomRowEl.classList.remove('fade-out');
          }, 350);
        }
      }
    });
  }, 3000);
}

function switchTwoGroupView(postId, targetView) {
  const p = twogroupsPostsData.find(item => item.id === postId);
  if (p) {
    p.viewState = targetView;
    renderTwoGroupsFeed();
  }
}

function loadMoreTwoGroupComments(postId) {
  const p = twogroupsPostsData.find(item => item.id === postId);
  if (p) {
    p.commentsPage += 1;
    renderTwoGroupsFeed();
  }
}

function addTwoGroupComment(postId) {
  const input = document.getElementById(`input-tg-comment-${postId}`);
  if (input && input.value.trim()) {
    const text = input.value.trim();
    if (!threadRepliesDatabase[postId]) threadRepliesDatabase[postId] = [];

    threadRepliesDatabase[postId].unshift({
      id: 'r_' + Date.now(),
      team: 'Product Creators',
      teamKey: 'team-b',
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

// Help Alert
const btnTwogroupsHelp = document.getElementById('btn-twogroups-help');
if (btnTwogroupsHelp) {
  btnTwogroupsHelp.addEventListener('click', () => {
    alert('Joault Two-Groups Feed Help:\n\n• Double tap any message to react with custom website emojis!\n• Reaction burst pops up on screen for 3s then vanishes.\n• Scrolling to a message pops up its reaction totals for 3s.\n• Swipe right for all comments 8 at a time.');
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
