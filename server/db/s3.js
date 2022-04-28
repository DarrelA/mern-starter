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
  return s3.getObject(downloadParams).createReadStream();
};

const deleteAvatar = async (fileKey) => {
  const params = { Key: fileKey, Bucket: bucketName };
  try {
    await s3.headObject(params).promise();
    console.log('File Found in S3');
    try {
      await s3.deleteObject(params).promise();
      console.log('file deleted Successfully');
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err));
    }
  } catch (err) {
    console.log('File not Found ERROR : ' + err.code);
  }
};

export { uploadFile, getFileStream, deleteAvatar };
