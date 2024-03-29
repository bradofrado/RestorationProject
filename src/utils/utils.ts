import dayjs from 'dayjs';
import { type HexColor } from './types/colors';
import { z } from 'zod';
import { type UserRole, userRoleSchema } from './types/auth';

export const DateFormat = {
	fullText: (date: Date) => {
		return dayjs(date).format("MMM, D, YYYY");
	},
	fullTextRange: (date: Date, endDate?: Date | null) => {
		const dateText = DateFormat.fullText(date);
		const endDateText = endDate ? DateFormat.fullText(endDate) : null;
		if (!endDateText || dateText == endDateText) {
			return dateText;
		}

		return `${dateText} to ${endDateText}`;
	}
}

export const groupBy = function<T extends Pick<T, K>, K extends keyof T>(arr: T[], key: K) {
	return arr.reduce<Record<T[K], T[]>>((prev, curr) => {
		let a: T[] = [];
		const val = prev[curr[key]];
		if (val) {
			a = val;
		}
		a?.push(curr);
		prev[curr[key]] = a;

		return prev;
	}, {})
}

export const groupByDistinct = function<T extends Pick<T, K>, K extends keyof T>(arr: T[], key: K) {
	return arr.reduce<Record<T[K], T>>((prev, curr) => {
		if (prev[curr[key]]) {
			throw new DOMException("Each key value in the list must be unique");
		}

		prev[curr[key]] = curr;

		return prev;
	}, {})
}

interface Settings {
	margin?: number,
	color?: HexColor
}
export const setStyleFromSettings = (settings: Settings): React.CSSProperties => {
	const margin = (m: number | undefined) => {
		return m ? `${m/4}rem` : undefined;
	}
	return {
		paddingTop: margin(settings.margin),
		paddingBottom: margin(settings.margin),
		color: settings.color
	}
}

export const jsonParse = <T>(schema: z.ZodType<T>) => z.string()
.transform( ( str, ctx ): z.infer<typeof schema> => {
	try {
		return schema.parse(JSON.parse( str ))
	} catch ( e ) {
		ctx.addIssue( { code: 'custom', message: 'Invalid JSON' } )
		return z.NEVER
	}
} )

export const useChangeProperty = <T,>(func: (item: T) => void) => {
	const ret = <K extends keyof T>(item: T, key: K, value: T[K]): T => {
		const copy = {...item};
		copy[key] = value;
		func(copy);

		return copy;
	}
	ret.function = func;

	return ret;
}
export type ReplaceWithName<T, K extends keyof T, Q> = Omit<T, K> & Q
export type Replace<T, K extends keyof T, Q> = ReplaceWithName<T, K, Record<K, Q>>

export type IfElse<PROPERTY extends string, IF, ELSE> = (Record<PROPERTY, true> & IF) | (Partial<Record<PROPERTY, false>> & ELSE)

export const getClass = (...strings: (string | undefined)[]) => {
    return strings.filter(x => !!x).join(' ');
}

export const isNotRole = <T,>(desiredRole: UserRole, transform?: (obj: T) => UserRole) => (obj: T | UserRole) => {
	const result = userRoleSchema.safeParse(obj);
	const role: UserRole | Error = result.success ? result.data : !!!transform ? Error("must provide transform method") : transform(obj as T);
	if (role instanceof Error) {
		throw role;
	}
	return role != desiredRole && role != 'admin';
}

export const exclude = <T extends Pick<T, K>, K extends keyof T>(user: T, ...keys: K[]): Omit<T, K> => {
	return Object.fromEntries(
	  Object.entries<T>(user).filter(([key]) => !keys.includes(key as K))
	) as Omit<T, K>
  }