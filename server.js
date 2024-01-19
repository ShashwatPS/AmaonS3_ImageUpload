const { S3, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const cors = require('cors');

const app = express();

app.use(cors());
const s3 = new S3({
    credentials: {
        accessKeyId: "AKIAWM436JAKBECFQZJN",
        secretAccessKey: "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",
    },
    region: "ap-south-1",
});


// Uploading API
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "frosthacks",
        metadata: function (req, file, cb) {
            console.log(file);
            cb(null, { fieldName: file.originalname });
        },
        key: function (req, file, cb) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().replace(/:/g, '-').split('.')[0];
            const modifiedFileName = `${formattedDate}_${file.originalname}`;
            cb(null, modifiedFileName);
        },
    }),
});

app.post('/upload', upload.single('photos'), function (req, res, next) {
    const imageName = req.file.key;
    res.send({ data: { imageName }, msg: 'Successfully uploaded ' + imageName + ' file!' });
});

app.get("/url/:filename", async (req, res) => {
    const params = { Bucket: "frosthacks", Key: req.params.filename };
    try {
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: 60 * 5 });
        res.send(signedUrl);
    } catch (error) {
        console.error("Error generating signed URL:", error);
        res.status(500).send("Error generating signed URL");
    }
});

app.listen(4000, function () {
    console.log('Express is online');
});