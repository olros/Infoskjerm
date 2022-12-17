import { useTheme } from '@mui/joy';

export type WindIconProps = {
  size: string | number;
} & React.ComponentPropsWithoutRef<'svg'>;

const WindIcon = ({ size, ...props }: WindIconProps) => {
  const theme = useTheme();

  return (
    <svg
      aria-hidden='true'
      color={theme.palette.text.primary}
      fill='none'
      focusable='false'
      height={size}
      viewBox='0 0 24 24'
      width={size}
      x='0'
      y='0'
      {...props}>
      <path
        d='M18 12H2m7.268-7A2 2 0 1 1 11 8H2m11.5 12a2.5 2.5 0 1 0 2-4H2m15.99-4a3 3 0 1 0-1.801-5.4'
        height='24'
        stroke='currentColor'
        strokeWidth='1.5'
        width='24'
        x='0'
        y='0'></path>
    </svg>
  );
};

export default WindIcon;
