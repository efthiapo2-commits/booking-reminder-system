const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

let appointments = [];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "TO_EMAIL_SOU@gmail.com",
    pass: "APP_PASSWORD"
  }
});

app.post("/book", (req, res) => {
  const { email, time } = req.body;

  appointments.push({
    email,
    time: new Date(time),
    reminderSent: false
  });

  res.send("Appointment booked");
});

setInterval(() => {

  const now = new Date();

  appointments.forEach(appt => {

    const diff = (appt.time - now) / 1000 / 60;

    if (diff <= 60 && diff > 59 && !appt.reminderSent) {

      transporter.sendMail({
        from: "TO_EMAIL_SOU@gmail.com",
        to: appt.email,
        subject: "Reminder",
        text: "Το ραντεβού σου είναι σε 1 ώρα."
      });

      appt.reminderSent = true;
    }

  });

}, 60000);

app.listen(3000, () => {
  console.log("Server running");
});
