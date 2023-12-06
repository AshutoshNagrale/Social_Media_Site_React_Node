import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getImagesUrlfromS3 = async (image) => {
  console.log("images from s3");
  const bucketname = import.meta.env.VITE_BUCKET_NAME;
  const bucketregion = import.meta.env.VITE_BUCKET_REGION;
  const accesskeys = import.meta.env.VITE_ACCESS_KEYS;
  const secretaccesskeys = import.meta.env.VITE_SECRET_ACCESS_KEYS;

  const s3 = new S3Client({
    credentials: {
      accessKeyId: accesskeys,
      secretAccessKey: secretaccesskeys,
    },
    region: bucketregion,
  });

  const getObjectParams = {
    Bucket: bucketname,
    Key: image,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  console.log(url);
  return url;
};
