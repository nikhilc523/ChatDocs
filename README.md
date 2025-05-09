## 📦 ChatDocs – Installation & Execution Guide

ChatDocs is a cloud-native AI web application built with **Next.js**, allowing users to chat with PDFs using OpenAI, Pinecone, AWS S3, and more.

---

### ✅ Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v18 or above)
* [npm](https://www.npmjs.com/)
* [Git](https://git-scm.com/)

---

### 🚀 Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/nikhilc523/ChatDocs
cd ChatDocs
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Create ****\`\`**** File**

Create a `.env` file at the root of the project with the following environment variables:

```
# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# PostgreSQL DB (NeonDB)
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# AWS S3 (File Storage)
NEXT_PUBLIC_S3_ACCESS_KEY_ID=...
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_S3_BUCKET_NAME=chatdocscloud

# Pinecone (Vector Database)
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_API_KEY=pcsk_...
PINECONE_PROJECT=project-id...
PINECONE_INDEX_NAME=chatdocs
EMBEDDING_DIM=1536

# OpenAI (Embeddings & NLP)
OPENAI_API_KEY=....

# Stripe (Payments)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...

# Base URL (for local development)
NEXT_BASE_URL=http://localhost:3000/
```

> 🔡 Important: Never commit .env to version control.

---

### 4. **Run the Application**

```bash
npm run dev
```

This will start the app at:

```
http://localhost:3000
```

---

### 📂 Key Notes

* You’ll need to ensure Pinecone index `chatdocs` exists before uploading PDFs.
* Make sure your AWS credentials have permission for the specified bucket.
* Stripe and Clerk keys should match your actual project settings in their respective dashboards.
* If you use webhooks (e.g., Stripe), use something like [`ngrok`](https://ngrok.com/) to test them locally.

---

## 🛠️ Environment Variables Overview for ChatDocs

Each section below explains a group of related `.env` variables used to configure your application.

---

### 🔐 **1. Clerk (Authentication)**

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

**Purpose:**

* Enables **user authentication and session management** using [Clerk](https://clerk.com/).

**Instructions:**

1. Sign up or log in at [https://clerk.com](https://clerk.com/).
2. Create a new Clerk application.
3. Go to **API Keys** in your Clerk dashboard:

   * Copy your **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   * Copy your **Secret Key** → `CLERK_SECRET_KEY`
4. Keep the sign-in/sign-up URLs as shown — these are your app's routes.

---

### 💄 **2. NeonDB (Database)**

```
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

**Purpose:**

* Connects your backend to a **PostgreSQL database hosted on Neon** (a serverless database).

**Instructions:**

1. Sign up or log in at [https://neon.tech](https://neon.tech/).
2. Create a new project and database.
3. Copy the **connection string** and paste it into `DATABASE_URL`.

---

### ☁️ **3. AWS S3 (PDF Storage)**

```
NEXT_PUBLIC_S3_ACCESS_KEY_ID=...
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_S3_BUCKET_NAME=chatdocscloud
```

**Purpose:**

* Stores uploaded PDF files in a secure, scalable **S3 bucket**.

**Instructions:**

1. Go to [AWS Console](https://aws.amazon.com/console/).
2. Create a new **S3 bucket** (e.g., `chatdocscloud`).
3. Go to **IAM > Users** → Create a user with **Programmatic Access**.
4. Assign **S3 full access** permissions.
5. Save the **Access Key ID** and **Secret Access Key** and paste them into your `.env`.
6. Use the bucket name in `NEXT_PUBLIC_S3_BUCKET_NAME`.

---

### 🔎 **4. Pinecone (Vector Search Engine)**

```
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_API_KEY=pcsk_...
PINECONE_PROJECT=project-id...
PINECONE_INDEX_NAME=chatdocs
EMBEDDING_DIM=1536
```

**Purpose:**

* Used for storing **semantic embeddings** (from PDF chunks) and performing **similarity search** during chat queries.

**Instructions:**

1. Sign up at [https://www.pinecone.io](https://www.pinecone.io/).
2. Create a new **Index** (name it `chatdocs`).
3. Choose an environment close to you (e.g., `us-east-1-aws`).
4. Copy:

   * **API Key** → `PINECONE_API_KEY`
   * **Project ID** → `PINECONE_PROJECT`
   * **Environment name** → `PINECONE_ENVIRONMENT`
5. Keep `EMBEDDING_DIM=1536` (this matches OpenAI’s embedding size).

---

### 🧠 **5. OpenAI (Embeddings and NLP)**

```
OPENAI_API_KEY=sk-...
```

**Purpose:**

* Generates **vector embeddings** (used in Pinecone) and **natural language answers** during chat interactions.

**Instructions:**

1. Sign up at [https://platform.openai.com](https://platform.openai.com/).
2. Add your **billing information** and buy credits.
3. Navigate to **API Keys**, and copy your key into `OPENAI_API_KEY`.

---

### 💳 **6. Stripe (Subscriptions and Payments)**

```
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_...
```

**Purpose:**

* Enables **subscription billing** for premium features using [Stripe](https://stripe.com/).

**Instructions:**

1. Sign up at [https://stripe.com](https://stripe.com/).
2. Go to **Developers > API Keys**:

   * Copy the **Secret Key** → `STRIPE_API_KEY`
3. Set up a **Webhook Endpoint** (e.g., `/api/stripe/webhook`):

   * Copy the **Signing Secret** → `STRIPE_WEBHOOK_SIGNING_SECRET`

---

### 🌐 **7. App Base URL (For Local Testing)**

```
NEXT_BASE_URL=http://localhost:3000/
```

**Purpose:**

* Used for building links in backend logic (e.g., email confirmations, redirects).

**Instructions:**

* Use `http://localhost:3000` for local development.
* Change it to your actual domain when deploying (e.g., `https://chatdocs.app`).

