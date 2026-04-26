# PrepAI - AI Mock Interviewer

Submitted By:
M. Zubair Adnan i220789 A
Ahmed Naveed i221132 A

A sleek, full-stack AI-powered mock interview platform. PrepAI allows users to practice role-specific technical interviews, receive instant AI-generated feedback, and visually track their progress over time across different difficulties.

Built with a modern stack featuring Next.js 14, Framer Motion, FastAPI, PostgreSQL, and OpenAI's GPT-4o.

---

## Features

- **AI-Powered Sessions:** Dynamically generates technical, behavioral, and practical questions based on the user's requested job role and difficulty (Easy/Medium/Hard).
- **Instant Feedback:** Evaluates user answers in real-time, providing immediate score out of 10 and constructive feedback on missing elements.
- **Progress Tracking:** Beautiful dashboard with historical interview tracking and automated overall performance metrics (Great / Okay / Needs Work).
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion. Features a deep navy and indigo-violet aesthetic, smooth micro-interactions, responsive glowing gradients, and floating authenticated states.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | FastAPI (Python 3.11), SQLAlchemy |
| **Database** | PostgreSQL 15 |
| **AI Integration**| OpenAI GPT-4o API |
| **Auth** | Custom JWT + `bcrypt` implementation |

---

## Project Structure

```
PrepAI/
│
├── frontend/                        ← Next.js 14 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js              ← Modern Landing page
│   │   │   ├── login/page.js        ← Split-screen Login via Framer Motion
│   │   │   ├── signup/page.js       ← Split-screen Signup via Framer Motion
│   │   │   ├── dashboard/page.js    ← Protected user portal (Past sessions + New)
│   │   │   ├── interview/
│   │   │   │   └── [id]/page.js     ← Active real-time interview answering screen
│   │   │   └── results/
│   │   │       └── [id]/page.js     ← Comprehensive post-interview score breakdown
│   │   ├── components/
│   │   │   ├── Navbar.js            ← Global dynamic navigation (Deep Navy)
│   │   └── lib/
│   │       └── api.js               ← Axios interception and backend API bindings
│
├── backend/                         ← FastAPI Application
│   ├── main.py                      ← App entry point & main mounting
│   ├── database.py                  ← PostgreSQL engine connection 
│   ├── models.py                    ← SQLAlchemy ORM (Users, Sessions, Questions, Answers)
│   ├── schemas.py                   ← Pydantic validation bindings
│   ├── auth.py                      ← JWT generation & Password Hashing
│   ├── openai_service.py            ← OpenAI System Prompts & Structured JSON interactions
│   └── routers/
│       ├── auth_router.py           
│       ├── sessions_router.py       
│       └── answers_router.py        
```

---

## Local Development Setup

To run this application locally, you will need Node.js, Python 3.11+, and a running Postgres database.

### 1. Environment Variables

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mockinterview
OPENAI_API_KEY=sk-your-openai-api-key-here
SECRET_KEY=your-secure-jwt-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Start the Backend

Navigate to the `backend` folder, create a virtual environment, install dependencies, and launch FastAPI:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Start the Frontend

Navigate to the `frontend` folder, install the packages, and run the Next.js development server:

```bash
cd frontend
npm install
npm run dev
```

### 4. Visit the Application
- Application: `http://localhost:3000`
- Backend API Docs (Swagger / OpenAPI): `http://localhost:8000/docs`

---

## 🏗️ Cloud-Native Architecture (Production)

This project has been refactored from a local monolithic application into a **Production-Grade, Cloud-Native Microservices Architecture** deployed on AWS using a fully automated GitOps CI/CD pipeline.

PrepAI is built on a modern DevOps stack designed for scalability, reliability, and zero-touch automation.

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, Tailwind, React | Static client-side UI bundled into an Nginx container. |
| **Auth Service** | FastAPI (Python) | Dedicated microservice handling JWT creation, hashing, and signup/login routing. |
| **Core Backend** | FastAPI (Python) | Dedicated microservice handling OpenAI integrations, session tracking, and evaluations. |
| **Database** | PostgreSQL 15 | Relational data storage, attached to a Kubernetes Persistent Volume. |
| **Infrastructure**| Terraform (AWS) | IaC provisioning of a custom VPC, Public Subnet, Internet Gateway, and an EC2 instance. |
| **Configuration**| Ansible | Automated server configuration, installing Docker, MicroK8s, and securely transferring secrets. |
| **CI/CD (Build)**| GitHub Actions | Continuous Integration pipeline that builds Docker images and dynamically updates Kustomize tags. |
| **GitOps (Deploy)**| ArgoCD & Kubernetes | Continuous Deployment controller that watches GitHub and automatically syncs the cluster state. |

