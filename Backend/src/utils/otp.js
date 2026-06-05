const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
// console.log("Generated OTP:", generateOTP());
export default generateOTP;
