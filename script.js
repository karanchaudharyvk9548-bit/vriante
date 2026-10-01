/* ============================================
   VRIANTE — Frontend Interactions
   ============================================ */

/* ===== UTILITIES ===== */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ===== SCROLL EFFECTS ===== */
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const nav = document.getElementById('nav');
    if (nav) {
      if (window.scrollY > 60) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    scrollTicking = false;
  });
}, { passive: true });

/* ===== REVEAL OBSERVER ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function attachReveal() {
  document.querySelectorAll(
    '.editorial-text, .editorial-media, .section-head-center, ' +
    '.products-head, .campaign-content, .category-card, ' +
    '.philosophy-inner, .look-item, .newsletter-inner, ' +
    '.footer-inner, .product'
  ).forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  });
}

/* ===== SIDE MENU ===== */
function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideOverlay');
  if (!menu) return;
  const opening = !menu.classList.contains('active');
  menu.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
  document.body.style.overflow = opening ? 'hidden' : '';
}

/* ===== SEARCH ===== */
function toggleSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  const opening = !overlay.classList.contains('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = opening ? 'hidden' : '';
  if (opening) {
    setTimeout(() => {
      const input = document.getElementById('searchInput');
      if (input) input.focus();
    }, 120);
  }
}

function liveSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;
  const q = input.value.trim().toLowerCase();
  if (!q) { results.innerHTML = ''; return; }
  const matches = allProducts
    .filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
    .slice(0, 8);
  if (matches.length === 0) {
    results.innerHTML = '<p style="grid-column:1/-1;color:var(--mid-grey);font-size:13px;letter-spacing:1px;font-style:italic;padding:30px 0;">No products found.</p>';
    return;
  }
  results.innerHTML = matches.map(p => `
    <div class="search-item" onclick="toggleSearch(); openQuickView(${p.id})">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h5>${p.name}</h5>
      <p>₹${p.price.toLocaleString('en-IN')}</p>
    </div>
  `).join('');
}

/* ===== CART ===== */
let cart = [];
let appliedCoupon = null;

try {
  cart = JSON.parse(localStorage.getItem('vriante_cart') || '[]');
} catch (e) { cart = []; }

function saveCart() {
  try {
    localStorage.setItem('vriante_cart', JSON.stringify(cart));
  } catch (e) {}
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer) return;
  const opening = !drawer.classList.contains('active');
  drawer.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
  document.body.style.overflow = opening ? 'hidden' : '';
}

