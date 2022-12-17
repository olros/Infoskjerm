import { useTheme } from '@mui/joy';

export type RainIconProps = {
  size: string | number;
} & React.ComponentPropsWithoutRef<'svg'>;

const RainIcon = ({ size, ...props }: RainIconProps) => {
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
        d='M2.04 12l-.747-.06.748.06zm19.92 0l.747-.06-.748.06zm-6.546 10.086l-.53-.53.53.53zm-2.828 0l-.53.53.53-.53zM2.788 12.062C3.221 6.78 7.235 2.75 12 2.75v-1.5c-5.668 0-10.221 4.757-10.707 10.69l1.495.122zM12 2.75c4.765 0 8.78 4.03 9.212 9.312l1.495-.123C22.22 6.007 17.668 1.25 12 1.25v1.5zm9 9.5H3v1.5h18v-1.5zm-19.707-.31c-.084 1.027.758 1.81 1.707 1.81v-1.5a.231.231 0 0 1-.166-.067.15.15 0 0 1-.046-.121l-1.495-.123zm19.919.122a.15.15 0 0 1-.046.121.231.231 0 0 1-.166.067v1.5c.949 0 1.79-.783 1.707-1.81l-1.495.122zM11.25 13v7.672h1.5V13h-1.5zm4.694 9.616l.586-.586-1.06-1.06-.586.585 1.06 1.061zm-3.889 0a2.75 2.75 0 0 0 3.89 0l-1.061-1.06a1.25 1.25 0 0 1-1.768 0l-1.06 1.06zm-.805-1.944c0 .729.29 1.428.805 1.944l1.061-1.06a1.25 1.25 0 0 1-.366-.884h-1.5z'
        fill='currentColor'
        height='24'
        width='24'
        x='0'
        y='0'></path>
    </svg>
  );
};

export default RainIcon;
