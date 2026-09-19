// ===== LOADER =====
document.body.classList.add('loading');
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
    document.body.classList.remove('loading');
    document.querySelectorAll('.section, .section-head, .brand-card, .blog-card, .testimonial, .about-grid, .store-card, .about-img').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
    setTimeout(() => {
      renderProducts();
      updateCountdown();
    }, 300);
  }, 1800);
});

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
}, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

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
  `).join('') || '<p style="color:#64748b;text-align:center;grid-column:1/-1;padding:40px;letter-spacing:2px;">No products found</p>';
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('hovans_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('hovans_wishlist') || '[]');

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}
function saveCart() {
  localStorage.setItem('hovans_cart', JSON.stringify(cart));
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
  if (total) total.textContent = '₹' + sum;
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
function checkoutWhatsApp() {
  if (cart.length === 0) { showToast('Bag is empty'); return; }
  let msg = 'Hi Hovans Wear! I want to order:%0A%0A';
  let total = 0;
  cart.forEach((item, i) => {
    msg += `*${i+1}.* ${item.name}%0A   Size: ${item.size}%0A   Price: ₹${item.price}%0A%0A`;
    total += item.price;
  });
  msg += `*TOTAL: ₹${total}*%0A%0APlease confirm my order!`;
  window.open(`https://wa.me/919900098766?text=${msg}`, '_blank');
}

// ===== WISHLIST =====
function toggleWishlist() {
  showToast(`Wishlist: ${wishlist.length} items`);
}
function updateWishlistUI() {
  const count = document.getElementById('wishlistCount');
  if (count) count.textContent = wishlist.length;
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== KEYBOARD & OUTSIDE CLICK =====
document.addEventListener('click', (e) => {
  const qv = document.getElementById('quickViewModal');
  const om = document.getElementById('orderModal');
  if (e.target === qv) closeQuickView();
  if (e.target === om) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuickView(); closeModal();
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
  }
});

// ===== FAQ & NEWSLETTER =====
function toggleFaq(el) { el.classList.toggle('active'); }
function subscribeMsg() { showToast('Subscribed! Check your email'); }

// ===== COUNTDOWN =====
function updateCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59);
  const distance = target.getTime() - new Date().getTime();
  if (distance < 0) return;
  const d = Math.floor(distance / (1000*60*60*24));
  const h = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const m = Math.floor((distance % (1000*60*60)) / (1000*60));
  const s = Math.floor((distance % (1000*60)) / 1000);
  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');
  if (dEl) dEl.textContent = String(d).padStart(2,'0');
  if (hEl) hEl.textContent = String(h).padStart(2,'0');
  if (mEl) mEl.textContent = String(m).padStart(2,'0');
  if (sEl) sEl.textContent = String(s).padStart(2,'0');
}
setInterval(updateCountdown, 1000);

// ===== HERO SLIDESHOW =====
let currentSlide = 0;
setInterval(() => {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}, 6000);// ===== PRODUCT IMAGES (HOVANS WEAR - 4 CATEGORIES) =====
const productImages = {
  tshirt: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600',
    'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'
  ],
  shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600',
    'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=600',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'
  ],
  pant: [
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600',
    'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600'
  ],
  sportswear: [
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600'
  ]
};

