const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

class StorageService {
  constructor() {
    this.uploadDir = process.env.UPLOAD_PATH || "./uploads";
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880; // 5MB
    this.allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    this.allowedDocTypes = ["application/pdf"];
  }

  // Initialize upload directory
  async initializeUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Generate unique filename
  generateFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
  }

  // Save file to disk
  async saveFile(file) {
    await this.initializeUploadDir();

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.maxFileSize} bytes`
      );
    }

    // Validate file type
    if (!this.isAllowedFileType(file.mimetype)) {
      throw new Error("File type not allowed");
    }

    const filename = this.generateFilename(file.originalname);
    const filepath = path.join(this.uploadDir, filename);

    await fs.writeFile(filepath, file.buffer);

    return {
      filename,
      filepath,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${filename}`,
    };
  }

  // Delete file
  async deleteFile(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  // Check if file exists
  async fileExists(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }

  // Get file info
  async getFileInfo(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      const stats = await fs.stat(filepath);
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error) {
      throw new Error("File not found");
    }
  }

  // Check if file type is allowed
  isAllowedFileType(mimetype) {
    return [...this.allowedImageTypes, ...this.allowedDocTypes].includes(
      mimetype
    );
  }

  // Save base64 image
  async saveBase64Image(base64String, originalName = "image.png") {
    await this.initializeUploadDir();

    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Validate size
    if (buffer.length > this.maxFileSize) {
      throw new Error("Image size exceeds maximum allowed size");
    }

    const filename = this.generateFilename(originalName);
    const filepath = path.join(this.uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    return {
      filename,
      filepath,
      size: buffer.length,
      url: `/uploads/${filename}`,
    };
  }

  // Get file as base64
  async getFileAsBase64(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      const buffer = await fs.readFile(filepath);
      return buffer.toString("base64");
    } catch (error) {
      throw new Error("File not found");
    }
  }

  // Clean up old files
  async cleanupOldFiles(daysOld = 30) {
    try {
      const files = await fs.readdir(this.uploadDir);
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filepath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filepath);

        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filepath);
          console.log(`Deleted old file: ${file}`);
        }
      }

      return true;
    } catch (error) {
      console.error("Error cleaning up files:", error);
      return false;
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const files = await fs.readdir(this.uploadDir);
      let totalSize = 0;
      let fileCount = 0;

      for (const file of files) {
        const filepath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filepath);
        totalSize += stats.size;
        fileCount++;
      }

      return {
        fileCount,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        uploadDir: this.uploadDir,
      };
    } catch (error) {
      throw new Error("Error getting storage stats");
    }
  }

  // Save thumbnail
  async saveThumbnail(originalFilename, thumbnailBuffer) {
    const thumbFilename = `thumb_${originalFilename}`;
    const filepath = path.join(this.uploadDir, thumbFilename);

    await fs.writeFile(filepath, thumbnailBuffer);

    return {
      filename: thumbFilename,
      url: `/uploads/${thumbFilename}`,
    };
  }

  // Get file URL
  getFileUrl(filename) {
    return `/uploads/${filename}`;
  }

  // Validate image dimensions (placeholder)
  async validateImageDimensions(filepath, maxWidth = 4096, maxHeight = 4096) {
    // In production, use a library like sharp to get image dimensions
    return true;
  }

  // Optimize image (placeholder)
  async optimizeImage(filepath) {
    // In production, use sharp or similar library to optimize images
    return filepath;
  }
}

module.exports = new StorageService();
