// ฟังก์ชันการส่งข้อมูลเมื่อฟอร์มถูกส่ง
document.getElementById("customer-form").addEventListener("submit", function(event) {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    // เก็บข้อมูลที่กรอกจากฟอร์ม
    const customerData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postal: document.getElementById("postal").value
    };

    // แสดงข้อมูลลูกค้าที่กรอก
    console.log("ข้อมูลลูกค้า:", customerData);

    // สามารถทำการส่งข้อมูลไปยังเซิร์ฟเวอร์ได้ที่นี่ (ใช้ AJAX หรือฟังก์ชันที่เหมาะสม)
    alert("บันทึกข้อมูลเรียบร้อย!");
});
