/**
 * Image Storage Service — Modular, supports local filesystem and Cloudinary
 *
 * Set STORAGE_PROVIDER=cloudinary with Cloudinary credentials to use cloud storage.
 * Defaults to local filesystem storage for development.
 */

const fs = require('fs');
const path = require('path');

async function uploadImage(filePath, folder = 'cleancity') {
  const provider = process.env.STORAGE_PROVIDER;

  if (provider === 'cloudinary') {
    return cloudinaryUpload(filePath, folder);
  }

  // Local storage — serve via /uploads static route
  return localStorageAdapter(filePath);
}

async function deleteImage(publicIdOrPath) {
  const provider = process.env.STORAGE_PROVIDER;

  if (provider === 'cloudinary') {
    return cloudinaryDelete(publicIdOrPath);
  }

  return localDeleteAdapter(publicIdOrPath);
}

// ─── Local Storage Adapter ────────────────────────────────────────────────────

async function localStorageAdapter(filePath) {
  const filename = path.basename(filePath);
  return {
    url: `/uploads/${filename}`,
    publicId: filePath,
    provider: 'local',
  };
}

async function localDeleteAdapter(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn('Could not delete local file:', err.message);
  }
}

// ─── Cloudinary Adapter ───────────────────────────────────────────────────────

async function cloudinaryUpload(filePath, folder) {
  try {
    const cloudinary = require('cloudinary').v2;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
    });

    // Delete local temp file after Cloudinary upload
    try { fs.unlinkSync(filePath); } catch {}

    return {
      url: result.secure_url,
      publicId: result.public_id,
      provider: 'cloudinary',
    };
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    throw new Error('Image upload to Cloudinary failed. Check your Cloudinary credentials.');
  }
}

async function cloudinaryDelete(publicId) {
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary delete error:', err.message);
  }
}

module.exports = { uploadImage, deleteImage };
