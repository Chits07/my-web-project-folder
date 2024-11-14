document.getElementById("product-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // รับค่าจากฟอร์ม
    var product_name = document.getElementById("product_name").value;
    var category_id = document.getElementById("category_id").value;
    var price = document.getElementById("price").value;
    var product_image = document.getElementById("product_image").files[0]; // รับไฟล์จาก input

    // สร้าง FormData เพื่อส่งข้อมูลพร้อมไฟล์
    var formData = new FormData();
    formData.append("product_name", product_name);
    formData.append("category_id", category_id);
    formData.append("price", price);
    formData.append("product_image", product_image); 

    // ส่งข้อมูลไปยัง API ด้วย AJAX (fetch API)
    fetch('http://localhost:3000/api/add-product', {
        method: 'POST',
        body: formData // ใช้ FormData แทน JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('เพิ่มสินค้าสำเร็จ');
            document.getElementById("product-form").reset(); // รีเซ็ตฟอร์มหลังจากเพิ่มสินค้า
        } else {
            alert('เกิดข้อผิดพลาด: ' + (data.message || 'ไม่สามารถเพิ่มสินค้าได้'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    });
});
