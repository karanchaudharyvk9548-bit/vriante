// ===== ENTRY SCREEN =====
function enterSite() {
  const entry = document.getElementById('entryScreen');
  if (entry) {
    entry.classList.add('hide');
    setTimeout(() => {
      entry.style.display = 'none';
      document.body.classList.remove('loading');
      renderProducts();
    }, 600);
  }
}
document.body.classList.add('loading');

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  const progress = document.getElementById('scrollProgress');
  if (progress) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = ((scrollTop / docHeight) * 100) + '%';
  }
});

// ===== REVEAL OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.05 });

// ===== SIDE MENU =====
function toggleMenu() {
  document.getElementById('sideMenu').classList.toggle('active');
}

// ===== SEARCH =====
function toggleSearch() {
  const overlay = document.getElementById('searchOverlay');
  overlay.classList.toggle('active');
  if (overlay.classList.contains('active')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
  }
}
function liveSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const results = document.getElementById('searchResults');
  if (!q) { results.innerHTML = ''; return; }
  const matches = allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
  results.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="toggleSearch(); openQuickView(${p.id})">
      <img src="${p.img}" alt="${p.name}">
      <h5>${p.name}</h5>
      <p>₹${p.price}</p>
    </div>
  `).join('') || '<p style="color:#94a3b8;text-align:center;grid-column:1/-1;padding:40px;letter-spacing:2px;">No products found</p>';
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('rubicon_cart') || '[]');
let appliedCoupon = null;

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}
function saveCart() {
  localStorage.setItem('rubicon_cart', JSON.stringify(cart));
  updateCartUI();
}
function updateCartUI() {
  const count = document.getElementById('cartCount');
  const itemCount = document.getElementById('cartItemCount');
  const total = document.getElementById('cartTotal');
  const items = document.getElementById('cartItems');
  if (count) count.textContent = cart.length;
  if (itemCount) itemCount.textContent = cart.length;
  if (cart.length === 0) {
    items.innerHTML = '<p class="cart-empty">Your bag is empty</p>';
    if (total) total.textContent = '₹0';
    return;
  }
  let sum = 0;
  items.innerHTML = cart.map((item, i) => {
    sum += item.price;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <h5>${item.name}</h5>
          <small>Size: ${item.size}</small>
          <p>₹${item.price}</p>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
      </div>
    `;
  }).join('');

  let finalTotal = sum;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      finalTotal = sum - Math.round(sum * appliedCoupon.discount / 100);
    } else {
      finalTotal = sum - appliedCoupon.discount;
    }
  }
  if (total) total.textContent = '₹' + finalTotal;
}
function addToCart(product, size) {
  if (!size) { showToast('Please select size first'); return; }
  cart.push({ ...product, size });
  saveCart();
  showToast('Added to bag');
}
function removeFromCart(i) {
  cart.splice(i, 1);
  saveCart();
  showToast('Removed from bag');
}

// ===== CHECKOUT WHATSAPP =====
function checkoutWhatsApp() {
  if (cart.length === 0) { showToast('Bag is empty'); return; }
  let msg = 'Hi RUBICON! I want to order:%0A%0A';
  let total = 0;
  cart.forEach((item, i) => {
    msg += `*${i+1}.* ${item.name}%0A   Size: ${item.size}%0A   Price: ₹${item.price}%0A%0A`;
    total += item.price;
  });
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      total = total - Math.round(total * appliedCoupon.discount / 100);
    } else {
      total = total - appliedCoupon.discount;
    }
    msg += `*Coupon Applied:* ${appliedCoupon.code}%0A`;
  }
  msg += `*TOTAL: ₹${total}*%0A%0APlease confirm!`;
  window.open(`https://wa.me/917000000777?text=${msg}`, '_blank');
}

