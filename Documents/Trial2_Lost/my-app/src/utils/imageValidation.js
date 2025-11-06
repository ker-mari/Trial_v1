/**
 * Image Validation Utilities
 * Validates base64 encoded images before upload
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_DIMENSION = 4096; // 4K resolution

/**
 * Validate a base64 encoded image
 * @param {string} base64String - The base64 encoded image string
 * @returns {Object} - { valid: boolean, error: string|null, info: object|null }
 */
export const validateBase64Image = (base64String) => {
  // Check if value is provided
  if (!base64String || base64String.trim() === '') {
    return { valid: true, error: null, info: null }; // Empty is valid (nullable)
  }

  // Check if it's a valid data URI
  const dataUriRegex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
  const match = base64String.match(dataUriRegex);

  if (!match) {
    return {
      valid: false,
      error: 'Invalid image format. Only JPEG, PNG, and WebP images are allowed.',
      info: null
    };
  }

  const mimeType = `image/${match[1]}`;

  // Validate mime type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid image type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      info: null
    };
  }

  // Extract base64 data
  const base64Data = base64String.replace(dataUriRegex, '');

  // Validate base64 encoding
  try {
    atob(base64Data);
  } catch (e) {
    return {
      valid: false,
      error: 'Invalid base64 encoding.',
      info: null
    };
  }

  // Calculate file size
  const padding = (base64Data.match(/=/g) || []).length;
  const fileSize = (base64Data.length * 0.75) - padding;

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    const actualSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Image size (${actualSizeMB}MB) exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB.`,
      info: { fileSize, fileSizeMB: actualSizeMB }
    };
  }

  // Validate image dimensions using Image object
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        resolve({
          valid: false,
          error: `Image dimensions (${width}x${height}) exceed maximum allowed dimensions of ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.`,
          info: { width, height, fileSize, fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2) }
        });
      } else {
        resolve({
          valid: true,
          error: null,
          info: { 
            width, 
            height, 
            fileSize, 
            fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
            mimeType 
          }
        });
      }
    };

    img.onerror = () => {
      resolve({
        valid: false,
        error: 'Unable to load image. The file may be corrupted.',
        info: null
      });
    };

    img.src = base64String;
  });
};

/**
 * Synchronous validation (without dimension check)
 * Use this for quick validation before async validation
 * @param {string} base64String - The base64 encoded image string
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateBase64ImageSync = (base64String) => {
  // Check if value is provided
  if (!base64String || base64String.trim() === '') {
    return { valid: true, error: null };
  }

  // Check if it's a valid data URI
  const dataUriRegex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
  const match = base64String.match(dataUriRegex);

  if (!match) {
    return {
      valid: false,
      error: 'Invalid image format. Only JPEG, PNG, and WebP images are allowed.'
    };
  }

  const mimeType = `image/${match[1]}`;

  // Validate mime type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid image type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  // Extract base64 data
  const base64Data = base64String.replace(dataUriRegex, '');

  // Validate base64 encoding
  try {
    atob(base64Data);
  } catch (e) {
    return {
      valid: false,
      error: 'Invalid base64 encoding.'
    };
  }

  // Calculate file size
  const padding = (base64Data.match(/=/g) || []).length;
  const fileSize = (base64Data.length * 0.75) - padding;

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    const actualSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Image size (${actualSizeMB}MB) exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB.`
    };
  }

  return { valid: true, error: null };
};

/**
 * Compress a base64 image if it's too large
 * @param {string} base64String - The base64 encoded image string
 * @param {number} maxSizeMB - Maximum size in MB (default: 5)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} - Compressed base64 string
 */
export const compressBase64Image = (base64String, maxSizeMB = 5, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize if dimensions are too large
      const maxDimension = 2048;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG with quality compression
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

      // Check if compression was successful
      const originalSize = (base64String.length * 0.75) / (1024 * 1024);
      const compressedSize = (compressedBase64.length * 0.75) / (1024 * 1024);

      if (compressedSize <= maxSizeMB) {
        resolve(compressedBase64);
      } else if (quality > 0.5) {
        // Try again with lower quality
        compressBase64Image(base64String, maxSizeMB, quality - 0.1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error(`Unable to compress image below ${maxSizeMB}MB. Current size: ${compressedSize.toFixed(2)}MB`));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = base64String;
  });
};

export default {
  validateBase64Image,
  validateBase64ImageSync,
  compressBase64Image,
  MAX_FILE_SIZE_MB,
  MAX_DIMENSION,
  ALLOWED_MIME_TYPES
};

