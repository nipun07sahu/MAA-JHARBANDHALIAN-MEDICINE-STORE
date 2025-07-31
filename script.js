// ✅ Initial Data
let products = [
  { id: 1, name: "NEUROBION FORTE INJ", price: 21.77, stock: 90, expiry: "2026-05", hsn: "30045010", image: "neurobion-forte-injection.webp" },
  { id: 2, name: "PIPERAZINE SUSP", price: 33.95, stock: 14, expiry: "2027-03", hsn: "30049011", image: "PIPERAZINE SUSP.jpg" },
  { id: 3, name: "SKF ENERGY POWDER", price: 16.50, stock: 5, expiry: "2027-01", hsn: "21069099", image: "SKF ENERGY POWDER.jpg" },
  { id: 4, name: "STAYFREE XL 6", price: 48.00, stock: 10, expiry: "2026-12", hsn: "96190010", image: "STAYFREE XL 6.webp" },
  { id: 5, name: "DICLOTAL INJ", price: 5.65, stock: 50, expiry: "2026-11-", hsn: "30041010", image: "diclotal.jpeg" },
  { id: 6, name: "TAXIM 500MG INJ", price: 27.00, stock: 40, expiry: "2026-12", hsn: "30042019", image: "TAXIM 500.avif" },
  { id: 7, name: "CHYAWANPRASH 500 GM", price: 235.00, stock: 30, expiry: "2027-01", hsn: "21069099", image: "CHYAWANPRASH.jpg" },
  { id: 8, name: "LACTODEX-1", price: 1055.00, stock: 20, expiry: "2026-10", hsn: "21069020", image: "LACT0183_L.jpg" },
  { id: 9, name: "Vertistar -MD 8 TAB", price: 65.67, stock: 25, expiry: "2026-09", hsn: "30045090", image: "vertistar-md.jpg" },
  { id: 11, name: "XONE 1GR INJ", price: 71.09, stock: 22, expiry: "2026-11", hsn: "30041090", image: "xon0001.webp" },
  { id: 12, name: "HAJMOLA IMLI SACHET", price: 170.00, stock: 35, expiry: "2026-10", hsn: "30045010", image: "losil.webp" },
  { id: 13, name: "AMLOVAS 5MG TAB", price: 42.00, stock: 60, expiry: "2027-01", hsn: "30049099", image: "amlovas.webp" }
];

let cart = [];
let isAdmin = false;
let isCustomerLoggedIn = localStorage.getItem("customerLoggedIn") === "true";

// ✅ Customer Auth
function showCustomerLogin() {
  document.getElementById("customerLoginModal").classList.remove("hidden");
}
function hideCustomerLogin() {
  document.getElementById("customerLoginModal").classList.add("hidden");
}
function showSignup() {
  document.getElementById("customerLoginModal").classList.add("hidden");
  document.getElementById("customerSignupModal").classList.remove("hidden");
}
function hideSignup() {
  document.getElementById("customerSignupModal").classList.add("hidden");
}
function logoutCustomer() {
  localStorage.removeItem("customerLoggedIn");
  isCustomerLoggedIn = false;
  location.reload();
}

