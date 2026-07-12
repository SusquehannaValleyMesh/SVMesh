# SVMesh

The upcoming website for the Susquehanna Valley Mesh, serving the centeral Pennsylvania region.

### Technology Stack

**Frontend:**

- React 19 with TypeScript
- Material-UI (MUI) for components and styling
- React Router for navigation
- Vite for build tooling and development
- React Markdown for content rendering

**Content Pipeline:**

- Build-time content sync from `content/pages/` and `content/updates/`
- Generated static indexes in `app/public/content/index/`
- Knowledgebase metadata parsed from markdown frontmatter

**Infrastructure:**

- Dockerized static site build and serve flow
- Nginx static hosting with SPA fallback
- Support for SSL/TLS termination behind external reverse proxies

## Building SVMesh

We use Docker to run the app stack, with a Docker Compose file provided. After cloning the repository, run `docker compose up -d --build` to run the site. By default, the site will be available on port 8081.

## Project Structure

```
svmesh/
├── app/                           # React frontend (Vite + MUI)
│   ├── src/
│   ├── scripts/sync-content.mjs   # Generates static content indexes and copies markdown
│   ├── public/
│   └── package.json
├── content/                       # Markdown content sources
│   ├── pages/
│   └── updates/
├── docs/                          # Operations and security docs
├── ops/                           # Deployment configs
│   └── nginx.static.conf
├── docker-compose.yml             # Default compose (production-like)
├── Dockerfile
├── QUICKSTART.md                  # Quick run instructions
└── README.md                      # This file
```

## Configuration

### Environment Variables

Create a `.env` file by copying `.env.example` and update it for your configuration:

```bash
# Domain Configuration
DOMAIN=your-domain.com

# Nginx Port
NGINX_PORT=8081

...
```

### Application Settings

Key configuration files:

- `app/vite.config.ts` - Frontend build configuration
- `app/scripts/sync-content.mjs` - Content sync and index generation
- `docker-compose.yml` - Container orchestration
- `ops/nginx.static.conf` - Static hosting nginx configuration

## Development

### Local Development Setup

1. **Install dependencies**

   ```bash
   # Frontend dependencies
   cd app
   npm install
   ```

2. **Run in development mode**

   ```bash
   # Frontend
   cd app
   npm run dev
   ```

3. **Build for production**

   ```bash
   # Build all containers
   docker compose build

   # Run production build locally
   docker compose up
   ```

## Monitoring and Maintenance

### Log Management

Logs are available through Docker Compose:

```bash
# View all logs
docker-compose logs

# Follow service logs
docker-compose logs -f svmesh-web
```

### Updates and Maintenance

```bash
# Update to latest version
git pull
docker compose build
docker compose up -d
```

## Documentation

Documentation is available in the `docs/` directory, covering how to best format Markdown pages to integrate seamlessly with the current rendering engine. If you are planning to contribute to page contents, please read and follow the guidelines.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Frontend powered by [React](https://reactjs.org/) and [Material-UI](https://mui.com/)
- Containerization with [Docker](https://www.docker.com/)
