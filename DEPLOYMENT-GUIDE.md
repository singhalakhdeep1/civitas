# Civic & Nonprofit Platform - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (for local development)
- PostgreSQL 16+ (if not using Docker)
- Redis 7+ (if not using Docker)
- Stripe account for payments
- SendGrid account for emails
- Twilio account for SMS

---

## 🐳 Docker Deployment (Recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd 04-CIVIC-NONPROFIT-PLATFORM
```

### 2. Configure Environment Variables
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/civic_platform"

# JWT Secrets (generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-256-bits-minimum
JWT_REFRESH_SECRET=your-super-secret-refresh-key-256-bits-minimum

# Stripe
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# SendGrid
SENDGRID_API_KEY=SG.YOUR_API_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Twilio
TWILIO_ACCOUNT_SID=YOUR_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_AUTH_TOKEN
TWILIO_PHONE_NUMBER=+1234567890

# AWS S3
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# OAuth2
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
FACEBOOK_APP_ID=YOUR_FACEBOOK_APP_ID
FACEBOOK_APP_SECRET=YOUR_FACEBOOK_APP_SECRET
```

### 3. Start Services
```bash
cd ..
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 4000

### 4. Run Database Migrations
```bash
docker-compose exec backend npx prisma migrate deploy
```

### 5. (Optional) Seed Database
```bash
docker-compose exec backend npx prisma db seed
```

### 6. Verify Deployment
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok"}
```

### 7. Access API Documentation
Open browser: `http://localhost:4000/api`

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
# Start PostgreSQL (if not using Docker)
# Create database
createdb civic_platform

# Run migrations
npx prisma migrate dev
npx prisma generate
```

### 3. Setup Redis
```bash
# Start Redis (if not using Docker)
redis-server
```

### 4. Start Development Server
```bash
npm run start:dev
```

Server runs on `http://localhost:4000`

### 5. Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 🌐 Production Deployment

### Option 1: Docker on VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Provision Server
- Ubuntu 22.04 LTS
- 2 GB RAM minimum (4 GB recommended)
- 20 GB SSD minimum

#### 2. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

#### 3. Setup SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d api.yourdomain.com
```

#### 4. Deploy Application
```bash
git clone <repository-url>
cd 04-CIVIC-NONPROFIT-PLATFORM
cp backend/.env.example backend/.env
# Edit .env with production values
docker-compose up -d
```

#### 5. Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: AWS/GCP/Azure

#### AWS Deployment
1. **ECS/Fargate**: Deploy Docker containers
2. **RDS**: PostgreSQL database
3. **ElastiCache**: Redis
4. **S3**: File storage
5. **CloudFront**: CDN
6. **Route53**: DNS

#### Google Cloud Platform
1. **Cloud Run**: Deploy containers
2. **Cloud SQL**: PostgreSQL
3. **Memorystore**: Redis
4. **Cloud Storage**: File storage
5. **Cloud CDN**: CDN

---

## 🔄 CI/CD Setup (GitHub Actions)

### 1. Add GitHub Secrets
Go to repository Settings → Secrets → Actions

Add these secrets:
```
DOCKER_USERNAME=your-docker-hub-username
DOCKER_PASSWORD=your-docker-hub-token
SERVER_HOST=your-server-ip
SERVER_USER=deploy
SERVER_SSH_KEY=<your-private-ssh-key>
```

### 2. Push to Main Branch
```bash
git push origin main
```

GitHub Actions will automatically:
- Run tests
- Lint code
- Build Docker image
- Push to Docker Hub
- Deploy to production server

---

## 🔧 Configuration

### Environment Variables

#### Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `STRIPE_SECRET_KEY`: Stripe API key
- `SENDGRID_API_KEY`: SendGrid API key
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token

#### Optional
- `REDIS_HOST`: Redis host (default: localhost)
- `REDIS_PORT`: Redis port (default: 6379)
- `PORT`: API port (default: 4000)
- `NODE_ENV`: Environment (development/production)
- `RATE_LIMIT_TTL`: Rate limit window (default: 60s)
- `RATE_LIMIT_MAX`: Max requests per window (default: 100)

### Database Configuration

#### Connection Pooling
```env
DATABASE_URL="postgresql://user:password@host:5432/database?connection_limit=10&pool_timeout=30"
```

#### SSL Connection
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

---

## 📊 Monitoring & Logging

### Health Checks
```bash
# Application health
curl http://localhost:4000/health

# Database health
docker-compose exec backend npx prisma db pull

# Redis health
docker-compose exec redis redis-cli ping
```

### Logs
```bash
# View all logs
docker-compose logs -f

# Backend logs only
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Monitoring Tools (Recommended)
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: APM

---

## 🔒 Security Checklist

### Before Production

✅ Change default passwords
✅ Set strong JWT secrets (256-bit minimum)
✅ Enable HTTPS/SSL
✅ Configure CORS properly
✅ Set rate limiting
✅ Enable Helmet security headers
✅ Setup firewall rules
✅ Enable database backups
✅ Use environment variables (never commit secrets)
✅ Setup monitoring & alerts
✅ Enable audit logging
✅ Configure Stripe webhooks
✅ Setup email SPF/DKIM records

---

## 🗄️ Database Management

### Backup Database
```bash
# Docker backup
docker-compose exec postgres pg_dump -U postgres civic_platform > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres civic_platform < backup.sql
```

### Migrations
```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Deploy migrations
npx prisma migrate deploy

# Reset database (DEV ONLY!)
npx prisma migrate reset
```

---

## 📈 Scaling

### Horizontal Scaling
1. Deploy multiple backend instances
2. Use load balancer (Nginx, HAProxy)
3. Use Redis for session storage
4. Use queue system for background jobs

### Database Scaling
1. Use read replicas
2. Enable connection pooling
3. Add database indexes
4. Use caching layer

### Caching Strategy
```typescript
// Cache expensive queries
const campaigns = await redis.get('campaigns:trending');
if (!campaigns) {
  const data = await prisma.campaign.findMany({/* ... */});
  await redis.set('campaigns:trending', JSON.stringify(data), 3600);
}
```

---

## 🆘 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs backend

# Rebuild image
docker-compose build --no-cache backend
```

### Database connection error
```bash
# Check PostgreSQL
docker-compose ps postgres

# Test connection
docker-compose exec backend npx prisma db pull
```

### Stripe webhook failures
1. Check Stripe dashboard for webhook logs
2. Verify `STRIPE_WEBHOOK_SECRET` in .env
3. Test with Stripe CLI:
```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
```

### Email not sending
1. Verify SendGrid API key
2. Check sender verification
3. Review SendGrid activity logs

---

## 📞 Support

- Documentation: `/docs`
- API Docs: `http://localhost:4000/api`
- Issues: GitHub Issues
- Email: support@civicplatform.org

---

## 🎉 Success!

Your Civic & Nonprofit Platform is now deployed!

**Next Steps:**
1. Create first admin user
2. Verify nonprofit organization
3. Create test campaign
4. Test donation flow
5. Setup monitoring
6. Configure backups
7. Plan marketing strategy

Happy deploying! 🚀
