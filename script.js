// Page navigation
function showPage(page) {
    document.querySelectorAll('.page').forEach(s => s.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Cart logic
let cart = [];
function addToCart(type, name, price, details={}) {
    cart.push({ type, name, price, details });
    updateCart();
}

function showBottleOptions(bottleName) {
    document.getElementById('bottleModalName').textContent = bottleName;
    document.getElementById('bottlePelletQty').value = '25';
    document.getElementById('bottlePelletColor').value = 'Black';
    document.getElementById('bottleModal').style.display = 'block';
}

function addBottleWithPellets() {
    let name = document.getElementById('bottleModalName').textContent;
    let bottlePrice = 0.50;
    let qty = parseInt(document.getElementById('bottlePelletQty').value);
    let pelletPrice = parseFloat(document.getElementById('bottlePelletQty').selectedOptions[0].getAttribute('data-price'));
    let pelletColor = document.getElementById('bottlePelletColor').value;
    addToCart('bottle', name, bottlePrice, {});
    addToCart('pellet', `${qty} Pellets (${pelletColor}) (with ${name})`, pelletPrice, { qty, pelletColor });
    closeModal('bottleModal');
}

function showRefillOptions(qty, price) {
    document.getElementById('refillModalName').textContent = `${qty} Pellets`;
    document.getElementById('refillPelletColor').value = 'Black';
    document.getElementById('refillModal').dataset.qty = qty;
    document.getElementById('refillModal').dataset.price = price;
    document.getElementById('refillModal').style.display = 'block';
}

function addRefillToCart() {
    let qty = parseInt(document.getElementById('refillModal').dataset.qty);
    let price = parseFloat(document.getElementById('refillModal').dataset.price);
    let pelletColor = document.getElementById('refillPelletColor').value;
    addToCart('pellet', `${qty} Pellets (${pelletColor})`, price, { qty, pelletColor });
    closeModal('refillModal');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function updateCart() {
    let cartList = document.getElementById('cartList');
    cartList.innerHTML = "";
    cart.forEach((item, idx) => {
        let detail = item.details && Object.keys(item.details).length > 0 ? 
            ` <small>(${Object.entries(item.details).map(([k,v]) => `${k}:${v}`).join(", ")})</small>` : '';
        cartList.innerHTML += `<li>${item.name} - $${item.price.toFixed(2)}${detail} 
        <button style="background:#b41a1a" onclick="removeFromCart(${idx})">Remove</button></li>`;
    });
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').innerHTML = cart.length ? `Total: $${total.toFixed(2)}` : "";
    document.getElementById('checkoutBtn').style.display = cart.length ? 'inline-block' : 'none';
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    updateCart();
}

function showCheckout() {
    document.getElementById('checkoutModal').style.display = 'block';
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('checkoutPriceLine').innerHTML = `Your total: <strong>$${total.toFixed(2)}</strong>`;
    document.getElementById('addressFields').style.display = 'none';
    document.getElementById('paymentMethod').value = 'meetup';
}

function toggleDeliveryFields() {
    let method = document.getElementById('paymentMethod').value;
    document.getElementById('addressFields').style.display = method == 'cashapp' ? 'block' : 'none';
    document.getElementById('mailingAddress').required = method == 'cashapp';
}

function completeCheckout() {
    let name = document.getElementById('legalName').value.trim();
    let method = document.getElementById('paymentMethod').value;
    let address = method == 'cashapp' ? document.getElementById('mailingAddress').value.trim() : "";
    if (!name || (method == 'cashapp' && !address)) {
        alert("Please fill in all required fields!");
        return;
    }
    let msg = "";
    if (method == "meetup") {
        msg = `Thanks, ${name}! Please meet us at the secret location: <strong>[INSERT LOCATION HERE]</strong> to exchange payment and pickup your items.`;
    } else {
        msg = `Hurray! Pay us via CashApp at: <strong>[CASHAPP_PLACEHOLDER]</strong>. Once payment is received, you’ll get your package in the mail within 7 days!<br>Shipping to: <em>${address}</em>`;
    }
    document.getElementById('checkoutForm').reset();
    cart = [];
    updateCart();
    document.getElementById('checkoutModal').style.display = 'none';
    setTimeout(() => { alert(msg); }, 100);
}

// Support FAQ toggle
function toggleFaq(id) {
    document.querySelectorAll('.faq-answer').forEach(ans => ans.style.display = 'none');
    let el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

// Default to Home
document.addEventListener("DOMContentLoaded", function () {
    showPage('home');
    updateCart();
    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => {
        if (e.target === m) closeModal(m.id);
    }));
});
