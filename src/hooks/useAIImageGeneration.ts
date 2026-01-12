import puter from '@heyputer/puter.js';
import { useState } from 'react';
import { createImageGenerationOptions } from '../config/ai-prompts';

/**
 * State of the AI image generation process
 */
export type AIImageGenerationState = 'idle' | 'generating' | 'success' | 'error';

/**
 * Result of the AI image generation
 */
export interface AIImageGenerationResult {
  imageElement: HTMLImageElement | null;
  imageUrl: string | null;
  error: string | null;
}

/**
 * Hook for generating vegetable images using Puter.js AI
 *
 * @example
 * const { generateImage, state, result, reset } = useAIImageGeneration();
 *
 * const handleGenerate = async () => {
 *   await generateImage('Tomate');
 * };
 */
export function useAIImageGeneration() {
  const [state, setState] = useState<AIImageGenerationState>('idle');
  const [result, setResult] = useState<AIImageGenerationResult>({
    imageElement: null,
    imageUrl: null,
    error: null,
  });

  /**
   * Generates a vegetable image using AI
   * @param vegetableName - Name of the vegetable (in French or English)
   * @returns Promise that resolves when generation is complete
   */
  const generateImage = async (vegetableName: string): Promise<void> => {
    if (!vegetableName.trim()) {
      setResult({
        imageElement: null,
        imageUrl: null,
        error: 'Veuillez saisir un nom de légume',
      });
      setState('error');
      return;
    }

    setState('generating');
    setResult({
      imageElement: null,
      imageUrl: null,
      error: null,
    });

    try {
      // Create image generation options with optimized prompt
      const options = createImageGenerationOptions(vegetableName);

      console.log('Generating image with Puter.js AI:', options);

      // Call Puter.js AI API to generate the image
      // The API returns an HTMLImageElement directly
      const imageElement: HTMLImageElement = await puter.ai.txt2img(options.prompt, {
        model: options.model,
        negative_prompt: options.negative_prompt,
        // Note: width, height, steps may not be supported by all models
        // gpt-image-1 doesn't support these, but stable-diffusion does
      });

      // Extract the image URL from the element
      const imageUrl = imageElement.src;

      setResult({
        imageElement,
        imageUrl,
        error: null,
      });
      setState('success');

      console.log('Image generated successfully:', imageUrl);
    } catch (error) {
      console.error('Error generating image with AI:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de la génération de l'image";

      setResult({
        imageElement: null,
        imageUrl: null,
        error: errorMessage,
      });
      setState('error');
    }
  };

  /**
   * Converts the generated HTMLImageElement to a File object
   * This is useful for uploading the image to Supabase Storage
   * @param fileName - Name for the file (e.g., 'vegetable-123-ai.png')
   * @returns Promise that resolves to a File object or null
   */
  const convertToFile = async (
    fileName: string = 'ai-generated-image.png',
  ): Promise<File | null> => {
    if (!result.imageElement || !result.imageUrl) {
      return null;
    }

    try {
      // Create a canvas to convert the image to a blob
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not create canvas context');
      }

      // Set canvas size to match image
      canvas.width = result.imageElement.naturalWidth || result.imageElement.width;
      canvas.height = result.imageElement.naturalHeight || result.imageElement.height;

      // Draw the image on the canvas
      ctx.drawImage(result.imageElement, 0, 0);

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        throw new Error('Failed to convert image to blob');
      }

      // Create File object from blob
      const file = new File([blob], fileName, { type: 'image/png' });

      return file;
    } catch (error) {
      console.error('Error converting image to file:', error);
      return null;
    }
  };

  /**
   * Resets the hook state to initial values
   */
  const reset = () => {
    setState('idle');
    setResult({
      imageElement: null,
      imageUrl: null,
      error: null,
    });
  };

  return {
    /**
     * Current state of the generation process
     */
    state,

    /**
     * Result of the generation (image, URL, or error)
     */
    result,

    /**
     * Function to trigger image generation
     */
    generateImage,

    /**
     * Function to convert the generated image to a File object
     */
    convertToFile,

    /**
     * Function to reset the hook state
     */
    reset,

    /**
     * Convenience flags for checking state
     */
    isGenerating: state === 'generating',
    isSuccess: state === 'success',
    isError: state === 'error',
    isIdle: state === 'idle',
  };
}
