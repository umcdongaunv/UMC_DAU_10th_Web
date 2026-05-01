import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * 1. Google 로그인 시작
 */
router.get("/v1/auth/google", (req, res) => {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  url.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID);
  url.searchParams.append("redirect_uri", process.env.GOOGLE_CALLBACK_URL);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", "profile email");
  url.searchParams.append("access_type", "offline");
  url.searchParams.append("prompt", "consent");

  res.redirect(url.toString());
});

/**
 * 2. callback (Google → 우리 서버)
 */
router.get("/v1/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;

    // 1) code → access token
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", process.env.GOOGLE_CALLBACK_URL);
    params.append("grant_type", "authorization_code");

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    // 2) 유저 정보
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const user = userRes.data;

    // 3) JWT 발급
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4) 프론트로 이동
    res.redirect(`http://localhost:5173?token=${token}`);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Google Login Failed");
  }
});

export default router;