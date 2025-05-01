import { Pinecone } from '@pinecone-database/pinecone';

/* ----- initialise once and reuse everywhere ----- */
export const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  // ↓ this line is ONLY for server-less; keep it out for pod-based
  controllerHostUrl: process.env.PINECONE_CONTROLLER_HOST_URL,
});

export const index = pc.index('chatdocs');   // ← exact name from console
