import { Storage } from '@google-cloud/storage';
import * as path from 'path';

const dirname = path.join(__dirname, '../../gcp.config.json');
const gcpProjectId = process.env.GCP_PROJECT_ID;
const bucketName = process.env.GCP_BUCKET_NAME as string;

const storage = new Storage({
   keyFilename: dirname,
   projectId: gcpProjectId,
});

const bucket = storage.bucket(bucketName);

export { storage, bucket };
