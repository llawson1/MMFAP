import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

import authenticTeamsRouter from "./routes/authentic-teams";
import expandedAuthenticTeamsRouter from "./routes/expanded-authentic-teams";
import uploadedDataRouter from "./routes/uploaded-data";
import premierLeagueSalariesRouter from "./routes/premier-league-salaries";
import matchdayFinanceRouter from "./routes/matchday-finance";
import apiSportsProxyRouter from "./routes/api-sports-proxy";
import sportmonksIntegrationRouter from "./routes/sportmonks-integration";
import sportmonksTestRouter from "./routes/sportmonks-test";
import dashboardSummaryRouter from "./routes/dashboard-summary";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use("/api", authenticTeamsRouter);
  app.use("/api", expandedAuthenticTeamsRouter);
  app.use("/api", uploadedDataRouter);
  app.use("/api", premierLeagueSalariesRouter);
  app.use("/api", matchdayFinanceRouter);
  app.use("/api", apiSportsProxyRouter);
  app.use("/api", sportmonksIntegrationRouter);
  app.use("/api", sportmonksTestRouter);
  app.use("/api", dashboardSummaryRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();