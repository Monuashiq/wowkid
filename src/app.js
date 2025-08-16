// import express from "express";
// import orderRoutes from "./routes/orderRoutes.js";  

// const app = express();

// app.use(express.json());

// // Routes
// app.use("/api/orders", orderRoutes);

// export default app;


import express from "express";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

export default app;
