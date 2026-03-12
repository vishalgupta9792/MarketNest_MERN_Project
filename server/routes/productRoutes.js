const express = require('express');
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getBrandDashboard,
  getBrandProducts,
  getProducts,
  getProductById,
} = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Brand routes (protected + brand only)
router.get('/dashboard', verifyToken, checkRole('brand'), getBrandDashboard);
router.get('/brand/all', verifyToken, checkRole('brand'), getBrandProducts);
router.post('/', verifyToken, checkRole('brand'), upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, checkRole('brand'), upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, checkRole('brand'), deleteProduct);

// Customer routes (protected)
router.get('/', verifyToken, checkRole('customer', 'brand'), getProducts);
router.get('/:id', verifyToken, getProductById);

module.exports = router;
