import admin from 'firebase-admin';
import serviceAccount from '../ServiceAccountKey.json' with { type: 'json' };

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export default admin;