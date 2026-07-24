// Joault Premium Sticker Threading Engine & TikTok-Style Gift Animations

// 5 PREMIUM STICKER PACKS (27+ STICKERS PER PACK = 135 TOTAL)
const PREMIUM_STICKER_PACKS = [
  {
    id: 'pack_1',
    name: 'Emoji Gold',
    icon: '👑',
    count: '27 Stickers',
    type: 'emoji',
    items: [
      { id: 'p1_1', name: 'Royal Crown', content: '👑' },
      { id: 'p1_2', name: 'Diamond Core', content: '💎' },
      { id: 'p1_3', name: 'Rocket Flame', content: '🚀' },
      { id: 'p1_4', name: 'High Voltage', content: '⚡' },
      { id: 'p1_5', name: 'Inferno', content: '🔥' },
      { id: 'p1_6', name: 'Golden Trophy', content: '🏆' },
      { id: 'p1_7', name: 'Shining Star', content: '🌟' },
      { id: 'p1_8', name: 'Money Bag', content: '💰' },
      { id: 'p1_9', name: 'Fleur de Lis', content: '⚜️' },
      { id: 'p1_10', name: 'Bulls Eye', content: '🎯' },
      { id: 'p1_11', name: 'Galaxy Orb', content: '🌌' },
      { id: 'p1_12', name: 'Crystal Ball', content: '🔮' },
      { id: 'p1_13', name: 'Unicorn Grace', content: '🦄' },
      { id: 'p1_14', name: 'Trident Power', content: '🔱' },
      { id: 'p1_15', name: 'Super Explosion', content: '💥' },
      { id: 'p1_16', name: 'Dizzy Stars', content: '💫' },
      { id: 'p1_17', name: 'Sparkles', content: '✨' },
      { id: 'p1_18', name: 'Champagne Pop', content: '🍾' },
      { id: 'p1_19', name: 'Gift Box', content: '🎁' },
      { id: 'p1_20', name: 'Gold Medal', content: '🥇' },
      { id: 'p1_21', name: 'Lion King', content: '🦁' },
      { id: 'p1_22', name: 'Golden Dragon', content: '🐉' },
      { id: 'p1_23', name: 'Volcano Flare', content: '🌋' },
      { id: 'p1_24', name: 'Fireworks', content: '🎆' },
      { id: 'p1_25', name: 'Ringed Planet', content: '🪐' },
      { id: 'p1_26', name: 'Money Wings', content: '💸' },
      { id: 'p1_27', name: 'Pure Gold', content: '🪙' }
    ]
  },
  {
    id: 'pack_2',
    name: 'Super Reactions',
    icon: '🤯',
    count: '27 Stickers',
    type: 'emoji',
    items: [
      { id: 'p2_1', name: 'Mind Blown', content: '🤯' },
      { id: 'p2_2', name: 'Star Struck', content: '🤩' },
      { id: 'p2_3', name: 'Party Popper', content: '🥳' },
      { id: 'p2_4', name: 'Cool Shades', content: '😎' },
      { id: 'p2_5', name: 'Money Mouth', content: '🤑' },
      { id: 'p2_6', name: 'Cyber Ghost', content: '👻' },
      { id: 'p2_7', name: 'Space Invader', content: '👾' },
      { id: 'p2_8', name: 'AI Bot', content: '🤖' },
      { id: 'p2_9', name: 'Alien Lord', content: '👽' },
      { id: 'p2_10', name: 'Disco Salsa', content: '💃' },
      { id: 'p2_11', name: 'Groove King', content: '🕺' },
      { id: 'p2_12', name: 'Popcorn Time', content: '🍿' },
      { id: 'p2_13', name: 'Palette Art', content: '🎨' },
      { id: 'p2_14', name: 'Drama Masks', content: '🎭' },
      { id: 'p2_15', name: 'Live Mic', content: '🎤' },
      { id: 'p2_16', name: 'DJ Phones', content: '🎧' },
      { id: 'p2_17', name: 'Rock Guitar', content: '🎸' },
      { id: 'p2_18', name: 'Saxophone', content: '🎷' },
      { id: 'p2_19', name: 'Evil Eye Amulet', content: '🧿' },
      { id: 'p2_20', name: 'Hamsa Hand', content: '🪬' },
      { id: 'p2_21', name: 'Moai Statue', content: '🗿' },
      { id: 'p2_22', name: 'Ideas Bulb', content: '💡' },
      { id: 'p2_23', name: 'Ocean Wave', content: '🌊' },
      { id: 'p2_24', name: 'Firecracker', content: '🧨' },
      { id: 'p2_25', name: 'Golden Key', content: '🗝️' },
      { id: 'p2_26', name: 'Hourglass', content: '⏳' },
      { id: 'p2_27', name: 'Compass Gold', content: '🧩' }
    ]
  },
  {
    id: 'pack_3',
    name: 'Web3 & Crypto',
    icon: '💎',
    count: '27 Stickers',
    type: 'image',
    items: [
      { id: 'p3_1', name: 'Bitcoin Gold', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crypto_btc.png' },
      { id: 'p3_2', name: 'Ethereum Crystal', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crypto_eth.png' },
      { id: 'p3_3', name: 'Diamond Hands', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/diamond_hands.png' },
      { id: 'p3_4', name: 'Solana Speed', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crypto_sol.png' },
      { id: 'p3_5', name: 'NFT Crown', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/nft_crown.png' },
      { id: 'p3_6', name: 'Gold Bull', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_bull.png' },
      { id: 'p3_7', name: 'Crypto Vault', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crypto_vault.png' },
      { id: 'p3_8', name: 'Web3 Matrix', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/web3_matrix.png' },
      { id: 'p3_9', name: 'Golden Coin Stack', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_coins.png' },
      { id: 'p3_10', name: 'Rocket Moon', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/rocket_moon.png' },
      { id: 'p3_11', name: 'Cyber Panther', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_panther.png' },
      { id: 'p3_12', name: 'Golden Keyhole', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_key.png' },
      { id: 'p3_13', name: 'Money Rain', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/money_rain.png' },
      { id: 'p3_14', name: 'Black VIP Card', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/black_card.png' },
      { id: 'p3_15', name: 'Emerald Gem', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/emerald_gem.png' },
      { id: 'p3_16', name: 'Sapphire Orb', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/sapphire_gem.png' },
      { id: 'p3_17', name: 'Golden Falcon', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_falcon.png' },
      { id: 'p3_18', name: 'Hologram Globe', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/holo_globe.png' },
      { id: 'p3_19', name: 'Quantum Core', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/quantum_core.png' },
      { id: 'p3_20', name: 'Diamond Shield', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/diamond_shield.png' },
      { id: 'p3_21', name: 'Neon Flame', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_flame.png' },
      { id: 'p3_22', name: 'Platinum Wings', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/plat_wings.png' },
      { id: 'p3_23', name: 'Cosmic Vortex', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cosmic_vortex.png' },
      { id: 'p3_24', name: 'Gold Bar Ingot', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_bar.png' },
      { id: 'p3_25', name: 'Crown Jewels', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crown_jewels.png' },
      { id: 'p3_26', name: 'Sovereign Ring', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/sovereign_ring.png' },
      { id: 'p3_27', name: 'Apex Trophy', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/apex_trophy.png' }
    ]
  },
  {
    id: 'pack_4',
    name: 'Cyberpunk Neon',
    icon: '⚡',
    count: '27 Stickers',
    type: 'image',
    items: [
      { id: 'p4_1', name: 'Cyber Skull', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_skull.png' },
      { id: 'p4_2', name: 'Neon Dragon', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_dragon.png' },
      { id: 'p4_3', name: 'Laser Eye', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/laser_eye.png' },
      { id: 'p4_4', name: 'Neon Mask', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_mask.png' },
      { id: 'p4_5', name: 'Cyber Wings', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_wings.png' },
      { id: 'p4_6', name: 'Plasma Orb', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/plasma_orb.png' },
      { id: 'p4_7', name: 'Laser Panther', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/laser_panther.png' },
      { id: 'p4_8', name: 'Cyber Core', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_core.png' },
      { id: 'p4_9', name: 'Neon Shield', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_shield.png' },
      { id: 'p4_10', name: 'Cyber Rose', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_rose.png' },
      { id: 'p4_11', name: 'Quantum Flame', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/quantum_flame.png' },
      { id: 'p4_12', name: 'Neon Phoenix', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_phoenix.png' },
      { id: 'p4_13', name: 'Cyber Viper', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_viper.png' },
      { id: 'p4_14', name: 'Matrix Portal', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/matrix_portal.png' },
      { id: 'p4_15', name: 'Neon Crown', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_crown.png' },
      { id: 'p4_16', name: 'Cyber Heart', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_heart.png' },
      { id: 'p4_17', name: 'Quantum Star', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/quantum_star.png' },
      { id: 'p4_18', name: 'Laser Tiger', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/laser_tiger.png' },
      { id: 'p4_19', name: 'Cyber Diamond', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_diamond.png' },
      { id: 'p4_20', name: 'Neon Coin', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_coin.png' },
      { id: 'p4_21', name: 'Plasma Key', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/plasma_key.png' },
      { id: 'p4_22', name: 'Cyber Ring', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_ring.png' },
      { id: 'p4_23', name: 'Quantum Crystal', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/quantum_crystal.png' },
      { id: 'p4_24', name: 'Laser Wing', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/laser_wing.png' },
      { id: 'p4_25', name: 'Neon Glyph', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_glyph.png' },
      { id: 'p4_26', name: 'Cyber Pulse', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/cyber_pulse.png' },
      { id: 'p4_27', name: 'Neon Apex', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/neon_apex.png' }
    ]
  },
  {
    id: 'pack_5',
    name: 'Luxury Gifts',
    icon: '🏆',
    count: '27 Stickers',
    type: 'image',
    items: [
      { id: 'p5_1', name: 'Gold Trophy', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_trophy.png' },
      { id: 'p5_2', name: 'Diamond Ring', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/diamond_ring.png' },
      { id: 'p5_3', name: 'Supercar', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/supercar.png' },
      { id: 'p5_4', name: 'Private Jet', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/private_jet.png' },
      { id: 'p5_5', name: 'Mega Yacht', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/luxury_yacht.png' },
      { id: 'p5_6', name: 'Luxury Mansion', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/mansion.png' },
      { id: 'p5_7', name: 'Champagne Gold', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/champagne.png' },
      { id: 'p5_8', name: 'Money Bag XL', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/money_bag_xl.png' },
      { id: 'p5_9', name: 'Treasure Chest', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/treasure_chest.png' },
      { id: 'p5_10', name: 'Rolex Watch', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/luxury_watch.png' },
      { id: 'p5_11', name: 'Golden Statue', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_statue.png' },
      { id: 'p5_12', name: 'Diamond Necklace', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/diamond_necklace.png' },
      { id: 'p5_13', name: 'Flying Cash', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/flying_cash.png' },
      { id: 'p5_14', name: 'Supercar Key', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/supercar_key.png' },
      { id: 'p5_15', name: 'Gold Ingot', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_ingot.png' },
      { id: 'p5_16', name: 'Ruby Gem', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/ruby_gem.png' },
      { id: 'p5_17', name: 'Golden Mic', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/golden_mic.png' },
      { id: 'p5_18', name: 'Crystal Globe', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crystal_globe.png' },
      { id: 'p5_19', name: 'Emerald Ring', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/emerald_ring.png' },
      { id: 'p5_20', name: 'VIP Pass', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/vip_pass.png' },
      { id: 'p5_21', name: 'Luxury Cigar', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/luxury_cigar.png' },
      { id: 'p5_22', name: 'Golden Pegasus', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_pegasus.png' },
      { id: 'p5_23', name: 'Diamond Falcon', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/diamond_falcon.png' },
      { id: 'p5_24', name: 'Platinum Crest', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/plat_crest.png' },
      { id: 'p5_25', name: 'Golden Lotus', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/gold_lotus.png' },
      { id: 'p5_26', name: 'Sovereign Crown', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/sovereign_crown.png' },
      { id: 'p5_27', name: 'Royal Scepter', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/royal_scepter.png' }
    ]
  }
];

// THREADED STICKERS DATABASE BY POST ID (Pre-populated for instant testing on post_1 & tg_1)
const threadedStickersDB = {
  post_1: [
    {
      sticker: { id: 'p1_1', name: 'Royal Crown', content: '👑' },
      pack: { id: 'pack_1', name: 'Emoji Gold', type: 'emoji' },
      timestamp: Date.now()
    },
    {
      sticker: { id: 'p1_2', name: 'Diamond Core', content: '💎' },
      pack: { id: 'pack_1', name: 'Emoji Gold', type: 'emoji' },
      timestamp: Date.now()
    }
  ],
  tg_1: [
    {
      sticker: { id: 'p1_1', name: 'Royal Crown', content: '👑' },
      pack: { id: 'pack_1', name: 'Emoji Gold', type: 'emoji' },
      timestamp: Date.now()
    },
    {
      sticker: { id: 'p3_1', name: 'Bitcoin Gold', content: 'https://raw.githubusercontent.com/spothit/public-assets/main/crypto_btc.png' },
      pack: { id: 'pack_3', name: 'Web3 & Crypto', type: 'image' },
      timestamp: Date.now()
    }
  ]
};

// GLOBAL ACTIVE STATE
let activeStickerPostId = null;
let activeSelectedPackId = 'pack_1';
let stickerMiddleObserver = null;

// INITIALIZE STICKER ENGINE
document.addEventListener('DOMContentLoaded', () => {
  createStickerDrawerModalHTML();
  createTikTokGiftOverlayHTML();

  // Attach secret hotzone to cards
  setupSecretStickerHotzones();

  // Middle-of-Screen Observer for Threaded Stickers
  setupStickerMiddleScreenObserver();
});


// CREATE DRAWER MODAL DOM STRUCTURE (GOOGLE & X CLASS CENTERED FLOATING SHEET)
function createStickerDrawerModalHTML() {
  if (document.getElementById('sticker-drawer-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'sticker-drawer-modal';
  modal.className = 'sticker-drawer-modal';

  modal.innerHTML = `
    <div class="sticker-picker-card">
      <!-- HEADER BAR -->
      <div class="picker-header-bar">
        <div class="picker-brand-title">
          <div class="picker-crown-icon">👑</div>
          <div>
            <h3>Premium Stickers</h3>
            <p>Tap any sticker to thread to message</p>
          </div>
        </div>
        <div class="picker-header-actions">
          <span class="vip-badge-pill">✨ VIP Vault</span>
          <button type="button" class="btn-close-sticker-drawer" onclick="closeStickerDrawer()" title="Close">&times;</button>
        </div>
      </div>

      <!-- HORIZONTAL PACK CATEGORY PILL TABS (GOOGLE & X STYLE) -->
      <div class="picker-category-tabs-row" id="packs-column-container">
        <!-- Rendered via JS -->
      </div>

      <!-- MAIN STICKERS GRID VIEWPORT -->
      <div class="picker-grid-viewport" id="stickers-grid-container">
        <!-- Rendered via JS -->
      </div>

      <!-- FOOTER HINT BAR -->
      <div class="picker-footer-bar">
        <span>⚡ 3s TikTok Gift Animation + 2x/3x Stack Badges</span>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// CREATE TIKTOK GIFT OVERLAY CONTAINER
function createTikTokGiftOverlayHTML() {
  if (document.getElementById('tiktok-gift-overlay-container')) return;

  const overlay = document.createElement('div');
  overlay.id = 'tiktok-gift-overlay-container';
  overlay.className = 'tiktok-gift-overlay-container';
  document.body.appendChild(overlay);
}

// SETUP SECRET HOTZONE ON TOP-RIGHT CORNER OF CARDS
function setupSecretStickerHotzones() {
  const cards = document.querySelectorAll('.post-card-box, .twogroup-card-box');
  cards.forEach(card => {
    const postId = card.dataset.postId;
    if (!postId) return;

    // Attach tiny threaded hole if stickers exist
    updateCardTinyHoleIndicator(card, postId);

    // Attach secret invisible hotzone in top-right corner above username
    let hotzone = card.querySelector('.secret-hotzone-topright');
    if (!hotzone) {
      hotzone = document.createElement('div');
      hotzone.className = 'secret-hotzone-topright';
      hotzone.title = 'Thread Premium Sticker';
      hotzone.onclick = (e) => {
        e.stopPropagation();
        openStickerDrawer(postId);
      };
      card.appendChild(hotzone);
    }
  });
}

// UPDATE TINY HOLE INDICATOR AT TOP RIGHT CORNER
function updateCardTinyHoleIndicator(cardElement, postId) {
  let tinyHole = cardElement.querySelector('.tiny-threaded-hole');
  const hasStickers = threadedStickersDB[postId] && threadedStickersDB[postId].length > 0;

  if (hasStickers) {
    if (!tinyHole) {
      tinyHole = document.createElement('div');
      tinyHole.className = 'tiny-threaded-hole';
      tinyHole.title = 'Threaded Premium Stickers Active';
      cardElement.appendChild(tinyHole);
    }
  } else {
    if (tinyHole) tinyHole.remove();
  }
}

// OPEN STICKER DRAWER FOR SELECTED MESSAGE
function openStickerDrawer(postId) {
  activeStickerPostId = postId;
  const modal = document.getElementById('sticker-drawer-modal');
  if (!modal) return;

  renderRegionAPacks();
  renderRegionBStickers();

  modal.classList.add('active');
}

// CLOSE STICKER DRAWER
function closeStickerDrawer() {
  const modal = document.getElementById('sticker-drawer-modal');
  if (modal) modal.classList.remove('active');
}

// RENDER HORIZONTAL PACK CATEGORY PILLS (GOOGLE & X STYLE)
function renderRegionAPacks() {
  const container = document.getElementById('packs-column-container');
  if (!container) return;

  container.innerHTML = '';

  PREMIUM_STICKER_PACKS.forEach(pack => {
    const isSelected = pack.id === activeSelectedPackId;
    const tabPill = document.createElement('div');
    tabPill.className = `pack-tab-pill ${isSelected ? 'selected' : ''}`;
    tabPill.onclick = () => {
      activeSelectedPackId = pack.id;
      renderRegionAPacks();
      renderRegionBStickers();
    };

    tabPill.innerHTML = `
      <span class="pack-tab-icon">${pack.icon}</span>
      <span>${pack.name}</span>
    `;

    container.appendChild(tabPill);
  });
}

// RENDER STICKERS GRID (GOOGLE & X HIGH-DENSITY GRID)
function renderRegionBStickers() {
  const container = document.getElementById('stickers-grid-container');
  if (!container) return;

  const currentPack = PREMIUM_STICKER_PACKS.find(p => p.id === activeSelectedPackId) || PREMIUM_STICKER_PACKS[0];

  container.innerHTML = '';

  currentPack.items.forEach(sticker => {
    const tile = document.createElement('div');
    tile.className = 'sticker-tile-item';
    tile.onclick = () => {
      threadStickerToPost(activeStickerPostId, sticker, currentPack);
    };

    if (currentPack.type === 'emoji') {
      tile.innerHTML = `
        <span class="sticker-render-el">${sticker.content}</span>
        <span class="sticker-label-tag">${sticker.name}</span>
      `;
    } else {
      tile.innerHTML = `
        <img src="${sticker.content}" alt="${sticker.name}" class="sticker-img-el" onerror="this.src='https://cdn-icons-png.flaticon.com/512/616/616490.png'">
        <span class="sticker-label-tag">${sticker.name}</span>
      `;
    }

    container.appendChild(tile);
  });
}


// THREAD STICKER TO MESSAGE & TRIGGER TIKTOK GIFT ANIMATION
function threadStickerToPost(postId, sticker, pack) {
  if (!postId) return;

  if (!threadedStickersDB[postId]) {
    threadedStickersDB[postId] = [];
  }

  // Add sticker to database for this post
  threadedStickersDB[postId].push({
    sticker: sticker,
    pack: pack,
    timestamp: Date.now()
  });

  // Update card's tiny hole indicator
  const cardElement = document.querySelector(`[data-post-id="${postId}"]`);
  if (cardElement) {
    updateCardTinyHoleIndicator(cardElement, postId);
  }

  // Close drawer
  closeStickerDrawer();

  // Play consolidated TikTok Gift Animation with 2x/3x quantity badge!
  playThreadedStickersForPost(postId, cardElement);
}

// GLOBAL PLAYING LOCK (PREVENTS ANY OTHER SET FROM APPEARING UNTIL CURRENT SET FINISHES AFTER 3s)
let isStickerSetCurrentlyActive = false;

// CONSOLIDATE THREADED STICKERS & PLAY SEQUENCE (3-SECOND STRICT LIFECYCLE)
function playThreadedStickersForPost(postId, cardElement) {
  const stickersList = threadedStickersDB[postId];
  if (!stickersList || stickersList.length === 0) return;

  // Strict Lock: Another set CANNOT appear unless the current set is NO MORE
  if (isStickerSetCurrentlyActive) return;
  isStickerSetCurrentlyActive = true;

  // Group identical stickers by sticker.id and count quantity (2x, 3x, etc.)
  const groupedMap = new Map();
  stickersList.forEach(item => {
    const key = item.sticker.id;
    if (groupedMap.has(key)) {
      groupedMap.get(key).quantity += 1;
    } else {
      groupedMap.set(key, {
        sticker: item.sticker,
        pack: item.pack,
        quantity: 1
      });
    }
  });

  const groupedItems = Array.from(groupedMap.values());

  // Spawn consolidated stickers with distinct motion patterns (1 to 5)
  groupedItems.forEach((entry, index) => {
    const patternIndex = (index % 5) + 1; // Motion pattern 1 to 5
    triggerTikTokGiftAnimation(entry.sticker, entry.pack, entry.quantity, patternIndex);
  });

  // Strict Lock Release after exactly 3.2 seconds (when 3s set animation completely finishes)
  setTimeout(() => {
    isStickerSetCurrentlyActive = false;
  }, 3200);
}

// TIKTOK-STYLE GIFT ANIMATION ENGINE (5 DISTINCT MOTION PATTERNS + 3s DURATION + 2x/3x BADGES)
function triggerTikTokGiftAnimation(sticker, pack, quantity = 1, patternIndex = 1) {
  const overlay = document.getElementById('tiktok-gift-overlay-container');
  if (!overlay) return;

  const stageItem = document.createElement('div');
  stageItem.className = `sticker-gift-stage-item sticker-motion-pattern-${patternIndex}`;

  let visualHTML = '';
  if (pack.type === 'emoji') {
    visualHTML = `<span class="gift-emoji-art">${sticker.content}</span>`;
  } else {
    visualHTML = `<img src="${sticker.content}" alt="${sticker.name}" class="gift-img-art" onerror="this.src='https://cdn-icons-png.flaticon.com/512/616/616490.png'">`;
  }

  const quantityBadge = quantity > 1 ? ` <span style="color: #FFD700; font-weight: 800; font-size: 1.15em;">${quantity}x</span>` : '';

  stageItem.innerHTML = `
    <div class="gift-visual-box">
      ${visualHTML}
    </div>
    <div class="gift-label-banner">
      <span>👑 ${sticker.name}${quantityBadge}</span>
    </div>
  `;

  overlay.appendChild(stageItem);

  // Lasts for exactly 3 seconds!
  setTimeout(() => {
    if (stageItem.parentNode) stageItem.remove();
  }, 3000);
}





// SCROLL TO MIDDLE OF SCREEN DETECTOR FOR THREADED STICKERS (EVERY TIME MESSAGE REACHES MIDDLE OF SCREEN)
let isScrollChecking = false;

function setupStickerMiddleScreenObserver() {
  window.removeEventListener('scroll', checkMiddleScreenCards);
  window.addEventListener('scroll', checkMiddleScreenCards, { passive: true });
  checkMiddleScreenCards();
}

function checkMiddleScreenCards() {
  if (isScrollChecking) return;
  isScrollChecking = true;

  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.post-card-box, .twogroup-card-box');
    const screenCenterY = window.innerHeight / 2;
    const middleZoneRadius = window.innerHeight * 0.28;

    cards.forEach(card => {
      const postId = card.dataset.postId;
      if (!postId || !threadedStickersDB[postId] || threadedStickersDB[postId].length === 0) return;

      const rect = card.getBoundingClientRect();
      const cardCenterY = rect.top + (rect.height / 2);
      const isMiddle = Math.abs(cardCenterY - screenCenterY) < middleZoneRadius;

      if (isMiddle) {
        if (!card.dataset.inMiddleZone) {
          card.dataset.inMiddleZone = 'true';
          playThreadedStickersForPost(postId, card);
        }
      } else {
        // Reset when message leaves middle of screen so it plays again when user returns!
        delete card.dataset.inMiddleZone;
      }
    });

    isScrollChecking = false;
  });
}



