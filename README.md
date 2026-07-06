# 0706word-sanmingzhi

Word Dungeon vocabulary review game web deployment package.

## Structure

- `web/`: static HTML, CSS, JavaScript, and game assets
- `api/`: optional Vercel serverless APIs for cloud task/session storage
- `vercel.json`: Vercel routing configuration

## Notes

The app can run as a static web game. Cloud task/result sync requires Vercel KV or compatible Upstash Redis environment variables.
