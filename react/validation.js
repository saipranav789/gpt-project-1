const validation = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkEmail(email) {
    email = this.checkString(email, "email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw "Error: Invalid email format";
    return email;
  },

  checkAdpEmail(email) {
    email = this.checkEmail(email);
    const adpEmailRegex = /^[^\s@]+@adp\.com$/i;
    if (!adpEmailRegex.test(email))
      throw "Error: You need to register with ADP associate email";
    return email;
  },

  checkPassword(password, confirmPassword) {
    password = this.checkString(password, "password");
    confirmPassword = this.checkString(confirmPassword, "confirmPassword");

    if (password.length < 6) {
      throw "Error: Password must be at least 6 characters long";
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(password)) {
      throw "Error: Password must contain at least one special character";
    }

    if (password !== confirmPassword) {
      throw "Error: Password and confirm password do not match";
    }

    return password;
  },
  checkLoginPassword(password) {
    if (!password || typeof password !== "string")
      throw "Error: You must provide a valid password!";
    return password;
  },
};

export default validation;
