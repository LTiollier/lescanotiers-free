import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

interface MobileCardField {
  label: string;
  value: ReactNode;
  emphasized?: boolean;
}

interface MobileCardAction {
  icon: ReactNode;
  onClick: () => void;
  color?: 'primary' | 'error' | 'default' | 'success' | 'info' | 'warning';
  disabled?: boolean;
}

interface MobileCardProps {
  fields: MobileCardField[];
  actions?: MobileCardAction[];
  onClick?: () => void;
}

/**
 * MobileCard - Composant générique pour afficher des données sous forme de carte sur mobile
 * Remplace les lignes de tableau par des cartes optimisées pour le touch
 */
export function MobileCard({ fields, actions, onClick }: MobileCardProps) {
  const content = (
    <CardContent>
      <Stack spacing={1.5}>
        {fields.map((field) => (
          <Box key={field.label}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}
            >
              {field.label}
            </Typography>
            {field.emphasized ? (
              <Typography variant="body1" fontWeight="bold">
                {field.value}
              </Typography>
            ) : (
              <Typography variant="body2">{field.value}</Typography>
            )}
          </Box>
        ))}
      </Stack>

      {actions && actions.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            justifyContent: 'flex-end',
          }}
        >
          {actions.map((action) => (
            <IconButton
              key={`action-${action.color || 'default'}`}
              size="medium"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              color={action.color || 'default'}
              disabled={action.disabled}
              sx={{
                // Optimisation touch: zone de touch plus grande
                minWidth: 44,
                minHeight: 44,
              }}
            >
              {action.icon}
            </IconButton>
          ))}
        </Stack>
      )}
    </CardContent>
  );

  if (onClick) {
    return (
      <Card
        sx={{
          mb: 2,
          // Amélioration visuelle pour le touch
          '&:active': {
            transform: 'scale(0.98)',
          },
          transition: 'transform 0.1s ease-in-out',
        }}
      >
        <CardActionArea onClick={onClick}>{content}</CardActionArea>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 2,
      }}
    >
      {content}
    </Card>
  );
}
