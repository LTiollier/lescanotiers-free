import { useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'vegetables-images';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates if the file is an acceptable image
 */
function validateImageFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Type de fichier non supporté. Utilisez jpeg, jpg, png ou webp.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Le fichier est trop volumineux. La taille maximum est de 2 MB.';
  }

  return null;
}

/**
 * Generates a unique filename for the image
 */
function generateFileName(vegetableId: number, originalFileName: string): string {
  const timestamp = Date.now();
  const extension = originalFileName.split('.').pop();
  return `${vegetableId}/vegetable-${vegetableId}-${timestamp}.${extension}`;
}

/**
 * Hook to upload a vegetable image to Supabase Storage
 */
export function useUploadVegetableImage() {
  return useMutation({
    mutationFn: async ({ vegetableId, file }: { vegetableId: number; file: File }) => {
      // Validate the file
      const validationError = validateImageFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      // Generate unique filename
      const fileName = generateFileName(vegetableId, file.name);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) {
        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

      if (!publicUrl) {
        throw new Error("Impossible de récupérer l'URL publique de l'image");
      }

      return publicUrl;
    },
  });
}

/**
 * Hook to delete a vegetable image from Supabase Storage
 */
export function useDeleteVegetableImage() {
  return useMutation({
    mutationFn: async (imageUrl: string) => {
      // Extract the path from the URL
      const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length < 2) {
        throw new Error("URL d'image invalide");
      }

      const filePath = urlParts[1];
      if (!filePath) {
        throw new Error("Impossible d'extraire le chemin du fichier");
      }

      // Delete from Supabase Storage
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
    },
  });
}

/**
 * Hook to replace a vegetable image (delete old, upload new)
 */
export function useReplaceVegetableImage() {
  const uploadImage = useUploadVegetableImage();
  const deleteImage = useDeleteVegetableImage();

  return useMutation({
    mutationFn: async ({
      vegetableId,
      file,
      oldImageUrl,
    }: {
      vegetableId: number;
      file: File;
      oldImageUrl: string | null;
    }) => {
      // Delete old image if it exists
      if (oldImageUrl) {
        try {
          await deleteImage.mutateAsync(oldImageUrl);
        } catch (error) {
          console.warn('Failed to delete old image:', error);
          // Continue with upload even if delete fails
        }
      }

      // Upload new image
      return await uploadImage.mutateAsync({ vegetableId, file });
    },
  });
}
