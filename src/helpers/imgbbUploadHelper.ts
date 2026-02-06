import axios from "axios";
import FormData from "form-data";

export const uploadToImgbb = async (fileBuffer: Buffer) => {
  const formData = new FormData();
  formData.append("image", fileBuffer.toString("base64"));

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
  );

  return res.data.data.url;
};
