import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import exerciseRoutes from "./routes/exercise.routes";
import exerciseAttemptRoutes from "./routes/exerciseAttempt.routes";
import categoryRoutes from "./routes/categoryRoutes";
import chapterRoutes from "./routes/chapterRoutes";
import studentProgressRoutes from "./routes/studentProgressRoutes";
import uploadRoutes from "./routes/upload.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/attempts", exerciseAttemptRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/progress", studentProgressRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

export default app;
