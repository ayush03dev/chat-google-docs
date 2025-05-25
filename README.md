# Chat Google Docs

A **chat application** that allows users to ask queries based on the contents of a Google Doc using natural language. It combines **Retrieval-Augmented Generation (RAG)** with **Google OAuth** to provide personalized access to both public and private Google Docs.

It uses Google Docs as a content source, Vespa.ai for vector + keyword hybrid search, and DeepSeek AI as the LLM for generating responses.

## Features

* Chat-based interface for querying document content
* Authenticates users via **Google OAuth** to access private Google Docs
* Fetches content from public or private Google Docs
* Chunks the document into sections
* Embeds chunks using an embedding model
* Indexes them into **Vespa.ai**
* Performs hybrid search (BM25 + vector similarity)
* Uses **DeepSeek AI** to generate contextual and accurate responses from top-ranked results

## How It Works

1. User logs in using **Google OAuth**
2. The app fetches content from a public or private Google Doc (accessible to the logged-in user)
3. The document is chunked into manageable sections
4. Embeddings are generated for each chunk
5. Chunks are stored in a Vespa index
6. When the user sends a query:

   * A hybrid search is performed in Vespa (BM25 + vector similarity)
   * The top-k results are passed along with the query to DeepSeek AI
   * The model returns a final response, which is shown in the chat

---

## Setup Instructions

### 1. Clone the Repository

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.sample` to `.env.local`:

```bash
cp .env.sample .env.local
```

Then fill in the required keys

---

## Running Vespa Locally

### 4. Install Vespa CLI

Follow the official guide:
[https://docs.vespa.ai/en/vespa-cli.html](https://docs.vespa.ai/en/vespa-cli.html)

### 5. Start Vespa using Docker

```bash
docker compose up
```

Wait for Vespa to fully start up (may take a few minutes).

### 6. Set Vespa CLI Target to Local

```bash
vespa config set target local
```

### 7. Deploy Vespa App Schema

```bash
vespa deploy --target local src/vespa
```

---

## ▶️ Start the App

```bash
npm run dev
```

Once running, users can sign in with their Google account and start chatting with their own private or public Google Docs using natural language.
