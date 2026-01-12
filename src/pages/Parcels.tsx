import { Box, Card, CardContent, Typography } from '@mui/material';

export function Parcels() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestion des Parcelles
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            La gestion des parcelles sera bientôt disponible.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Fonctionnalités à venir :
          </Typography>
          <ul>
            <li>Liste des parcelles</li>
            <li>Ajouter une parcelle</li>
            <li>Modifier une parcelle</li>
            <li>Supprimer une parcelle</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
