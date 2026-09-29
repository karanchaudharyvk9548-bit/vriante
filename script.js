// ===== SIMPLE VERSION - SIRF PRODUCTS AAYENGE =====
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

function toggleMenu() { document.getElementById('sideMenu').classList.toggle('active'); }
function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}
function toggleSearch() {
  document.getElementById('searchOverlay').classList.toggle('active');
}
function toggleFaq(el) { el.classList.toggle('active'); }
function subscribeMsg() { showToast('Subscribed!'); }

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== PRODUCTS =====
const productData = [
  { id:1, name:"Oversized Black Tee", price:899, cat:"tshirt", tag:"NEW", img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
  { id:2, name:"Red Graphic Tee", price:999, cat:"tshirt", tag:"HOT", img:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600" },
  { id:3, name:"White Classic Tee", price:699, cat:"tshirt", tag:"", img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600" },
  { id:4, name:"Blue Drop Shoulder", price:1099, cat:"tshirt", tag:"BEST", img:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600" },
  { id:5, name:"Black Printed Tee", price:1199, cat:"tshirt", tag:"", img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600" },
  { id:6, name:"Red Oversized Tee", price:1299, cat:"tshirt", tag:"LIMITED", img:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600" },
  { id:7, name:"Classic Black Shirt", price:1499, cat:"shirt", tag:"BEST", img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600" },
  { id:8, name:"Casual White Shirt", price:1299, cat:"shirt", tag:"NEW", img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600" },
  { id:9, name:"Red Check Shirt", price:1399, cat:"shirt", tag:"", img:"https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600" },
  { id:10, name:"Blue Check Shirt", price:1399, cat:"shirt", tag:"HOT", img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600" },
  { id:11, name:"Cargo Street Pants", price:1499, cat:"pant", tag:"BEST", img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600" },
  { id:12, name:"Slim Fit Denim", price:1699, cat:"pant", tag:"NEW", img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=600" },
  { id:13, name:"Black Cargo Pants", price:1799, cat:"pant", tag:"HOT", img:"https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600" },
  { id:14, name:"Blue Denim Jeans", price:1599, cat:"pant", tag:"", img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600" },
  { id:15, name:"Premium Black Hoodie", price:1799, cat:"hoodie", tag:"BEST", img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600" },
  { id:16, name:"Oversized Zip Hoodie", price:1999, cat:"hoodie", tag:"HOT", img:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600" },
  { id:17, name:"Red Pullover Hoodie", price:1899, cat:"hoodie", tag:"NEW", img:"https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600" },
  { id:18, name:"Blue Hoodie", price:1799, cat:"hoodie", tag:"", img:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600" }
];

function getCatName(cat) {
  const names = { tshirt:'T-Shirt', shirt:'Shirt', pant:'Pants', hoodie:'Hoodie' };
  return names[cat] || cat;
}
function getOriginalPrice(price) { return Math.round(price / 0.7); }

let currentFilter = 'all';
let visibleCount = 12;
let currentProduct = null;
let selectedSize = '';

function filterProducts(cat, el) {
  currentFilter = cat;
  visibleCount = 12;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  let filtered = currentFilter === 'all' ? productData : productData.filter(p => p.cat === currentFilter);
  const toShow = filtered.slice(0, visibleCount);
  
  if (toShow.length === 0) {
    grid.innerHTML = '<p style="color:#94a3b8;grid-column:1/-1;text-align:center;padding:80px 20px;">No products</p>';
    return;
  }
  
  grid.innerHTML = toShow.map(p => {
    const original = getOriginalPrice(p.price);
    const tagClass = p.tag === 'BEST' ? 'green' : (p.tag === 'NEW' ? 'white' : '');
    return '<div class="product" onclick="openQuickView(' + p.id + ')">' +
      '<div class="product-img">' +
      (p.tag ? '<span class="product-tag ' + tagClass + '">' + p.tag + '</span>' : '') +
      '<span class="product-discount">-30%</span>' +
      '<img src="' + p.img + '" alt="' + p.name + '">' +
      '<button class="quick-view-btn" onclick="event.stopPropagation(); openQuickView(' + p.id + ')">Quick View</button>' +
      '</div>' +
      '<div class="product-info">' +
      '<p class="cat">' + getCatName(p.cat) + '</p>' +
      '<h4>' + p.name + '</h4>' +
      '<div class="product-price">' +
      '<span class="price">₹' + p.price + ' <small>₹' + original + '</small></span>' +
      '<button class="buy-btn" onclick="event.stopPropagation(); openQuickView(' + p.id + ')">Buy</button>' +
      '</div></div></div>';
  }).join('');
  
  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    if (visibleCount >= filtered.length) btn.style.display = 'none';
    else { btn.style.display = 'inline-block'; btn.textContent = 'Load More'; }
  }
}

function loadMore() { visibleCount += 12; renderProducts(); }

function openQuickView(id) {
  const p = productData.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  selectedSize = '';
  document.getElementById('qvImg').src = p.img;
  document.getElementById('qvCat').textContent = getCatName(p.cat);
  document.getElementById('qvTitle').textContent = p.name;
  document.getElementById('qvPrice').innerHTML = '₹' + p.price + ' <small style="color:#94a3b8;text-decoration:line-through;">₹' + getOriginalPrice(p.price) + '</small>';
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  document.getElementById('quickViewModal').classList.add('active');
}
function closeQuickView() {
  document.getElementById('quickViewModal').classList.remove('active');
}
function selectSize(btn) {
  document.querySelectorAll('.size-btns button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = btn.textContent;
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('rubicon_cart') || '[]');

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
    return '<div class="cart-item">' +
      '<img src="' + item.img + '">' +
      '<div class="cart-item-info"><h5>' + item.name + '</h5><small>Size: ' + item.size + '</small><p>₹' + item.price + '</p></div>' +
      '<button class="cart-item-remove" onclick="removeFromCart(' + i + ')">✕</button>' +
      '</div>';
  }).join('');
  if (total) total.textContent = '₹' + sum;
}

function addToCart(product, size) {
  if (!size) { showToast('Please select size'); return; }
  cart.push({ ...product, size });
  saveCart();
  showToast('Added to bag');
}
function addToCartFromQuickView() {
  if (!currentProduct) return;
  if (!selectedSize) { showToast('Please select size'); return; }
  addToCart(currentProduct, selectedSize);
  closeQuickView();
}
function removeFromCart(i) { cart.splice(i, 1); saveCart(); showToast('Removed'); }

function checkoutWhatsApp() {
  if (cart.length === 0) { showToast('Bag is empty'); return; }
  let msg = 'Hi RUBICON! I want to order:%0A%0A';
  let total = 0;
  cart.forEach((item, i) => {
    msg += (i+1) + '. ' + item.name + ' — Size: ' + item.size + ' — ₹' + item.price + '%0A';
    total += item.price;
  });
  msg += '%0ATOTAL: ₹' + total + '%0A%0APlease confirm!';
  window.open('https://wa.me/917000000777?text=' + msg, '_blank');
}

window.addEventListener('load', () => {
  setTimeout(updateCartUI, 500);
});
