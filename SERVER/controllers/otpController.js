const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/userModels');
const Email = process.env.EMAIL;
const Password = process.env.EMAIL_PASS;

// Send OTP to user's email
const sendOTP = async (req, res) => {
    
    const email = req.email || (req.body && req.body.email);
    console.log("email", email);
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits.charAt(randomIndex);
    }

    // Send OTP to user's email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: Email,
            pass: Password
        }
    });

    const mailOptions = {
        from: Email,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for email verification is: ${otp}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
        if (info.response) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            res.status(500).json({ message: 'Error sending email' });
        }
        await updateOtp(email, otp);

        return otp;
    } catch (error) {
        console.log('Error sending email: ', error);
        res.status(500).json({ message: 'Error sending email', error: error });
        throw error;
    }
};

const updateOtp = async (email, otp) => {
    try {
        const filter = { email: email };
        const update = { otp: otp };
        await User.updateOne(filter, update);
    } catch (error) {
        console.log('Error updating OTP in User schema: ', error);
        throw error;
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp === req.body.otp) {
            // OTP matched, mark email as verified
            user.isEmailverified = true;
            await user.save();

            return res.status(200).json({ message: 'Email verified successfully' });
        } else {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { User, sendOTP, verifyOTP };