# ai.ra.recipes (LibreChat + Code Interpreter)

## Rebuild & Restart

1. **Configure Environment**
   Ensure `.env` exists in the repository root and in `code-interpreter/.env`.

2. **Rebuild & Restart Code Interpreter**
   ```bash
   cd /home/sheetal/librechat-src/code-interpreter
   sudo docker compose down
   sudo docker compose build --no-cache sandbox-runner api service-worker
   sudo docker compose up -d
   ```

3. **Rebuild & Restart LibreChat**
   ```bash
   cd /home/sheetal/librechat-src
   sudo docker compose down
   sudo docker compose build --no-cache
   sudo docker compose up -d
   ```

4. **Verify Containers**
   ```bash
   sudo docker ps --format "table {{.Names}}\t{{.Status}}"
   ```
