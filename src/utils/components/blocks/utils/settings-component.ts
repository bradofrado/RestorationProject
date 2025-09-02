import { HexColorSchema } from '~/utils/types/colors';
import { z } from 'zod';

export const SettingsComponentSettingsSchema = z.object({
  margin: z.number(),
  color: HexColorSchema,
});

export type SettingsComponentSettings = z.infer<
  typeof SettingsComponentSettingsSchema
>;
