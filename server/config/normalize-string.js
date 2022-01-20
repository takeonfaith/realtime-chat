const normalizeString = (str) => {
	return str
		.replace(/\s/g, "")
		.replace(/\$/g, "s")
		.replace(/[,'._/]/g, "")
		.replace(/-/g, "")
		.toLowerCase();
};

module.exports = normalizeString
