import moment from 'moment';

export function nameFormatter(word, defaultTxt = null) {
	//converts org_admin => Org Admin
	if (!word || !word.length || typeof word !== 'string') {
		return defaultTxt || 'N/A';
	}
	return (
		word
			.toLowerCase()
			.replace(/([A-Z])/g, ' $1')
			.replace(/_/g, ' ')
			.trim()
			// uppercase the first character
			.replace(/\b[a-z](?=[a-z]{2})/g, function (letter) {
				return letter.toUpperCase();
			})
			.split(',')
			.join(', ')
	);
}

export const dateFormatter = (date, format) => {
	format = format || 'll';
	return moment(date).format(format);
};

export const commaSeparator = number => {
	return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};
