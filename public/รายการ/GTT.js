let cartCount = 0;
let cartItems = []; // เก็บรายการสินค้าที่ถูกเพิ่มในตะกร้า

function updateCart() {
    const cartButton = document.getElementById('view-cart');
    cartButton.textContent = `🛒 ตะกร้าสินค้า (${cartCount})`;
}

// ฟังก์ชันสำหรับการเพิ่มสินค้าไปยังตะกร้า
function addToCart(product, quantity) {
    cartCount += quantity;
    cartItems.push({ product, quantity });
    updateCart();
    alert(`เพิ่มสินค้า ${quantity} ชิ้นลงในตะกร้า: ${product.title}`);
}

// ฟังก์ชันสำหรับการแสดงรายการในตะกร้า
function showCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = ''; // ล้างรายการก่อน
    let totalAmount = 0; // เก็บยอดรวม

    cartItems.forEach((item, index) => {
        const li = document.createElement('li');

        // เพิ่มช่องติ๊กถูก
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox-item');
        checkbox.id = `item-${index}`;
        
        li.appendChild(checkbox);
        
        li.textContent += `${item.quantity} ชิ้น: ${item.product.title} (ราคา: ${item.product.price})`;
        
        // เพิ่มยอดรวม
        totalAmount += item.quantity * parseFloat(item.product.price.replace(/[^0-9.-]+/g,"")); // นำราคาออกเพื่อคำนวณ
        
        // เพิ่มปุ่มลบ
        const deleteButton = document.createElement('span');
        deleteButton.textContent = 'ลบ';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => removeFromCart(index); // เชื่อมโยงฟังก์ชันลบ
        li.appendChild(deleteButton);
        
        cartItemsList.appendChild(li);
    });

    document.getElementById('total-amount').textContent = `ยอดรวม: ${totalAmount} บาท`;
    cartModal.style.display = 'block'; // แสดงป๊อปอัพ
}

// ฟังก์ชันสำหรับลบสินค้าจากตะกร้า
function removeFromCart(index) {
    cartCount -= cartItems[index].quantity; // ปรับจำนวนสินค้าในตะกร้า
    cartItems.splice(index, 1); // ลบสินค้าจากอาเรย์
    updateCart();
    showCart(); // อัปเดตรายการในป๊อปอัพ
}

// ฟังก์ชันสำหรับยกเลิกทั้งหมด
function clearAllItems() {
    cartCount = 0;
    cartItems = [];
    updateCart();
    showCart(); // อัปเดตรายการในป๊อปอัพ
}

// ฟังก์ชันสำหรับปิดป๊อปอัพ
function closeModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
}

// ฟังก์ชันสำหรับซื้อทันที
document.querySelector('.buy-now').addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = {
        title: document.querySelector('.product-title').textContent,
        price: document.querySelector('.product-price').textContent,
    };
    addToCart(product, quantity);
    alert(`ซื้อสินค้า ${quantity} ชิ้น: ${product.title}`);
});

// ฟังก์ชันสำหรับเปิดป๊อปอัพตะกร้า
document.getElementById('view-cart').addEventListener('click', showCart);

// ฟังก์ชันสำหรับปิดป๊อปอัพ
document.getElementById('close-modal').addEventListener('click', closeModal);

// ฟังก์ชันสำหรับยกเลิกทั้งหมด
document.getElementById('remove-all').addEventListener('click', clearAllItems);

// ฟังก์ชันสำหรับการเพิ่มสินค้าไปยังตะกร้า
document.querySelector('.add-to-cart').addEventListener('click', () => {
    const quantity = parseInt(document.getElementById('quantity').value);
    const product = {
        title: document.querySelector('.product-title').textContent,
        price: document.querySelector('.product-price').textContent,
    };
    addToCart(product, quantity);
});
