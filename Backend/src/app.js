import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./config/redis.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import addressRoutes from "./routes/address.routes.js";

const app = express();

/* ======================================================
   Allowed Origins
====================================================== */

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];

/* ======================================================
   CORS OPTIONS
====================================================== */

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman / mobile apps / server-side requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

/* ======================================================
   Manual CORS Headers
====================================================== */

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);

    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );

    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ======================================================
   Middleware
====================================================== */

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* ======================================================
   Routes
====================================================== */

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/addresses", addressRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/reviews", reviewRoutes);

/* ======================================================
   Health Route
====================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NutriSync API Running 🚀",
  });
});

/* ======================================================
   Global Error Handler
====================================================== */

app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,

    message: err.message || "Internal Server Error",
  });
});

export default app;
