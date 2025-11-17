import { MongoClient, ServerApiVersion } from 'mongodb';

declare global { 
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Use a global variable to preserve the client across module reloads in development
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

export const clientPromise = global._mongoClientPromise as Promise<MongoClient>;

export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default getDb;
