import dayjs from 'dayjs';
import { type HexColor } from './types/colors';
import { z } from 'zod';
import { type UserRole, userRoleSchema } from './types/auth';

export const DateFormat = {
  estimateMonth: (date: Date) => {
    return `~ ${dayjs(date).format('MMM YYYY')}`;
  },
  estimateYear: (date: Date) => {
    return `~ ${dayjs(date).format('YYYY')}`;
  },
  fullText: (date: Date) => {
    return dayjs(date).format('MMM, D, YYYY');
  },
  fullTextRange: (date: Date, endDate?: Date | null) => {
    const dateText = DateFormat.fullText(date);
    const endDateText = endDate ? DateFormat.fullText(endDate) : null;
    if (!endDateText || dateText == endDateText) {
      return dateText;
    }

    return `${dateText} to ${endDateText}`;
  },
};

export const groupBy = function <T extends Pick<T, K>, K extends keyof T>(
  arr: T[],
  key: K
) {
  return arr.reduce<Record<T[K], T[]>>((prev, curr) => {
    let a: T[] = [];
    const val = prev[curr[key]];
    if (val) {
      a = val;
    }
    a?.push(curr);
    prev[curr[key]] = a;

    return prev;
  }, {});
};

export const groupByDistinct = function <
  T extends Pick<T, K>,
  K extends keyof T
>(arr: T[], key: K) {
  return arr.reduce<Record<T[K], T>>((prev, curr) => {
    if (prev[curr[key]]) {
      throw new DOMException('Each key value in the list must be unique');
    }

    prev[curr[key]] = curr;

    return prev;
  }, {});
};

interface Settings {
  margin?: number;
  color?: HexColor;
}
export const setStyleFromSettings = (
  settings: Settings
): React.CSSProperties => {
  const margin = (m: number | undefined) => {
    return m ? `${m / 4}rem` : undefined;
  };
  return {
    paddingTop: margin(settings.margin),
    paddingBottom: margin(settings.margin),
    color: settings.color,
  };
};

export const jsonParse = <T>(schema: z.ZodType<T>) =>
  z.string().transform((str, ctx): z.infer<typeof schema> => {
    let json: unknown;
    try {
      json = JSON.parse(str);
    } catch (error) {
      console.error(error);
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
      return z.NEVER;
    }
    return schema.parse(json);
  });

export const useChangeProperty = <T>(func: (item: T) => void) => {
  const ret = <K extends keyof T>(item: T, key: K, value: T[K]): T => {
    const copy = { ...item };
    copy[key] = value;
    func(copy);

    return copy;
  };
  ret.function = func;

  return ret;
};
export type ReplaceWithName<T, K extends keyof T, Q> = Omit<T, K> & Q;
export type Replace<T, K extends keyof T, Q> = ReplaceWithName<
  T,
  K,
  Record<K, Q>
>;

export type IfElse<PROPERTY extends string, IF, ELSE> =
  | (Record<PROPERTY, true> & IF)
  | (Partial<Record<PROPERTY, false>> & ELSE);

export const getClass = (...strings: (string | undefined)[]) => {
  return strings.filter((x) => !!x).join(' ');
};

export const isNotRole =
  <T>(desiredRole: UserRole, transform?: (obj: T) => UserRole) =>
  (obj: T | UserRole) => {
    const result = userRoleSchema.safeParse(obj);
    const role: UserRole | Error = result.success
      ? result.data
      : !!!transform
      ? Error('must provide transform method')
      : transform(obj as T);
    if (role instanceof Error) {
      throw role;
    }
    return role != desiredRole && role != 'admin';
  };

export const exclude = <T extends Pick<T, K>, K extends keyof T>(
  user: T,
  ...keys: K[]
): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries<T>(user).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
};

declare global {
  interface String {
    replaceWith: <T extends string extends T ? unknown : 'Must be a string'>(
      regex: RegExp,
      callback: (match: RegExpMatchArray, index: number) => T
    ) => T[];
    replaceOccurance: (
      searchValue: string | RegExp,
      replaceValue: string,
      index: number
    ) => string;
  }
}
String.prototype.replaceWith = function <
  T extends string extends T ? unknown : 'Must be a string'
>(regex: RegExp, callback: (match: RegExpMatchArray, index: number) => T): T[] {
  const str = this as string;
  let match;
  let index = 0;
  const contents: T[] = [];
  let matchIndex = 0;
  while ((match = regex.exec(str))) {
    contents.push(str.slice(index, match.index) as T);
    contents.push(callback(match, matchIndex));
    index = match.index + match[0].length;
    matchIndex++;
  }
  if (index < str.length) {
    contents.push(str.slice(index) as T);
  }

  return contents;
};

String.prototype.replaceOccurance = function (
  searchValue: string | RegExp,
  replaceValue: string,
  index: number
) {
  const str = this as string;
  const allReplaceableIndexes = Array.from(
    str.matchAll(
      searchValue instanceof RegExp ? searchValue : new RegExp(searchValue, 'g')
    )
  );
  const replaceableIndex = allReplaceableIndexes[index];
  if (!replaceableIndex) {
    return str;
  }
  return (
    str.slice(0, replaceableIndex.index) +
    replaceValue +
    str.slice(replaceableIndex.index + replaceableIndex[0].length)
  );
};
