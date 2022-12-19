import { useLocales } from '~/LocaleProvider';
import { differenceInMinutes, parseJSON } from 'date-fns';
import { useCallback } from 'react';
import { useIsClient } from 'usehooks-ts';

export const useFormattedDate = () => {
  const locales = useLocales();
  const isMounted = useIsClient();

  return useCallback(
    (date: string, options?: Intl.DateTimeFormatOptions) => {
      const parsedDate = parseJSON(date);
      const fullFormat = new Intl.DateTimeFormat(locales, { ...options, timeZone: 'europe/oslo' }).format(parsedDate);
      if (!isMounted) return fullFormat;
      const minutesUntil = differenceInMinutes(parsedDate, new Date());
      if (minutesUntil < 1) {
        return 'Nå';
      }
      if (minutesUntil < 15) {
        return `${minutesUntil} min`;
      }
      return fullFormat;
    },
    [isMounted, locales],
  );
};
