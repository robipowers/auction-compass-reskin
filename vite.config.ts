import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // OpenAI proxy plugin — handles /api/chat requests server-side
      {
        name: 'openai-proxy',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method not allowed');
              return;
            }

            let body = '';
            req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
            req.on('end', async () => {
              try {
                const { messages } = JSON.parse(body);
                
                const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                  },
                  body: JSON.stringify({
                    model: 'gpt-4o',
                    messages,
                    stream: true,
                    temperature: 0.7,
                    max_tokens: 2048,
                  }),
                });

                if (!openaiRes.ok) {
                  const error = await openaiRes.text();
                  console.error('OpenAI error:', openaiRes.status, error);
                  res.statusCode = openaiRes.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: `OpenAI API error: ${openaiRes.status}` }));
                  return;
                }

                // Stream the response
                res.setHeader('Content-Type', 'text/event-stream');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');

                const reader = openaiRes.body?.getReader();
                if (!reader) {
                  res.statusCode = 500;
                  res.end('No response body');
                  return;
                }

                const decoder = new TextDecoder();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value, { stream: true });
                  res.write(chunk);
                }
                res.end();
              } catch (err) {
                console.error('Proxy error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal proxy error' }));
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
