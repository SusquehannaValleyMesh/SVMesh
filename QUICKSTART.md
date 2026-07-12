# SVMesh Production Quick Start

This guide will help you deploy SVMesh securely in production in under 30 minutes.

## Prerequisites

- Linux server (Ubuntu 20.04+ or similar)
- Docker and Docker Compose installed
- Domain name pointed to your server
- Root or sudo access

## Step 1: Initial Setup (5 minutes)

```bash
# Clone the repository
git clone <your-repo-url> /opt/svmesh
cd /opt/svmesh

# Create environment file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Minimum required configuration:**

```env
NGINX_PORT=8081
```

## Step 2: Choose Exposure Method (2 minutes)

For most deployments, expose the container directly on `NGINX_PORT`.

If you run an external reverse proxy (Traefik, Caddy, cloud load balancer), point it to:

- `http://<svmesh-host>:<NGINX_PORT>`

## Step 3: Build Application (5 minutes)

```bash
# Build Docker image
docker build -t svmesh-site:latest .

# Verify build completed
docker images | grep svmesh
```

## Step 4: Deploy (2 minutes)

```bash
# Start the site
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## Step 5: Verify Deployment (5 minutes)

```bash
# Test health endpoint
curl http://localhost:8081/health
# Expected: ok

# Test from external network
curl -I https://yourdomain.com
# Expected: 200 OK
```

### Verify Security Headers

Visit https://securityheaders.com/?q=yourdomain.com

Expected headers:

- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy
- ✅ Referrer-Policy

## Step 6: Add Content (3 minutes)

```bash
# Add your markdown files
cp your-content/*.md /opt/svmesh/content/pages/
cp your-updates/*.md /opt/svmesh/content/updates/

# Rebuild so static content indexes include new files
docker compose up -d --build
```

## Common Issues & Solutions

### 🔴 Port 80/443 already in use

```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting service
sudo systemctl stop apache2  # or nginx
sudo systemctl disable apache2
```

### 🔴 Container permission errors

```bash
# Fix ownership
sudo chown -R 1001:1001 /opt/svmesh/content/pages
sudo chown -R 1001:1001 /opt/svmesh/content/updates
```

### 🔴 Cannot reach application from your reverse proxy

```bash
# Verify nginx is accessible from proxy/server edge:
curl -I http://your-svmesh-server-ip:8081

# Check container logs
docker compose logs -f

# Verify firewall rules
sudo ufw status
sudo iptables -L -n | grep 8081
```

## Security Verification

Run these commands to verify security:

```bash
# 1. Check container is running as non-root
docker exec svmesh-web id
# Expected: uid=1001(appuser) gid=1001(appgroup)

# 2. Verify read-only filesystem
docker exec svmesh-web touch /usr/share/nginx/html/test.txt
# Expected: Permission denied or read-only filesystem error

# 3. Check security options
docker inspect svmesh-web | grep -A5 SecurityOpt
# Expected: no-new-privileges:true
```

## Monitoring Setup (Optional)

### Basic Monitoring

```bash
# Monitor container resources
docker stats

# Watch logs in real-time
docker compose logs -f --tail=50

# Check disk space
df -h
```

### Advanced Monitoring (Recommended)

- Set up uptime monitoring: UptimeRobot, Pingdom, or StatusCake
- Configure log aggregation: ELK stack, Loki, or CloudWatch
- Set up alerts: PagerDuty, OpsGenie, or email notifications

## Backup Strategy

```bash
# Backup content files
tar -czf svmesh-backup-$(date +%Y%m%d).tar.gz /opt/svmesh/content/pages /opt/svmesh/content/updates /opt/svmesh/.env

# Backup to remote location
rsync -avz /opt/svmesh/content/pages backup-server:/backups/svmesh/
rsync -avz /opt/svmesh/content/updates backup-server:/backups/svmesh/
```

## Updates & Maintenance

### Update Application

```bash
cd /opt/svmesh
git pull
docker build -t svmesh-site:latest .
docker compose up -d --build
```

### Update Dependencies

```bash
# Update base images
docker pull node:20-alpine
docker pull nginx:alpine

# Rebuild with updated images
docker build --no-cache -t svmesh-site:latest .
```

## Support

- 📖 Full documentation: [docs/README.md](docs/README.md)
- 🔒 Security guide: [docs/SECURITY.md](docs/SECURITY.md)
- ✅ Production checklist: [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)
- 🐛 Issues: Create a GitHub issue

## Next Steps

1. ✅ Complete [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)
2. 📊 Set up monitoring and alerting
3. 🔄 Schedule regular backups
4. 📱 Configure uptime monitoring
5. 🔐 Enable automatic security updates:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

---

**Deployment Time**: ~20 minutes  
**Security Level**: Production-ready ✅  
**Architecture**: Static site in nginx container 🔄

For detailed security hardening, review [docs/SECURITY.md](docs/SECURITY.md).
