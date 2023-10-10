const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./Routes/users");
const authRouter = require("./Routes/auth");
const postRouter = require("./Routes/post");
const multer = require("multer");
const path = require("path");

const app = express();
dotenv.config();

const bucketname = process.env.BUCKET_NAME;
const bucketregion = process.env.BUCKET_REGION;
const accesskeys = process.env.ACCESS_KEYS;
const secretaccesskeys = process.env.SECRET_ACCESS_KEYS;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accesskeys,
    secretAccessKey: secretaccesskeys,
  },
  region: bucketregion,
});

try {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
  console.log(`Connected to MongoDB Successfully ... 🔥🔥🔥`);
} catch (err) {
  console.log(`Connection to MongoDB Failed \n ${err}`);
}

//use local images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

//upload image to s3
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  const data = {
    Bucket: bucketname,
    Key: req.body.name,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(data);
  await s3.send(command);

  res.send({});
});
////

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.listen(process.env.PORT, () => {
  console.log(
    `Backend Server Started on port : ${process.env.PORT} ... 🚀🚀🚀 `
  );
});
