export const validationErr = () => {
  const validatefirstName = (value) => {
    // if the field is empty
    if (!value) {
      return "This field is required";
    }
    // if firstName is less than 4 characters
    if (value.length < 4) {
      return "The first name should be at least 4 characters long";
    }
    // All is good
    return true;
  };

  const validatelastName = (value) => {
    // if the field is empty
    if (!value) {
      return "This field is required";
    }
    // if lastName is less than 4 characters
    if (value.length < 4) {
      return "The last name should be at least 4 characters long";
    }
    // All is good
    return true;
  };

  const validatemobileNumber = (value) => {
    if (!value) {
      return "This field is required";
    }
    if (value.length < 10) {
      return "The Mobile Number should be at least 10 digits";
    }
    return true;
  };

  const validateprofilePhoto = (file) => {
    if (!file) {
      return "Please select a picture";
    }
    if (file.size > 1000000) {
      return "This file must be less than or equal to 1MB";
    }
    return true;
  };

  const validateEmail = (value) => {
    // if the field is empty
    if (!value) {
      return "This field is required";
    }
    // if the field is not a valid email
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return "This field must be a valid email";
    }
    // All is good
    return true;
  };

  const validatePassword = (password) => {
    // if the field is empty
    if (!password) {
      return "This field is required";
    }
    // if the field is not a valid password
    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+!~\-/?\\[\]{}|])(?=.*[^\s]).{8,20}$/;
    if (!regex.test(password)) {
      return "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be between 8-20 characters long";
    }
    // All is good
    return true;
  };

  return {
    validationErr,
    validatefirstName,
    validatelastName,
    validateEmail,
    validatemobileNumber,
    validateprofilePhoto,
    validatePassword,
  };
};