// ===== PRODUCT NAMES (HOVANS WEAR) =====
const productNames = {
  tshirt: ['Oversized Black Tee','Red Graphic Tee','White Classic Tee','Blue Drop Shoulder','Black Printed Tee','Red Oversized Tee','White Oversized Tee','Blue Graphic Tee','Black Minimal Tee','Red Polo Tee','White Striped Tee','Blue Polo Tee','Black V-Neck Tee','Red Round Neck','Premium Full Sleeve','White Henley Tee','Blue Acid Wash','Black Tie-Dye','Red Signature Tee','Premium Cotton Tee'],
  shirt: ['Classic Black Shirt','Casual White Shirt','Red Check Shirt','Blue Check Shirt','Black Formal Shirt','White Formal Shirt','Blue Denim Shirt','Red Flannel Shirt','Blue Linen Shirt','Black Casual Shirt','White Linen Shirt','Red Formal Shirt','Blue Casual Shirt','Black Striped Shirt','White Striped Shirt','Blue Oxford Shirt','Red Casual Shirt','Blue Formal Shirt','Black Party Shirt','White Party Shirt','Red Satin Shirt','Blue Satin Shirt','Black Silk Shirt','White Silk Shirt','Denim Casual Shirt','Red Denim Shirt','Blue Denim Shirt','Black OverShirt','White OverShirt','Premium Signature Shirt'],
  pant: ['Cargo Street Pants','Slim Fit Denim','Black Cargo Pants','Blue Denim Jeans','Grey Track Pants','Black Formal Trousers','Beige Chinos','Olive Cargo Pants','Black Denim Jeans','White Chinos','Navy Trousers','Grey Formal Pants','Black Joggers','Red Track Pants','Blue Cargo Pants','Blue Slim Jeans','Black Slim Jeans','Grey Joggers','Beige Cargo Pants','Black Chinos','Brown Chinos','Navy Cargo Pants','Ripped Denim','Black Track Pants','Olive Chinos','Grey Cargo Pants','Blue Denim Shorts','Black Denim Shorts','White Track Pants','Premium Wool Trousers','Black Leather Pants','Beige Linen Pants','Blue Cargo Pants','Blue Joggers','Red Joggers','Navy Formal Pants','Brown Leather Pants','Grey Wool Trousers','Premium Cargo Pants','Designer Denim Jeans'],
  sportswear: ['Performance Training Tee','Dry-Fit Gym T-Shirt','Running Tank Top','Athletic Shorts','Track Pants Pro','Compression Tights','Gym Hoodie','Sports Jacket','Yoga Leggings','Running Shoes Tee','CrossFit Tank','Basketball Jersey','Football Training Kit','Cycling Jersey','Swimming Trunks','Tennis Polo','Gym Stringer','Muscle Fit Tee','Moisture Wicking Tee','Reflective Running Jacket','Sports Bra','Athletic Socks Pack','Gym Gloves','Training Shorts','Running Cap','Sweatband Set','Sports Water Bottle','Gym Duffle Bag','Fitness Tracker Band','Resistance Band Set','Jump Rope Pro','Yoga Mat Premium','Foam Roller','Massage Gun','Gym Belt','Lifting Straps','Knee Sleeves','Wrist Wraps','Ankle Weights','Weighted Vest']
};

