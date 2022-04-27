import aws from 'aws-sdk';
import fs from 'fs';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// s3 object keys; do not change the named key
const s3 = new aws.S3({ region, accessKeyId, secretAccessKey });

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

const getFileStream = (fileKey) => {
  const downloadParams = { Key: fileKey, Bucket: bucketName };
  s3.getObject(downloadParams).createReadStream();
};

export { uploadFile, getFileStream };
