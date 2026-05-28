import models from "../models/index.js";
import admin from '../config/connection.js';

export default {
    // Create new order
    add: async (req, res) => {
        try {
            const newOrder = {
                ...models.orderModel,
                ...req.body,
            };

            const orderRef = admin.firestore().collection('orders').doc();
            await orderRef.set(newOrder);

            res.status(200).json({ id: orderRef.id, ...newOrder });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while adding the order.',
                error: e.message,
            });
        }
    },

    // List all orders
    list: async (req, res) => {
        try {
            const snapshot = await admin.firestore().collection('orders').get();
            const orders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            res.status(200).json(orders);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the order list.',
                error: e.message,
            });
        }
    },

    // Get an order by ID
    get: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'The order ID is required.' });
            }

            const orderRef = admin.firestore().collection('orders').doc(id);
            const doc = await orderRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Order not found.' });
            }

            res.status(200).json({ id: doc.id, ...doc.data() });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the order.',
                error: e.message,
            });
        }
    },

    // Update an order
    update: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'The order ID is required.' });
            }

            const orderRef = admin.firestore().collection('orders').doc(id);
            const doc = await orderRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Order not found.' });
            }

            const updatedOrder = {
                ...req.body,
            };

            await orderRef.set(updatedOrder, { merge: true });

            res.status(200).json({ id, ...updatedOrder });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while updating the order.',
                error: e.message,
            });
        }
    },

    // Delete an order
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'The order ID is required.' });
            }

            const orderRef = admin.firestore().collection('orders').doc(id);
            const doc = await orderRef.get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Order not found.' });
            }

            await orderRef.delete();

            res.status(200).json({ message: 'Order successfully deleted.' });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while deleting the order.',
                error: e.message,
            });
        }
    },
};