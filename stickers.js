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


// CREATE DRAWER MODAL DOM STRUCTURE (REGION A & REGION B)
function createStickerDrawerModalHTML() {
  if (document.getElementById('sticker-drawer-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'sticker-drawer-modal';
  modal.className = 'sticker-drawer-modal';

  modal.innerHTML = `
    <button type="button" class="btn-close-sticker-drawer" onclick="closeStickerDrawer()" title="Close">&times;</button>

    <!-- REGION A: LEFT SIDE (1 COLUMN x 4 ROWS SCROLLABLE PACKS) -->
    <div class="sticker-region-a">
      <div class="region-title-a">
        <span>🎁 Premium Packs</span>
      </div>
      <div class="packs-column-scroll" id="packs-column-container">
        <!-- Rendered via JS -->
      </div>
    </div>

    <!-- REGION B: RIGHT SIDE (3 COLUMNS x 8 ROWS SCROLLABLE STICKER GRID) -->
    <div class="sticker-region-b">
      <div class="region-title-b">
        <span id="region-b-pack-name">Emoji Gold</span>
        <span style="font-size: 0.75rem; color: #D9A273; font-weight: 500;">Tap to thread sticker</span>
      </div>
      <div class="stickers-grid-scroll" id="stickers-grid-container">
        <!-- Rendered via JS -->
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

// RENDER REGION A: 5 PACKS (1 COLUMN x 4 ROWS SCROLLABLE)
function renderRegionAPacks() {
  const container = document.getElementById('packs-column-container');
  if (!container) return;

  container.innerHTML = '';

  PREMIUM_STICKER_PACKS.forEach(pack => {
    const isSelected = pack.id === activeSelectedPackId;
    const card = document.createElement('div');
    card.className = `pack-card-item ${isSelected ? 'selected' : ''}`;
    card.onclick = () => {
      activeSelectedPackId = pack.id;
      renderRegionAPacks();
      renderRegionBStickers();
    };

    card.innerHTML = `
      <div class="pack-icon-box">${pack.icon}</div>
      <div class="pack-meta-info">
        <span class="pack-name-text">${pack.name}</span>
        <span class="pack-count-badge">${pack.count}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// RENDER REGION B: 27 STICKERS GRID (3 COLUMNS x 8 ROWS SCROLLABLE)
function renderRegionBStickers() {
  const container = document.getElementById('stickers-grid-container');
  const nameLabel = document.getElementById('region-b-pack-name');
  if (!container) return;

  const currentPack = PREMIUM_STICKER_PACKS.find(p => p.id === activeSelectedPackId) || PREMIUM_STICKER_PACKS[0];
  if (nameLabel) nameLabel.textContent = `${currentPack.name} Pack`;

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

// CONSOLIDATE THREADED STICKERS & PLAY SEQUENCE (PREVENTING DUPLICATE OVERLAPS & CLUSTERING)
function playThreadedStickersForPost(postId, cardElement) {
  const stickersList = threadedStickersDB[postId];
  if (!stickersList || stickersList.length === 0) return;

  // Prevent duplicate concurrent stacking for the exact same post
  if (cardElement && cardElement.dataset.activeGiftPlaying === 'true') return;
  if (cardElement) cardElement.dataset.activeGiftPlaying = 'true';

  // Group stickers by sticker.id and count quantity (2x, 3x, etc.)
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

  // Staggered non-overlapping spatial sequence playback
  groupedItems.forEach((entry, index) => {
    const slotIndex = index % 5; // Assign distinct screen slot (0 to 4)
    setTimeout(() => {
      triggerTikTokGiftAnimation(entry.sticker, entry.pack, entry.quantity, slotIndex);
    }, index * 1200); // Staggered by 1.2s for clean breathing room!
  });

  // Unlock activeGiftPlaying after sequence completes
  const totalSeqDuration = Math.max(6000, groupedItems.length * 1200 + 4000);
  setTimeout(() => {
    if (cardElement) delete cardElement.dataset.activeGiftPlaying;
  }, totalSeqDuration);
}

// REAL-TIME PHYSICS & COLLISION ENGINE FOR FLOATING STICKERS
const activePhysicsStickers = [];
let physicsLoopActive = false;

function startPhysicsLoop() {
  if (physicsLoopActive) return;
  physicsLoopActive = true;

  function loop() {
    updateStickerPhysics();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

function updateStickerPhysics() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Flow boundaries: keep stickers floating smoothly around the central viewport (not stuck at edges!)
  const minX = width * 0.15;
  const maxX = width * 0.85;
  const minY = height * 0.15;
  const maxY = height * 0.85;

  // 1. Position Update & Gentle Central Flow Bounce
  for (let i = 0; i < activePhysicsStickers.length; i++) {
    const s = activePhysicsStickers[i];

    s.x += s.vx;
    s.y += s.vy;

    // Gentle velocity direction reversal at central flow bounds
    if (s.x < minX) { s.x = minX; s.vx = Math.abs(s.vx); }
    if (s.x > maxX) { s.x = maxX; s.vx = -Math.abs(s.vx); }
    if (s.y < minY) { s.y = minY; s.vy = Math.abs(s.vy); }
    if (s.y > maxY) { s.y = maxY; s.vy = -Math.abs(s.vy); }

    if (s.element) {
      s.element.style.left = `${s.x}px`;
      s.element.style.top = `${s.y}px`;
    }
  }

  // 2. Collision Detection: Spark burst & elastic bounce when stickers contact each other
  const now = Date.now();
  for (let i = 0; i < activePhysicsStickers.length; i++) {
    for (let j = i + 1; j < activePhysicsStickers.length; j++) {
      const s1 = activePhysicsStickers[i];
      const s2 = activePhysicsStickers[j];

      const dx = s2.x - s1.x;
      const dy = s2.y - s1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = s1.radius + s2.radius;

      if (dist < minDist && dist > 0) {
        // THEY CAME IN CONTACT! Trigger Spark Explosion & Vector Bounce
        if (now - s1.lastSpark > 600 && now - s2.lastSpark > 600) {
          s1.lastSpark = now;
          s2.lastSpark = now;

          const midX = (s1.x + s2.x) / 2;
          const midY = (s1.y + s2.y) / 2;

          // Spawn Explosive Golden Spark Particle Burst
          spawnSparkBurstEffect(midX, midY);

          // Flash colliding stickers
          if (s1.element) s1.element.classList.add('colliding');
          if (s2.element) s2.element.classList.add('colliding');
          setTimeout(() => {
            if (s1.element) s1.element.classList.remove('colliding');
            if (s2.element) s2.element.classList.remove('colliding');
          }, 350);

          // Physical elastic bounce vectors
          const nx = dx / dist;
          const ny = dy / dist;
          const kx = s1.vx - s2.vx;
          const ky = s1.vy - s2.vy;
          const p = 2 * (nx * kx + ny * ky) / 2;

          s1.vx -= p * nx;
          s1.vy -= p * ny;
          s2.vx += p * nx;
          s2.vy += p * ny;
        }
      }
    }
  }
}

// SPAWN GOLDEN SPARK & EXPLOSION PARTICLE BURST AT CONTACT POINT
function spawnSparkBurstEffect(x, y) {
  const overlay = document.getElementById('tiktok-gift-overlay-container');
  if (!overlay) return;

  const sparkBox = document.createElement('div');
  sparkBox.className = 'collision-spark-burst';
  sparkBox.style.left = `${x}px`;
  sparkBox.style.top = `${y}px`;

  const sparkSymbols = ['💥', '✨', '⚡', '🌟', '💫', '🔥'];

  for (let i = 0; i < 8; i++) {
    const symbol = sparkSymbols[Math.floor(Math.random() * sparkSymbols.length)];
    const angle = (i / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const el = document.createElement('span');
    el.className = 'spark-symbol';
    el.textContent = symbol;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);

    sparkBox.appendChild(el);
  }

  overlay.appendChild(sparkBox);

  setTimeout(() => {
    if (sparkBox.parentNode) sparkBox.remove();
  }, 750);
}

// TIKTOK-STYLE GIFT STICKER WITH REAL-TIME PHYSICS & COLLISION
function triggerTikTokGiftAnimation(sticker, pack, quantity = 1, slotIndex = 0) {
  const overlay = document.getElementById('tiktok-gift-overlay-container');
  if (!overlay) return;

  startPhysicsLoop();

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Initialize position in central screen flow region (never stuck at edges!)
  const startX = (width * 0.25) + (Math.random() * width * 0.5);
  const startY = (height * 0.25) + (Math.random() * height * 0.5);

  // Organic floating velocity
  const angle = Math.random() * Math.PI * 2;
  const speed = 1.2 + Math.random() * 1.5;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const stageItem = document.createElement('div');
  stageItem.className = 'physics-floating-sticker';
  stageItem.style.left = `${startX}px`;
  stageItem.style.top = `${startY}px`;

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

  const physicsObj = {
    id: 'phys_' + Date.now() + '_' + Math.random(),
    x: startX,
    y: startY,
    vx: vx,
    vy: vy,
    radius: 65, // ~130px collision boundary
    element: stageItem,
    lastSpark: 0
  };

  activePhysicsStickers.push(physicsObj);

  // Stays active / flowing for 6 minutes (360,000 ms) or clean removal
  setTimeout(() => {
    const idx = activePhysicsStickers.indexOf(physicsObj);
    if (idx !== -1) activePhysicsStickers.splice(idx, 1);
    if (stageItem.parentNode) stageItem.remove();
  }, 360000); // 6 Minutes!
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



