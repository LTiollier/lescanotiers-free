import { Box, Card, CardContent, Typography } from '@mui/material';

export function Vegetables() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Légumes
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            La gestion des légumes sera bientôt disponible.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Fonctionnalités à venir :
          </Typography>
          <ul>
            <li>Liste des légumes</li>
            <li>Catégories de légumes</li>
            <li>Ajouter un légume</li>
            <li>Modifier un légume</li>
            <li>Supprimer un légume</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
