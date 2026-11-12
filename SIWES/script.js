function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
function toggleSearch() {
  const search = document.getElementById("search");
  search.classList.toggle("open");
  if (search.classList.contains("open")) {
    search.querySelector("input").focus();
  }
}
/* ==========================================================
   Timmy Luxe - script.js
   ========================================================== */

/* ---------- Naira formatting ---------- */
function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/* ---------- Mobile menu ---------- */
function myFunction() {
  document.getElementById("myTopnav").classList.toggle("responsive");
}

/* ---------- Search (icon on mobile) ---------- */
function toggleSearch() {
  const search = document.getElementById("search");
  search.classList.toggle("open");
  if (search.classList.contains("open")) {
    search.querySelector("input").focus();
  }
}

/* ---------- Cart storage ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Could not save cart:", e);
  }
  updateCartCount();
}

function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = total;
    el.style.display = total ? "inline-block" : "none";
  });
}

/* ---------- Cart actions ---------- */
function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(p => p.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
}

function changeQty(id, change) {
  let cart = getCart();
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += change;
  cart = cart.filter(p => p.qty > 0);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter(p => p.id !== id));
  renderCart();
}

/* ---------- Cart page rendering ---------- */
function renderCart() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!list) return; // not on the cart page

  const cart = getCart();

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty">Your cart is empty. <a href="product.html">Start shopping</a></p>';
    totalEl.textContent = formatNaira(0);
    return;
  }

  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="">
      <div class="cart-info">
        <h3>${item.name}</h3>
        <p>${formatNaira(item.price)}</p>
      </div>
      <div class="qty">
        <button onclick="changeQty('${item.id}', -1)" aria-label="Decrease">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty('${item.id}', 1)" aria-label="Increase">+</button>
      </div>
      <button class="remove" onclick="removeItem('${item.id}')" aria-label="Remove">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = formatNaira(total);
}

/* ---------- Checkout (placeholder) ---------- */
function checkout() {
  if (getCart().length === 0) {
    alert("Your cart is empty.");
    return;
  }
  alert("Checkout coming soon!");
}

/* ---------- Run when the page loads ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // show prices in naira on product cards
  document.querySelectorAll("[data-price-display]").forEach(el => {
    el.textContent = formatNaira(Number(el.dataset.priceDisplay));
  });

  updateCartCount();
  renderCart();

  // one listener handles every "Add to Cart" button
  document.addEventListener("click", e => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    addToCart({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      img: btn.dataset.img
    });

    const old = btn.textContent;
    btn.textContent = "Added ✓";
    setTimeout(() => (btn.textContent = old), 1000);
  });
});