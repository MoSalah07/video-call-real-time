import express from "express";
// Dotenv .env
import "dotenv/config";
// DB
import { connectDB } from "./lib/db";
// Routes
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
// Cookie parser
import cookieParser from "cookie-parser";
// Cors
import cors from "cors";

import path from "path";
import fs from "fs";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use(`/api/auth`, authRoutes);
app.use(`/api/user`, usersRoutes);
app.use(`/api/chat`, chatRoutes);

// ======== Serve Vite React build in production ========
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../../client/dist");
  const indexPath = path.join(clientPath, "index.html");

  // Serve static files
  app.use(express.static(clientPath));

  // Fallback to index.html for SPA
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("index.html not found");
      }
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log(`server connected on port ${PORT}`);
  connectDB();
});