---

## 🚀 Zero-Touch Deployment Pipeline

The entire AWS infrastructure and Kubernetes cluster can be provisioned and deployed automatically with zero manual server configuration.

### Prerequisites
1. AWS CLI configured with administrator access.
2. Terraform, Ansible, and Docker installed on your local machine.
3. An OpenAI API Key.
4. A Docker Hub account with Repository Secrets configured in GitHub (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_PUBLIC_IP`).

### Step 1: Secure Your Secrets
Create a file locally at `k8s/actual_secrets.yml` to hold your production keys. (This file is ignored by Git for security).
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: prepai-secrets
type: Opaque
stringData:
  DB_USER: "postgres"
  DB_PASSWORD: "secure-password"
  DB_NAME: "mockinterview"
  DATABASE_URL: "postgresql://postgres:secure-password@postgres-db:5432/mockinterview"
  OPENAI_API_KEY: "sk-your-real-api-key"
  SECRET_KEY: "your-highly-secure-jwt-secret-string"
```

### Step 2: Provision Infrastructure (Terraform)
Navigate to the `infrastructure/terraform` directory and apply the AWS configuration.
```bash
cd infrastructure/terraform
terraform init
terraform apply -auto-approve
```
*Take note of the EC2 Public IP outputted at the end of this process.*

### Step 3: Configure Server & Kubernetes (Ansible)
1. Update `infrastructure/ansible/inventory.ini` with your new EC2 Public IP address.
2. In your GitHub repository settings, update the `EC2_PUBLIC_IP` Repository Secret so the Frontend can build its dynamic routes.
3. Run the Ansible playbook from your local machine:
```bash
cd infrastructure/ansible
ansible-playbook -i inventory.ini playbook.yml
```
*This playbook installs Kubernetes, securely copies your local `actual_secrets.yml` to the server vault, installs ArgoCD, and connects the cluster to GitHub.*

### Step 4: GitOps Automation (GitHub Actions & ArgoCD)
Whenever you push code to the `master` branch:
1. **GitHub Actions** builds the new Next.js, Auth, and Backend Docker images.
2. The Action pushes the images to Docker Hub tagged with the Git commit hash.
3. The Action uses `Kustomize` to update the `k8s/kustomization.yml` file with the new image tags and commits the change back to GitHub.
4. **ArgoCD**, running inside the EC2 cluster, detects the change in GitHub and automatically pulls the new Docker images, gracefully restarting the Pods without downtime.

---

## 🌐 Accessing the Application

Once ArgoCD finishes deploying the pods, the application is live!
Open your browser and navigate to:
**`http://<YOUR_EC2_PUBLIC_IP>:30002`**

Some relevant commands:
```bash
# create 
terraform init
terraform apply -auto-approve

# Change public IP address (if changed)
EC2_PUBLIC_IP="<NEW_IP>"      # Update in GitHub Repo Settings

# Restart playbook
ansible-playbook -i inventory.ini playbook.yml

# Clean up everything
terraform destroy

kubectl rollout restart deployment prepai-backend
kubectl logs -l app=backend
kubectl logs -l app=postgres
kubectl logs -l app=auth-service



ssh -i ~/.ssh/id_rsa ubuntu@<IP_Address>
nano secrets.yml
kubectl apply -f secrets.yml
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f https://raw.githubusercontent.com/blueork/PrepAI/main/k8s/argocd-app.yml
kubectl get pods -w
kubectl apply -f https://raw.githubusercontent.com/blueork/PrepAI/master/k8s/argocd-app.yml
kubectl get application prepai-app -n argocd


# 1. Clone your repo onto the EC2 server (it will ask for your GitHub username/password)
git clone https://github.com/blueork/PrepAI.git

# 2. Tell Kubernetes to apply everything in the k8s folder!
kubectl apply -k PrepAI/k8s/
kubectl get application prepai-app -n argocd


```