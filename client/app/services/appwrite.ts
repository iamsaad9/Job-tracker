import { Client, Storage } from "node-appwrite";

/**
 * Ensures environment variables are present and 
 * provides strict string typing for the rest of the app.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

// 1. Initialize the Client with typed strings
const client: Client = new Client()
  .setEndpoint(requireEnv("APPWRITE_ENDPOINT"))
  .setProject(requireEnv("APPWRITE_PROJECT_ID"))
  .setKey(requireEnv("APPWRITE_API_KEY"));

// 2. Initialize Storage with the typed client
const storage: Storage = new Storage(client);

// 3. Export constants with explicit types
const bucketId: string = requireEnv("APPWRITE_BUCKET_ID");

export { storage, bucketId };