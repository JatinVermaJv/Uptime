const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token access denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};

module.exports = {
  authMiddleware,
  JWT_SECRET
}; 