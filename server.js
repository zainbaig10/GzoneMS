import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const port = 4000;

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const companyToMail = {
  "EXION": "gzoneonesolution@gmail.com",
  TEST: "zain.baig98@gmail.com",
  GZONE: "gzone@uur.co.in",
};

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "sales@ex-ion.com",
    pass: "Exion@123",
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "gzoneonesolution@gmail.com",
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

app.post("/sendEmail", async (req, res) => {
  try {
    const {
      businessNames,
      businessActivities,
      passportScan,
      personalPhoto,
      uaeResidencyCopy,
      emiratesIdCopy,
      homeAddressUAE,
      homeAddressOutsideUAE,
      motherName,
      fatherName,
      email,
      phoneNumber,
      maritalStatus,
      religion,
      faith,
    } = req.body;

    // Log the incoming data to check for issues
    console.log("Received Data:", req.body);

    // Check if all required fields are present
    if (
      !businessNames ||
      !businessActivities ||
      !passportScan ||
      !personalPhoto ||
      !homeAddressUAE ||
      !homeAddressOutsideUAE ||
      !motherName ||
      !fatherName ||
      !email ||
      !phoneNumber ||
      !maritalStatus ||
      !religion ||
      !faith
    ) {
      return res.status(400).json({
        msg: "Missing required fields. Please provide all necessary details.",
      });
    }

    // Send the email
    await sendEmail(
      companyToMail["EXION"],
      "New Business Registration Request",
      `\n
        Business Names: ${businessNames} \n
        Business Activities: ${businessActivities} \n
        Passport Scan: ${passportScan} \n
        Personal Photo: ${personalPhoto} \n
        UAE Residency Copy: ${uaeResidencyCopy || "N/A"} \n
        Emirates ID Copy: ${emiratesIdCopy || "N/A"} \n
        Home Address (UAE): ${homeAddressUAE} \n
        Home Address (Outside UAE): ${homeAddressOutsideUAE} \n
        Mother's Name: ${motherName} \n
        Father's Name: ${fatherName} \n
        Email: ${email} \n
        Phone Number: ${phoneNumber} \n
        Marital Status: ${maritalStatus} \n
        Religion: ${religion} \n
        Faith: ${faith}
      `
    );

    return res.status(200).json({
      msg: "Mail sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Error while sending mail",
    });
  }
});

app.listen(4000, () => {
  console.log(`Server is listening on port ${port}`);
});
