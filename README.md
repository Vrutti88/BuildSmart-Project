# 🏗️ BuildSmart — Construction Project Cloud

> **B.Tech CSE 2024–2028 | AWS Case Study | Semester IV | ITM Skills University**
> Domain: Construction Project Management

A full-stack cloud web application deployed on **AWS** for managing construction projects, tasks, approvals, analytics, and infrastructure monitoring — built to demonstrate real-world cloud engineering concepts.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [AWS Architecture](#-aws-architecture)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Database Schema](#-database-schema)
6. [API Endpoints](#-api-endpoints)
7. [Role-Based Access](#-role-based-access)
8. [Local Setup](#-local-setup)
9. [AWS Deployment](#-aws-deployment)
10. [Docker](#-docker)
11. [Seed Demo Data](#-seed-demo-data)
12. [Environment Variables](#-environment-variables)
13. [Default Login Credentials](#-default-login-credentials)
14. [Screenshots](#-screenshots)

---

## 📌 Project Overview

BuildSmart is a **centralized cloud platform** for construction companies to manage:

- **Projects** — create and track construction projects with budgets and locations
- **Tasks** — assign site work to engineers and track progress
- **Approvals** — workflow for managers to approve or reject requests
- **Analytics** — live charts built from real database data
- **Reports** — executive-level summary of all platform KPIs
- **Monitoring** — live EC2 CPU/memory/disk stats and system audit logs

The application demonstrates **AWS cloud infrastructure** including EC2, RDS MySQL, S3, VPC, CloudWatch, IAM, and Docker containerisation — as required by the case study.

---

## ☁️ AWS Architecture

```
Region: ap-south-1 (Mumbai)

VPC: 10.0.0.0/16
├── Public Subnet: 10.0.1.0/24
│   └── EC2 t3.medium
│       ├── Nginx (reverse proxy, port 80)
│       ├── Node.js API (PM2, port 5000)
│       └── React Frontend (built & served by Nginx)
│
└── Private Subnet: 10.0.2.0/24
    └── RDS MySQL db.t3.small
        └── Database: buildsmart

S3 Bucket: buildsmart-assets
└── /backups/    ← daily automated DB backups (cron)

CloudWatch
├── EC2 CPU Alarm (threshold: 70%)
├── Memory Alarm
└── Application Logs (via CloudWatch Agent)

IAM
├── buildsmart-admin     (AdministratorAccess)
├── buildsmart-developer (EC2 + RDS + S3 access)
└── buildsmart-readonly  (ReadOnlyAccess)
```

### Security Groups

| Group              | Port | Source          | Purpose               |
|--------------------|------|-----------------|------------------------|
| buildsmart-ec2-sg  | 22   | Your IP         | SSH access             |
| buildsmart-ec2-sg  | 80   | 0.0.0.0/0       | HTTP (Nginx)           |
| buildsmart-ec2-sg  | 443  | 0.0.0.0/0       | HTTPS                  |
| buildsmart-ec2-sg  | 5000 | 0.0.0.0/0       | Node.js API (dev)      |
| buildsmart-rds-sg  | 3306 | buildsmart-ec2-sg | MySQL (EC2 only)     |

---

## 🛠️ Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Chart.js    |
| Backend    | Node.js, Express 5                        |
| Database   | MySQL 8 (AWS RDS)                         |
| Auth       | JWT (JSON Web Tokens) + bcrypt            |
| Cloud      | AWS EC2, RDS, S3, VPC, CloudWatch, IAM    |
| Container  | Docker, Docker Compose                    |
| Web Server | Nginx (reverse proxy)                     |
| Process    | PM2 (Node.js process manager)             |
| HTTP Client| Axios                                     |

---

## 📁 Project Structure

```
BuildSmart/
├── backend/
│   ├── config/
│   │   └── db.js                  # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # Login, JWT generation
│   │   ├── projectController.js   # CRUD for projects
│   │   ├── taskController.js      # CRUD for tasks
│   │   ├── approvalController.js  # Approve / reject workflow
│   │   ├── reportController.js    # Aggregated KPI queries
│   │   ├── monitoringController.js# EC2 metrics + audit logs
│   │   └── seedController.js      # Generate demo data (ADMIN only)
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   ├── authorize.js           # Role-based access guard
│   │   └── upload.js              # Multer file upload handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── approvalRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── monitoringRoutes.js
│   │   └── seedRoutes.js
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── Navbar.jsx         # Top bar with user info
│   │   │   ├── PageShell.jsx      # Layout wrapper
│   │   │   ├── ProtectedRoute.jsx # Auth guard
│   │   │   └── RoleRoute.jsx      # Role guard
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Dashboard.jsx      # Overview + Generate button (ADMIN)
│   │   │   ├── Projects.jsx       # Project list + add form
│   │   │   ├── Tasks.jsx          # Task list + add form
│   │   │   ├── Approvals.jsx      # Approve/reject queue
│   │   │   ├── Analytics.jsx      # Live charts from DB
│   │   │   ├── Reports.jsx        # Executive KPI report
│   │   │   └── Monitoring.jsx     # EC2 metrics + audit logs
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with JWT interceptor
│   │   ├── App.jsx                # Routes + auth state
│   │   ├── main.jsx
│   │   └── index.css              # Global styles
│   └── package.json
│
├── database/
│   └── schema.sql                 # Table definitions + user seed
│
├── docker/
│   ├── Dockerfile                 # Node.js backend image
│   └── docker-compose.yml         # Backend container config
│
└── scripts/
    └── backup.sh                  # Automated DB backup to S3
```

---

## 🗄️ Database Schema

```sql
-- Users (seeded with 3 roles)
users        (id, name, email, password, role)

-- Core data
projects     (id, project_name, location, budget)
tasks        (id, task_name, assigned_to, status)
approvals    (id, task_name, status, created_at)

-- Reporting & monitoring
audit_logs   (id, action, user_name, created_at)
reports      (id, report_name, created_at)
```

**Task statuses:** `Pending` | `In Progress` | `Completed`

**Approval statuses:** `Pending` | `Approved` | `Rejected`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Access  | Description          |
|--------|---------------------|---------|----------------------|
| POST   | `/api/auth/login`   | Public  | Login, returns JWT   |

### Projects
| Method | Endpoint            | Access         | Description          |
|--------|---------------------|----------------|----------------------|
| GET    | `/api/projects`     | All roles      | List all projects    |
| POST   | `/api/projects`     | ADMIN, MANAGER | Create project       |

### Tasks
| Method | Endpoint            | Access         | Description          |
|--------|---------------------|----------------|----------------------|
| GET    | `/api/tasks`        | All roles      | List all tasks       |
| POST   | `/api/tasks`        | ADMIN, MANAGER | Create task          |

### Approvals
| Method | Endpoint                    | Access         | Description          |
|--------|-----------------------------|----------------|----------------------|
| GET    | `/api/approvals`            | All roles      | List all approvals   |
| POST   | `/api/approvals`            | All roles      | Submit approval      |
| PUT    | `/api/approvals/approve/:id`| ADMIN, MANAGER | Approve a request    |
| PUT    | `/api/approvals/reject/:id` | ADMIN, MANAGER | Reject a request     |

### Reports & Monitoring
| Method | Endpoint               | Access    | Description              |
|--------|------------------------|-----------|--------------------------|
| GET    | `/api/reports`         | All roles | Aggregated KPI summary   |
| GET    | `/api/monitoring`      | All roles | EC2 CPU/memory/disk      |
| GET    | `/api/monitoring/logs` | All roles | Audit log entries        |

### Seed (Demo Data)
| Method | Endpoint    | Access | Description                        |
|--------|-------------|--------|------------------------------------|
| POST   | `/api/seed` | ADMIN  | Populate DB with 12 projects, 20 tasks, 7 approvals, 10 logs |

> All endpoints except `/api/auth/login` require the `Authorization` header with a valid JWT token.

---

## 👥 Role-Based Access

| Feature              | ADMIN | MANAGER | ENGINEER |
|----------------------|-------|---------|----------|
| View Dashboard       | ✅    | ✅      | ✅       |
| Generate Demo Data   | ✅    | ❌      | ❌       |
| Add Projects         | ✅    | ✅      | ❌       |
| Add Tasks            | ✅    | ✅      | ❌       |
| Approve / Reject     | ✅    | ✅      | ❌       |
| View Analytics       | ✅    | ✅      | ✅       |
| View Reports         | ✅    | ✅      | ✅       |
| View Monitoring      | ✅    | ✅      | ✅       |

---

## 💻 Local Setup

### Prerequisites

- Node.js v20+
- MySQL 8 running locally (or RDS endpoint)
- Git

### 1. Clone / Extract the project

```bash
# If using Git
git clone https://github.com/YOUR_USERNAME/buildsmart.git
cd buildsmart

# Or just unzip the provided archive
unzip BuildSmart_Final.zip
cd BS_out
```

### 2. Set up the database

```bash
# Create the database and import schema
mysql -u root -p -e "CREATE DATABASE buildsmart;"
mysql -u root -p buildsmart < database/schema.sql
```

This creates all tables and inserts the three default users.

### 3. Configure the backend

```bash
cd backend
cp .env .env.local   # optional backup
nano .env            # or open in your editor
```

Update `.env` with your local MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=buildsmart
JWT_SECRET=buildsmartsecret
```

### 4. Start the backend

```bash
cd backend
npm install
npm run dev        # uses nodemon for auto-reload
# OR
npm start          # production mode
```

Backend will be running at `http://localhost:5000`

Verify: `curl http://localhost:5000/` → should return `{ "project": "BuildSmart Construction Project Cloud", "status": "Running" }`

### 5. Configure the frontend

```bash
cd frontend
```

Open `src/services/api.js` and set the base URL:

```js
const api = axios.create({
  baseURL: "http://localhost:5000/api",   // local
});
```

### 6. Start the frontend

```bash
npm install
npm run dev
```

Frontend will be running at `http://localhost:5173`

Open your browser and go to `http://localhost:5173` → you should see the login page.

---

## ☁️ AWS Deployment

### Step 1 — Launch EC2

```
AMI:            Ubuntu Server 24.04 LTS
Instance type:  t3.medium
Key pair:       buildsmart-key.pem  (save this!)
VPC:            buildsmart-vpc (create new, 10.0.0.0/16)
Subnet:         Public subnet (10.0.1.0/24)
Security group: Allow ports 22, 80, 443, 5000
Storage:        20 GB gp3
```

### Step 2 — Connect to EC2

```bash
chmod 400 ~/Downloads/buildsmart-key.pem
ssh -i ~/Downloads/buildsmart-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Step 3 — Install dependencies on EC2

```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# PM2
sudo npm install -g pm2
```

### Step 4 — Create RDS MySQL

```
Engine:         MySQL 8.0
Template:       Free tier
DB identifier:  buildsmart-db
Username:       admin
Password:       BuildSmart@123
Instance:       db.t3.micro
VPC:            buildsmart-vpc
Subnet:         Private subnet
Security group: buildsmart-rds-sg (allow 3306 from EC2 only)
Public access:  NO
```

Copy the RDS **endpoint hostname** after creation.

### Step 5 — Upload & configure project

```bash
# Upload from your local machine
scp -i buildsmart-key.pem -r ./BS_out ubuntu@<EC2_IP>:/home/ubuntu/buildsmart

# On EC2 — configure backend
cd /home/ubuntu/buildsmart/backend
nano .env
```

Set in `.env`:

```env
PORT=5000
DB_HOST=<YOUR_RDS_ENDPOINT>
DB_USER=admin
DB_PASSWORD=BuildSmart@123
DB_NAME=buildsmart
JWT_SECRET=buildsmartsecret
```

### Step 6 — Import schema to RDS

```bash
# From EC2 (MySQL client is installed)
mysql -h <RDS_ENDPOINT> -u admin -pBuildSmart@123 buildsmart < /home/ubuntu/buildsmart/database/schema.sql
```

### Step 7 — Start backend with PM2

```bash
cd /home/ubuntu/buildsmart/backend
npm install
pm2 start server.js --name buildsmart-api
pm2 save
pm2 startup   # run the command it outputs
```

### Step 8 — Build and serve frontend

```bash
cd /home/ubuntu/buildsmart/frontend

# Update API URL to use your EC2 IP
# Edit src/services/api.js → baseURL: "http://<EC2_IP>/api"

npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### Step 9 — Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/buildsmart
```

Paste:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/buildsmart /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx
```

App is now live at `http://<EC2_PUBLIC_IP>`

### Step 10 — S3 Bucket (for backups)

```bash
aws s3 mb s3://buildsmart-assets --region ap-south-1
```

Edit `scripts/backup.sh` with your RDS endpoint, then schedule:

```bash
crontab -e
# Add:
0 2 * * * /bin/bash /home/ubuntu/buildsmart/scripts/backup.sh >> /var/log/buildsmart-backup.log 2>&1
```

### Step 11 — CloudWatch Alarm

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name buildsmart-high-cpu \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --dimensions "Name=InstanceId,Value=<INSTANCE_ID>" \
  --evaluation-periods 2
```

---

## 🐳 Docker

### Build and run the backend container

```bash
cd docker

# Build image
docker build -f Dockerfile -t buildsmart-api ../backend

# Run with docker-compose (update DB_HOST in docker-compose.yml first)
docker-compose up -d

# Check status
docker ps
docker logs buildsmart-api
```

### Push to Docker Hub

```bash
docker login
docker tag buildsmart-api YOUR_DOCKERHUB_USERNAME/buildsmart-api:v1
docker push YOUR_DOCKERHUB_USERNAME/buildsmart-api:v1
```

---

## 🌱 Seed Demo Data

Once logged in as **ADMIN**, go to the **Dashboard** and click the **"Generate Demo Data"** button.

This inserts via `POST /api/seed`:

| Table       | Records inserted |
|-------------|-----------------|
| projects    | 12              |
| tasks       | 20              |
| approvals   | 7               |
| audit_logs  | 10              |
| reports     | 6               |

After seeding, all pages — Projects, Tasks, Approvals, Analytics, Reports, Monitoring — will show real data from the database.

> ⚠️ Only ADMIN role can see and use the Generate button. Managers and Engineers cannot trigger a seed.

---

## 🔧 Environment Variables

| Variable          | Description                        | Example                                    |
|-------------------|------------------------------------|--------------------------------------------|
| `PORT`            | Backend server port                | `5000`                                     |
| `DB_HOST`         | MySQL host (RDS endpoint or localhost) | `buildsmart-db.xxxx.ap-south-1.rds.amazonaws.com` |
| `DB_USER`         | MySQL username                     | `admin`                                    |
| `DB_PASSWORD`     | MySQL password                     | `BuildSmart@123`                           |
| `DB_NAME`         | MySQL database name                | `buildsmart`                               |
| `JWT_SECRET`      | Secret key for JWT signing         | `buildsmartsecret`                         |
| `AWS_REGION`      | AWS region (for CloudWatch SDK)    | `ap-south-1`                               |
| `EC2_INSTANCE_ID` | EC2 instance ID (for monitoring)   | `i-0123456789abcdef0`                      |

---

## 🔑 Default Login Credentials

> Password for all accounts: **`admin123`**

| Role     | Email                       | Password  | Permissions                          |
|----------|-----------------------------|-----------|--------------------------------------|
| ADMIN    | admin@buildsmart.com        | admin123  | Full access + Generate Demo Data     |
| MANAGER  | manager@buildsmart.com      | admin123  | View all, add projects/tasks, approve |
| ENGINEER | engineer@buildsmart.com     | admin123  | View only (no add/approve access)    |

---

## 📸 Screenshots

> Take screenshots of the following pages for your submission:

| Page        | What to show                                      |
|-------------|---------------------------------------------------|
| Login       | Login screen with BuildSmart branding             |
| Dashboard   | Stats cards populated after seeding               |
| Projects    | Table with 12 seeded projects                     |
| Tasks       | Table with 20 tasks and status badges             |
| Approvals   | Pending queue with Approve/Reject buttons         |
| Analytics   | Bar, Pie and Line charts with real data           |
| Reports     | KPI cards and progress bars                       |
| Monitoring  | CPU/memory gauges + system log from audit_logs    |

---

## 💰 AWS Cost Estimate (ap-south-1 / Mumbai)

| Service           | Type            | Monthly (USD) | Monthly (INR) |
|-------------------|-----------------|---------------|---------------|
| EC2 t3.medium     | On-Demand       | ~$30.37       | ~₹2,530       |
| RDS db.t3.micro   | Single-AZ MySQL | ~$12.41       | ~₹1,035       |
| S3 (50 GB)        | Standard        | ~$1.15        | ~₹96          |
| Data Transfer     | 10 GB out       | ~$1.00        | ~₹83          |
| CloudWatch        | Basic + alarms  | ~$2.00        | ~₹167         |
| **Total**         |                 | **~$46.93**   | **~₹3,911**   |

> 💡 **Free Tier Tip:** Use `t2.micro` EC2 + `db.t3.micro` RDS for the first 12 months at no cost under AWS Free Tier.

---

## 🏛️ AWS Concepts Demonstrated

| Concept                    | Implementation                               |
|----------------------------|----------------------------------------------|
| Compute                    | EC2 t3.medium with Ubuntu 24.04              |
| Managed Database           | RDS MySQL 8 in private subnet                |
| Object Storage             | S3 bucket for backups                        |
| Networking                 | Custom VPC, public/private subnets           |
| Firewall                   | Security Groups with least-privilege rules   |
| Identity & Access          | IAM users and roles with scoped permissions  |
| Monitoring & Alerting      | CloudWatch metrics + SNS email alerts        |
| Linux Administration       | User/group management, cron jobs, systemctl  |
| Process Management         | PM2 for Node.js, Nginx as reverse proxy      |
| Containerisation           | Docker image + docker-compose deployment     |
| Automation                 | Shell script for DB backup, cron scheduling  |
| Role-Based Access          | JWT + middleware enforcing ADMIN/MANAGER/ENGINEER roles |

---

*Built for ITM Skills University · AWS Case Study · Semester IV · Construction Project Management*
