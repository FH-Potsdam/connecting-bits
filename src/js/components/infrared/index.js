
export default class Intrared {
	detectPresence() {
		return new Promise((resolve) => {
			setTimeout(resolve, 5000);
		});
	}
}