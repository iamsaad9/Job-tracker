const { Client, Storage } = require("node-appwrite");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const client = new Client()
  .setEndpoint(requireEnv("APPWRITE_ENDPOINT"))
  .setProject(requireEnv("APPWRITE_PROJECT_ID"))
  // IMPORTANT: use a Server API Key (never expose to client)
  .setKey(requireEnv("APPWRITE_API_KEY"));

const storage = new Storage(client);
const bucketId = requireEnv("APPWRITE_BUCKET_ID");

module.exports = { storage, bucketId };

