import { index } from '../src/lib/pineconeClient.js';

async function main() {
  await index.namespace('smoke').upsert([
    { id: 'vec1', values: [0.1, 0.2], metadata: { tag: 'test' } },
  ]);

  const res = await index.namespace('smoke').query({
    topK: 1,
    vector: [0.1, 0.2],
    includeMetadata: true,
  });

  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
