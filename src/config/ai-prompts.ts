/**
 * AI Image Generation Configuration
 *
 * This file contains pre-prompts and configuration for generating
 * vegetable images using Puter.js AI API
 */

/**
 * Base prompt template for vegetable image generation
 * This template ensures consistent, high-quality images suitable for the application
 */
export const VEGETABLE_IMAGE_PROMPT_TEMPLATE = `High-quality realistic photograph of a fresh {vegetable_name}, centered in frame, close-up view, well-lit natural lighting, white or neutral background, professional food photography style, sharp focus, vibrant natural colors, no text, no watermark`;

/**
 * Negative prompt to exclude unwanted elements
 */
export const VEGETABLE_IMAGE_NEGATIVE_PROMPT = `blurry, low quality, distorted, ugly, bad anatomy, watermark, text, signature, multiple vegetables, cartoon, drawing, illustration, painting`;

/**
 * Default AI model configuration for image generation
 */
export const AI_IMAGE_CONFIG = {
  /**
   * Model to use for image generation
   * Options: 'gpt-image-1', 'gpt-image-1.5', 'stabilityai/stable-diffusion-3-medium'
   */
  model: 'gpt-image-1',

  /**
   * Image dimensions (only supported by some models)
   */
  width: 1024,
  height: 1024,

  /**
   * Quality settings (for supported models)
   */
  steps: 30,

  /**
   * Test mode - set to true to avoid using API credits during development
   */
  testMode: false,
} as const;

/**
 * Generates a complete prompt for a vegetable image
 * @param vegetableName - Name of the vegetable (in French or English)
 * @returns Complete prompt string
 */
export function generateVegetablePrompt(vegetableName: string): string {
  const cleanName = vegetableName.trim().toLowerCase();
  return VEGETABLE_IMAGE_PROMPT_TEMPLATE.replace('{vegetable_name}', cleanName);
}

/**
 * Translates common French vegetable names to English for better AI understanding
 * The AI models perform better with English prompts
 */
const VEGETABLE_TRANSLATIONS: Record<string, string> = {
  tomate: 'tomato',
  carotte: 'carrot',
  'pomme de terre': 'potato',
  salade: 'lettuce',
  laitue: 'lettuce',
  courgette: 'zucchini',
  aubergine: 'eggplant',
  poivron: 'bell pepper',
  concombre: 'cucumber',
  radis: 'radish',
  navet: 'turnip',
  betterave: 'beet',
  épinard: 'spinach',
  épinards: 'spinach',
  chou: 'cabbage',
  'chou-fleur': 'cauliflower',
  brocoli: 'broccoli',
  haricot: 'bean',
  'haricots verts': 'green beans',
  pois: 'pea',
  'petit pois': 'pea',
  maïs: 'corn',
  oignon: 'onion',
  ail: 'garlic',
  poireau: 'leek',
  céleri: 'celery',
  persil: 'parsley',
  basilic: 'basil',
  courge: 'squash',
  potiron: 'pumpkin',
  citrouille: 'pumpkin',
  artichaut: 'artichoke',
  asperge: 'asparagus',
  fenouil: 'fennel',
  endive: 'endive',
  roquette: 'arugula',
  mâche: "lamb's lettuce",
};

/**
 * Translates a French vegetable name to English if available
 * Falls back to the original name if no translation exists
 * @param vegetableName - French vegetable name
 * @returns English translation or original name
 */
export function translateVegetableName(vegetableName: string): string {
  const cleanName = vegetableName.trim().toLowerCase();
  return VEGETABLE_TRANSLATIONS[cleanName] || cleanName;
}

/**
 * Creates the full AI image generation options
 * @param vegetableName - Name of the vegetable
 * @returns Complete options object for puter.ai.txt2img()
 */
export function createImageGenerationOptions(vegetableName: string) {
  const translatedName = translateVegetableName(vegetableName);
  const prompt = generateVegetablePrompt(translatedName);

  return {
    prompt,
    model: AI_IMAGE_CONFIG.model,
    negative_prompt: VEGETABLE_IMAGE_NEGATIVE_PROMPT,
    width: AI_IMAGE_CONFIG.width,
    height: AI_IMAGE_CONFIG.height,
    steps: AI_IMAGE_CONFIG.steps,
  };
}
