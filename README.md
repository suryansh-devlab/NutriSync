# 🥗 Nutricart — AI-Powered Health & Nutrition E-Commerce Platform

## 🚀 Overview

Nutricart is a full-stack AI-driven health and nutrition platform that combines **e-commerce**, **personalized diet planning**, and **smart recommendations** into a single ecosystem.

It focuses on **vegan, protein-rich, and health-oriented products**, helping users make better lifestyle choices while connecting **consumers directly with local retailer shops (distributors)** under centralized admin control.

---

## 🧩 Platform Architecture (Core Idea)

Nutricart follows a **B2B2C hybrid model**:

### 👤 Consumer (End User)

- Discovers products online
- Gets AI-based recommendations
- Can order directly (optional flow)

### 🏪 Distributor = Retailer Shop (Your Sales Partners)

- Nutricart **supplies products to retailers (B2B)**
- Retailers sell products **offline in their local shops**
- Act as **ground-level sales channels**
- Expand Nutricart’s reach in physical markets

👉 Important:
Retailers are **customers of Nutricart (B2B buyers)** and also **resellers (offline sellers)**.

### 🛠️ Admin (Central Control Layer)

- Manages **product supply chain**
- Controls **retailers (distributors) and consumers**
- Tracks sales (online + offline ecosystem vision)

---

## ✨ Key Features

### 👤 Consumer Features

- 🔐 OTP-based authentication (Login/Signup)
- 🛒 Browse & purchase health products
- 📦 Order tracking & history
- 📍 Address management
- 🤖 AI-based diet & exercise recommendations
- ❤️ Personalized product suggestions

---

### 🏪 Distributor (Retailer Shop) Features

- 🏬 Register as a retailer partner
- 📦 Purchase stock from Nutricart (B2B model)
- 🛒 Sell products **offline in local market**
- 💰 Earn profit margins on resale
- 📊 Track purchases, margins & performance
- 📍 Operate within their own shop location

👉 Core Idea:
Nutricart acts like a **brand + supplier**, while retailers act as **offline sellers**.

---

### 🛠️ Admin Features (Full Control System)

- 👥 Manage consumers and distributors
- 🛍️ Add / edit / delete products
- 📊 Advanced analytics dashboard
  - Sales
  - User growth
  - Distributor performance

- 📦 Monitor all orders
- ⚙️ Control margins, visibility, and system rules

👉 Admin acts as the **central brain of the platform**.

---

## 🧠 AI Capabilities

- Personalized diet plans
- Product recommendations based on goals
- Health suggestions (weight loss, muscle gain, etc.)

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js

### Database

- MongoDB (Mongoose)

### Authentication & Security

- JWT
- OTP (Email/SMS)
- bcrypt

### Performance

- Redis (OTP + caching)

---

## 📂 Project Structure

```
Nutricart/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

---

## 🔐 Authentication Flow (OTP Based)

1. User enters email/phone
2. OTP stored in Redis
3. OTP sent via Email/SMS
4. User verifies OTP
5. JWT token generated

---

## 🛒 Business Flow (B2B + Optional B2C)

### 🏪 Retailer Flow (Primary)

1. Admin adds products
2. Retailer purchases stock from Nutricart
3. Retailer sells products offline
4. Retailer earns margin

### 👤 Consumer Flow (Optional / Future Hybrid)

1. User browses products
2. Places order
3. Can be fulfilled via retailer network or direct supply

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/nutricart.git
cd nutricart
```

### 2️⃣ Install Dependencies

Frontend:

```
cd frontend
npm install
```

Backend:

```
cd backend
npm install
```

---

### 3️⃣ Environment Variables (.env)

```
PORT=4000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

### 4️⃣ Run Project

Backend:

```
npm run dev
```

Frontend:

```
npm start
```

---

## 📊 Future Enhancements

- 📱 Mobile App
- 🧾 Subscription-based diet plans
- 🧠 AI chatbot nutrition assistant
- 💳 Payment gateway integration
- 🏪 Retailer inventory management system

---

## 🎯 Vision

Nutricart aims to become a **hyperlocal AI-powered health commerce platform**, where:

- Consumers get smart health guidance
- Retailers grow their local business digitally
- Admin controls and optimizes the ecosystem

---

## 👨‍💻 Author

Suryansh Kushwaha

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