// ✅ Product Rendering for Customer
function renderProducts() {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card bg-white shadow rounded-lg p-4 text-sm";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="h-32 mx-auto object-contain mb-2" />
      <div class="text-center">
        <h3 class="font-bold">${p.name}</h3>
        <p>Price: ₹${p.price}</p>
        <p>Stock: ${p.stock}</p>
        <p>Expiry: ${p.expiry}</p>
      </div>
      <div class="mt-2 flex justify-center gap-2">
        <button onclick="addToCart(${p.id})" class="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
        ${isAdmin ? `<button onclick="editProduct(${p.id})" class="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>` : ""}
      </div>
    `;
    productsGrid.appendChild(div);
  });
}

// ✅ Admin Dashboard Renderer
function renderAdminDashboard() {
  const grid = document.getElementById("adminProductsGrid");
  grid.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <p>Stock: ${p.stock}</p>
        <p>Expiry: ${p.expiry}</p>
      </div>
      <div class="admin-btns">
        <button class="edit-btn" onclick="editProduct(${p.id})">Edit</button>
        <button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
    grid.appendChild(div);
  });
}

function deleteProduct(id) {
  if (confirm("Delete this product?")) {
    products = products.filter(p => p.id !== id);
    renderProducts();
    renderAdminDashboard();
  }
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  const name = prompt("Enter name:", product.name);
  const price = parseFloat(prompt("Enter price:", product.price));
  const stock = parseInt(prompt("Enter stock:", product.stock));
  const expiry = prompt("Enter expiry date:", product.expiry);
  if (name && !isNaN(price) && !isNaN(stock) && expiry) {
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.expiry = expiry;
    renderProducts();
    renderAdminDashboard();
    alert("Product updated.");
  }
}

// ✅ Cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (product.stock <= 0) return alert("Out of stock");
  const item = cart.find(i => i.id === id);
  if (item) item.quantity++;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function changeQuantity(id, qty) {
  const item = cart.find(i => i.id === id);
  if (item && qty > 0) item.quantity = parseInt(qty);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const offer = document.getElementById("offerSection");
  const count = document.getElementById("cartCount");
  cartItems.innerHTML = "";
  let total = 0;
  let items = 0;
  cart.forEach(c => {
    items += c.quantity;
    total += c.quantity * c.price;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-2";
    div.innerHTML = `
      <div>
        <b>${c.name}</b> - ₹${c.price} × 
        <input type="number" value="${c.quantity}" min="1" onchange="changeQuantity(${c.id}, this.value)" class="w-12 border text-center" />
      </div>
      <button onclick="removeFromCart(${c.id})" class="text-red-500">❌</button>
    `;
    cartItems.appendChild(div);
  });
  const cashback = items >= 5 ? total * 0.05 : 0;
  const gst = total * 0.05;
  const final = total - cashback + gst;
  cartSummary.innerHTML = `
    <div>Total: ₹${total.toFixed(2)}</div>
    <div>Cashback: ₹${cashback.toFixed(2)}</div>
    <div>GST: ₹${gst.toFixed(2)}</div>
    <div><b>Final: ₹${final.toFixed(2)}</b></div>
    <button onclick="printInvoice(${final.toFixed(2)})" class="mt-2 bg-green-500 text-white px-3 py-1 rounded">🧾 Print Bill</button>
  `;
  count.textContent = items;
  offer.textContent = cashback > 0 ? `Congrats! ₹${cashback.toFixed(2)} cashback` : "";
}

function printInvoice(finalAmount) {
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const addr = document.getElementById("customerAddress").value;
  const pin = document.getElementById("customerPincode").value;
  let html = `<h2>Customer Invoice</h2><hr>`;
  html += `<b>Name:</b> ${name}<br><b>Phone:</b> ${phone}<br><b>Address:</b> ${addr} - ${pin}<br><hr>`;
  html += `<table border='1' cellpadding='5' cellspacing='0'><tr><th>Name</th><th>Qty</th><th>Rate</th><th>Total</th></tr>`;
  cart.forEach(c => {
    html += `<tr><td>${c.name}</td><td>${c.quantity}</td><td>₹${c.price}</td><td>₹${(c.price * c.quantity).toFixed(2)}</td></tr>`;
  });
  html += `</table><br><b>Total Amount: ₹${finalAmount}</b>`;
  const w = window.open();
  w.document.write(html);
  w.print();
  w.close();
}

// ✅ Order
let latestOrderId = "";

function handleOrder() {
  if (cart.length === 0) return alert("Cart is empty");

  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const addr = document.getElementById("customerAddress").value;
  const pin = document.getElementById("customerPincode").value;

  if (!name || !phone || !addr || !pin) return alert("Fill all details");

  const latestOrderId = "ORDER" + Math.floor(Math.random() * 1000000);

  const newOrder = {
    id: latestOrderId,
    name,
    phone,
    address: addr,
    pincode: pin,
    items: [...cart],
    status: "Pending"
  };

  // Store or push to database here if needed

  const eta = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  const deliveryTime = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  document.getElementById("orderSuccess").innerHTML =
    `✅ <b>Order Placed!</b><br>Your order will be delivered by <b>${deliveryTime}</b>.<br>Thank you for shopping with us!`;
  
  document.getElementById("orderSuccess").classList.remove("hidden");

  cart = [];
  renderCart();
}


function approveOrder(id) {
  const order = orders.find(o => o.id === id);
  if (!order) return alert("Order not found!");
  order.status = "Approved ✅";
  renderOrders();

  const trackingURL = "track.html?id=" + order.id;
  document.getElementById("trackingLink").href = trackingURL;
  document.getElementById("customerNotify").classList.remove("hidden");
}



// ✅ Customer Login
function customerLoginHandler(e) {
  e.preventDefault();
  const phone = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const match = users.find(u => u.phone === phone && u.password === pass);
  if (match) {
    localStorage.setItem("customerLoggedIn", "true");
    isCustomerLoggedIn = true;
    hideCustomerLogin();
    document.getElementById("mainContent").classList.remove("hidden");
    renderProducts();
    renderCart();
  } else alert("Invalid phone or password");
}

// ✅ Signup
function customerSignupHandler(e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const phone = document.getElementById("signupPhone").value;
  const pass = document.getElementById("signupPassword").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.phone === phone)) return alert("Phone already registered");
  users.push({ name, phone, password: pass });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful");
  hideSignup();
  showCustomerLogin();
}

// ✅ Search
function handleSearch() {
  const name = card.querySelector("h3").textContent.toLowerCase();

  document.querySelectorAll("#productsGrid .product-card").forEach(card => {
    const name = card.querySelector(".product-info b").textContent.toLowerCase();
    card.style.display = name.includes(term) ? "" : "none";
  });
}

// ✅ PDF Upload
async function extractPdfText(data) {
  const pdfjs = window['pdfjs-dist/build/pdf'];
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  const doc = await pdfjs.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + "\n";
  }
  return text;
}

function parseProductsFromText(text) {
  const lines = text.split("\n");
  let added = 0;
  lines.forEach(line => {
    const match = line.match(/\d+\.\s*(.+?)\s+(\d+(\.\d{1,2})?)/);
    if (match) {
      const name = match[1];
      const price = parseFloat(match[2]);
      products.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
        price,
        stock: 10,
        expiry: "2026-12-31",
        hsn: "00000000",
        image: ""
      });
      added++;
    }
  });
  alert(`${added} products added from PDF.`);
  renderProducts();
  renderAdminDashboard();
}

// ✅ Admin Login
function adminLoginHandler(e) {
  e.preventDefault();
  const u = document.getElementById("loginUsername").value;
  const p = document.getElementById("loginPassword").value;
  if (u === "Nipun31@" && p === "NIPUN07@") {
    isAdmin = true;
    localStorage.setItem("isAdmin", "true");
    alert("Admin login successful");
    document.getElementById("adminDashboard").classList.remove("hidden");
    document.getElementById("adminLoginModal").classList.add("hidden");
    renderProducts();
    renderAdminDashboard();
  } else alert("Invalid admin credentials");
}
function showUPIPayment() {
  if (cart.length === 0) return alert("Cart is empty");

  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const addr = document.getElementById("customerAddress").value;
  const pin = document.getElementById("customerPincode").value;

  if (!name || !phone || !addr || !pin) {
    return alert("Please fill all customer details before payment.");
  }

  document.getElementById("upiModal").classList.remove("hidden");
}

function confirmUPIPayment() {
  document.getElementById("upiModal").classList.add("hidden");

  // Call order placing function
  handleOrder();

  // Show a friendly confirmation message
  const successBox = document.getElementById("orderSuccess");
  successBox.innerText = "✅ Payment confirmed! Your order has been placed successfully.";
  successBox.classList.remove("hidden");

  // Optional: Scroll to success message
  successBox.scrollIntoView({ behavior: "smooth" });
}


// ✅ INIT
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mainContent").classList.remove("hidden");
renderProducts();
renderCart();
if (!isCustomerLoggedIn) showCustomerLogin();


  document.getElementById("customerLoginForm")?.addEventListener("submit", customerLoginHandler);
  document.getElementById("customerSignupForm")?.addEventListener("submit", customerSignupHandler);
  document.getElementById("showSignup")?.addEventListener("click", showSignup);
  document.getElementById("closeSignup")?.addEventListener("click", hideSignup);
  document.getElementById("logoutCustomer")?.addEventListener("click", logoutCustomer);
  document.getElementById("productSearch")?.addEventListener("input", handleSearch);
  document.getElementById("orderNowBtn")?.addEventListener("click", handleOrder);
  document.getElementById("adminLoginForm")?.addEventListener("submit", adminLoginHandler);

  document.getElementById("pdfUploader")?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const text = await extractPdfText(reader.result);
      parseProductsFromText(text);
    };
    reader.readAsArrayBuffer(file);
  });
});
