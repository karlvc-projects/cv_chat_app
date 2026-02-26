# CV Chat App

Minimal single-page React app that sends a message to an n8n webhook and displays the response.

## Project Structure

```
cv-chat-app/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .env.example
├── README.md
├── package.json
└── vite.config.js
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file and set webhook URL:
   ```bash
   cp .env.example .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Deploy on GCP VM (with existing n8n + Traefik)

Use this flow if n8n is already running on the same VM with Traefik exposing ports `80/443`.
This setup serves the app at `https://chatcv.duckdns.org` without `:3000`.

### 1. Prerequisites on VM

1. Docker + Docker Compose installed.
2. n8n stack already running with Traefik container.
3. DuckDNS record `chatcv.duckdns.org` pointing to this VM external IP.
4. GCP firewall allows TCP `80` and `443`.

### 2. Configure app env

Create `.env`:

```bash
nano .env
```

Set:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-domain/webhook/your-webhook-id
```

### 3. Configure `docker-compose.yml`

Use Traefik labels and join the same external network used by n8n Traefik:

```yaml
services:
  cv-chat-app:
    build:
      context: .
      args:
        VITE_N8N_WEBHOOK_URL: ${VITE_N8N_WEBHOOK_URL}
    env_file:
      - .env
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=n8n-compose_default"
      - "traefik.http.routers.chatcv.rule=Host(`chatcv.duckdns.org`)"
      - "traefik.http.routers.chatcv.entrypoints=web,websecure"
      - "traefik.http.routers.chatcv.tls=true"
      - "traefik.http.routers.chatcv.tls.certresolver=mytlschallenge"
      - "traefik.http.services.chatcv.loadbalancer.server.port=80"
    networks:
      - n8n_traefik_net

networks:
  n8n_traefik_net:
    external: true
    name: n8n-compose_default
```

Notes:
- `mytlschallenge` must match your Traefik cert resolver name.
- `n8n-compose_default` must match the Docker network where Traefik is attached.

### 4. Build and run

```bash
docker compose down
docker compose up -d --build
```

### 5. Verify

```bash
docker ps
docker logs n8n-compose-traefik-1 --tail 200
```

Open:

`https://chatcv.duckdns.org`
