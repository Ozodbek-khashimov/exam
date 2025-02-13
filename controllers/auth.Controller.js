import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import jwt from "jsonwebtoken"
// import { generateToken } from '../utils/generateToken.js';
import { sendEmalOtp } from '../utils/sendEmail.js';

export const usercontroller = {
  // Regiter funksiyasining o'zgartirilgan versiyasi:
  async register(req, res) {
    const { firstName, lastName, username, email, password, role = 'user' } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = await User.create({ firstName, lastName, username, email, password, role });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.create({ userId: user._id, code: otp, expiresAt: Date.now() + 600000 });

      // To'g'ri email yuborish
      console.log(email, otp);

      await sendEmalOtp.sendMailActivationCode(email, otp);

      res.status(201).json({ message: 'User registered. Check your email for OTP.' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  },


  async verifyOTP(req, res) {
    const { email, code } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const otp = await OTP.findOne({ userId: user._id, code });
      if (!otp || otp.expiresAt < Date.now()) throw new Error('Invalid or expired OTP');

      user.isVerified = true;
      await user.save();
      await OTP.deleteOne({ _id: otp._id });

      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          id:user._id,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message })
    }
  },
  async getProfile(req, res) {
    try {

      const profile = await User.findById(req.params.id);
      if(!profile){
        return res.status(400).json({ message: "user not found" });
      }
      res.status(200).json({ user: profile });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateProfile(req, res) {
    const { name, email } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) throw new Error('User not found');

      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();

      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteProfile(req, res) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
