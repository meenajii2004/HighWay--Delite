import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// ✅ One Tap login
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; // frontend sends credentialResponse.credential
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const appToken = jwt.sign(
      { email: payload.email, name: payload.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token: appToken, user: payload });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};

// ✅ Redirect flow (Google sends code → backend exchanges it)
export const googleOAuthRedirect = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    const { tokens } = await client.getToken({
      code: code as string,
      redirect_uri: "http://localhost:5000/api/auth/google/callback", // must match Google console
    });

    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    const appToken = jwt.sign(
      { email: payload.email, name: payload.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // frontend redirect with token
    res.redirect(`${process.env.CORS_ORIGIN}/?token=${appToken}`);
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "OAuth Failed" });
  }
};
