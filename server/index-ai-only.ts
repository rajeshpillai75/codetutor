import express, { json, Request, Response, NextFunction } from "express";
import { log } from "./vite";
import { registerRoutes } from "./routes-ai-only";
import cors from "cors";
import { setupVite, serveStatic } from "./vite";
import { check } from "./seeds-minimal";

const app = express();

// Simple check if the database is ready
check().catch((err) => {
  log(`Database not ready: ${err.message}`, "express");
});

// Middleware
app.use(cors());
app.use(json());

// Simple logger middleware
app.use((req, _res, next) => {
  log(`${req.method} ${req.url}`, "express");
  next();
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  log(`Error: ${err.message}`, "express");
  res.status(500).send({ error: "Internal Server Error" });
});

// Register API routes and get HTTP server
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    // Setup Vite in development, or serve static files in production
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }
    
    // Start the server
    server.listen(port, () => {
      log(`serving on port ${port}`, "express");
    });
  } catch (err) {
    log(`Failed to start server: ${err}`, "express");
    process.exit(1);
  }
}

startServer();