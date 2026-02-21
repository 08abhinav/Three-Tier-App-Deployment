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
- **CI/CD:** Github Actions
- **Cloud:** AWS  

---

## Project Structure
```text
Three-Tier-App-Deployment
|
├── .github/
|    └── workflows/
|        └── backend.yml
|        └── frontend.yml
├── app/
|   └── backend/     # Node.js backend APIs
|   └── frontend/    # React application 
|
├── Architecture.png
├── README.md
|
```
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

---

## GitHub Actions Setup

This project uses **GitHub Actions** to automatically build and push Docker images to **AWS Elastic Container Registry (ECR)**.

---

## Workflow Location

Navigate to the workflows directory:

```bash
cd .github/workflows
```

You should see two workflow files:

- `backend.yml`
- `frontend.yml`

---

## Workflow Execution Flow

Both workflow files run on **GitHub-hosted runners** and follow the sequence below:

---

### 1️ Checkout Repository

- Uses `actions/checkout`
- Pulls the latest commit from the repository

---

### 2️ Configure AWS Credentials

AWS credentials are configured using **GitHub Repository Secrets**.

Go to:

```
GitHub Repository
→ Settings
→ Secrets and variables
→ Actions
→ New repository secret
```

### Required Secrets

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

> ⚠️ Never hardcode AWS credentials inside workflow files.

---

### 3️ Login to AWS ECR

The workflow logs in to AWS ECR using:

```
aws-actions/amazon-ecr-login@v2
```

---

### 4️ Build and Push Docker Image

- Builds the image from:

```
app/<directory>/Dockerfile
```

- Make sure you provide your **ECR repository URI** in the workflow file.

Example format:

```
<account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>
```

---

## Final Steps

1. Commit and push your changes.
2. Go to the **Actions** tab in your GitHub repository.
3. You will see the workflow running.
4. After successful execution:
   - Log in to AWS Console
   - Search for **ECR**
   - Open your repository (e.g., `dev/backend`)
   - Verify the latest image has been pushed successfully

---

## ⚠️ Important Notes

- Ensure your IAM user has permission:
  - `AmazonEC2ContainerRegistryFullAccess`
- Make sure the ECR repository is created before pushing.
- Always store sensitive data inside GitHub Secrets.

---
## Learning Outcomes

- **ECR (Elastic Container Registry)**  
  Learned how to securely store, manage, and version Docker container images in AWS, and integrate them into CI/CD pipelines.

- **ECS (Elastic Container Service)**  
  Understood how to deploy, manage, and scale containerized applications using AWS-managed orchestration with Fargate.

- **GitHub Actions**  
  Gained hands-on experience building CI/CD workflows to automate building, and deployment directly from GitHub repositories.

- **Docker**  
  Learned how to containerize applications using Dockerfiles, manage multi-container setups, and ensure consistent environments across development and production.