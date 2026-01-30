import * as fs from "fs";
import * as path from "path";
import { nanoid } from "nanoid";

// Storage directory - relative to project root
const STORAGE_DIR = path.join(process.cwd(), "uploads");
const PUBLIC_DIR = path.join(process.cwd(), "client/public/uploads");

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
}

ensureDirectories();

export interface StorageResult {
  key: string;
  url: string;
  path: string;
}

/**
 * Upload a file to local storage
 * @param relKey - Relative key for the file (e.g., "listings/123/image.jpg")
 * @param data - File content as Buffer, Uint8Array, or string
 * @param contentType - MIME type of the file
 * @returns Object with key, url, and path
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<StorageResult> {
  ensureDirectories();

  // Generate unique filename
  const fileName = `${nanoid()}-${path.basename(relKey)}`;
  const filePath = path.join(STORAGE_DIR, fileName);
  const publicPath = path.join(PUBLIC_DIR, fileName);

  // Convert data to Buffer
  let buffer: Buffer;
  if (typeof data === "string") {
    buffer = Buffer.from(data);
  } else if (data instanceof Uint8Array) {
    buffer = Buffer.from(data);
  } else {
    buffer = data;
  }

  // Write to storage
  fs.writeFileSync(filePath, buffer);

  // Also write to public directory for direct access
  fs.writeFileSync(publicPath, buffer);

  return {
    key: fileName,
    url: `/uploads/${fileName}`,
    path: filePath,
  };
}

/**
 * Get a file from local storage
 * @param relKey - File key (filename)
 * @param expiresIn - Expiration time (ignored for local storage, kept for API compatibility)
 * @returns Object with key and url
 */
export async function storageGet(
  relKey: string,
  expiresIn?: number
): Promise<StorageResult> {
  ensureDirectories();

  const filePath = path.join(STORAGE_DIR, relKey);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${relKey}`);
  }

  return {
    key: relKey,
    url: `/uploads/${relKey}`,
    path: filePath,
  };
}

/**
 * Delete a file from local storage
 * @param relKey - File key (filename)
 */
export async function storageDelete(relKey: string): Promise<void> {
  ensureDirectories();

  const filePath = path.join(STORAGE_DIR, relKey);
  const publicPath = path.join(PUBLIC_DIR, relKey);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  if (fs.existsSync(publicPath)) {
    fs.unlinkSync(publicPath);
  }
}

/**
 * List all files in storage
 * @param prefix - Optional prefix to filter files
 */
export async function storageList(prefix?: string): Promise<string[]> {
  ensureDirectories();

  const files = fs.readdirSync(STORAGE_DIR);

  if (prefix) {
    return files.filter((f) => f.startsWith(prefix));
  }

  return files;
}

/**
 * Get file size
 * @param relKey - File key (filename)
 */
export async function storageGetSize(relKey: string): Promise<number> {
  const filePath = path.join(STORAGE_DIR, relKey);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${relKey}`);
  }

  const stats = fs.statSync(filePath);
  return stats.size;
}
