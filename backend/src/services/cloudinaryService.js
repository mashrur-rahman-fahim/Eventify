import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (file, folder = "eventify") => {
  try {
    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: "auto",
      transformation: [
        { width: 800, height: 600, crop: "limit" },
        { quality: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImage = async (public_id) => {
  try {
    if (!public_id) return;

    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};

export const updateImage = async (
  file,
  oldPublicId = null,
  folder = "eventify"
) => {
  try {
    // Delete old image if exists
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }

    // Upload new image
    return await uploadImage(file, folder);
  } catch (error) {
    console.error("Cloudinary update error:", error);
    throw new Error("Failed to update image");
  }
};
