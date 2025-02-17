import { EMAIL_PASSWORD, EMAIL_USERNAME } from "./env.config";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

export default transporter;
