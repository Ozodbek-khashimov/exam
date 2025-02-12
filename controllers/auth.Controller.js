import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
// import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';  

export const usercontroller = {
    // Regiter funksiyasining o'zgartirilgan versiyasi:
    async register(req, res) {
      const {firstName,lastName, username, email, password, role = 'user' } = req.body;
    
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already registered' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName,lastName, username, email, password: hashedPassword, role });
    
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({ userId: user._id, code: otp, expiresAt: Date.now() + 600000 });
    
        // To'g'ri email yuborish
        await sendEmail.sendMail({ email });
    
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

        res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            tokens: {
                accessToken, 
                refreshToken, 
            },
        });
    } catch (error) {
        next(error);
    }
},
  async getProfile(req, res) {
    try {
      const profile = await User.findById(req.user._id, { name: 1, email: 1, isVerified: 1 });
      res.status(200).json(profile);
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
