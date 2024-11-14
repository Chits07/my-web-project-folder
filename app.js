const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');  // ใช้ bcrypt สำหรับการตรวจสอบรหัสผ่าน
const app = express();
const multer = require('multer');
const port = 3000;  // กำหนดพอร์ตเป็น 3000 อย่างชัดเจน


// ตั้งค่าการเก็บไฟล์โดยใช้ multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // เก็บไฟล์ในโฟลเดอร์ 'uploads/'
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // ตั้งชื่อไฟล์ใหม่ด้วย timestamp
    }
});

// ใช้ multer เพื่อจัดการการอัปโหลดไฟล์
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'your_database',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// เส้นทางต่างๆ ที่ถูกต้อง
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// เส้นทางสำหรับหน้า login.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// เส้นทางสำหรับหน้า register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// เส้นทางสำหรับหน้า reset-password.html
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// เส้นทางหน้าอื่น ๆ
app.get('/mother', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mother.html')));
app.get('/health', (req, res) => res.sendFile(path.join(__dirname, 'public', 'health.html')));
app.get('/electrical', (req, res) => res.sendFile(path.join(__dirname, 'public', 'electrical.html')));
app.get('/garden', (req, res) => res.sendFile(path.join(__dirname, 'public', 'garden.html')));
app.get('/beauty', (req, res) => res.sendFile(path.join(__dirname, 'public', 'beauty.html')));
app.get('/fashion', (req, res) => res.sendFile(path.join(__dirname, 'public', 'fashion.html')));
app.get('/mobile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mobile.html')));

// API สำหรับการสมัครสมาชิก
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
            db.query(insertQuery, [email, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Registration error, please try again.' });
                }
                res.json({ success: true, message: 'Registration successful' });
            });
        } catch (error) {
            return res.status(500).json({ error: 'Error in password hashing' });
        }
    });
});

// API สำหรับการล็อกอิน
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }
                if (result) {
                    return res.json({ success: true, message: 'รหัสผ่านถูกต้อง' });
                } else {
                    return res.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
                }
            });
        } else {
            return res.json({ success: false, message: 'ไม่พบผู้ใช้นี้ในระบบ' });
        }
    });
});

// API สำหรับการรีเซ็ตรหัสผ่าน
app.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'อีเมลและรหัสผ่านใหม่ต้องไม่เป็นค่าว่าง' });
    }

    try {
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Error retrieving user' });
            }

            if (user.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating password' });
                }
                return res.json({ message: 'รหัสผ่านของคุณถูกรีเซ็ตเรียบร้อย.' });
            });
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



// API สำหรับเพิ่มสินค้า
app.post('/api/add-product', upload.single('product_image'), (req, res) => {
    const { product_name, category_id, price } = req.body;
    const product_image = req.file ? req.file.filename : null;

    const query = 'INSERT INTO products (product_name, category_id, price, product_image) VALUES (?, ?, ?, ?)';
    db.query(query, [product_name, category_id, price, product_image], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
        }
        res.json({ success: true, message: 'เพิ่มสินค้าเรียบร้อยแล้ว' });
    });
});

// ตั้งค่า static file สำหรับโฟลเดอร์ uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API สำหรับดึงข้อมูลสินค้า
app.get('/api/products', (req, res) => {
    const limit = 10;  // จำกัดจำนวนสินค้าในแต่ละหน้า
    const page = req.query.page || 1;  // รับค่าหน้าปัจจุบันจาก query string หรือใช้ค่าเริ่มต้นเป็น 1
    const category = req.query.category;  // รับค่าหมวดหมู่จาก query string (เช่น category=1)
    const offset = (page - 1) * limit;  // คำนวณ offset สำหรับ pagination

    let query = 'SELECT * FROM products';
    let queryParams = [];
    
    if (category) {
        query += ' WHERE category_id = ?';
        queryParams.push(category);
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    db.query(query, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
