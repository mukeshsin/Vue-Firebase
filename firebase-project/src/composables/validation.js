export const validationErr = () => {
  const validateFirstName = (value) => {
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

  const validateLastName = (value) => {
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

  const validateMobileNumber = (value) => {
    if (!value) {
      return "This field is required";
    }
    if (value.length < 10) {
      return "The Mobile Number should be at least 10 digits";
    }
    // If the mobile number is not valid
    const regex = /^[0-9]{10}$/; // Only allow 10 digits
    if (!regex.test(value)) {
      return "This field must be a valid mobile number";
    }
    return true;
  };

  const validateProfilePhoto = (file) => {
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


  const validatePasswordLogin = (value) => {
    // if the field is empty
    if (!value) {
      return "This field is required";
    }
    // if the field is required a valid password
    if(value.length < 3){
      return "Require valid password"
    }
    // All is good
    return true;
  };

  // validate for post page

  const validateTitle =(value)=>{
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

  }

  const validatePhoto = (file) => {
    if (!file) {
      return "This field is required";
    }
    if (file.size > 1000000) {
      return "This file must be less than or equal to 1MB";
    }
    return true;
  };



  const validateDescription = (value) => {
    console.log("value", value);
    if (!value) {
      return "This field is required";
    }
    if (value.length < 20) {
      return "The description should be at least 20 characters long";
    }
    return true;
  };
  


  return {
    validationErr,
    validateFirstName,
    validateLastName,
    validateEmail,
    validateMobileNumber,
    validateProfilePhoto,
    validatePassword,
    validatePasswordLogin,
    validateTitle,
    validatePhoto,
    validateDescription,
  };
};
