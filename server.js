const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// چاپ پیامی که سرور شروع شده
console.log("Server is starting...");

// مقدار کلید Firebase از متغیر محیطی خوانده می‌شود
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// چاپ مقدار متغیر محیطی
console.log("Service Account: ", process.env.FIREBASE_SERVICE_ACCOUNT);

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

        // چاپ اطلاعات دریافتی از درخواست
        console.log("Collection:", collection);
        console.log("Document ID:", docId);

        const docRef = db.collection(collection).doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            console.log("Document not found");
            return res.status(404).json({ error: 'Document not found' });
        }

        console.log("Document data:", doc.data());
        return res.status(200).json(doc.data());
    } catch (error) {
        console.log("Error occurred:", error.message);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = app;
