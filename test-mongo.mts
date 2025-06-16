import { getItemsCollection } from './src/lib/mongodb.js';

async function test() {
  try {
    const collection = await getItemsCollection();
    const count = await collection.countDocuments();
    console.log('Connected! Item count:', count);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test(); 