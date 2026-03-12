const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary');
const streamifier = require('streamifier');

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'marketnest/products' },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ────────────────────────────────────────────
// BRAND ROUTES
// ────────────────────────────────────────────

// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, status } = req.body;

  if (!title || !description || !price || !category) {
    throw new ApiError(400, 'title, description, price, and category are required.');
  }

  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    if (req.files.length > 5) throw new ApiError(400, 'Maximum 5 images allowed.');
    if (!hasCloudinaryConfig()) {
      throw new ApiError(503, 'Image upload is not configured yet. Add real Cloudinary credentials in server/.env or create the product without images.');
    }
    imageUrls = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
  }

  const product = await Product.create({
    title,
    description,
    price: Number(price),
    category,
    images: imageUrls,
    brand: req.user.id,
    status: status || 'draft',
  });

  res.status(201).json({ success: true, product });
});

// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
  if (!product) throw new ApiError(404, 'Product not found.');

  // Ownership check
  if (product.brand.toString() !== req.user.id) {
    throw new ApiError(403, 'You can only edit your own products.');
  }

  const { title, description, price, category, status } = req.body;
  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (category) product.category = category;
  if (status) product.status = status;

  // Handle new images
  if (req.files && req.files.length > 0) {
    if (!hasCloudinaryConfig()) {
      throw new ApiError(503, 'Image upload is not configured yet. Add real Cloudinary credentials in server/.env before uploading product images.');
    }
    const newUrls = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
    product.images = [...product.images, ...newUrls].slice(0, 5);
  }

  await product.save();
  res.json({ success: true, product });
});

// @route   DELETE /api/products/:id  (soft delete)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
  if (!product) throw new ApiError(404, 'Product not found.');

  if (product.brand.toString() !== req.user.id) {
    throw new ApiError(403, 'You can only delete your own products.');
  }

  product.isDeleted = true;
  product.status = 'archived';
  await product.save();

  res.json({ success: true, message: 'Product deleted successfully.' });
});

// @route   GET /api/products/dashboard
exports.getBrandDashboard = asyncHandler(async (req, res) => {
  const brandId = req.user.id;

  const [total, published, archived, draft, recent] = await Promise.all([
    Product.countDocuments({ brand: brandId, isDeleted: false }),
    Product.countDocuments({ brand: brandId, isDeleted: false, status: 'published' }),
    Product.countDocuments({ brand: brandId, isDeleted: false, status: 'archived' }),
    Product.countDocuments({ brand: brandId, isDeleted: false, status: 'draft' }),
    Product.find({ brand: brandId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title price status images createdAt'),
  ]);

  res.json({ success: true, stats: { total, published, archived, draft }, recentProducts: recent });
});

// @route   GET /api/products/brand/all  (brand sees all their products)
exports.getBrandProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { brand: req.user.id, isDeleted: false };
  if (status) filter.status = status;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
});

// ────────────────────────────────────────────
// CUSTOMER ROUTES
// ────────────────────────────────────────────

// @route   GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search = '', category } = req.query;

  const filter = { status: 'published', isDeleted: false };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (category && category !== 'all') filter.category = category;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('brand', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));

  res.json({
    success: true,
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// @route   GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isDeleted: false,
    status: 'published',
  }).populate('brand', 'name email');

  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ success: true, product });
});