// ===== MEMBERSHIP =====
function joinMembership(plan, price) {
  const msg = `Hi RUBICON! I want to join VIP Membership.%0A%0A*Plan:* ${plan}%0A*Price:* ₹${price}%0A%0APlease confirm!`;
  window.open(`https://wa.me/917000000777?text=${msg}`, '_blank');
  showToast(plan + ' Membership — Opening WhatsApp');
}

// ===== COUPON SYSTEM =====
const coupons = {
  'RAHUL10': { discount: 10, type: 'percent' },
  'PRIYA15': { discount: 15, type: 'percent' },
  'WELCOME20': { discount: 20, type: 'percent' }
};

function applyCoupon() {
  const input = document.getElementById('couponInput');
  const msg = document.getElementById('couponMessage');
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    msg.textContent = 'Please enter a coupon code';
    msg.className = 'error';
    return;
  }

  if (coupons[code]) {
    appliedCoupon = { code: code, discount: coupons[code].discount, type: coupons[code].type };
    msg.textContent = '✓ Coupon applied! ' + coupons[code].discount + '% off';
    msg.className = 'success';
    updateCartUI();
    showToast('Coupon applied!');
  } else {
    appliedCoupon = null;
    msg.textContent = '✗ Invalid coupon code';
    msg.className = 'error';
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuickView();
    const sm = document.getElementById('sideMenu');
    const so = document.getElementById('searchOverlay');
    const cd = document.getElementById('cartDrawer');
    const co = document.getElementById('cartOverlay');
    if (sm) sm.classList.remove('active');
    if (so) so.classList.remove('active');
    if (cd) cd.classList.remove('active');
    if (co) co.classList.remove('active');
  }
});

// ===== NEWSLETTER =====
function subscribeMsg() { showToast('Subscribed!'); }

// ===== HERO SLIDESHOW =====
let currentSlide = 0;
setInterval(() => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 6000);

// ===== PRODUCT IMAGES =====
const productImages = {
  tshirt: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600'
  ],
  shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600'
  ],
  pant: [
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600'
  ],
  hoodie: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
    'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'
  ]
};

const productNames = {
  tshirt: ['Oversized Black Tee','Red Graphic Tee','White Classic Tee','Blue Drop Shoulder','Black Printed Tee','Red Oversized Tee','White Oversized Tee','Blue Graphic Tee'],
  shirt: ['Classic Black Shirt','Casual White Shirt','Red Check Shirt','Blue Check Shirt','Black Formal Shirt','White Formal Shirt','Blue Denim Shirt','Red Flannel Shirt'],
  pant: ['Cargo Street Pants','Slim Fit Denim','Black Cargo Pants','Blue Denim Jeans','Grey Track Pants','Black Formal Trousers','Beige Chinos','Olive Cargo Pants'],
  hoodie: ['Premium Black Hoodie','Oversized Zip Hoodie','Red Pullover Hoodie','Blue Hoodie','White Hoodie','Black Printed Hoodie','Red Zip Hoodie']
};

function generateProducts() {
  const all = [];
  let id = 1;
  const cats = [
    { key:'tshirt', count:8, priceMin:499, priceMax:2999 },
    { key:'shirt', count:8, priceMin:699, priceMax:3999 },
    { key:'pant', count:7, priceMin:999, priceMax:5999 },
    { key:'hoodie', count:7, priceMin:899, priceMax:3499 }
  ];
  cats.forEach(c => {
    for (let i = 0; i < c.count; i++) {
      const images = productImages[c.key];
      const names = productNames[c.key];
      const img = images[i % images.length];
      const baseName = names[i % names.length];
      const variant = Math.floor(i / names.length) + 1;
      const name = variant > 1 ? baseName + ' V' + variant : baseName;
      const price = Math.floor(Math.random() * (c.priceMax - c.priceMin) + c.priceMin);
      const tags = ['', '', 'NEW', 'BEST', 'HOT', 'LIMITED'];
      const tag = tags[Math.floor(Math.random() * tags.length)];
      all.push({ id: id++, name, price, cat: c.key, tag, img });
    }
  });
  return all;
}

const allProducts = generateProducts();

