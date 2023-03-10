const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const connectDB = require("../config/db");
require("dotenv").config();

app.set("views", "./public/views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/signup", async (req, res) => {
  try {
    const data = {
      email: req.body.email,
    };

    await connectDB.insertMany([data]);
    console.log("user added to the database");

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"noreply@thehungrykitchen" <${process.env.EMAIL_USERNAME}>`, // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "TheHungryKitchen", // Subject line
      text: "This is a confirmation message for you successfully signing up to recive news about any updates or changes to the website", // plain text body
      html: "<b>This is a confirmation message for you successfully signing up to recive news about any updates or changes to the website</b>", // html body
    });

    console.log("message sent");

    res.render("success");
  } catch {
    console.log("user failed to be added to the database");
    res.render("failed");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
