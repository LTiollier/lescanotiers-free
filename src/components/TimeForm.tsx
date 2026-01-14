import { Check } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useActivities } from '../hooks/useActivities';
import { useCycles } from '../hooks/useCycles';
import type { Database } from '../types/database.types';
import { VegetableAvatar } from './VegetableAvatar';

type Time = Database['public']['Tables']['times']['Row'];

interface TimeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    cycleId: number,
    activityId: number,
    date: string,
    minutes: number,
    quantity: number | null,
  ) => void;
  time?: Time | null;
  isLoading?: boolean;
}

// Durées prédéfinies en minutes
const DURATION_OPTIONS = [
  { label: '30min', value: 30 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
  { label: '2h30', value: 150 },
  { label: '3h', value: 180 },
  { label: '3h30', value: 210 },
  { label: '4h', value: 240 },
  { label: '4h30', value: 270 },
  { label: '5h', value: 300 },
  { label: '5h30', value: 330 },
  { label: '6h', value: 360 },
  { label: '6h30', value: 390 },
  { label: '7h', value: 420 },
];

export function TimeForm({ open, onClose, onSubmit, time, isLoading }: TimeFormProps) {
  const [step, setStep] = useState<'cycle' | 'activity' | 'date' | 'duration' | 'quantity'>(
    'cycle',
  );
  const [cycleId, setCycleId] = useState<number | null>(null);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [minutes, setMinutes] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');

  const { data: cycles, isLoading: cyclesLoading } = useCycles();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const activeCycles = cycles?.filter((cycle) => {
    const today = dayjs();
    const start = dayjs(cycle.starts_at);
    const end = dayjs(cycle.ends_at);
    return (
      (today.isAfter(start, 'day') || today.isSame(start, 'day')) &&
      (today.isBefore(end, 'day') || today.isSame(end, 'day'))
    );
  });

  useEffect(() => {
    if (open) {
      if (time) {
        setCycleId(time.cycle_id);
        setActivityId(time.activity_id);
        setDate(dayjs(time.date));
        setMinutes(time.minutes);
        setQuantity(time.quantity || '');
        setStep('cycle');
      } else {
        setCycleId(null);
        setActivityId(null);
        setDate(dayjs());
        setMinutes(null);
        setQuantity('');
        setStep('cycle');
      }
    }
  }, [time, open]);

  const handleCycleSelect = (id: number) => {
    setCycleId(id);
    setStep('activity');
  };

  const handleActivitySelect = (id: number) => {
    setActivityId(id);
    setStep('date');
  };

  const handleDateSelect = () => {
    if (date) {
      setStep('duration');
    }
  };

  const handleDurationSelect = (mins: number) => {
    setMinutes(mins);
    setStep('quantity');
  };

  const handleSubmit = () => {
    if (cycleId && activityId && date && minutes) {
      const dateStr = date.format('YYYY-MM-DD');
      onSubmit(cycleId, activityId, dateStr, minutes, quantity ? Number(quantity) : null);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'cycle':
        return 'Sélectionnez le cycle';
      case 'activity':
        return "Sélectionnez l'activité";
      case 'date':
        return 'Choisissez la date';
      case 'duration':
        return 'Durée de travail';
      case 'quantity':
        return 'Quantité récoltée (optionnel)';
      default:
        return '';
    }
  };

  const selectedCycle = cycles?.find((c) => c.id === cycleId);
  const selectedActivity = activities?.find((a) => a.id === activityId);

  const renderSummary = () => {
    if (step === 'cycle') return null;

    return (
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: 'grey.50',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mb: 1, fontWeight: 'bold', textTransform: 'uppercase' }}
        >
          Résumé de la saisie
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {/* Cycle */}
          {selectedCycle && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VegetableAvatar
                imageUrl={selectedCycle.vegetables?.image_url}
                name={selectedCycle.vegetables?.name || 'N/A'}
                size="small"
                sx={{ width: 20, height: 20 }}
              />
              <Typography variant="body2">
                <strong>Cycle :</strong> {selectedCycle.vegetables?.name} (
                {selectedCycle.parcels?.name})
              </Typography>
            </Box>
          )}

          {/* Activity */}
          {selectedActivity && (
            <Typography variant="body2">
              <strong>Activité :</strong> {selectedActivity.name}
            </Typography>
          )}

          {/* Date */}
          {(step === 'duration' || step === 'quantity') && date && (
            <Typography variant="body2">
              <strong>Date :</strong> {date.format('DD/MM/YYYY')}
            </Typography>
          )}

          {/* Duration */}
          {step === 'quantity' && minutes && (
            <Typography variant="body2">
              <strong>Durée :</strong> {Math.floor(minutes / 60)}h
              {minutes % 60 > 0 ? (minutes % 60).toString().padStart(2, '0') : ''}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>
        <Box>
          <Typography variant="h6">{time ? 'Modifier le temps' : 'Nouveau temps'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {getStepTitle()}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {renderSummary()}

        {/* Step 1: Cycle Selection */}

        {step === 'cycle' && (
          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },

              gap: 2,

              pt: 1,
            }}
          >
            {cyclesLoading ? (
              <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              activeCycles?.map((cycle) => (
                <Card
                  key={cycle.id}
                  elevation={cycleId === cycle.id ? 4 : 1}
                  sx={{
                    border: cycleId === cycle.id ? 2 : 0,

                    borderColor: 'primary.main',
                  }}
                >
                  <CardActionArea
                    onClick={() => handleCycleSelect(cycle.id)}
                    sx={{
                      p: 2,

                      height: '100%',

                      display: 'flex',

                      flexDirection: 'column',

                      alignItems: 'center',

                      gap: 1.5,

                      minHeight: 140,
                    }}
                  >
                    <VegetableAvatar
                      imageUrl={cycle.vegetables?.image_url}
                      name={cycle.vegetables?.name || 'N/A'}
                      size="large"
                      sx={{ width: 64, height: 64 }}
                    />

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {cycle.vegetables?.name || 'N/A'}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {cycle.parcels?.name || 'N/A'}
                      </Typography>
                    </Box>

                    {cycleId === cycle.id && (
                      <Check color="primary" sx={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                  </CardActionArea>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Step 2: Activity Selection */}

        {step === 'activity' && (
          <Box>
            <Box
              sx={{
                display: 'grid',

                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' },

                gap: 2,
              }}
            >
              {activitiesLoading ? (
                <Box
                  sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 4 }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                activities?.map((activity) => (
                  <Card
                    key={activity.id}
                    elevation={activityId === activity.id ? 4 : 1}
                    sx={{
                      border: activityId === activity.id ? 2 : 0,

                      borderColor: 'primary.main',
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleActivitySelect(activity.id)}
                      sx={{
                        p: 3,

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        minHeight: 80,

                        position: 'relative',
                      }}
                    >
                      <Typography variant="body1" fontWeight="medium" textAlign="center">
                        {activity.name}
                      </Typography>

                      {activityId === activity.id && (
                        <Check color="primary" sx={{ position: 'absolute', top: 8, right: 8 }} />
                      )}
                    </CardActionArea>
                  </Card>
                ))
              )}
            </Box>

            <Button onClick={() => setStep('cycle')} sx={{ mt: 2 }} fullWidth>
              Retour
            </Button>
          </Box>
        )}

        {/* Step 3: Date Selection */}

        {step === 'date' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button onClick={() => setStep('activity')} fullWidth>
                Retour
              </Button>

              <Button onClick={handleDateSelect} variant="contained" fullWidth disabled={!date}>
                Suivant
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 4: Duration Selection */}

        {step === 'duration' && (
          <Box>
            <Box
              sx={{
                display: 'grid',

                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },

                gap: 2,
              }}
            >
              {DURATION_OPTIONS.map((option) => (
                <Card
                  key={option.value}
                  elevation={minutes === option.value ? 4 : 1}
                  sx={{
                    border: minutes === option.value ? 2 : 0,

                    borderColor: 'primary.main',
                  }}
                >
                  <CardActionArea
                    onClick={() => handleDurationSelect(option.value)}
                    sx={{
                      p: 3,

                      display: 'flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      minHeight: 80,

                      position: 'relative',
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {option.label}
                    </Typography>

                    {minutes === option.value && (
                      <Check color="primary" sx={{ position: 'absolute', top: 8, right: 8 }} />
                    )}
                  </CardActionArea>
                </Card>
              ))}
            </Box>

            <Button onClick={() => setStep('date')} sx={{ mt: 2 }} fullWidth>
              Retour
            </Button>
          </Box>
        )}

        {/* Step 5: Quantity Selection */}

        {step === 'quantity' && (
          <Box>
            <Box
              sx={{
                gap: 2,

                mb: 3,
              }}
            >
              <TextField
                label="Quantité (Kg, unités, etc..)"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                slotProps={{
                  htmlInput: { min: 0, step: 0.1 },
                }}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    height: 80,

                    fontSize: '1.5rem',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button onClick={() => setStep('duration')} fullWidth>
                Retour
              </Button>

              <Button onClick={handleSubmit} variant="contained" fullWidth disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : 'Valider'}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
