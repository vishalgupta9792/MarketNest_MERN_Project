# 🛍️ MarketNest – Mini Fashion Marketplace

> A production-ready MERN stack fashion marketplace with role-based access, JWT auth, Cloudinary image uploads, and server-side pagination.

## 🔗 Live Links

| Service | URL |
|---------|-----|
| Frontend | `https://marketnest.vercel.app` *(update after deploy)* |
| Backend API | `https://marketnest-api.onrender.com` *(update after deploy)* |

---

## 🧱 Architecture

```
┌─────────────────┐        ┌──────────────────────┐        ┌───────────────┐
│  React Frontend │◄──────►│  Express REST API     │◄──────►│ MongoDB Atlas │
│  (Vercel)       │  JWT   │  (Render.com)         │        │               │
└─────────────────┘        └──────────┬───────────┘        └───────────────┘
                                       │
                              ┌────────▼────────┐
                              │   Cloudinary    │
                              │ (Image Storage) │
                              └─────────────────┘
```

- **Frontend** (React + Vite) communicates with the backend via Axios with automatic JWT refresh
- **Backend** (Express + Node.js) exposes a RESTful API with role-based access control
- **Database** (MongoDB Atlas) stores users and products with proper schema design
- **Images** are uploaded via Multer (memory storage) → streamed to Cloudinary

---

## 🔐 Authentication Flow

```
1. User signs up → password hashed with bcrypt (12 rounds)
2. User logs in  → receives:
     • accessToken  (15 min) in response body
     • refreshToken (7 days) in httpOnly cookie
3. Axios interceptor attaches Bearer token to every request
4. On 401 error  → interceptor calls POST /api/auth/refresh
                 → gets new accessToken → retries original request
5. Logout        → cookie cleared + refreshToken nulled in DB
```

---

## 📁 Folder Structure

```
marketnest/
├── server/
│   ├── config/          → db.js, cloudinary.js
│   ├── controllers/     → authController.js, productController.js
│   ├── middleware/      → authMiddleware.js, roleMiddleware.js,
│   │                      uploadMiddleware.js, errorMiddleware.js
│   ├── models/          → User.js, Product.js
│   ├── routes/          → authRoutes.js, productRoutes.js
│   ├── utils/           → ApiError.js, asyncHandler.js, generateToken.js
│   └── server.js
└── client/
    └── src/
        ├── api/         → axiosInstance.js (with interceptors)
        ├── components/  → Navbar, ProductCard, Pagination, ImageUpload
        ├── context/     → AuthContext.jsx
        ├── pages/       → Login, Signup, Marketplace, ProductDetail,
        │                   BrandDashboard, CreateProduct, EditProduct
        └── routes/      → ProtectedRoute.jsx, RoleRoute.jsx
```

---

## 🔒 Security Decisions

| Decision | Reason |
|----------|--------|
| bcrypt with 12 salt rounds | Industry standard; slow hashing resists brute-force |
| httpOnly cookie for refresh token | Cannot be read by JavaScript → XSS protection |
| Short-lived access token (15min) | Minimizes damage if token is leaked |
| Ownership check before edit/delete | Prevents brands from tampering with others' products |
| Role middleware on all sensitive routes | Defense in depth against privilege escalation |
| CORS restricted to frontend origin | Prevents unauthorized cross-origin requests |
| `.env` for all secrets | Secrets never committed to version control |
| `select: false` on password/refreshToken | Never accidentally returned in API responses |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)

### Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🌐 Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Backend | Render.com | Free tier, set all env vars in dashboard |
| Frontend | Vercel | Set VITE_API_URL to your Render URL |
| Database | MongoDB Atlas | Free M0 cluster, whitelist 0.0.0.0/0 |
| Images | Cloudinary | Free tier, 25 credits/month |

---

## 🤖 AI Tools Used

Claude AI (Anthropic) was used to:
- Scaffold boilerplate middleware patterns (asyncHandler, ApiError)
- Generate initial Mongoose schema structure

All business logic, security decisions, auth flow implementation, and architecture were written and reviewed manually.

---

## 👤 Roles & Capabilities

### Brand (Seller)
- ✅ Signup/Login as Brand
- ✅ Create products (draft or published)
- ✅ Upload up to 5 images per product
- ✅ Edit only their own products (ownership enforced)
- ✅ Soft delete products
- ✅ View dashboard: total / published / archived / draft counts

### Customer (Buyer)
- ✅ Signup/Login as Customer
- ✅ Browse published marketplace
- ✅ View product details
- ✅ Search by product name
- ✅ Filter by category
- ✅ Server-side pagination
- ❌ Cannot create/edit/delete products

---

## 📬 Submission

Submitted by: Vishal Gupta   
Email: careers@trizenventures.com  
Subject: `Assignment Submission – Vishal Gupta`
