const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();    

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
}); 

// function to send an email notification 
const sendTaskAssignmentEmail = async (memberEmail, taskName,projectName, dueDate) => {
    const mailOptions ={
        from : process.env.EMAIL_USER, // your email address
        to : memberEmail, // recipient's email address
        subject: `New Task Assigned: ${taskName} for Project: ${projectName}`,
        html : `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563EB;">Hello!</h2>
        <p>A new task has been assigned to you in the project management application:</p>
        <h3 style="color: #4A5568;">Task: ${taskName}</h3>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <p>Please log in to the application to view the full details and start working on it.</p>
        <p style="margin-top: 20px;">Thank you,</p>
        <p>Your Project Management Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;">
        <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
      </div> ` ,
    };
    try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${memberEmail} for task: "${taskName}"`);
  } catch (error) {
    console.error(`Failed to send email to ${memberEmail} for task "${taskName}":`, error);
    // In a production environment, you might want to log this error to a monitoring system
    // or implement a retry mechanism.
  }
};
module.exports = {
    sendTaskAssignmentEmail,
};