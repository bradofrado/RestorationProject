import { useMemo } from 'react';
import { SettingsComponentSettings } from './settings-component';
import { jsonParse } from '~/utils/utils';
import { z } from 'zod';

export const useParseSettings = <T extends SettingsComponentSettings>(
  settings: string | undefined | null,
  schema: z.ZodType<T>,
  { margin = 0, color = '#000', ...rest }: Partial<T>
): T => {
  const settingsParsed: T = useMemo(
    () =>
      settings
        ? jsonParse(schema).parse(settings)
        : ({ margin, color, ...rest } as T),
    [settings, schema, margin, color, rest]
  );

  return settingsParsed;
};
