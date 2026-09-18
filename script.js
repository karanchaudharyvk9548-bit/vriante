// ===== MUSIC =====
let musicPlaying = false;
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const btn = document.getElementById('musicBtn');
  if (!music) return;
  if (musicPlaying) {
    music.pause();
    btn.textContent = '🔇';
    musicPlaying = false;
  } else {
    music.play().catch(() => {});
    btn.textContent = '🔊';
    musicPlaying = true;
  }
}

// ===== SIDE MENU =====
function toggleMenu() {
  document.getElementById('sideMenu').classList.toggle('active');
}

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
    const percent = (scrollTop / docHeight) * 100;
    progress.style.width = percent + '%';
  }
});

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    }, 50);
  });
  document.querySelectorAll('a, button, .product, .brand-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

// ===== HERO SLIDESHOW =====
let currentSlide = 0;
function nextSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}
setInterval(nextSlide, 5000);

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  targetDate.setHours(23, 59, 59);

  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance < 0) return;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');
  if (dEl) dEl.textContent = String(days).padStart(2, '0');
  if (hEl) hEl.textContent = String(hours).padStart(2, '0');
  if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
  if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
    document.body.classList.remove('loading');
    // Reveal animations
    document.querySelectorAll('.section, .section-head, .product, .brand-card, .blog-card, .testimonial').forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }, 1500);
});
document.body.classList.add('loading');

// ===== FAQ TOGGLE =====
function toggleFaq(el) {
  el.classList.toggle('active');
}

// ===== NEWSLETTER =====
function subscribeMsg() {
  alert('✅ Thank you! Aap Vriante family me shamil ho gaye. 30% OFF code email pe aayega!');
}

// ===== PRODUCTS DATA =====
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
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600'
  ],
  shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600',
    'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=600'
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
  ],
  footwear: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600'
  ],
  accessory: [
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
    'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=600',
    'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=600',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'
  ]
};

