import { AutoAwesome, Refresh } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { generateVegetablePrompt, translateVegetableName } from '../config/ai-prompts';
import { useAIImageGeneration } from '../hooks/useAIImageGeneration';
import { VegetableAvatar } from './VegetableAvatar';

interface AIImageGenerationDialogProps {
  open: boolean;
  onClose: () => void;
  vegetableName: string;
  onImageGenerated: (imageFile: File) => void;
}

/**
 * Dialog component for AI-powered vegetable image generation
 *
 * This component handles the full flow of:
 * 1. Displaying the prompt that will be used
 * 2. Generating the image with Puter.js AI
 * 3. Showing a preview of the generated image
 * 4. Converting and returning the image as a File for upload
 */
export function AIImageGenerationDialog({
  open,
  onClose,
  vegetableName,
  onImageGenerated,
}: AIImageGenerationDialogProps) {
  const { result, generateImage, convertToFile, reset, isGenerating, isSuccess, isError } =
    useAIImageGeneration();

  // Generate image when dialog opens
  useEffect(() => {
    if (open && vegetableName) {
      reset();
      generateImage(vegetableName);
    }
  }, [open, vegetableName, reset, generateImage]);

  const handleRegenerate = () => {
    reset();
    generateImage(vegetableName);
  };

  const handleUseImage = async () => {
    if (!result.imageElement) {
      return;
    }

    // Convert the image to a File object
    const timestamp = Date.now();
    const fileName = `vegetable-ai-${timestamp}.png`;
    const file = await convertToFile(fileName);

    if (file) {
      onImageGenerated(file);
      onClose();
    } else {
      // Show error if conversion failed
      alert("Impossible de convertir l'image. Veuillez réessayer.");
    }
  };

  const translatedName = translateVegetableName(vegetableName);
  const prompt = generateVegetablePrompt(translatedName);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="primary" />
          Génération d'image par IA
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Vegetable Name */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Légume
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {vegetableName}
              {translatedName !== vegetableName.toLowerCase() && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({translatedName})
                </Typography>
              )}
            </Typography>
          </Box>

          {/* Prompt Preview */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Prompt utilisé
            </Typography>
            <Typography
              variant="body2"
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              {prompt}
            </Typography>
          </Box>

          {/* Generation States */}
          {isGenerating && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                py: 4,
              }}
            >
              <CircularProgress size={48} />
              <Typography variant="body2" color="text.secondary">
                Génération de l'image en cours...
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cela peut prendre quelques secondes
              </Typography>
            </Box>
          )}

          {isError && (
            <Alert severity="error">
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Erreur lors de la génération
              </Typography>
              <Typography variant="body2">{result.error}</Typography>
            </Alert>
          )}

          {isSuccess && result.imageUrl && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Image générée
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  p: 3,
                  border: '2px solid',
                  borderColor: 'success.main',
                  borderRadius: 2,
                  bgcolor: 'success.50',
                }}
              >
                <VegetableAvatar
                  imageUrl={result.imageUrl}
                  name={vegetableName}
                  size="large"
                  sx={{
                    width: 200,
                    height: 200,
                    boxShadow: 3,
                  }}
                />
                <Alert severity="success" sx={{ width: '100%' }}>
                  Image générée avec succès !
                </Alert>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isGenerating}>
          Annuler
        </Button>

        {isError && (
          <Button
            onClick={handleRegenerate}
            startIcon={<Refresh />}
            variant="outlined"
            color="primary"
          >
            Réessayer
          </Button>
        )}

        {isSuccess && (
          <>
            <Button
              onClick={handleRegenerate}
              startIcon={<Refresh />}
              variant="outlined"
              disabled={isGenerating}
            >
              Régénérer
            </Button>
            <Button onClick={handleUseImage} variant="contained" disabled={isGenerating}>
              Utiliser cette image
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
