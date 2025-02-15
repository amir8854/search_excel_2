const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// مقدار کلید Firebase از متغیر محیطی خوانده می‌شود
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

// API برای دریافت اطلاعات از Firestore
app.post('/api/firestore', async (req, res) => {
    try {
        const { collection, docId } = req.body;
        console.log("Received request body:", req.body);  // چاپ درخواست دریافتی
        const docRef = db.collection(collection).doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Document not found' });
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        console.error("Error fetching document:", error);  // چاپ خطا
        return res.status(500).json({ error: error.message });
    }
});

module.exports = app;