function updateCartUI() {
  const count = document.getElementById('cartCount');
  const itemCount = document.getElementById('cartItemCount');
  const total = document.getElementById('cartTotal');
  const items = document.getElementById('cartItems');

  if (count) count.textContent = cart.length;
  if (itemCount) itemCount.textContent = `(${cart.length})`;

  if (!items) return;

  if (cart.length === 0) {
    items.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
    if (total) total.textContent = '₹0';
    return;
  }

  let sum = 0;
  items.innerHTML = cart.map((item, i) => {
    sum += item.price;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="cart-item-info">
          <h5>${item.name}</h5>
          <small>Size ${item.size} · Qty 1</small>
          <p>₹${item.price.toLocaleString('en-IN')}</p>
        </div>
        <button class="cart-remove" onclick="removeFromCart(${i})" aria-label="Remove">✕</button>
      </div>
    `;
  }).join('');

  let finalTotal = sum;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      finalTotal = sum - Math.round(sum * appliedCoupon.discount / 100);
    } else {
      finalTotal = Math.max(0, sum - appliedCoupon.discount);
    }
  }
  if (total) total.textContent = '₹' + finalTotal.toLocaleString('en-IN');
}

function addToCart(product, size) {
  if (!size) { showToast('Please select a size'); return; }
  cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, size });
  saveCart();
  updateCartUI();
  showToast('Added to bag');
}

function addToCartFromQuickView() {
  if (!currentProduct) return;
  if (!selectedSize) { showToast('Please select a size'); return; }
  addToCart(currentProduct, selectedSize);
  closeQuickView();
  toggleCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  saveCart();
  updateCartUI();
  showToast('Removed from bag');
}

/* ===== WHATSAPP CHECKOUT ===== */
const WHATSAPP_NUMBER = '917000000777'; // Change this

function checkoutWhatsApp() {
  if (cart.length === 0) { showToast('Your bag is empty'); return; }

  let msg = 'Hi VRIANTE! I would like to order:%0A%0A';
  let total = 0;
  cart.forEach((item, i) => {
    msg += `*${i + 1}.* ${item.name}%0A   Size: ${item.size}%0A   Price: ₹${item.price.toLocaleString('en-IN')}%0A%0A`;
    total += item.price;
  });

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      total = total - Math.round(total * appliedCoupon.discount / 100);
    } else {
      total = Math.max(0, total - appliedCoupon.discount);
    }
    msg += `*Coupon:* ${appliedCoupon.code}%0A%0A`;
  }

  msg += `*TOTAL: ₹${total.toLocaleString('en-IN')}*%0A%0APlease confirm my order.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

/* ===== NEWSLETTER ===== */
function subscribeMsg() {
  const email = document.getElementById('newsletterEmail');
  const note = document.getElementById('newsletterNote');
  if (!email || !note) return;
  const value = email.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!valid) {
    note.textContent = 'Please enter a valid email address.';
    note.style.color = '#e06c6c';
    return;
  }
  note.textContent = 'Thank you. You will be notified at launch.';
  note.style.color = 'var(--accent)';
  email.value = '';
}

/* ===== KEYBOARD & OUTSIDE CLICK ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuickView();
    const sm = document.getElementById('sideMenu');
    const so = document.getElementById('searchOverlay');
    const cd = document.getElementById('cartDrawer');
    const co = document.getElementById('cartOverlay');
    const sov = document.getElementById('sideOverlay');
    if (sm) sm.classList.remove('active');
    if (so) so.classList.remove('active');
    if (cd) cd.classList.remove('active');
    if (co) co.classList.remove('active');
    if (sov) sov.classList.remove('active');
    document.body.style.overflow = '';
  }
});

document.addEventListener('click', (e) => {
  const qv = document.getElementById('quickViewModal');
  if (e.target === qv) closeQuickView();
});

/* ===== INIT ===== */
window.addEventListener('load', () => {
  updateCartUI();
  attachReveal();
});

window.addEventListener('DOMContentLoaded', () => {
  attachReveal();
});/* ===== PRODUCT DATA (Demo — Editable) ===== */
const allProducts = [
  {
    id: 1,
    name: 'Oversized Heavyweight Tee',
    price: 1299,
    cat: 'tshirt',
    tag: 'NEW',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85',
    desc: 'Heavyweight 240 GSM cotton. Drop shoulder. Pre-shrunk.'
  },
  {
    id: 2,
    name: 'Charcoal Boxy Tee',
    price: 1199,
    cat: 'tshirt',
    tag: '',
    img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=85',
    desc: 'Boxy silhouette. Garment dyed. Soft hand-feel.'
  },
  {
    id: 3,
    name: 'Off-White Essential Tee',
    price: 1099,
    cat: 'tshirt',
    tag: '',
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85',
    desc: 'Warm off-white. Ribbed collar. Structured fit.'
  },
  {
    id: 4,
    name: 'Black Signature Tee',
    price: 1399,
    cat: 'tshirt',
    tag: 'BEST',
    img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=85',
    desc: 'Signature VRIANTE print. Heavyweight cotton.'
  },
  {
    id: 5,
    name: 'Washed Graphic Tee',
    price: 1499,
    cat: 'tshirt',
    tag: '',
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85',
    desc: 'Vintage wash. Faded graphic. One-of-one feel.'
  },
  {
    id: 6,
    name: 'Deep Navy Oversized Tee',
    price: 1299,
    cat: 'tshirt',
    tag: '',
    img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=85',
    desc: 'Navy. Drop shoulder. Relaxed fit.'
  },
  {
    id: 7,
    name: 'Signature Hoodie — Black',
    price: 2499,
    cat: 'hoodie',
    tag: 'BEST',
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85',
    desc: 'Heavyweight 400 GSM fleece. Kangaroo pocket.'
  },
  {
    id: 8,
    name: 'Zip Hoodie — Charcoal',
    price: 2699,
    cat: 'hoodie',
    tag: 'NEW',
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85',
    desc: 'Full-zip. Ribbed cuffs. Premium fleece.'
  },
  {
    id: 9,
    name: 'Pullover Hoodie — Off-White',
    price: 2399,
    cat: 'hoodie',
    tag: '',
    img: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=85',
    desc: 'Warm off-white. Brushed interior.'
  },
  {
    id: 10,
    name: 'Embroidered Hoodie — Black',
    price: 2899,
    cat: 'hoodie',
    tag: 'LIMITED',
    img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=85',
    desc: 'Embroidered VRIANTE monogram. Limited run.'
  },
  {
    id: 11,
    name: 'Oversized Hoodie — Sand',
    price: 2599,
    cat: 'hoodie',
    tag: '',
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85',
    desc: 'Sand colourway. Boxy fit.'
  },
  {
    id: 12,
    name: 'Heavy Fleece Hoodie — Grey',
    price: 2699,
    cat: 'hoodie',
    tag: '',
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85',
    desc: 'Heather grey. Heavyweight fleece.'
  }
];

/* ===== STATE ===== */
let currentFilter = 'all';
let visibleCount = 8;
let currentProduct = null;
let selectedSize = '';

/* ===== HELPERS ===== */
function getCatName(cat) {
  const names = { tshirt: 'T-Shirt', hoodie: 'Hoodie', shirt: 'Shirt', pant: 'Pants' };
  return names[cat] || cat;
}

function getOriginalPrice(price) {
  return Math.round(price / 0.7);
}

function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

/* ===== FILTER ===== */
function filterProducts(cat, el) {
  currentFilter = cat;
  visibleCount = 8;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if (el) {
    el.classList.add('active');
  } else {
    document.querySelectorAll('.chip').forEach(c => {
      if (c.dataset.filter === cat) c.classList.add('active');
    });
  }
  renderProducts();
  scrollToId('shop');
}

/* ===== GET FILTERED ===== */
function getFilteredProducts() {
  if (currentFilter === 'all') return [...allProducts];
  return allProducts.filter(p => p.cat === currentFilter);
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  if (toShow.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--mid-grey);font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:80px 20px;">No products found</p>';
    const btn = document.getElementById('loadMoreBtn');
    if (btn) btn.style.display = 'none';
    return;
  }

  grid.innerHTML = toShow.map(p => {
    const original = getOriginalPrice(p.price);
    const tagClass = p.tag === 'BEST' ? 'alt' : '';
    return `
      <article class="product" onclick="openQuickView(${p.id})">
        <div class="product-img">
          ${p.tag ? `<span class="product-tag ${tagClass}">${p.tag}</span>` : ''}
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <button class="quick-view-btn" onclick="event.stopPropagation(); openQuickView(${p.id})">Quick View</button>
        </div>
        <div class="product-info">
          <p class="product-cat">${getCatName(p.cat)}</p>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-price">
            <span class="now">${formatPrice(p.price)}</span>
            <span class="was">${formatPrice(original)}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    if (visibleCount >= filtered.length) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'inline-block';
      btn.textContent = `LOAD MORE (${filtered.length - visibleCount})`;
    }
  }

  // Re-observe new products for reveal
  document.querySelectorAll('.product').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

function loadMore() {
  visibleCount += 8;
  renderProducts();
}

/* ===== QUICK VIEW ===== */
function openQuickView(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  selectedSize = '';

  const qvImg = document.getElementById('qvImg');
  const qvCat = document.getElementById('qvCat');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const modal = document.getElementById('quickViewModal');

  if (qvImg) qvImg.src = p.img;
  if (qvCat) qvCat.textContent = getCatName(p.cat);
  if (qvTitle) qvTitle.textContent = p.name;
  if (qvPrice) qvPrice.innerHTML = `${formatPrice(p.price)} <small>${formatPrice(getOriginalPrice(p.price))}</small>`;

  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('active');
  if (!document.getElementById('cartDrawer')?.classList.contains('active') &&
      !document.getElementById('sideMenu')?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function selectSize(btn) {
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = btn.textContent.trim();
}

function orderFromQuickView() {
  if (!currentProduct) return;
  if (!selectedSize) { showToast('Please select a size'); return; }
  const msg = `Hi VRIANTE! I am interested in:%0A%0A*Product:* ${currentProduct.name}%0A*Size:* ${selectedSize}%0A*Price:* ₹${currentProduct.price.toLocaleString('en-IN')}%0A%0APlease share more details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

/* ===== INITIAL RENDER ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
