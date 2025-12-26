import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model.js";
import dotenv from 'dotenv';
import { generateTokens, setCookies, storeRefreshToken } from "../lib/helper.js";

dotenv.config();

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await UserModel.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = await UserModel.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              subscription: "no",
            });
          }
        }

        return done(null, user);
      } 
      catch(err){
        return done(err, null);
      }
    }
  )
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }),
  async (req, res) => {
    const userId=req.user._id;
    const { accessToken, refreshToken }=generateTokens(req.user._id);
    setCookies(res, accessToken, refreshToken);
    await storeRefreshToken(userId, refreshToken);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/success`
    );
  }
);

export default router;
