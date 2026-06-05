import "./src/config/env.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { seedAdmin } from "./src/controllers/seedAdmin.controller.js";

// Connect to the database
connectDB();

await seedAdmin(); // Seed the admin user on startup

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
