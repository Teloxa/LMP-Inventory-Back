import models from "../models/index.js";
import admin from '../config/connection.js';
import bcrypt from 'bcryptjs';

export default {
    add: async (req, res) => {
        try {
            const { name, email } = req.body;
    
            // Check if required fields exist
            if (!name || !email) {
                return res.status(400).json({
                    error: 'Name and email are required.'
                });
            }
    
            const findSupplier = await admin.firestore().collection('suppliers').where('name', '==', name).get();
            const findEmail = await admin.firestore().collection('suppliers').where('email', '==', email).get();
    
            if (!findSupplier.empty) {
                return res.status(400).json({
                    error: 'The supplier name already exists.'
                });
            }
    
            if (!findEmail.empty) {
                return res.status(400).json({
                    error: 'The email already exists.'
                });
            }
    
            const newSupplier = {
                ...models.providerModel,
                ...req.body
            };
    
            const supplierRef = admin.firestore().collection('suppliers').doc();
            await supplierRef.set(newSupplier);
    
            res.status(200).json({ id: supplierRef.id, ...newSupplier });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while adding the supplier.',
                error: e.message
            });
        }
    },    
    list: async (req, res) => {
        try {
            const snapshot = await admin.firestore().collection('suppliers').get();
            
            const suppliers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            res.status(200).json(suppliers);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the supplier list.',
                error: e.message
            });
        }
    },
    getById: async (req, res) => {
        try {
            const id = req.params.id;
            const supplierDoc = await admin.firestore().collection('suppliers').doc(id).get();
            
            if (!supplierDoc.exists){
                return res.status(401).json({
                    message: 'Supplier not found.'
                });
            }
            res.status(201).json({
                message: 'Displaying supplier data.',
                supplier: {
                    id: supplierDoc.id,
                    ...supplierDoc.data()
                }
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'An error occurred while retrieving the supplier.',
                error: e.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const supplierRef = admin.firestore().collection('suppliers').doc(id);
            const doc = await supplierRef.get();
    
            if (!doc.exists) {
                return res.status(404).json({
                    message: 'Supplier does not exist.'
                });
            }
    
            await supplierRef.delete();
            res.status(200).json({
                message: 'Supplier was successfully deleted.'
            });
        } catch (e) {
            res.status(500).json({
                error: 'An error occurred while attempting to delete the supplier.'
            });
        }
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { email, name } = req.body;
    
            // Validate if email is already in use by another supplier
            const emailSnapshot = await admin.firestore().collection('suppliers')
                .where('email', '==', email)
                .get();
    
            if (!emailSnapshot.empty) {
                const existingEmailUser = emailSnapshot.docs.find(doc => doc.id !== id);
                if (existingEmailUser) {
                    return res.status(400).json({ error: 'The email address is already in use by another supplier.' });
                }
            }
    
            // Validate if name is already in use by another supplier
            const nameSnapshot = await admin.firestore().collection('suppliers')
                .where('name', '==', name)
                .get();
    
            if (!nameSnapshot.empty) {
                const existingNameUser = nameSnapshot.docs.find(doc => doc.id !== id);
                if (existingNameUser) {
                    return res.status(400).json({ error: 'The supplier name is already in use by another supplier.' });
                }
            }
    
            // Update supplier data
            const updatedData = { ...req.body };
            await admin.firestore().collection('suppliers').doc(id).set(updatedData, { merge: true });
    
            res.status(200).json({
                id,
                ...updatedData,
                message: 'Supplier successfully updated.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Unable to update the supplier.'
            });
        }
    },        
};