export const isValidPhoneNumber = (phoneNumber) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phoneNumber.replace(/^\+91/, ""));
};
