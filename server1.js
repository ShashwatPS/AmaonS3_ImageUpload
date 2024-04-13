const express = require('express');
const multer = require('multer');
const { S3, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const app = express();


const s3 = new S3({
    credentials: {
        accessKeyId: "AKIAWM436JAKBECFQZJN",
        secretAccessKey: "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",
    },
    region: "ap-south-1",
});

const upload = multer();

// Define the upload route
app.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const file = req.file;
        const imageName = file.originalname;

        const uploadParams = {
            Bucket: "frosthacks",
            Key: imageName,
            Body: file.buffer
        };
        await s3.send(new PutObjectCommand(uploadParams));

        const signedUrlParams = {
            Bucket: "frosthacks",
            Key: imageName,
        };
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(signedUrlParams), { expiresIn: 300 });
        res.status(200).json({ signedUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
