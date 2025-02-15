const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// مقدار کلید Firebase از متغیر محیطی خوانده می‌شود
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    console.log("Initializing Firebase Admin SDK...");  // اضافه کردن لاگ
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    console.log("Firebase already initialized");  // لاگ در صورتی که قبلاً Firebase راه‌اندازی شده باشد
}

const db = admin.firestore();

// API برای دریافت اطلاعات از Firestore
app.post('/api/firestore', async (req, res) => {
    try {
        console.log("Received request body:", req.body);  // چاپ درخواست دریافتی
        const { collection, docId } = req.body;

        if (!collection || !docId) {
            console.error("Missing collection or docId in request body");  // لاگ در صورت کمبود داده
            return res.status(400).json({ error: "Missing collection or docId" });
        }

        const docRef = db.collection(collection).doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            console.log(`Document with id ${docId} not found in collection ${collection}`);
            return res.status(404).json({ error: 'Document not found' });
        }

        return res.status(200).json(doc.data());
    } catch (error) {
        console.error("Error fetching document:", error);  // چاپ خطا
        return res.status(500).json({ error: error.message });
    }
});

module.exports = app;