// ===== PRODUCT NAMES =====
const productNames = {
  tshirt: ['Oversized Black Tee','Red Graphic Tee','White Classic Tee','Green Drop Shoulder','Black Printed Tee','Red Oversized Tee','White Oversized Tee','Green Graphic Tee','Black Minimal Tee','Red Polo Tee','White Striped Tee','Green Polo Tee','Black V-Neck Tee','Red Round Neck','Premium Full Sleeve','White Henley Tee','Green Acid Wash','Black Tie-Dye','Red Signature Tee','Premium Cotton Tee'],
  shirt: ['Classic Black Shirt','Casual White Shirt','Red Check Shirt','Green Check Shirt','Black Formal Shirt','White Formal Shirt','Blue Denim Shirt','Red Flannel Shirt','Green Linen Shirt','Black Casual Shirt','White Linen Shirt','Red Formal Shirt','Green Casual Shirt','Black Striped Shirt','White Striped Shirt','Blue Oxford Shirt','Red Casual Shirt','Green Formal Shirt','Black Party Shirt','White Party Shirt','Red Satin Shirt','Green Satin Shirt','Black Silk Shirt','White Silk Shirt','Denim Casual Shirt','Red Denim Shirt','Green Denim Shirt','Black OverShirt','White OverShirt','Premium Signature Shirt'],
  pant: ['Cargo Street Pants','Slim Fit Denim','Black Cargo Pants','Blue Denim Jeans','Grey Track Pants','Black Formal Trousers','Beige Chinos','Olive Cargo Pants','Black Denim Jeans','White Chinos','Navy Trousers','Grey Formal Pants','Black Joggers','Red Track Pants','Green Cargo Pants','Blue Slim Jeans','Black Slim Jeans','Grey Joggers','Beige Cargo Pants','Black Chinos','Brown Chinos','Navy Cargo Pants','Ripped Denim','Black Track Pants','Olive Chinos','Grey Cargo Pants','Blue Denim Shorts','Black Denim Shorts','White Track Pants','Premium Wool Trousers','Black Leather Pants','Beige Linen Pants','Blue Cargo Pants','Green Joggers','Red Joggers','Navy Formal Pants','Brown Leather Pants','Grey Wool Trousers','Premium Cargo Pants','Designer Denim Jeans'],
  hoodie: ['Premium Black Hoodie','Oversized Zip Hoodie','Red Pullover Hoodie','Green Hoodie','White Hoodie','Black Printed Hoodie','Red Zip Hoodie','Green Zip Hoodie','Black Oversized Hoodie','White Oversized Hoodie','Red Oversized Hoodie','Green Oversized Hoodie','Black Fleece Hoodie','Grey Hoodie','Navy Hoodie','Black Graphic Hoodie','Red Graphic Hoodie','Green Graphic Hoodie','Black Reflective Hoodie','White Reflective Hoodie','Red Fleece Hoodie','Green Fleece Hoodie','Black Street Hoodie','Grey Street Hoodie','Black Camo Hoodie','Green Camo Hoodie','Black Hoodie Dress','Red Varsity Hoodie','Green Varsity Hoodie','Black Sherpa Hoodie','White Sherpa Hoodie','Red Sherpa Hoodie','Black Tech Hoodie','Grey Tech Hoodie','Black Premium Hoodie','Red Premium Hoodie','Green Premium Hoodie','White Premium Hoodie','Black Designer Hoodie','Signature Vriante Hoodie'],
  footwear: ['Air Runner Sneakers','Street Canvas Shoes','Classic White Sneakers','Black High-Tops','Running Sports Shoes','Casual Loafers','Leather Formal Shoes','Slip-On Sneakers','Retro Basketball Shoes','Skate Shoes','Trail Running Shoes','Suede Loafers','Mesh Running Shoes','Chunky Sneakers','Platform Sneakers','Velcro Strap Shoes','Espadrille Flats','Ankle Boots','Chelsea Boots','Desert Boots','Sports Sandals','Beach Flip-Flops','Hiking Shoes','Yoga Shoes','Barefoot Trainers','Crossfit Shoes','Tennis Shoes','Badminton Shoes','Football Cleats','Cricket Shoes','Basketball High-Tops','Volleyball Shoes','Cycling Shoes','Golf Shoes','Walking Shoes','Orthopedic Shoes','Winter Boots','Rain Shoes','Safety Shoes','Fashion Sneakers'],
  accessory: ['Classic Leather Belt','Canvas Cap','Woolen Beanie','Aviator Sunglasses','Wayfarer Shades','Leather Wallet','Canvas Backpack','Travel Duffel Bag','Silk Tie','Bow Tie','Cufflinks Set','Silver Chain','Gold Chain','Leather Watch','Smart Watch','Analog Watch','Baseball Cap','Snapback Cap','Fedora Hat','Panama Hat','Leather Gloves','Woolen Scarf','Silk Scarf','Umbrella Premium','Socks Pack','Keychain Leather','Money Clip','Card Holder','Laptop Sleeve','Tote Bag','Crossbody Bag','Messenger Bag','Gym Bag','Waist Bag','Phone Case','Airpods Case','Notebook Premium','Pen Set','Desk Organizer','Water Bottle']
};// ===== GENERATE 400 PRODUCTS =====
function generateProducts() {
  const all = [];
  let id = 1;
  const cats = [
    { key:'tshirt', count:80, priceMin:699, priceMax:2999 },
    { key:'shirt', count:80, priceMin:499, priceMax:3999 },
    { key:'pant', count:80, priceMin:1099, priceMax:5999 },
    { key:'hoodie', count:80, priceMin:1099, priceMax:3999 },
    { key:'footwear', count:50, priceMin:1499, priceMax:7999 },
    { key:'accessory', count:30, priceMin:299, priceMax:2999 }
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
      const tags = ['', 'NEW', 'BEST', 'HOT', 'LIMITED'];
      const tag = tags[Math.floor(Math.random() * tags.length)];
      all.push({ id: id++, name, price, cat: c.key, tag, img });
    }
  });
  return all;
}

const allProducts = generateProducts();

// ===== STATE =====
let currentFilter = 'all';
let visibleCount = 16;
let currentProduct = null;
let selectedSize = '';

// ===== HELPERS =====
function getCatName(cat) {
  const names = {
    tshirt: 'T-Shirt', shirt: 'Shirt', pant: 'Pants',
    hoodie: 'Hoodie', footwear: 'Footwear', accessory: 'Accessory'
  };
  return names[cat] || cat;
}

