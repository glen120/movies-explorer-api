const validateUrl = /^(https?:\/\/)(www\.)?[0-9a-z]+([.|-][0-9a-z]+)*\.[0-9a-z]+(\/[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/i;

module.exports = validateUrl;
