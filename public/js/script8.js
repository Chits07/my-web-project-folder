let currentPage = 1;
let totalPages = 0;
let cartItems = {};  // สร้างตัวแปรเก็บสินค้าในตะกร้า
const productsPerPage = 8;  // จำนวนสินค้าต่อหน้า

let currentIndex = 0;
const slides = document.querySelector('.slides');
const totalSlides = slides ? slides.children.length : 0;

document.addEventListener('DOMContentLoaded', () => {
    // ตรวจสอบว่า .slides มีลูกอยู่จริงหรือไม่
    if (totalSlides > 0) {
        setInterval(showNextSlide, 3000); // เริ่มสไลด์อัตโนมัติทุก 3 วินาที
    } else {
        console.log("No slides found!");
    }
});

// ฟังก์ชันแสดงสไลด์ถัดไป
function showNextSlide() {
    if (totalSlides > 0) {
        currentIndex = (currentIndex + 1) % totalSlides; // เลื่อนไปยังสไลด์ถัดไป
        const offset = -currentIndex * 100; // คำนวณตำแหน่งใหม่
        slides.style.transform = `translateX(${offset}%)`; // ใช้ backticks สำหรับ template literal
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

fetch('http://localhost:3000/api/products?category=1&page=9') // ตรวจสอบว่า URL นี้สามารถดึงข้อมูลได้หรือไม่
    .then(response => response.json())
    .then(data => {
        const productContainer = document.getElementById('product-container');
        
        if (!data || data.length === 0) {
            productContainer.innerHTML = '<p>No products found.</p>';
            return;
        }

        // ลูปผ่านข้อมูลสินค้าที่ดึงมา
        data.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            
            // ตรวจสอบ URL ของภาพและกำหนดเส้นทางให้ถูกต้อง
            const imageUrl = product.product_image ? `/uploads/${product.product_image}` : 'default-image.jpg';
            console.log('Image URL:', imageUrl);

            productDiv.innerHTML = `
                <img src="${imageUrl}" alt="${product.product_name}" class="product-image"/>
                <h3>${product.product_name}</h3>
                <p>฿${product.price}</p>
            `;
            productContainer.appendChild(productDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });


// ฟังก์ชั่นในการแสดงสินค้าในหน้าเว็บ
function displayProducts(products) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // เคลียร์สินค้าก่อนที่จะเพิ่มใหม่

    if (products && products.length > 0) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            // แก้ไขการเข้าถึงข้อมูลให้ตรงกับฟิลด์ที่ได้รับ
            const productImage = product.product_image ? `/path/to/images/${product.product_image}.jpg` : 'default-image.png'; // อัปเดต URL ของภาพให้ถูกต้อง
            const productName = product.product_name || 'No Name';
            const productPrice = product.price !== undefined ? `฿${product.price}` : 'Price Unavailable';

            // สร้าง HTML สำหรับแสดงสินค้า
            productElement.innerHTML = `
                <img src="${productImage}" alt="${productName}" class="product-image">
                <h3>${productName}</h3>
                <span class="product-price">${productPrice}</span>
                <button onclick="addToCart(${product.id}, '${productName}', ${product.price})">Add to Cart</button>
            `;

            productContainer.appendChild(productElement); // เพิ่มสินค้าเข้าไปใน container
        });
    } else {
        productContainer.innerHTML = '<p>No products available.</p>';
    }
}


// เรียกใช้ฟังก์ชั่นเพื่อดึงข้อมูลสินค้าเมื่อโหลดหน้าเว็บ
window.onload = fetchProducts;

// ฟังก์ชันเพิ่มสินค้าในตะกร้า
function addToCart(productId, productName, productPrice) {
    if (cartItems[productId]) {
        cartItems[productId].quantity += 1;
    } else {
        cartItems[productId] = { name: productName, price: productPrice, quantity: 1 };
    }
    updateCartCount();
}

// อัปเดตจำนวนสินค้าในตะกร้า
function updateCartCount() {
    const totalItems = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = totalItems;
}

// ฟังก์ชันเปลี่ยนหน้า
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    fetchProducts();
}

// อัพเดตปุ่ม pagination
function updatePagination() {
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    document.getElementById('pageNumbers').innerText = `Page ${currentPage} of ${totalPages}`;
}

// ฟังก์ชันค้นหาสินค้า
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productName = card.querySelector('h3').innerText.toLowerCase();
        if (productName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ฟังก์ชันแสดง/ซ่อนตะกร้า
function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = (cart.style.display === 'none' || cart.style.display === '') ? 'block' : 'none';
    renderCartItems();
}

// ฟังก์ชันเพื่อแสดงสินค้าที่อยู่ในตะกร้า
function renderCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = ''; // เคลียร์ข้อมูลเก่า

    Object.values(cartItems).forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${item.name}</strong> x ${item.quantity} - ฿${item.price * item.quantity}`;
        cartItemsDiv.appendChild(div);
    });
}