function getDiscount(price) {
  return Math.round(price / 0.7);
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  let filtered = currentFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.cat === currentFilter);

  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map(p => {
    const original = getDiscount(p.price);
    const tagClass = p.tag === 'BEST' ? 'green' : (p.tag === 'NEW' ? 'white' : '');
    return `
      <div class="product" onclick="openQuickView(${p.id})">
        <div class="product-img">
          ${p.tag ? `<span class="product-tag ${tagClass}">${p.tag}</span>` : ''}
          <span class="product-discount">30% OFF</span>
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
    if (visibleCount >= filtered.length) {
      btn.style.display = 'none';
    } else {
      btn.style.display = 'inline-block';
      btn.textContent = `Load More (${filtered.length - visibleCount} remaining)`;
    }
  }

  // Re-observe new products for reveal animation
  document.querySelectorAll('.product').forEach(el => observer.observe(el));
}

// ===== FILTER =====
function filterProducts(cat, el) {
  currentFilter = cat;
  visibleCount = 16;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProducts();
}

// ===== LOAD MORE =====
function loadMore() {
  visibleCount += 16;
  renderProducts();
}

// ===== QUICK VIEW =====
function openQuickView(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  selectedSize = '';
  const modal = document.getElementById('quickViewModal');
  document.getElementById('qvImg').src = p.img;
  document.getElementById('qvCat').textContent = getCatName(p.cat);
  document.getElementById('qvTitle').textContent = p.name;
  document.getElementById('qvPrice').innerHTML = `₹${p.price} <small style="color:#666;text-decoration:line-through;font-size:16px;">₹${getDiscount(p.price)}</small> • 30% OFF`;
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  modal.classList.add('active');
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

function orderFromQuickView() {
  if (!currentProduct) return;
  if (!selectedSize) {
    alert('Bhai pehle size select karo!');
    return;
  }
  const msg = `Hi Vriante! Mujhe ye order karna hai:%0A%0A*Product:* ${currentProduct.name}%0A*Price:* ₹${currentProduct.price} (30% OFF)%0A*Size:* ${selectedSize}%0A%0APlease confirm!`;
  window.open(`https://wa.me/919900098766?text=${msg}`, '_blank');
}

// ===== ORDER MODAL =====
function openModal(id) {
  currentProduct = allProducts.find(p => p.id === id);
  if (!currentProduct) return;
  const modal = document.getElementById('orderModal');
  document.getElementById('modalTitle').textContent = currentProduct.name;
  document.getElementById('modalImg').src = currentProduct.img;
  document.getElementById('modalPrice').innerHTML = `₹${currentProduct.price} <small style="color:#666;text-decoration:line-through;font-size:14px;">₹${getDiscount(currentProduct.price)}</small> • 30% OFF`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('orderModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ===== SEND WHATSAPP (Order Modal) =====
function sendWhatsApp() {
  const name = document.getElementById('mName').value.trim();
  const phone = document.getElementById('mPhone').value.trim();
  const size = document.getElementById('mSize').value.trim();
  const color = document.getElementById('mColor').value.trim();
  const address = document.getElementById('mAddress').value.trim();

  if (!name || !phone || !size || !address) {
    alert('Bhai sab fields fill karo!');
    return;
  }

  const msg = `Hi Vriante! Naya Order:%0A%0A*Product:* ${currentProduct.name}%0A*Price:* ₹${currentProduct.price} (30% OFF)%0A*Size:* ${size}%0A*Color:* ${color || 'Any'}%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A%0APlease confirm!`;
  window.open(`https://wa.me/919900098766?text=${msg}`, '_blank');
  closeModal();
}

// ===== CONTACT FORM ORDER =====
function submitOrder() {
  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const product = document.getElementById('cProduct').value.trim();
  const size = document.getElementById('cSize').value.trim();
  const color = document.getElementById('cColor').value.trim();
  const address = document.getElementById('cAddress').value.trim();

  if (!name || !phone || !product || !address) {
    alert('Bhai sab fields fill karo!');
    return;
  }

  const msg = `Hi Vriante! Naya Order:%0A%0A*Product:* ${product}%0A*Size:* ${size || 'N/A'}%0A*Color:* ${color || 'Any'}%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A%0APlease confirm!`;
  window.open(`https://wa.me/919900098766?text=${msg}`, '_blank');
}

// ===== INITIAL RENDER =====
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    renderProducts();
    updateCountdown();
  }, 1800);
});

// ===== MODAL CLOSE ON OUTSIDE CLICK =====
document.addEventListener('click', (e) => {
  const qv = document.getElementById('quickViewModal');
  const om = document.getElementById('orderModal');
  if (e.target === qv) closeQuickView();
  if (e.target === om) closeModal();
});

// ===== ESC KEY CLOSE =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuickView();
    closeModal();
    document.getElementById('sideMenu').classList.remove('active');
  }
});
