# Three-Tier Application Deployment

A simple **Task Management Application** built using a modern **Three-Tier Architecture** and deployed using containerization.

---

## Architecture Overview

This project follows a classic **Three-Tier Architecture**:

1. **Frontend (Presentation Layer)**
   - Built with **React**
   - Handles UI and user interaction

2. **Backend (Application Layer)**
   - Built with **Node.js**
   - Exposes REST APIs
   - Connects to database

3. **Database (Data Layer)**
   - AWS Aurora (MySQL-compatible RDS)
   - Stores task data persistently

---

## Tech Stack

- **Frontend:** React  
- **Backend:** Node.js (Express)  
- **Database:** AWS Aurora RDS (MySQL)  
- **Containerization:** Docker  
- **Cloud:** AWS  

---

## 📂 Project Structure
│
├── backend/        # Node.js backend APIs
├── frontend/       # React application
└── Architecture.png
---

## Local Development Setup

### Clone Repository

```bash
git clone https://github.com/08abhinav/Three-Tier-App-Deployment.git
cd Three-Tier-App-Deployment
```

### Setup Backend
```bash
cd backend
npm install
```
### Note
- Before running the backend, make sure you have configured the AWS CLI on your local system
- Follow these steps to configure the AWS CLI:
```bash
aws configure
```
- It will prompt you for the AWS Access Key ID and AWS Secret Access Key.
- Go to your AWS account and create a new access key. You will receive an Access Key ID and a Secret Access Key. Copy and paste them here, and download the .csv file for future reference.


### Run backend
```bash
npm run dev
```
- The backend run on: https://localhost:8500/

### Setup Frontend
```bash
cd frontend
npm install
npm start
```
- The frontend run on: https://localhost:5173/

### Note:
- If you want to run the containerized application locally, ensure Docker is installed and running. Otherwise, it will be used within GitHub Actions.
### Setup Docker
```bash
cd backend
docker build -t task-backend .

cd frontend
docker build -t task-frontend .
```
- Create a docker-compose.yaml file and define all the required services in it.
- For reference:
`https://github.com/AmanPathak-DevOps/Student-Teacher-Portal-Three-Tier-Application/blob/ecs-deployment/docker-compose.yaml`
