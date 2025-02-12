import {User} from "../models/User.js"
import jwtService from "../service/jwt.service.js"
const { UserJwt } = jwtService;

 export const usercontroller={
    async register(req, res, next) {
        try {
            const { username, password, email, firstName, lastName } = req.body;
            

            if (!username || !password || !email || !firstName || !lastName) {
                throw new Error("Malumot to'liq emas");
            }

            const oldUser = await User.findOne({ email });
            if (oldUser) {
                return res.status(400).send({ message: "User already exists" });
            }

            const user = await User.create({
                username,
                password,
                email,
                firstName,
                lastName
            });
            // console.log(user);
            
            res.status(201).json({
                message: 'User registered successfully',
                user: { id: user.id },
            });
        } catch (error) {
            next(error);
        }
    },
    async verifyOTP (req, res) {
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
    async getProfile (req, res) {
      try {
        const profile = await User.findById(req.user._id, { name: 1, email: 1, isVerified: 1 });
        res.status(200).json(profile);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
}