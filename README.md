# E-Cell Todo App — Dockerized Full Stack Application

## Tech Stack
- Frontend: React + Vite (served via Nginx)
- Backend: Node.js + Express
- Database: MongoDB
- Containerization: Docker + Docker Compose

## Project Structure
```
ecell-docker-project/
│
├── docker-compose.yml
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── nginx.conf
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── pages/
            └── Todo.jsx
```

## How to Run

### Prerequisites
- Docker
- Docker Compose

### Run the app
```bash
docker-compose up --build
```

Then open http://localhost in your browser.

### Stop the app
```bash
docker-compose down
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/todos | Get all todos |
| POST | /api/todos | Create new todo |
| PATCH | /api/todos/:id | Toggle complete |
| DELETE | /api/todos/:id | Delete todo |

## Architecture
```
Browser
   ↓
Frontend Container (Nginx - Port 80)
   ↓
Backend Container (Node.js - Port 5000)
   ↓
MongoDB Container (Port 27017)
```

Each service runs in its own Docker container.
They communicate through a Docker internal network.
MongoDB data is persisted using Docker volumes.

## How it works

### Frontend Dockerfile
- Uses Node 18 to build the React app
- Uses Nginx to serve the built files in production
- This is called a multi-stage build

### Backend Dockerfile
- Uses Node 18 alpine (lightweight)
- Installs dependencies
- Runs the Express server

### docker-compose.yml
- Defines all 3 services
- Sets up networking between containers
- MongoDB URI uses container name 'mongo' instead of localhost

## Cloud Deployment (AWS EC2 / DigitalOcean VPS)

### Steps to deploy on a cloud server:

1. **Get a VPS** — Sign up for DigitalOcean or AWS EC2
   - Choose Ubuntu 22.04
   - Minimum 1GB RAM

2. **Install Docker on the server**
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
```

3. **Copy your project to the server**
```bash
scp -r ecell-docker-project/ user@your-server-ip:~/
```

4. **Run the app on the server**
```bash
cd ecell-docker-project
sudo docker-compose up -d
```

5. **Open port 80** in your cloud provider's firewall settings

6. **Access your app** at http://your-server-ip

### Why Docker makes deployment easy
- No need to install Node.js, MongoDB separately on the server
- Same docker-compose up command works everywhere
- No "works on my machine" problems
- Easy to scale and update

## Bonus Features

### Logging
Docker automatically captures logs from all containers:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo
```

### Zero Downtime Deployment
To update without downtime:
```bash
docker-compose up -d --no-deps --build backend
```
This rebuilds only the backend container while others keep running.

### CI/CD Pipeline (GitHub Actions)
A CI/CD pipeline can be added using GitHub Actions:
- On every push to main branch
- Automatically build Docker images
- Run tests
- Deploy to server

