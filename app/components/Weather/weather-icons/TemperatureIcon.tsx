import { useTheme } from '@mui/joy';

export type TemperatureIconProps = {
  size: string | number;
} & React.ComponentPropsWithoutRef<'svg'>;

const TemperatureIcon = ({ size, ...props }: TemperatureIconProps) => {
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
      <g height='24' width='24' x='0' y='0'>
        <circle cx='12' cy='18' r='1.25' stroke='currentColor' strokeWidth='1.5'></circle>
        <path d='M12 17V8m0-5a3 3 0 0 0-3 3v9.354a4 4 0 1 0 6 0V6a3 3 0 0 0-3-3z' stroke='currentColor' strokeWidth='1.5'></path>
      </g>
    </svg>
  );
};

export default TemperatureIcon;