let currentFilter = 'all';
let visibleCount = 12;
let currentProduct = null;
let selectedSize = '';

function getCatName(cat) {
  const names = { tshirt:'T-Shirt', shirt:'Shirt', pant:'Pants', hoodie:'Hoodie' };
  return names[cat] || cat;
}
function getOriginalPrice(discountedPrice) {
  return Math.round(discountedPrice / 0.7);
}

function filterProducts(cat, el) {
  currentFilter = cat;
  visibleCount = 12;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProducts();
  if (cat !== 'all') {
    const el2 = document.getElementById('collection');
    if (el2) el2.scrollIntoView({ behavior: 'smooth' });
  }
}

function getFilteredProducts() {
  let filtered = [...allProducts];
  if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.cat === currentFilter);
  }
  return filtered;
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  if (toShow.length === 0) {
    grid.innerHTML = '<p style="color:#94a3b8;grid-column:1/-1;text-align:center;padding:80px 20px;letter-spacing:2px;text-transform:uppercase;font-size:12px;">No products found</p>';
    const btn = document.getElementById('loadMoreBtn');
    if (btn) btn.style.display = 'none';
    return;
  }

  grid.innerHTML = toShow.map(p => {
    const original = getOriginalPrice(p.price);
    const tagClass = p.tag === 'BEST' ? 'green' : (p.tag === 'NEW' ? 'white' : '');
    return `
      <div class="product" onclick="openQuickView(${p.id})">
        <div class="product-img">
          ${p.tag ? `<span class="product-tag ${tagClass}">${p.tag}</span>` : ''}
          <span class="product-discount">-30%</span>
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <button class="quick-view-btn" onclick="event.stopPropagation(); openQuickView(${p.id})">Quick View</button>
        </div>
        <div class="product-info">
          <p class="cat">${getCatName(p.cat)}</p>
          <h4>${p.name}</h4>
          <div class="product-price">
            <span class="price">₹${p.price} <small>₹${original}</small></span>
            <button class="buy-btn" onclick="event.stopPropagation(); openQuickView(${p.id})">Buy</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    if (visibleCount >= filtered.length) btn.style.display = 'none';
    else {
      btn.style.display = 'inline-block';
      btn.textContent = `Load More (${filtered.length - visibleCount} more)`;
    }
  }
  document.querySelectorAll('.product').forEach(el => observer.observe(el));
}

function loadMore() { visibleCount += 12; renderProducts(); }

// ===== QUICK VIEW =====
function openQuickView(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  selectedSize = '';
  document.getElementById('qvImg').src = p.img;
  document.getElementById('qvCat').textContent = getCatName(p.cat);
  document.getElementById('qvTitle').textContent = p.name;
  document.getElementById('qvPrice').innerHTML = `₹${p.price} <small style="color:#94a3b8;text-decoration:line-through;font-size:16px;">₹${getOriginalPrice(p.price)}</small>`;
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  document.getElementById('quickViewModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeQuickView() {
  const qv = document.getElementById('quickViewModal');
  if (qv) qv.classList.remove('active');
  document.body.style.overflow = 'auto';
}
function selectSize(btn) {
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = btn.textContent;
}
function addToCartFromQuickView() {
  if (!currentProduct) return;
  if (!selectedSize) { showToast('Please select size'); return; }
  addToCart(currentProduct, selectedSize);
  closeQuickView();
}
function orderFromQuickView() {
  if (!currentProduct) return;
  if (!selectedSize) { showToast('Please select size'); return; }
  const msg = `Hi RUBICON! I want to order:%0A%0A*Product:* ${currentProduct.name}%0A*Price:* ₹${currentProduct.price} (30% OFF)%0A*Size:* ${selectedSize}%0A%0APlease confirm!`;
  window.open(`https://wa.me/917000000777?text=${msg}`, '_blank');
}

// ===== INIT =====
window.addEventListener('load', () => {
  setTimeout(() => {
    updateCartUI();
  }, 1000);
});
