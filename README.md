# Redis Uses & Implementations

A collection of practical Redis implementation examples demonstrating common use cases in production applications. This repository contains multiple mini-projects showcasing different Redis patterns and features.

## 📚 Project Overview

This repository serves as a learning resource and reference guide for implementing Redis in Node.js applications. Each subdirectory contains a complete, runnable example of a specific Redis use case with clear code and documentation.

## 🎯 Use Cases Included

### 1. **Login OTP with TTL** (`login-otp-ttl/`)
Implements a time-limited One-Time Password (OTP) system using Redis's expiration (TTL) feature.

**Key Features:**
- Generate OTP codes for phone number verification
- Store OTP with automatic 30-second expiration
- Verify OTP before it expires
- Check remaining TTL for an OTP
- Auto-cleanup of expired OTPs

**Redis Concepts Used:**
- `SET` with `EX` (expiration in seconds)
- `GET` to retrieve values
- `TTL` to check remaining expiration time
- `DEL` to remove keys

**Endpoints:**
- `POST /otp` - Generate and send OTP to phone
- `POST /otp-verify` - Verify the OTP
- `GET /otp/:phone/ttl` - Check OTP expiration time

---

### 2. **Email Queue** (`email-queue/`)
Demonstrates a simple queue implementation using Redis lists for email job processing.

**Key Features:**
- Add email jobs to a queue
- Process emails from the queue (FIFO order)
- Store job metadata (recipient, subject, body, timestamp)
- Manual job processing

**Redis Concepts Used:**
- `LPUSH` - Add jobs to the queue (left push)
- `RPOP` - Remove and process jobs from queue (right pop)
- JSON serialization for complex data

**Endpoints:**
- `POST /emails` - Add an email job to the queue
- `GET /emails/process-one` - Process one email from the queue

**Use Case:** Great for simple queue patterns without requiring external job queue libraries.

---

### 3. **BullMQ Jobs** (`bare-minimum-bullmq-jobs/`)
A more production-ready job queue implementation using BullMQ, a popular Node.js queue library built on Redis.

**Key Features:**
- Queue management with job tracking
- Automatic retry logic with exponential backoff
- Job event handling
- Better error handling and monitoring
- Persistence and recovery

**Dependencies:**
- `bullmq` - Advanced job queue library
- `ioredis` - Redis client
- `express` - Web framework
- `mongoose` - Database (for job persistence)

**Endpoints:**
- `POST /welcome-email` - Queue a welcome email job with retry logic

**Use Case:** Recommended for production applications requiring robust job processing with automatic retries and monitoring.

---

## 🛠️ Tech Stack

All projects use:
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **ioredis** - High-performance Redis client for Node.js
- **Redis** - In-memory data structure store

Individual projects may include:
- **BullMQ** - Advanced job queue library
- **Mongoose** - MongoDB ODM (for data persistence)
- **Nodemon** - Development tool for auto-restart

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Redis** (running locally or on a server)

### Install Redis

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

**Windows (WSL):**
```bash
sudo apt-get install redis-server
redis-server
```

**Docker:**
```bash
docker run -d -p 6379:6379 redis:latest
```

## 🚀 Getting Started

### General Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aenansh/redis-uses-implementations.git
   cd redis-uses-implementations
   ```

2. **Ensure Redis is running:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

### Running Individual Projects

#### Login OTP with TTL
```bash
cd login-otp-ttl
npm install
npm run dev
```

**Test the API:**
```bash
# Send OTP
curl -X POST http://localhost:3000/otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}'

# Verify OTP (within 30 seconds)
curl -X POST http://localhost:3000/otp-verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "otp": "123456"}'

# Check TTL
curl http://localhost:3000/otp/+1234567890/ttl
```

#### Email Queue
```bash
cd email-queue
npm install
npm run dev
```

**Test the API:**
```bash
# Queue an email
curl -X POST http://localhost:3000/emails \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome!",
    "body": "Thanks for signing up!"
  }'

# Process one email from queue
curl http://localhost:3000/emails/process-one
```

#### BullMQ Jobs
```bash
cd bare-minimum-bullmq-jobs
npm install
npm run dev
```

**Test the API:**
```bash
# Queue a welcome email with automatic retry
curl -X POST http://localhost:3000/welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "name": "John"
  }'
```

## 📖 Redis Commands Reference

### Key Commands Used in This Repository

| Command | Use Case | Example |
|---------|----------|---------|
| `SET key value EX seconds` | Store with expiration | `SET otp:123 456789 EX 30` |
| `GET key` | Retrieve value | `GET otp:123` |
| `DEL key` | Delete key | `DEL otp:123` |
| `TTL key` | Check time to live | `TTL otp:123` |
| `LPUSH key value` | Add to queue (left) | `LPUSH queue:emails job1` |
| `RPOP key` | Remove from queue (right) | `RPOP queue:emails` |
| `EXISTS key` | Check if key exists | `EXISTS otp:123` |

## 🎓 Learning Outcomes

After exploring this repository, you'll understand:

- ✅ How to use Redis for time-limited data (OTP, sessions)
- ✅ Basic queue patterns with Redis lists
- ✅ Advanced job queuing with BullMQ
- ✅ Redis TTL and automatic key expiration
- ✅ Integrating Redis with Express.js applications
- ✅ When to use simple Redis patterns vs. libraries like BullMQ
- ✅ Best practices for error handling and retries

## 📊 Project Comparison

| Feature | OTP TTL | Email Queue | BullMQ |
|---------|---------|-------------|--------|
| Complexity | Low | Low | High |
| Production Ready | ⚠️ Simple use | ⚠️ Simple use | ✅ Yes |
| Automatic Retry | ❌ No | ❌ No | ✅ Yes |
| Monitoring | ❌ No | ❌ No | ✅ Yes |
| Persistence | ✅ Yes | ✅ Yes | ✅ Yes |
| Event Handling | ❌ No | ❌ No | ✅ Yes |

## 🔄 Redis Connection

All projects connect to Redis at `redis://localhost:6379`. To connect to a different Redis instance, modify the connection string in the source files:

```javascript
const redis = new Redis("redis://host:port");
```

## 🐛 Troubleshooting

**Issue:** `Error: connect ECONNREFUSED 127.0.0.1:6379`
- **Solution:** Make sure Redis is running. Run `redis-server` or verify it's started with `redis-cli ping`

**Issue:** `Cannot find module 'ioredis'`
- **Solution:** Run `npm install` in the project directory

**Issue:** OTP expires immediately
- **Solution:** Check that `EX` (seconds) is set correctly in the Redis command

**Issue:** Emails not being processed
- **Solution:** Ensure you're calling the `/emails/process-one` endpoint to pop items from the queue

## 💡 Use Cases in Production

- **OTP Login:** SMS/email verification, two-factor authentication
- **Email Queues:** Bulk email sending, welcome emails, notifications
- **BullMQ:** Background jobs, heavy computations, scheduled tasks, real-time notifications

## 📚 Additional Resources

- [Redis Documentation](https://redis.io/docs/)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Express.js Guide](https://expressjs.com/)

## 📄 License

ISC

## 👤 Author

Aenansh Mittal - [@Aenansh](https://github.com/Aenansh)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more Redis use cases
- Improve documentation
- Submit bug fixes
- Share better implementations

---

Happy learning! 🎉 If this repository helped you, please give it a ⭐ on GitHub!
