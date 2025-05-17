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

import path from "node:path";

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

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "../../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server connected on port ${PORT}`);
  connectDB();
});
