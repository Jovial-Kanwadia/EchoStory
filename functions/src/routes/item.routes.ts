// File: src/routes/item.routes.ts
import { Router } from "express";
import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from "../controllers/item.controller";

const router = Router();

// Item routes
router.post("/create", createItem);
router.get("/getAllItems", getAllItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;