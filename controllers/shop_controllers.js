import models from "../models/index.js";
import admin from '../config/connection.js';
import bcrypt from 'bcryptjs';

export default {
    add: async (req, res) => {
        try {
            const { number } = req.body;
    
            // Check if required fields exist
            if (!number) {
                return res.status(400).json({
                    error: 'Name and number are required.'
                });
            }
    
            const findStore = await admin.firestore().collection('stores').where('number', '==', number).get();
    
            if (!findStore.empty) {
                return res.status(400).json({
                    error: 'The store already exists.'
                });
            }
    
            const newStore = {
                ...models.shopModel,
                ...req.body
            };
    
            const storeRef = admin.firestore().collection('stores').doc();
            await storeRef.set(newStore);
    
            res.status(200).json({ id: storeRef.id, ...newStore });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while adding the store.',
                error: e.message
            });
        }
    },    
    list: async (req, res) => {
        try {
            const snapshot = await admin.firestore().collection('stores').get();
            
            const stores = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            res.status(200).json(stores);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the store list.',
                error: e.message
            });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const storeDoc = await admin.firestore().collection('stores').doc(id).get();
            
            if (!storeDoc.exists){
                return res.status(401).json({
                    message: 'Store not found.'
                });
            }
            res.status(201).json({
                message: 'Displaying store data.',
                store: {
                    id: storeDoc.id,
                    ...storeDoc.data()
                }
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the store.',
                error: e.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const storeRef = admin.firestore().collection('stores').doc(id);
            const doc = await storeRef.get();
    
            if (!doc.exists) {
                return res.status(404).json({
                    message: 'Store does not exist.'
                });
            }
    
            await storeRef.delete();
            res.status(200).json({
                message: 'Store was successfully deleted.'
            });
        } catch (e) {
            res.status(500).json({
                error: 'An error occurred while attempting to delete the store.'
            });
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, number } = req.body;
            
            const snapshot = await admin.firestore().collection('stores')
                .where('number', '==', number)
                .get();
    
            if (!snapshot.empty) {
                const existingUser = snapshot.docs.find(doc => doc.id !== id);
                if (existingUser) {
                    return res.status(400).json({ error: 'The number is already in use by another store.' });
                }
            }
    
            const updatedData = {
                ...req.body,
            };
    
            await admin.firestore().collection('stores').doc(id).set(updatedData, { merge: true });
    
            res.status(200).json({
                id: id,
                ...updatedData,
                message: 'Store successfully updated.'
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({
                error: 'Unable to update the store.'
            });
        }
    },    
};