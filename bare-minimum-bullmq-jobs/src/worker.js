import { Worker } from "bullmq";
import { connection } from "./queue.js";

const emailWorker = new Worker(
  "email_queue",
  async (Job) => {
    console.log("Processing job...", Job.id, Job.name, Job.data);
    await new Promise((resolve) => setTimeout(resolve, 10500));
    console.log("Job completed.", Job.id, Job.name, Job.data);
  },
  {connection},
);

emailWorker.on("completed", (job) => {
  console.log("Completed job:", job.id, job.name, job.data);
});

emailWorker.on("failed", (job, err) => {
  console.log("Failed job:", job.id, job.name, job.data);
  console.error(err); 
});
