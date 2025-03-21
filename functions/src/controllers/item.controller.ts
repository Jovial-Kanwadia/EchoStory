import { Request, Response } from "express";
import { getRepository } from "fireorm";
import { Item } from "../models/item.model";

// Get repository for Item collection
const itemRepository = getRepository(Item);

// CREATE - Add a new item
export const createItem = async (req: Request, res: Response) => {
    try {
        const itemData = req.body;

        // Validate request body
        if (!itemData || !itemData.name) {
            return res.status(400).json({ error: 'Item name is required' });
        }

        // Create item with timestamps
        const item = new Item();
        item.name = itemData.name;
        item.description = itemData.description;
        item.price = itemData.price;
        item.createdAt = new Date();
        item.updatedAt = new Date();

        // Save to Firestore
        const savedItem = await itemRepository.create(item);

        return res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({ error: 'Failed to create item' });
    }
};

// READ - Get all items
export const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await itemRepository.find();
        return res.status(200).json(items);
    } catch (error) {
        console.error('Error getting items:', error);
        return res.status(500).json({ error: 'Failed to retrieve items' });
    }
};

// READ - Get an item by ID
export const getItemById = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;

        try {
            const item = await itemRepository.findById(itemId);
            return res.status(200).json(item);
        } catch (error) {
            // Item not found
            return res.status(404).json({ error: 'Item not found' });
        }
        return res.status(500).json({ error: 'Failed to retrieve item' });
    } catch (error) {
        console.error('Error getting item:', error);
        return res.status(500).json({ error: 'Failed to retrieve item' });
    }
};

// UPDATE - Update an item by ID
export const updateItem = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const updateData = req.body;

        // Validate request body
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No update data provided' });
        }

        try {
            // Get existing item
            const item = await itemRepository.findById(itemId);

            // Update properties
            Object.assign(item, updateData);
            item.updatedAt = new Date();

            // Save changes
            const updatedItem = await itemRepository.update(item);
            return res.status(200).json(updatedItem);
        } catch (error) {
            return res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ error: 'Failed to update item' });
    }
};

// DELETE - Delete an item by ID
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;

        try {
            // Check if item exists
            await itemRepository.findById(itemId);

            // Delete item
            await itemRepository.delete(itemId);
            return res.status(200).json({ message: 'Item deleted successfully' });
        } catch (error) {
            // Item not found
            return res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ error: 'Failed to delete item' });
    }
};