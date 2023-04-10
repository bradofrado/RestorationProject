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