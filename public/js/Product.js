let cart = []; // ตัวแปรสำหรับเก็บรายการสินค้าที่เพิ่มลงในตะกร้า

document.addEventListener("DOMContentLoaded", function() {
    const products = [];

    // เพิ่มสินค้าจนครบ 100 ชิ้น
    for (let i = 1; i <= 100; i++) {
        products.push({
            id: i,
            name: `Product ${i}`,
            price: `$${(Math.random() * 100 + 10).toFixed(2)}`,
            image: "https://via.placeholder.com/200"
        });
    }

    const productList = document.getElementById("product-list");

    // สร้างและแสดงสินค้าทั้งหมด
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.name}')">Add to Cart</button>
        `;

        productList.appendChild(productDiv);
    });
});

// ฟังก์ชันเพิ่มสินค้าลงในตะกร้า
function addToCart(productId, productName) {
    cart.push({ id: productId, name: productName });
    updateCartCount();
}

// ฟังก์ชันอัปเดตจำนวนสินค้าที่อยู่ในตะกร้า
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;
}

// ฟังก์ชันเปิด/ปิด Modal
function toggleCartModal() {
    const cartModal = document.getElementById("cart-modal");
    if (cartModal.style.display === "none" || cartModal.style.display === "") {
        cartModal.style.display = "flex";
        displayCartItems(); // แสดงรายการในตะกร้า
    } else {
        cartModal.style.display = "none";
    }
}

// ฟังก์ชันแสดงรายการสินค้าในตะกร้า
function displayCartItems() {
    const cartItemsList = document.getElementById("cart-items-list");
    cartItemsList.innerHTML = ''; // ล้างรายการก่อนแสดงใหม่

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            cartItemsList.appendChild(li);
        });
    }
}

// ฟังก์ชันค้นหาสินค้า
function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const productElements = document.querySelectorAll(".product");

    productElements.forEach(product => {
        const productName = product.querySelector("h2").textContent.toLowerCase();
        if (productName.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
