import { Box, Card, CardContent, Chip, Typography } from '@mui/material';

export function Activities() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Activités
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            La gestion des activités sera bientôt disponible.
          </Typography>

          <Chip label="Admin uniquement" color="primary" size="small" sx={{ mb: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Fonctionnalités à venir :
          </Typography>
          <ul>
            <li>Liste des activités prédéfinies</li>
            <li>Ajouter une activité</li>
            <li>Modifier une activité</li>
            <li>Supprimer une activité</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
