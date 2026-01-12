import { AddPhotoAlternate, AutoAwesome, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useVegetableCategories } from '../hooks/useVegetableCategories';
import type { Database } from '../types/database.types';
import { AIImageGenerationDialog } from './AIImageGenerationDialog';
import { VegetableAvatar } from './VegetableAvatar';

type Vegetable = Database['public']['Tables']['vegetables']['Row'];

interface VegetableFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    categoryId: number | null,
    imageFile: File | null,
    shouldDeleteImage: boolean,
  ) => void;
  vegetable?: Vegetable | null;
  isLoading?: boolean;
}

export function VegetableForm({
  open,
  onClose,
  onSubmit,
  vegetable,
  isLoading,
}: VegetableFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { data: categories, isLoading: categoriesLoading } = useVegetableCategories();

  useEffect(() => {
    if (vegetable) {
      setName(vegetable.name);
      setCategoryId(vegetable.category_id);
      setImagePreview(vegetable.image_url);
    } else {
      setName('');
      setCategoryId(null);
      setImagePreview(null);
    }
    setImageFile(null);
    setShouldDeleteImage(false);
    setImageError(null);
  }, [vegetable, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Type de fichier non supporté. Utilisez jpeg, jpg, png ou webp.');
        return;
      }

      // Validate file size (2 MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Le fichier est trop volumineux. La taille maximum est de 2 MB.');
        return;
      }

      setImageFile(file);
      setShouldDeleteImage(false);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setShouldDeleteImage(true);
    setImageError(null);
  };

  const handleOpenAIDialog = () => {
    setAiDialogOpen(true);
  };

  const handleCloseAIDialog = () => {
    setAiDialogOpen(false);
  };

  const handleAIImageGenerated = (file: File) => {
    // Handle the AI-generated image the same way as a manually uploaded file
    setImageFile(file);
    setShouldDeleteImage(false);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !imageError) {
      onSubmit(name.trim(), categoryId, imageFile, shouldDeleteImage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{vegetable ? 'Modifier le légume' : 'Nouveau légume'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du légume"
            type="text"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <FormControl fullWidth margin="dense" disabled={isLoading || categoriesLoading}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              label="Catégorie"
            >
              <MenuItem value="">
                <em>Aucune catégorie</em>
              </MenuItem>
              {categoriesLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Image Upload Section */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Image du légume (optionnel)
            </Typography>

            {imagePreview && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <VegetableAvatar imageUrl={imagePreview} name={name || 'Aperçu'} size="large" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    {imageFile ? imageFile.name : 'Image actuelle'}
                  </Typography>
                  {imageFile && (
                    <Typography variant="caption" color="text.secondary">
                      {(imageFile.size / 1024).toFixed(2)} KB
                    </Typography>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={handleDeleteImage}
                  disabled={isLoading}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternate />}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                {imagePreview ? "Changer l'image" : 'Ajouter une image'}
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<AutoAwesome />}
                onClick={handleOpenAIDialog}
                disabled={isLoading || !name.trim()}
                sx={{ flex: 1 }}
              >
                Générer avec IA
              </Button>
            </Box>

            {imageError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {imageError}
              </Alert>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Formats acceptés: JPEG, PNG, WebP. Taille max: 2 MB.
              {name.trim() && (
                <>
                  <br />💡 Utilisez le bouton "Générer avec IA" pour créer une image
                  automatiquement.
                </>
              )}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !name.trim() || !!imageError}
          >
            {isLoading ? 'Enregistrement...' : vegetable ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>

      {/* AI Image Generation Dialog */}
      <AIImageGenerationDialog
        open={aiDialogOpen}
        onClose={handleCloseAIDialog}
        vegetableName={name}
        onImageGenerated={handleAIImageGenerated}
      />
    </Dialog>
  );
}
