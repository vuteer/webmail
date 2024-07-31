// validation functions

export const validatePhone = (phone: string )=> {
	let safaricom = /^(254)?((?:(?:7(?:(?:[01249][0-9])|(?:5[789])|(?:6[89])))|(?:1(?:[1][0-5])))[0-9]{6})$/;
	let airtel = /^(254)?((?:(?:7(?:(?:3[0-9])|(?:5[0-6])|(8[5-9])))|(?:1(?:[0][0-2])))[0-9]{6})$/; 
	let telkom = /^(254)?(77[0-6][0-9]{6})$/;
	let equitel = /^(254)?(76[34][0-9]{6})$/;

	let parsedPhone = String(phone)
	let validate = parsedPhone.match(safaricom) || parsedPhone.match(airtel) || parsedPhone.match(telkom) || parsedPhone.match(equitel); 

	return Boolean(validate);
}

export const validateEmail = (email: string) => {
	return String(email)
	  .toLowerCase()
	  .match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	  );
  };


  // check if string is a valid url
export function isValidURL(url: string) {
	const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
	return urlPattern.test(url);
  }