// ===== GENERATE 300 PRODUCTS =====
function generateProducts() {
  const all = [];
  let id = 1;
  const cats = [
    { key:'tshirt', count:80, priceMin:499, priceMax:2999 },
    { key:'shirt', count:80, priceMin:699, priceMax:3999 },
    { key:'pant', count:80, priceMin:999, priceMax:5999 },
    { key:'sportswear', count:60, priceMin:599, priceMax:4999 }
  ];

  cats.forEach(c => {
    for (let i = 0; i < c.count; i++) {
      const images = productImages[c.key];
      const names = productNames[c.key];
      const img = images[i % images.length];
      const baseName = names[i % names.length];
      const variant = Math.floor(i / names.length) + 1;
      const name = variant > 1 ? `${baseName} V${variant}` : baseName;
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
let visibleCount = 16;
let currentProduct = null;
let selectedSize = '';
let activeFilters = { categories: [], price: null, sizes: [] };
let currentSort = 'default';

// ===== HELPERS =====
function getCatName(cat) {
  const names = { tshirt:'T-Shirt', shirt:'Shirt', pant:'Pants', sportswear:'Sportswear' };
  return names[cat] || cat;
}
function getOriginalPrice(discountedPrice) {
  return Math.round(discountedPrice / 0.7);
}

// ===== FILTER =====
function toggleFilter() {
  document.getElementById('filterSidebar').classList.toggle('active');
}
function toggleSizeFilter(btn) {
  btn.classList.toggle('active');
  applyFilters();
}
function clearFilters() {
  document.querySelectorAll('.filter-group input').forEach(i => i.checked = false);
  document.querySelectorAll('.size-filter button').forEach(b => b.classList.remove('active'));
  activeFilters = { categories: [], price: null, sizes: [] };
  currentFilter = 'all';
  visibleCount = 16;
  renderProducts();
}
function applyFilters() {
  activeFilters.categories = Array.from(document.querySelectorAll('.filter-group input[type="checkbox"]:checked')).map(i => i.value);
  const priceRadio = document.querySelector('.filter-group input[name="price"]:checked');
  activeFilters.price = priceRadio ? priceRadio.value : null;
  activeFilters.sizes = Array.from(document.querySelectorAll('.size-filter button.active')).map(b => b.textContent);
  visibleCount = 16;
  renderProducts();
}
function sortProducts(val) {
  currentSort = val;
  renderProducts();
}

function getFilteredProducts() {
  let filtered = [...allProducts];
  if (activeFilters.categories.length > 0) {
    filtered = filtered.filter(p => activeFilters.categories.includes(p.cat));
  } else if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.cat === currentFilter);
  }
  if (activeFilters.price) {
    const [min, max] = activeFilters.price.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  if (currentSort === 'low') filtered.sort((a,b) => a.price - b.price);
  else if (currentSort === 'high') filtered.sort((a,b) => b.price - a.price);
  else if (currentSort === 'new') filtered.sort((a,b) => b.id - a.id);
  return filtered;
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  const resultCount = document.getElementById('resultCount');
  if (resultCount) {
    resultCount.textContent = `Showing ${toShow.length} of ${filtered.length} products`;
  }

  if (toShow.length === 0) {
    grid.innerHTML = '<p style="color:#64748b;grid-column:1/-1;text-align:center;padding:80px 20px;letter-spacing:2px;text-transform:uppercase;font-size:12px;">No products found</p>';
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
            <button class="buy-btn" onclick="event.stopPropagation(); openModal(${p.id})">Buy</button>
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

function filterProducts(cat, el) {
  currentFilter = cat;
  activeFilters = { categories: [], price: null, sizes: [] };
  document.querySelectorAll('.filter-group input').forEach(i => i.checked = false);
  document.querySelectorAll('.size-filter button').forEach(b => b.classList.remove('active'));
  visibleCount = 16;
  renderProducts();
  if (cat !== 'all') {
    document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
  }
}
function loadMore() { visibleCount += 16; renderProducts(); }

// ===== QUICK VIEW =====
function openQuickView(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  selectedSize = '';
  document.getElementById('qvImg').src = p.img;
  document.getElementById('qvCat').textContent = getCatName(p.cat);
  document.getElementById('qvTitle').textContent = p.name;
  document.getElementById('qvPrice').innerHTML = `₹${p.price} <small style="color:#64748b;text-decoration:line-through;font-size:16px;">₹${getOriginalPrice(p.price)}</small>`;
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  document.getElementById('quickViewModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeQuickView() {
  document.getElementById('quickViewModal').classList.remove('active');
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
  const msg = `Hi Hovans Wear! I want to order:%0A%0A*Product:* ${currentProduct.name}%0A*Price:* ₹${currentProduct.price} (30% OFF)%0A*Size:* ${selectedSize}%0A%0APlease confirm!`;
  window.open(`https://wa.me/919900098766?text=${msg}`, '_blank');
}

// ===== ORDER MODAL =====
function openModal(id) {
  currentProduct = allProducts.find(p => p.id === id);
  if (!currentProduct) return;
  document.getElementById('modalTitle').textContent = currentProduct.name;
  document.getElementById('modalImg').src = currentProduct.img;
  document.getElementById('modalPrice').innerHTML = `₹${currentProduct.price} <small style="color:#64748b;text-decoration:line-through;font-size:14px;">₹${getOriginalPrice(currentProduct.price)}</small>`;
  document.getElementById('orderModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('orderModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}
function sendWhatsApp() {
  const name = document.getElementById('mName').value.trim();
  const phone = document.getElementById('mPhone').value.trim();
  const size = document.getElementById('mSize').value.trim();
  const color = document.getElementById('mColor').value.trim();
  const address = document.getElementById('mAddress').value.trim();
  if (!name || !phone || !size || !address) { showToast('Please fill all fields'); return; }
  const msg = `Hi Hovans Wear! New Order:%0A%0A*Product:* ${currentProduct.name}%0A*Price:* ₹${currentProduct.price} (30% OFF)%0A*Size:* ${size}%0A*Color:* ${color || 'Any'}%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A%0APlease confirm!`;
  window.open(`https://wa.me/919900098766?text=${msg}`, '_blank');
  closeModal();
}

// ===== INIT =====
window.addEventListener('load', () => {
  setTimeout(() => {
    updateCartUI();
    updateWishlistUI();
  }, 2000);
});
