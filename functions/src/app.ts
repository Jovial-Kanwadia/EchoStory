import { Application } from "express";
import itemRoutes from "./routes/item.routes";

export default function setupRoutes(app: Application): void {
  app.use("/api/items", itemRoutes);
}