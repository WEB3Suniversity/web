import { MongoClient } from 'mongodb';

// 分离数据库连接字符串和数据库名称
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'courses'; // 直接指定数据库名称

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('MongoDB URI 未配置');
}

if (process.env.NODE_ENV === 'development') {
  // 在开发环境中使用全局变量来避免多次连接
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // 在生产环境中创建新的连接
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(dbName); // 使用指定的数据库名称
  return { client, db };
}

export default clientPromise;