import express from "express";
import cors from "cors";
import { env } from "./config/env";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

app.use("/api/health", healthRoutes);

app.listen(env.port, () => {
  console.log(`CareerCV API running on http://localhost:${env.port}`);
});