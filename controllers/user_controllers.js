import models from "../models/index.js";
import admin from "../config/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
throw new Error("The key JWT_SECRET is not define on the file .env");
}

const TOKEN_EXPIRATION = "1h";

export default {
add: async (req, res) => {
    try {
    const findUser = await admin
        .firestore()
        .collection("users")
        .where("user", "==", req.body.user)
        .get();
    const findEmail = await admin
        .firestore()
        .collection("users")
        .where("email", "==", req.body.email)
        .get();

    if (!findUser.empty) {
        return res.status(400).json({
        error: "The username is already taken",
        });
    }

    if (!findEmail.empty) {
        return res.status(400).json({
        error: "The email is already taken",
        });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const newUser = {
        ...models.userModel,
        ...req.body,
    };

    const userRef = admin.firestore().collection("users").doc();
    await userRef.set(newUser);

    res.status(200).json({ id: userRef.id, ...newUser });
    } catch (e) {
    console.error(e);
    res.status(500).json({
        message: "An erro occurred while adding the user",
        error: e.message,
    });
    }
},
list: async (req, res) => {
    try {
    const snapshot = await admin.firestore().collection("users").get();
    const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    res.status(200).json(users);
    } catch (e) {
    console.error(e);
    res.status(500).json({
        message: "An error occurred while getting the list of users",
        error: e.message,
    });
    }
},
GetById: async (req, res) => {
    try {
    const id = req.params.id;
    const user = await admin.firestore().collection("users").doc(id).get();
    if (!user.exists) {
        return res.status(401).json({
        message: "The user was not found",
        });
    }
    res.status(201).json({
        message: "Displaying user data",
        usuario: {
        id: user.id,
        ...user.data(),
        },
    });
    } catch (e) {
    console.error(e);
    res.status(500).json({
        message: "An error occurred while retrieving the user",
        error: e.message,
    });
    }
},

delete: async (req, res) => {
    try {
        const id = req.params.id;
        const userRef = admin.firestore().collection("users").doc(id);
        const doc = await userRef.get();

    if (!doc.exists) {
        return res.status(404).json({
        message: "The user not exists",
        });
    }
    await userRef.delete();
    res.status(200).json({
        message: "The user has been deleted",
    });
    } catch (e) {
    res.status(500).json({
        error: "An error ocurred while attemping to delete the user",
    });
    }
},
    update: async (req, res) => {
    try {
        const id = req.params.id;
        const { email, usuario, password } = req.body;

        // If multer processed a file upload, build its public path; otherwise null
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        // --- Input validation ---
        if (!email || !usuario) {
            return res.status(400).json({
                error: 'Email and username are required fields.',
            });
        }

        const emailSnapshot = await admin.firestore().collection('usuarios')
            .where('email', '==', email)
            .get();

        if (!emailSnapshot.empty) {
            const emailTakenByOther = emailSnapshot.docs.find(doc => doc.id !== id);
            if (emailTakenByOther) {
                return res.status(400).json({ error: 'Email is already in use by another account.' });
            }
        }

        // --- Uniqueness check: username ---
        const usernameSnapshot = await admin.firestore().collection('usuarios')
            .where('usuario', '==', usuario)
            .get();

        if (!usernameSnapshot.empty) {
            const usernameTakenByOther = usernameSnapshot.docs.find(doc => doc.id !== id);
            if (usernameTakenByOther) {
                return res.status(400).json({ error: 'Username is already in use by another account.' });
            }
        }
        const updatedData = {
            ...req.body,
            profileImage: profileImage || undefined,
            password: password ? await bcrypt.hash(password, 10) : undefined,
        };

        // Strip undefined keys — Firestore merge would treat them as explicit writes
        if (!updatedData.password) delete updatedData.password;
        if (!updatedData.profileImage) delete updatedData.profileImage;

        await admin.firestore().collection('usuarios').doc(id).set(updatedData, { merge: true });

        res.status(200).json({
            id,
            ...updatedData,
            message: 'User updated successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: 'Unable to update user.',
        });
    }
},

login: async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // Look up the account by username (Firestore has no native "find by field",
        // so we use a where-query and treat an empty result as "not found")
        const findUser = await admin.firestore()
            .collection('usuarios')
            .where('usuario', '==', usuario)
            .get();

        if (findUser.empty) {
            // Return 401, not 404 — avoid leaking whether an account exists
            return res.status(401).json({ error: 'User not found.' });
        }

        const userDoc = findUser.docs[0];
        const user = userDoc.data();
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        const token = jwt.sign(
            { id: userDoc.id, usuario: user.usuario },
            SECRET_KEY,
            { expiresIn: TOKEN_EXPIRATION }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: userDoc.id,
                usuario: user.usuario,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while trying to log in.',
        });
    }
},

};
