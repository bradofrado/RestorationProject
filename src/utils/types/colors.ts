import { z } from "zod";

export type HexColor = `#${string}`

export const PrimaryColor: HexColor = `#FFF`;

export const HexColorSchema = z.string().startsWith("#")