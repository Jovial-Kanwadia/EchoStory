import { Application } from "express";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";

export default function setupRoutes(app: Application): void {
  app.use("/items", itemRoutes);
  app.use("/users", userRoutes);
}
