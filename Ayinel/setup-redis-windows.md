# Redis Setup for Windows - Ayinel Project

## Option 1: Using Docker (Recommended)

1. Install Docker Desktop for Windows
2. Run Redis in a container:

```bash
docker run -d --name redis-ayinel -p 6379:6379 redis:alpine
```

## Option 2: Using WSL2 (Windows Subsystem for Linux)

1. Install WSL2 if not already installed
2. Install Ubuntu or another Linux distribution
3. In WSL terminal:

```bash
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

## Option 3: Using Windows Redis Port

1. Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases
2. Extract and run redis-server.exe
3. Redis will be available at localhost:6379

## Testing Redis Connection

Once Redis is running, test the connection:

```bash
# In WSL or Git Bash
redis-cli ping
# Should return: PONG
```

## For Development Without Redis

If you prefer to develop without Redis temporarily, you can disable the queue modules in `apps/api/src/app.module.ts` by commenting out the QueueModule import.
