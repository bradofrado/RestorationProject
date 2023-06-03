import dayjs from 'dayjs';

export const DateFormat = {
	fullText: (date: Date) => {
		return dayjs(date).format("MMM, D, YYYY");
	}
}

export const groupBy = function<T extends Pick<T, K>, K extends keyof T>(arr: T[], key: K) {
	return arr.reduce<Record<T[K], T[]>>((prev, curr) => {
		let a: T[] | undefined = [];
		if (prev[curr[key]]) {
			a = prev[curr[key]];
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

export const useChangeProperty = <T,>(func: (item: T) => void) => {
	return <K extends keyof T>(item: T, key: K, value: T[K]): T => {
		const copy = {...item};
		copy[key] = value;
		func(copy);

		return copy;
	}
}

export type Replace<T, K extends string | number | symbol, Q> = Omit<T, K> & Record<K, Q>
