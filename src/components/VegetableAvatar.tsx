import { LocalFlorist } from '@mui/icons-material';
import { Avatar, type AvatarProps } from '@mui/material';

interface VegetableAvatarProps extends Omit<AvatarProps, 'src' | 'alt'> {
  imageUrl: string | null | undefined;
  name: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { width: 32, height: 32 },
  medium: { width: 40, height: 40 },
  large: { width: 56, height: 56 },
};

/**
 * Component to display a vegetable avatar with image or fallback icon
 */
export function VegetableAvatar({
  imageUrl,
  name,
  size = 'medium',
  sx,
  ...props
}: VegetableAvatarProps) {
  const dimensions = sizeMap[size];

  return (
    <Avatar
      src={imageUrl || undefined}
      alt={name}
      sx={{
        ...dimensions,
        bgcolor: imageUrl ? 'transparent' : 'primary.main',
        ...sx,
      }}
      {...props}
    >
      {!imageUrl && <LocalFlorist />}
    </Avatar>
  );
}
