import express from "express";
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
} from "../controller/productController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { handleUploadError, uploadMultiple } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes (require authentication)
router.post("/", protect, uploadMultiple, handleUploadError, createProduct);
router.put("/:id", protect, uploadMultiple, handleUploadError, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
