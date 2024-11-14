const resetForm = document.getElementById('resetForm');

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        Swal.fire({
            title: 'Error!',
            text: 'รหัสไม่ตรงกันกรุณาลองอีกครั้ง',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#007BFF',
        });
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/reset-password',  { // ใช้ URL ที่กำหนดในเซิร์ฟเวอร์
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                newPassword
            }),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Success!',
                text: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#007BFF',
            }).then(() => {
                window.location.href = '/login.html'; // ไปหน้า login
            });
        } else {
            console.error('Error data:', data); // Log ข้อมูลข้อผิดพลาด
            Swal.fire({
                title: 'Error!',
                text: data.error,
                icon: 'error',
                confirmButtonText: 'ลองอีกครั้ง',
                confirmButtonColor: '#007BFF',
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#007BFF',
        });
    }
    
});


