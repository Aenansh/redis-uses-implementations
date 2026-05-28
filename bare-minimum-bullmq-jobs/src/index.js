import express, { raw } from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis("redis://localhost:6379");

app.listen(3000, (req, res) => {
  console.log("Listening on port 3000");
});
