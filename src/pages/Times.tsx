import { Box, Card, CardContent, Typography } from '@mui/material';

export function Times() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Suivi des Temps Passés
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Le suivi des temps passés sera bientôt disponible.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Fonctionnalités à venir :
          </Typography>
          <ul>
            <li>Saisir un temps passé</li>
            <li>Associer à un cycle et une activité</li>
            <li>Ajouter une quantité récoltée</li>
            <li>Voir l'historique de ses temps</li>
            <li>Statistiques et rapports</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}
