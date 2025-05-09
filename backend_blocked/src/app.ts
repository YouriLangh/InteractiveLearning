import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import exerciseRoutes from "./routes/exercise.routes";
import exerciseAttemptRoutes from "./routes/exerciseAttempt.routes";
import chapterRoutes from "./routes/chapterRoutes";
import studentProgressRoutes from "./routes/studentProgressRoutes";
import uploadRoutes from "./routes/upload.routes";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/attempts", exerciseAttemptRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/progress", studentProgressRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
