import express from "express";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "user",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );

  res.json({ message: "Email job added to queue", job });
});

app.listen(3000, (req, res) => {
  console.log("Listening on port 3000");
});
