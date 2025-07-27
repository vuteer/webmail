import { createToast } from "@/utils/toast";

// utils/uploadImage.ts
export const uploadToCloudinary = async (file: File, path: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", path)
    // formData.append("transformation", JSON.stringify([
    //   { width: 800, crop: "limit", quality: "auto" }
    // ]));
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET || ""); // from Cloudinary settings
  
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok && data.secure_url) {
        return data.secure_url;
      } else {
        // add toast here: 
        createToast("Error uploading", "Failed to upload image", "danger"); 
        return null;
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      // add toast here: "Image upload error"
      createToast("Error uploading", "Image upload error", "danger"); 

      return null;
    }
  };
  