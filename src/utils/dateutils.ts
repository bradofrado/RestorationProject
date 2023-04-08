import dayjs from 'dayjs';

const Format = {
	fullText: (date: Date) => {
		return dayjs(date).format("MMM, D, YYYY");
	}
}

export default Format;