import axios from "axios";

export const sendOtpService = async (phone) => {
  try {
    const response = await axios.post(
      "YOUR_SEND_OTP_API",
      {
        phone,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NUTRISYNC_AUTH_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
};