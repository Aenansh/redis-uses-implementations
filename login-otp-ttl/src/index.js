import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(otpKey(phone), otp, "EX", 30);

  res.json({ message: "OTP sent!", success: true, otp });
});

app.post("/otp-verify", async (req, res) => {
  const { phone, otp } = req.body;

  const savedOtp = await redis.get(otpKey(phone));

  if (!savedOtp)
    return res.json({
      message: "OTP expired request another one.",
      success: false,
    });

  if (savedOtp !== otp)
    return res.json({ message: "Incorrect OTP!", success: false });

  await redis.del(otpKey(phone));
  res.json({ message: "Welcome you are verified!", success: true });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));

  if (!ttl)
    return res.json({
      message: "No OTP requested or OTP expired.",
      success: true,
    });

  res.json({ message: "OTP is valid till", ttl: ttl, success: true });
});

app.listen(3000, (req, res) => {
  console.log("Listening on port 3000");
});
