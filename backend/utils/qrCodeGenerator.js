import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    const qrDataURL = await QRCode.toDataURL(text);
    return qrDataURL;
  } catch (err) {
    console.error("QR Code generation failed:", err);
    return null;
  }
};
