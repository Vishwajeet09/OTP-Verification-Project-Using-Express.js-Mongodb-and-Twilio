import twilio from 'twilio';
import dotenv from 'dotenv';
import User from "../models/userModel.js"


// Load environment variables
dotenv.config();

// Define Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


class UserController {

    static index = (req, res) => {
        res.render('index.ejs')
    }



    static userLogin = async (req, res) => {

        const  {phoneNumber}  = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        else{
            // Generate OTP
            function generateOTP() {
            const digits = '0123456789';
            let otp = '';
            for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
            }
            return otp;
            }

            // Send OTP via SMS
            async function sendOTP(phoneNumber, otp) {
            try {
                const message = await twilioClient.messages.create({
                body: `Your OTP is ${otp}`,
                from: '+16205361399',
                to: '+91'+ phoneNumber,
            });
            // console.log(`Sent OTP to ${'+91'+phoneNumber}: ${message.sid}`);
            } catch (err) {
            // console.error(`Error sending OTP to ${'+91'+phoneNumber}: ${err}`);
            }}


            const otp = generateOTP();
            const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
            try {
                const user = await User.findOneAndUpdate({ phoneNumber }, { otp, otpExpiration }, { upsert: true, new: true });
                await sendOTP(user.phoneNumber, user.otp);
                res.render('verify');
            } catch (err) {
                // console.error(`Error requesting OTP for ${phoneNumber}: ${err}`);
                    }
        }
    }




    static verifyOTP = async (req, res) => {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }
        try {
            const user = await User.findOne({ otp, otpExpiration: { $gt: new Date() } });
            if (!user) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            // res.status(200).json({ message: 'OTP verified' });
            res.render('landingPage');
            } catch (err) {
            console.error(`Error verifying OTP for ${phoneNumber}: ${err}`);
            res.status(500).json({ message: 'Error verifying OTP' });
            }


    }

}


    export default UserController