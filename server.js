const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Email sending route
app.post("/send-email", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail
                pass: process.env.EMAIL_PASS, // App password (Not regular password)
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL, // Your email to receive messages
            subject: subject,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: "Email Sent Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Email could not be sent" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
