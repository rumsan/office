import generator from 'generate-password';

function generatePassword() {
	return generator.generate({
		length: 10,
		numbers: true
	});
}
export default generatePassword;
