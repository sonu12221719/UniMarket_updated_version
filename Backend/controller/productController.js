import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

// CREATE
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user._id // assuming you have auth middleware attaching user
    };

    console.log(req.files)
    // Handle image uploads if files are present
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
            resource_type: "auto"
          });
          
          // Remove local file after upload
          fs.unlinkSync(file.path);
          
          return {
            public_id: result.public_id,
            url: result.secure_url
          };
        } catch (uploadError) {
          // Remove local file if upload fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw uploadError;
        }
      });

      try {
        const uploadedImages = await Promise.all(imagePromises);
        productData.images = uploadedImages;
      } catch (uploadError) {
        return res.status(400).json({
          message: "Error uploading images",
          error: uploadError.message
        });
      }
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LIST
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DETAIL
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Handle image uploads if files are present
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
            resource_type: "auto"
          });
          
          // Remove local file after upload
          fs.unlinkSync(file.path);
          
          return {
            public_id: result.public_id,
            url: result.secure_url
          };
        } catch (uploadError) {
          // Remove local file if upload fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw uploadError;
        }
      });

      try {
        const uploadedImages = await Promise.all(imagePromises);
        productData.images = uploadedImages;
      } catch (uploadError) {
        return res.status(400).json({ 
          message: "Error uploading images", 
          error: uploadError.message 
        });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(async (image) => {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
          }
        }
      });
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "products",
    resource_type: "auto"
  });
  fs.unlinkSync(filePath); // Remove local file
  return result;
};
