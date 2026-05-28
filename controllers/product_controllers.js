import models from "../models/index.js";
import admin from '../config/conexion.js'; 

export default {
    // Add product
    add: async (req, res) => {
        try {
            const newProduct = { 
                ...models.productModel, 
                ...req.body 
            };

            const productRef = admin.firestore().collection('products').doc();
            await productRef.set(newProduct);

            res.status(200).json({ id: productRef.id, ...newProduct });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while adding the product.',
                error: e.message,
            });
        }
    },

    // List products
    list: async (req, res) => {
        try {
            const snapshot = await admin.firestore().collection('products').get();
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            res.status(200).json(products);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the product list.',
                error: e.message,
            });
        }
    },

    // Get product by ID
    get: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'The product ID is required.' });
            }

            const productRef = admin.firestore().collection('products').doc(id);
            const doc = await productRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            res.status(200).json({ id: doc.id, ...doc.data() });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the product.',
                error: e.message,
            });
        }
    },

    // Update product
    update: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'The product ID is required.' });
            }

            const productRef = admin.firestore().collection('products').doc(id);
            const doc = await productRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            const updatedProduct = { 
                ...req.body 
            };

            await productRef.set(updatedProduct, { merge: true });

            res.status(200).json({ id, ...updatedProduct });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while updating the product.',
                error: e.message,
            });
        }
    },

    // Remove product
    remove: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'The product ID is required.' });
            }

            const productRef = admin.firestore().collection('products').doc(id);
            const doc = await productRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            await productRef.delete();

            res.status(200).json({ message: 'Product successfully deleted.' });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while deleting the product.',
                error: e.message,
            });
        }
    },
};