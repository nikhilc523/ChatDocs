/* ───────────  src/lib/pinecone.ts  ─────────── */
/* eslint-disable no-console */
import { Pinecone, type PineconeRecord } from "@pinecone-database/pinecone";
import { PDFLoader }                      from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter,
         Document }                       from "@pinecone-database/doc-splitter";
import md5                from "md5";

import { downloadFromS3 } from "./s3-server";
import { getEmbeddings }  from "./embeddings";
import { convertToAscii } from "./utils";

/* ---------- config ---------- */

const INDEX_NAME    = process.env.PINECONE_INDEX_NAME ?? "chatdocs";  // name you created
const API_KEY       = process.env.PINECONE_API_KEY!;                  // required
const EMBEDDING_DIM = 1536;                                           // change if needed

/* ---------- client (pod-mode) ----------
   In pod mode only the apiKey is needed.                           */
const pc = new Pinecone({ apiKey: API_KEY });
const index = () => pc.index(INDEX_NAME);             // convenience wrapper

/* ---------- helpers ---------- */

export const truncateStringByBytes = (s: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(s).slice(0, bytes));
};

type PDFPage = { pageContent: string; metadata: { loc: { pageNumber: number } } };
type Meta    = { text: string; pageNumber: number };

/* ---------- pipeline ---------- */

async function splitPages(pages: PDFPage[]) {
  const splitter = new RecursiveCharacterTextSplitter();
  const docs: Document[] = [];

  for (const { pageContent, metadata } of pages) {
    const cleaned = pageContent.replace(/\n/g, " ").trim();
    if (!cleaned) continue;                               // skip blank pages

    const chunks = await splitter.splitDocuments([
      new Document({
        pageContent: cleaned,
        metadata   : {
          pageNumber: metadata.loc.pageNumber,
          text      : truncateStringByBytes(cleaned, 36_000),
        },
      }),
    ]);
    docs.push(...chunks);
  }

  if (!docs.length)
    throw new Error("📄 PDF had no extractable text (maybe a scanned-image PDF).");

  return docs;
}

/* ---------- Embed → PineconeRecord ---------- */
async function embedDocuments(docs: Document[]): Promise<PineconeRecord[]> {
  return Promise.all(
    docs.map(async (doc) => {
      /**              🔑  pick just the primitives we care about            **/
      const safeMeta = {
        pageNumber: (doc.metadata as any).pageNumber,   // number
        text      : (doc.metadata as any).text,         // string
      };

      // basic validation
      if (
        typeof safeMeta.pageNumber !== "number" ||
        typeof safeMeta.text       !== "string"
      ) {
        throw new Error("❌ Invalid metadata (pageNumber / text)");
      }

      const values = await getEmbeddings(doc.pageContent);

      return {
        id      : md5(doc.pageContent),
        values,
        metadata: safeMeta,          // <- only primitives now
      };
    })
  );
}

async function upsertToPinecone(fileKey: string, vecs: PineconeRecord[]) {
  if (!vecs.length) throw new Error("❌ No vectors to insert");

  const nsName = convertToAscii(fileKey);          // one namespace per file
  console.log(`🚀 Upserting ${vecs.length} vectors to index “${INDEX_NAME}” / ns “${nsName}”…`);

  await index().namespace(nsName).upsert(vecs);

  console.log("✅ Pinecone upsert complete");
}

/* ---------- exported entry point ---------- */

export async function loadS3IntoPinecone(fileKey: string) {
  console.log("📥 Downloading:", fileKey);
  const localPath = await downloadFromS3(fileKey);
  if (!localPath) throw new Error("❌ S3 download failed");

  console.log("📚 Parsing PDF:", localPath);
  const pages = (await new PDFLoader(localPath).load()) as PDFPage[];

  console.log("✂️ Splitting pages…");
  const docs = await splitPages(pages);

  console.log("🧠 Embedding chunks…");
  const vecs = await embedDocuments(docs);

  console.log("🚀 Sending to Pinecone…");
  await upsertToPinecone(fileKey, vecs);

  return docs[0];                    // return first doc for debugging / logging
}
