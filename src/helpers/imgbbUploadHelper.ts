import axios from "axios";
import FormData from "form-data";

export const uploadToImgbb = async (fileBuffer: Buffer) => {
  const formData = new FormData();
  formData.append("image", fileBuffer, {
    filename: "image.jpg",
  });

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    formData,
    {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  return res.data.data.url;
};
