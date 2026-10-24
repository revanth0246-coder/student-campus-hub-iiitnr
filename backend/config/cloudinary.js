const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Check if Cloudinary credentials are provided via environment variables
const isCloudinaryConfigured = () => {
  return !!(
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) ||
    process.env.CLOUDINARY_URL
  );
};

// Configure Cloudinary if credentials exist
if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
}

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {}
}

/**
 * Uploads an image (base64 Data URL or file) to Cloudinary.
 * If Cloudinary credentials are not set, falls back safely to local storage or returns the URL as-is.
 * 
 * @param {string} fileSource - Base64 Data URL (data:image/...;base64,...) or remote URL
 * @param {object} options - { folder: string, public_id?: string }
 * @returns {Promise<{ success: boolean, url: string, provider: 'cloudinary' | 'local' | 'remote', public_id?: string }>}
 */
async function uploadImage(fileSource, options = {}) {
  if (!fileSource || typeof fileSource !== 'string') {
    throw new Error('Invalid file source provided for upload.');
  }

  // If already a remote CDN / HTTPS URL and not base64, keep it
  if ((fileSource.startsWith('http://') || fileSource.startsWith('https://')) && !fileSource.startsWith('data:image')) {
    return {
      success: true,
      url: fileSource,
      provider: 'remote'
    };
  }

  // 1. Cloudinary Upload (Production on Render)
  if (isCloudinaryConfigured()) {
    try {
      const folder = options.folder || 'iiitnr-campus-hub';
      const uploadOptions = {
        folder,
        resource_type: 'image',
        overwrite: true
      };
      if (options.public_id) uploadOptions.public_id = options.public_id;

      const result = await cloudinary.uploader.upload(fileSource, uploadOptions);
      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        provider: 'cloudinary'
      };
    } catch (err) {
      console.error('[Cloudinary] Upload failed, falling back to local storage:', err.message);
    }
  }

  // 2. Local Fallback (Development environment without Cloudinary API keys)
  try {
    const matches = fileSource.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      return {
        success: true,
        url: fileSource,
        provider: 'fallback'
      };
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const randomName = 'img_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex') + '.' + extension;
    const filePath = path.join(UPLOADS_DIR, randomName);
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${randomName}`;
    return {
      success: true,
      url: relativeUrl,
      provider: 'local'
    };
  } catch (localErr) {
    console.error('Local fallback upload error:', localErr);
    return {
      success: false,
      url: fileSource,
      error: localErr.message
    };
  }
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadImage
};
