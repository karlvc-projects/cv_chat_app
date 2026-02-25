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

## Deploy on GCP VM (Docker)

1. Install Docker:
   ```bash
   sudo apt update
   sudo apt install -y docker.io
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

2. Install Docker Compose:
   ```bash
   sudo apt install -y docker-compose-plugin
   ```

3. Clone project:
   ```bash
   git clone <your-repo-url> cv-chat-app
   cd cv-chat-app
   ```

4. Add `.env` with webhook URL:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Set:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-domain/webhook/your-webhook-id
   ```

5. Build and run:
   ```bash
   docker compose up -d --build
   ```

6. Open port 3000 in GCP firewall:
- In Google Cloud Console, go to VPC Network > Firewall
- Create firewall rule allowing TCP:3000
- Apply it to your VM network/tag

Then open:

`http://<VM_EXTERNAL_IP>:3000`
