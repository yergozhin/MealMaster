const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/config');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long' });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleId = 2;
    const [result] = await db.query('INSERT INTO users (name, email, passwordHash, roleId) VALUES (?, ?, ?, ?)', [
      name,
      email,
      hashedPassword,
      roleId,
    ]);

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = rows[0];
    if (user.id != 1 && user.id != 2) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    } else {
      if (user.passwordHash != password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
