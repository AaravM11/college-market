import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const dbName = 'college-marketplace';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the value is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, it's best to not use a global variable.
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getItemsCollection(): Promise<Collection> {
  const client = await clientPromise;
  const db: Db = client.db(dbName);
  return db.collection('items');
}

export async function getUsersCollection(): Promise<Collection> {
  const client = await clientPromise;
  const db: Db = client.db(dbName);
  return db.collection('users');
} 