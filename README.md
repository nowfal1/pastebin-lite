# Pastebin Lite

Pastebin Lite is a simple web application that allows users to create text pastes and share them using a unique URL. Each paste can optionally expire after a given time (TTL) or after a limited number of views.

## Running the Project Locally

1. Clone the repository:
git clone <your-repository-url>
cd pastebin-lite

2. Install dependencies:
npm install

3. Create a `.env.local` file in the project root and add:
KV_URL=redis://default:4gVkxDxTcYKAQKKIOjaOT2JFfkadtJ2P@redis-10681.c245.us-east-1-3.ec2.cloud.redislabs.com:10681

4. Start the development server:
npm run dev

5. Open the application in your browser:
http://localhost:3000

## Persistence Layer

This application uses Redis as its persistence layer. Redis is provided via Vercel KV and is used to store paste content, expiration time, and remaining view count. The data is persistent across requests and is not stored in memory.
