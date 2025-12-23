import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Copy, Check, Github, FileText, Code2, Workflow } from 'lucide-react';
import { toast } from 'sonner';

// Import workflow images
import workflowIngestion from 'figma:asset/1dad7059420c1200f434ef05c34bb334b30cabd9.png';
import workflowChat from 'figma:asset/f69fa785f0984779afcf647e0664899405374bcc.png';
import liveMatchConcepts from 'figma:asset/3ecaddebe46e909d183a56db9afa1a1dbe33ff00.png';
import techStackWorkflow from 'figma:asset/7b8ec670f643305d755f75159ea0e007717528a6.png';

// Mock project data
const projectsData = {
  'rag-ai-system': {
    title: 'Knowledge: RAG AI system',
    overview: '**Knowledge** is an AI-powered information retrieval system designed to store vectorised long-form text and surface relevant insights through chat interface, via high-precision semantic search.\n\nThe system uses a Retrieval-Augmented Generation (RAG) architecture to connect ideas across sources, domains and concepts.\n\nResponses are grounded in a controlled pair of relational vector databases, prioritising retrieval quality, traceability, and observability over latency and generative fluency.',
    skills: 'AI system design · Retrieval-Augmented Generation (RAG) · data transformation (Notion → Supabase) · vectorization/embeddings · SQL joins · workflow automation (n8n) · prompt & guardrail design · evaluation design · observability/debugging · model selection',
    githubUrl: 'https://github.com/yourusername/knowledge-rag',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMHN5c3RlbSUyMGRpYWdyYW18ZW58MXx8fHwxNzM0NTQwNzU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    n8nJson: `{
  "name": "knowledge-RAG Workflow",
  "nodes": [
    {
      "parameters": {
        "authentication": "oAuth2",
        "resource": "database",
        "operation": "getAll",
        "databaseId": "{{ $json.sourcesDbId }}",
        "returnAll": true,
        "options": {}
      },
      "name": "Notion - Get Sources",
      "type": "n8n-nodes-base.notion",
      "typeVersion": 2,
      "position": [250, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "resource": "database",
        "operation": "getAll",
        "databaseId": "{{ $json.excerptsDbId }}",
        "returnAll": true,
        "options": {}
      },
      "name": "Notion - Get Excerpts",
      "type": "n8n-nodes-base.notion",
      "typeVersion": 2,
      "position": [250, 500]
    },
    {
      "parameters": {
        "jsCode": "// Normalize and combine excerpt with source metadata\\nconst excerpts = $input.all();\\nconst output = [];\\n\\nfor (const excerpt of excerpts) {\\n  const sourceId = excerpt.json.sourceRelation?.[0]?.id;\\n  \\n  if (!sourceId) {\\n    continue; // Skip excerpts without valid source\\n  }\\n  \\n  output.push({\\n    json: {\\n      excerptId: excerpt.json.id,\\n      excerptText: excerpt.json.passage,\\n      excerptNotes: excerpt.json.notes,\\n      sourceId: sourceId,\\n      timestamp: new Date().toISOString()\\n    }\\n  });\\n}\\n\\nreturn output;"
      },
      "name": "Normalize Excerpt Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [450, 500]
    },
    {
      "parameters": {
        "model": "text-embedding-3-small",
        "options": {}
      },
      "name": "Generate Embeddings",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [650, 500]
    },
    {
      "parameters": {
        "operation": "insert",
        "table": "excerpts",
        "columns": "excerpt_id, excerpt_text, excerpt_notes, source_id, embedding, created_at",
        "options": {}
      },
      "name": "Supabase - Insert Excerpts",
      "type": "n8n-nodes-base.supabase",
      "typeVersion": 1,
      "position": [850, 500]
    }
  ],
  "connections": {
    "Notion - Get Excerpts": {
      "main": [[{
        "node": "Normalize Excerpt Data",
        "type": "main",
        "index": 0
      }]]
    },
    "Normalize Excerpt Data": {
      "main": [[{
        "node": "Generate Embeddings",
        "type": "main",
        "index": 0
      }]]
    },
    "Generate Embeddings": {
      "main": [[{
        "node": "Supabase - Insert Excerpts",
        "type": "main",
        "index": 0
      }]]
    }
  }
}`,
    prd: `# 1) User Need / Context

Users capture insights and information across long-form sources (books, articles, podcasts, videos) but struggle to retrieve them later in a meaningful way. Over time, previously captured knowledge becomes difficult to reference, particularly when connections are conceptual or cross-domain.

Traditional keyword search is insufficient for this use case: it relies on exact phrasing, fails to surface semantically related content, and does not support conceptual linking across topics or disciplines.

# 2) Why Retrieval-Augmented Generation (RAG)

The system is designed around **Retrieval-Augmented Generation (RAG)** to ensure responses are grounded in a controlled knowledge base rather than relying on the language model's latent training data.

RAG was selected for three primary reasons:

1. **Grounded responses**  
   All outputs should be traceable to stored sources and excerpts, establishing a clear source of truth for what the system "knows."

2. **Semantic retrieval over unstructured content**  
   Vector-based retrieval enables concept-level search across long-form text, outperforming keyword or API-based retrieval for exploratory and cross-domain queries.

3. **Separation of concerns**  
   Retrieval quality, data structure, and provenance are handled by the system design, while the language model is used strictly for synthesis and explanation.

Alternative approaches such as direct API access to a note-taking system (e.g. via MCP) were considered. While suitable for structured lookups or live data access, they do not provide the same level of semantic indexing, retrieval precision, or deterministic observability required for this use case.

**Terminology note:** This project implements a *RAG pipeline / RAG system*, not a "RAG model." The language model is a component, not the system itself.

# 3) Goals

The system is designed to meet the following goals:

1. **High-precision semantic retrieval**  
   Retrieve the most relevant passages for a query based on meaning, not keywords, prioritising precision over recall.

2. **Deterministic ingestion and retrieval**  
   Re-running ingestion or retrieval workflows should not introduce silent drift, duplication, or ambiguity in system state.

3. **Traceable answers with source grounding**  
   All generated responses must be attributable to specific stored excerpts and their parent sources.

4. **Observable system behaviour**  
   It must be possible to inspect what data was ingested, what was retrieved, and why a given answer was produced.

# 4) System Overview

## High-level architecture

- **Authoring layer:** Notion databases used to capture sources and excerpts  
- **Indexing layer:** Supabase vector database for semantic retrieval  
- **Orchestration:** n8n workflows for ingestion, embedding, and chat  
- **Interface:** Chat-based entry point for querying the knowledge base (frontend TBD)

# Workflows

## Workflow 1: \`knowledge-RAG\` (Ingestion & Vectorisation)

1. Fetch selected fields from Notion Sources and Excerpts databases  
2. Normalize and combine content with required metadata  
3. Validate relational integrity between excerpts and sources  
4. Generate embeddings for each excerpt  
5. Write rows and vectors to Supabase  

## Workflow 2: \`knowledge-chat\` (Query & Synthesis)

1. Receive a user query  
2. Embed the query  
3. Retrieve top-K relevant excerpts from Supabase  
4. Join excerpts with parent source metadata  
5. Generate a grounded response using retrieved context  

# 5) Data Model

> **Note:** Sample rows for each database will be added once provided.

## Notion — Sources

Represents primary materials (books, articles, podcasts, videos).

Key fields:
- title  
- author / creator  
- source type  
- year (where applicable)  
- summary  
- reflections  
- tags / topics  

## Notion — Excerpts

Represents the atomic retrieval unit.

Key fields:
- quoted passage  
- reflective notes  
- relation to parent source (required)  

Excerpts are the **unit of retrieval**; sources provide provenance and context.

# 6) Vector Database Design

Each excerpt is stored in Supabase with:

- embedding vector (semantic index)  
- excerpt text (retrieval content)  
- stable identifiers  
- metadata (author, title, source type, etc.)  
- reference to parent source  

# Design rationale

- **Vector embeddings** enable semantic similarity search over meaning rather than phrasing.  
- **Excerpt-level indexing** improves retrieval precision and context efficiency.  
- **Metadata fields** support filtering, disambiguation, citation, and debugging.  
- **Relational joins** reconstruct full provenance at query time.  

The language model does not access the database directly; it only receives retrieved excerpts and associated metadata.

# 7) Model Usage

## Embeddings

An embeddings model is used to convert excerpts and queries into vectors for similarity search.

Rationale:
- Optimised for semantic representation  
- Cost-effective for batch processing  
- Produces a stable retrieval space  

## Chat / Synthesis

A general-purpose chat model is used to synthesize responses from retrieved context.

Rationale:
- Strong multi-document reasoning  
- Reliable instruction following  
- Capable of structured, grounded responses  

*(Exact model names are implementation details and intentionally abstracted here.)*

# 8) Retrieval Strategy & Constraints

## Retrieval strategy

1. Embed user query  
2. Perform vector similarity search over excerpt embeddings  
3. Retrieve top-K excerpts above a relevance threshold  
4. Join with parent source metadata  
5. Pass retrieved context to the chat model with grounding instructions  

## Constraints

- Limit K to prevent context dilution  
- Exclude excerpts without valid source relationships  
- Prefer fewer, higher-signal passages over broad recall  
- Do not generate answers when retrieval evidence is insufficient  

These constraints exist to prioritise answer quality and trustworthiness over fluency.

## 9) Model Behaviour & Guardrails

The model is constrained to:

- Use only retrieved excerpts as evidence  
- Cite sources for substantive claims  
- Explicitly acknowledge insufficient information  
- Avoid inventing sources, quotations, or provenance  

The model is treated as a **synthesis component**, not a source of truth.

# 10) Failure Modes & Mitigations

## Broken joins (orphan excerpts)
- **Risk:** Ungrounded or unverifiable answers  
- **Mitigation:** Enforce required source relationships; exclude invalid rows from retrieval  

## Duplicate rows from ingestion
- **Risk:** Noisy retrieval and silent drift  
- **Mitigation:** Deterministic clear-and-rebuild ingestion for MVP  

## Stale embeddings
- **Risk:** Retrieval mismatch after content edits  
- **Mitigation:** Track update timestamps and re-embed modified rows  

## Over-retrieval
- **Risk:** Generic or averaged responses  
- **Mitigation:** Similarity thresholds and conservative top-K values  

# 11) Observability & Evaluation

## Observability requirements

For ingestion:
- run timestamp  
- row counts  
- join coverage (% excerpts with valid sources)  
- embedding model/version  

For chat:
- query text  
- retrieved excerpt IDs and similarity scores  
- applied filters  
- joined source IDs  
- generated response and citations  

## Evaluation approach

- Curated query set covering recall, synthesis, and cross-domain linking  
- Manual relevance scoring of retrieved excerpts  
- Citation coverage checks  
- Consistency checks across repeated runs of identical queries  

Observability is treated as a first-class product requirement.

# 13) Open Questions & Trade-offs

## Ingestion strategy

The current approach clears and rebuilds the vector database on each run to guarantee determinism and avoid silent duplication. This is acceptable at MVP scale.

**Future approach:**
- Use stable IDs (e.g. Notion page IDs)  
- Compare Notion \`last_edited_time\` with stored vectorisation timestamps  
- Insert new rows, update modified rows, delete removed rows  

## Additional open considerations

- Hybrid retrieval (vector + keyword)  
- Re-ranking strategies  
- Versioning of knowledge snapshots  
- Frontend affordances for citation inspection  
- Long-term scalability limits`
  },
  'e-commerce-platform': {
    title: 'Portfolio build: this website',
    overview: `This portfolio was built as a **real product with AI-first thinking:** a space to clearly communicate my work, thinking, and approach to building.

Setup offers full control across **design → development → deployment**. Allowing rapid exploration early on, while still converging on a maintainable, production-quality codebase.`,
    imageUrl: 'figma:asset/7b8ec670f643305d755f75159ea0e007717528a6.png',
    githubUrl: 'https://github.com/alexmcgovern14/Portfoliowebsite',
    prd: `This portfolio was built as a **real product with AI-first thinking:** a space to clearly communicate my work, thinking, and approach to building.

Setup offers full control across **design → development → deployment**. Allowing rapid exploration early on, while still converging on a maintainable, production-quality codebase.`,
    challenge: `# Sketching

Low-fidelity ideation of overall structure, hierarchy, and narrative.  
A moodboard was used to collect inspiration and establish early direction.


# Figma ↔ Figma Make loop

**Figma**  
High-fidelity design exploration and colour decisions, used to define the visual language and key pages.

**Figma Make**  
Prototyping tool used for rapid iteration, site scaffolding and testing user journeys.

**Loop**  
Specific components were designed in Figma and then fed back into Figma Make, combining the specificity and detail of designing in Figma with the speed and scale of prototyping.

# GitHub

Source of truth for the codebase.  
Once the product stabilised, the repository became the authoritative version of the site, with all changes flowing through GitHub.


# Cursor

Codebase pulled into Cursor to refactor generated output into production-quality code.  
Used to improve structure and maintainability, and to support ongoing development before pushing changes back to GitHub.


# Vercel

Hosting and deployment.  
The site is continuously deployed from the main branch, keeping it live and easy to evolve as the codebase changes.`
  },
  'live-match-summary': {
    title: 'Live match summary',
    overview: 'Production GenAI feature that gives LiveScore users a live update on the state of play of a game, bringing them up to speed in a few sentences.\n\nA USP for LiveScore, built before any competitors, it offers a new solution to the oldest user need — _what\'s happening in this match?_ — unlocked by the possibilities of Generative AI.\n\nIt adds significant value at the *most important time for engagement* (live match) on *second most viewed page*, for *all users.*\n\nThe solution leverages natural language capabilities of GenAI to convert structured match data into a short narrative, telling the user what they need to know at speed.\n\n# Ownership\nOriginated concept, proved technical opportunity through prototyping and drove feature through to production:\n- Defined user value, where feature should live in experience and what good looks like\n- Prototyped to validate opportunity and explore output formats & discover potential limitations\n- Set system constraints: grounded in reliable data, speed, no speculation or reliance on historical knowledge, consistency across updates\n- Owned decisions on data inputs, guardrails, iteration through prompt engineering and evals loop',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNofGVufDF8fHx8MTczNDU0MDc1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    conceptImage: liveMatchConcepts,
    prd: `# Live match summary

# Overview

Production GenAI feature that gives LiveScore users a live update on the state of play of a game, bringing them up to speed in a few sentences.

A USP for LiveScore, built before any competitors, it offers a new solution to the oldest user need — _what's happening in this match?_ — unlocked by the possibilities of Generative AI. 

It adds significant value at the *most important time for engagement* (live match) on *second most viewed page*, for *all users.*

The solution leverages natural language capabilities of GenAI to convert structured match data into a short narrative, telling the user what they need to know at speed.

[insert images of feature]

# Ownership
Originated concept, proved technical opportunity through prototyping and drove feature through to production:
- Defined user value, where feature should live in experience and what good looks like
- Prototyped to validate opportunity and explore output formats & discover potential limitations
- Set system constraints: grounded in reliable data, speed, no speculation or reliance on historical knowledge, consistency across updates
- Owned decisions on data inputs, guardrails, iteration through prompt engineering and evals loop

# User needs and opportunity

Live sports has an old, universal user need: quickly understand the match narrative right now. Pure data lacks narrative, and traditional commentary feeds lack detail.

Example scenarios:
- User can't watch the game, wants to quickly get up to speed on what's happening
- User thinking about switching on the TV to watch, wants to know if worth watching or not
* User interested in placing in-play bet, wants to understand momentum

# Constraints 
- **Speed:** LiveScore is all about pace, generation must be fast enough to stay in sync with live play. Generation time optimised to average of 5 seconds, with short wait periods after key updates (goals/red cards) handled gracefully with transitions to immediately remove out-of-date content.
- **No hallucinations or speculation:** All outputs must be strictly grounded in provided data, with model prioritising recent key events and never stepping into assumptions or extrapolating data into speculation.
- **One of the fans:** Tone of voice, British English and a _feeling_ of understanding the match through terminology and accurate narrative. 

# Evaluations

Evals ran through OpenAI platform, provided 0-10 guided scores and explanations, focused on:
- **Factual accuracy** against input data
- **Recency**, scored on emphasising recent momentum and events
- **Structure and formatting**, including word counts and bolding rules
- **Clarity and conciseness**, easily scannable with no fluff or repetition
- **Tone** scored against brand guidelines and British football fan voice 

# Challenges

Iterating through guardrails, prompt engineering and evaluation loops raised a number of issues:

## Hallucinations and misplaced confidence 
Live match data can be out of sync incomplete, delayed or corrected; some signals are ambiguous. 

Passing everything to model and asking it to "summarise the match" produces outputs that _sound_ confident but are laced with inaccuracies and focus on the wrong things.

Better reasoning by the model was not the right solution — stricter control was. Pre-processing data and constraining model's scope through tight prompt engineering produces more determinism in an inherently probabilistic system.

## Latency as a constraint
In a product optimised for speed, an update that arrives 30 seconds after a goal feels broken, even if it's accurate.

Improving quality through reasoning, additional generation steps or excessive safety checks always increases latency.

Generation flow intentionally kept minimal, using fast models and tightly contained context. UI was designed to gracefully handle out-of-date summaries after major updates (eg. a goal) by transitioning into a simple celebratory goal holding message until new output is available. 

These decisions kept synthesis of match data and generation to an average of 5 seconds. 
_____

Reliability in GenAI systems comes from system design and constraints, not from picking a "smarter" model.`
  },
  'lineup-changes': {
    title: 'Line-up insights',
    overview: `LiveScore feature in production that **uses AI to generate insights** about what each team's manager has changed in team selection since last match — the key information users are looking for at a *peak-traffic moment*. 

The system compares both teams' newly confirmed line-ups against their previous match, and generates a **grounded summary** of what changed.

Five rounds of unmoderated user testing before development across a number of UI placements all showed extremely positive signal for the feature:  
> "I think this is really cool! I've never seen any site offer anything like this"

User sentiment tracked in production through a thumbs up/down poll, **consistently scoring above the 80% target.**

[insert image of feature here, use placeholder for now]`,
    imageUrl: 'https://images.unsplash.com/photo-1662541352052-391abb1837e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGxpbmV1cCUyMHRhY3RpY3N8ZW58MXx8fHwxNzY2NDM5MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    keyInfo: `Surfaced on the line-ups page for each match and triggered when line-ups are confirmed, usually *1–1.5 hours before kick-off*. This is one of LiveScore's highest traffic moments. **Speed is critical** as users repeatedly refresh in anticipation of news. 

# Responsibility
Created the concept and owned the feature end-to-end: problem framing, input/output contract, prompt engineering, guardrails, eval criteria, iteration.

# Definition of changes
- Players in/out of the **starting eleven**
- *Positional switches*, such as right-back moving into midfield
- Formation shifts
- New players on the bench who were not in the squad 
- Injuries and suspensions

# Output shape
Example:
- Team A make **3 changes** from last match
- Player A, Player B replace Player C and Player D in midfield
- Possible formation change from *4-3-3* to *4-2-3-1*

# System design
- Normalise inputs *(starter vs bench separated; identity matching handled upstream)*
- Compute **deterministic diffs** *(ins/outs/retained + position/formation changes where reliable)*
- LLM generates narrative only from the diff object *(closed-world)*`,
    challenge: `"Look at two lists and describe the differences" seemed like an easy task, but gave easily the *worst hallucinations* we've seen in building AI workflows. We found models at the time (GPT-4-class models) could not reliably handle both calculating the differences and describing changes with narrative, whilst needing to handle identity resolution and entity state changes — including positional changes, bench vs. starting, dropped from squad vs. brand new players, similar names etc. 

LLMs don't maintain persistent entities with identities over time in a 100% robust way like traditional programming/databases. Model training also encourages plausible, confident answers, not cautious uncertainty. Therefore when losing track of entities, LLMs will tend to produce a plausible-sounding answer: a hallucination. And so players who swapped positions were treated as new, fictitious players were invented, and *Sorba Thomas became the enemy*. 

No amount of prompt engineering resolved the issues and we only got to a reliable output passing all evals — and later user satisfaction scores — through **pre-processing the data to provide calculated diffs** and letting the LLM focus purely on the narrative rather than two tasks. A step we resisted for a while, believing it should be easily handled.

In revisiting the original task ~six months later with newer models incl. GPT-5.1, Gemini 3, and Mistral 3, there have been significant improvements in maintaining entity state over longer contexts, all did a far better job. Over more complex and lengthy narratives *object permanence* can still break down; going beyond 22 names in a matchday squad, models can lose track of entities and produce contradictions, but it takes a lot more complexity than just 6 months ago.

# Lessons
1. Models are improving rapidly in many ways, not just the headline-grabbing ones; this topic isn't included in most major benchmarking.  
2. **System design** is (as always) key in handling limitations: beyond the normal constraints through prompt engineering, reconsider data input options; watch out for overconfidence and prompt model to explain reasoning to validate methodology and output; instruct not to state a plausible answer if uncertain; avoid assumptions where data is insufficient; run evals at scale and implement output guardrails. Treat the system as a whole — the leverage point may not be where you're used to focusing.`,
    prd: `# Line-up insights

# Overview

LiveScore feature in production that **uses AI to generate insights** about what each team's manager has changed in team selection since last match — the key information users are looking for at a *peak-traffic moment*. 

The system compares both teams' newly confirmed line-ups against their previous match, and generates a **grounded summary** of what changed.

Five rounds of unmoderated user testing before development across a number of UI placements all showed extremely positive signal for the feature:  
> "I think this is really cool! I've never seen any site offer anything like this"

User sentiment tracked in production through a thumbs up/down poll, **consistently scoring above the 80% target.**

[insert image of feature here, use placeholder for now]

# Key info

Surfaced on the line-ups page for each match and triggered when line-ups are confirmed, usually *1–1.5 hours before kick-off*. This is one of LiveScore's highest traffic moments. **Speed is critical** as users repeatedly refresh in anticipation of news. 

## Responsibility
Created the concept and owned the feature end-to-end: problem framing, input/output contract, prompt engineering, guardrails, eval criteria, iteration.

## Definition of changes
- Players in/out of the **starting eleven**
- *Positional switches*, such as right-back moving into midfield
- Formation shifts
- New players on the bench who were not in the squad 
- Injuries and suspensions

## Output shape
Example:
- Team A make **3 changes** from last match
- Player A, Player B replace Player C and Player D in midfield
- Possible formation change from *4-3-3* to *4-2-3-1*

## System design
- Normalise inputs *(starter vs bench separated; identity matching handled upstream)*
- Compute **deterministic diffs** *(ins/outs/retained + position/formation changes where reliable)*
- LLM generates narrative only from the diff object *(closed-world)*

# Challenge

"Look at two lists and describe the differences" seemed like an easy task, but gave easily the *worst hallucinations* we've seen in building AI workflows. We found models at the time (GPT-4-class models) could not reliably handle both calculating the differences and describing changes with narrative, whilst needing to handle identity resolution and entity state changes — including positional changes, bench vs. starting, dropped from squad vs. brand new players, similar names etc. 

LLMs don't maintain persistent entities with identities over time in a 100% robust way like traditional programming/databases. Model training also encourages plausible, confident answers, not cautious uncertainty. Therefore when losing track of entities, LLMs will tend to produce a plausible-sounding answer: a hallucination. And so players who swapped positions were treated as new, fictitious players were invented, and *Sorba Thomas became the enemy*. 

No amount of prompt engineering resolved the issues and we only got to a reliable output passing all evals — and later user satisfaction scores — through **pre-processing the data to provide calculated diffs** and letting the LLM focus purely on the narrative rather than two tasks. A step we resisted for a while, believing it should be easily handled.

In revisiting the original task ~six months later with newer models incl. GPT-5.1, Gemini 3, and Mistral 3, there have been significant improvements in maintaining entity state over longer contexts, all did a far better job. Over more complex and lengthy narratives *object permanence* can still break down; going beyond 22 names in a matchday squad, models can lose track of entities and produce contradictions, but it takes a lot more complexity than just 6 months ago.

## Lessons
1. Models are improving rapidly in many ways, not just the headline-grabbing ones; this topic isn't included in most major benchmarking.  
2. **System design** is (as always) key in handling limitations: beyond the normal constraints through prompt engineering, reconsider data input options; watch out for overconfidence and prompt model to explain reasoning to validate methodology and output; instruct not to state a plausible answer if uncertain; avoid assumptions where data is insufficient; run evals at scale and implement output guardrails. Treat the system as a whole — the leverage point may not be where you're used to focusing.`
  },
  'spotify-recommendation-engine': {
    title: 'Spotify recommended artists playlist generator',
    overview: 'Solving my own need for better recommendations on Spotify',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwbXVzaWN8ZW58MXx8fHwxNzM0NTQwNzU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    githubUrl: 'https://github.com/alexmcgovern14/spotify-recommended-artists-playlist-generator',
    prd: `# Vision

Enable Spotify listeners to discover new music by automatically generating a playlist of recommended artists similar to the ones they already love — delivered directly into the user's Spotify library.

# Problem statement

Spotify users often enjoy discovering new music, but existing recommendation features like **Discover Weekly** and **Daily Mix** — despite being widely used — also attract criticism for becoming repetitive, lacking variety, or failing to introduce meaningful new music that fits a user's nuanced tastes. Users report that recommendations feel increasingly stale.

# Scope & Overview

This product **only includes backend functionality** — it interacts with two APIs to generate playlists:
- **Spotify API:** for reading user top artists and creating playlists.  
- **ListenBrainz (via MusicBrainz):** for finding similar artists not already on the user's top list.

The service runs as a backend process that:

1. Authenticates the user via Spotify.
2. Fetches the user's top artists.
3. Converts those artists into MusicBrainz IDs.
4. Queries ListenBrainz for similar artists.
5. Filters out artists the user already listens to.
6. Picks a representative track for each recommended artist.
7. Creates and saves a Spotify playlist in the user's library.

The output is a playlist titled  *"Recommended Artists 🎧"* that appears in the user's Spotify app.

# Key Features

### **Spotify OAuth integration**

- Secure login and permission request to read top artists and manage playlists.
- Minimal scopes to protect user privacy: \`user-top-read\`, \`playlist-modify-public\`, \`playlist-modify-private\`.

**Success criteria:**  
Users can authenticate once and playlists are generated without further user input.

---

### **Top artists fetch**

- Retrieve the user's top artists (configurable time range: short, medium, long term).
- Defaults to the top 20–50 artists.

**Success criteria:**  
Top artists list accurately reflects recent listening behaviour.

---

### **Similar artists lookup**

- Use **ListenBrainz API/MusicBrainz** to find similar artists for each top artist.
- Allow configuration of similarity strictness (e.g., "close", "medium", "exploratory").

**Success criteria:**  
Generated artist list contains artists not already in the user's listening history.

---

### **Playlist creation**

- For each recommended artist, fetch a *representative top track*.
- Create a playlist in the authenticated user's Spotify library automatically.

**Success criteria:**  
Playlist is visible in the Spotify app and tracks are playable immediately.

---


## **Roadmap**

- Add **genre or mood filtering** (e.g., only southern soul, only high-energy tracks).  
- Expose a simple **API endpoint** to trigger playlist generation programmatically.  
- Build a lightweight dashboard for configuring preferences (e.g., similarity strength, track popularity filters).
- Support **recurring playlist refreshes** (e.g., weekly updates)?`
  },
};

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<'text' | 'markdown'>('text');
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedImage, setExpandedImage] = useState(false);

  const project = slug ? projectsData[slug as keyof typeof projectsData] : null;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll spy for active section and header collapse
  useEffect(() => {
    const handleScroll = () => {
      // Header collapse logic - collapse when user scrolls down even slightly
      setIsScrolled(window.scrollY > 20);
      
      // Scroll spy logic
      const sections = ['overview', 'skills', 'workflows', 'user-needs', 'key-info', 'requirements', 'output-challenges', 'lineup-challenge', 'tech-stack'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC key to close expanded image
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedImage) {
        setExpandedImage(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [expandedImage]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!project) {
        toast.error('No project data available');
        return;
      }

      if (!project.prd) {
        toast.error('No PRD data available');
        return;
      }

      const textToCopy = project.prd;

      // Try modern Clipboard API first, fallback to legacy method
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch (clipboardErr) {
        // Fallback method for when Clipboard API is blocked
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (execErr) {
          textArea.remove();
          throw execErr;
        }
      }

      setCopied(true);
      toast.success('PRD copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error(`Failed to copy: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCopyJsonToClipboard = async () => {
    if (project && 'n8nJson' in project) {
      try {
        const textToCopy = project.n8nJson;

        // Try modern Clipboard API first, fallback to legacy method
        try {
          await navigator.clipboard.writeText(textToCopy);
        } catch (clipboardErr) {
          // Fallback method for when Clipboard API is blocked
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            textArea.remove();
          } catch (execErr) {
            textArea.remove();
            throw execErr;
          }
        }

        setCopiedJson(true);
        toast.success('n8n JSON copied to clipboard!');
        setTimeout(() => setCopiedJson(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy n8n JSON.');
      }
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f0eae1] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-['Instrument_Serif:Regular',sans-serif] text-4xl text-[#5a5452] mb-4">
            Project Not Found
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#5a5452] hover:text-[#00a1ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2628]">
      {/* Integrated Header Section */}
      <header className={`sticky top-0 z-50 bg-[#2a2628]/95 backdrop-blur-sm transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`} style={{ borderBottom: '1px solid rgba(108, 105, 106, 0.3)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Navigation */}
          <div className="py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#b8b8b8] hover:text-[#00a1ff] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </Link>
          </div>

          {/* Title and Metadata - Collapses on scroll */}
          <div 
            className={`transition-all duration-500 ease-in-out ${
              isScrolled 
                ? 'h-0 opacity-0' 
                : 'h-auto opacity-100 pb-6'
            }`}
            style={{
              overflow: 'hidden',
            }}
          >
            <h1 className="font-['Instrument_Serif:Regular',sans-serif] text-5xl text-[rgb(255,255,255)] mb-4 leading-tight">
              {project.title}
            </h1>
            {/* Subheading for rag-ai-system */}
            {slug === 'rag-ai-system' && (
              <p className="text-[#d4d4d4] text-xl mb-6 leading-relaxed">
                LLM semantic search through vectorised data
              </p>
            )}
            {/* Subheading for live-match-summary */}
            {slug === 'live-match-summary' && (
              <p className="text-[#d4d4d4] text-xl mb-6 leading-relaxed">
                Case study in building AI features: data-led live updates for football matches
              </p>
            )}
            {/* Subheading for lineup-changes */}
            {slug === 'lineup-changes' && (
              <p className="text-[#d4d4d4] text-xl mb-6 leading-relaxed">
                Case study in building with LLMs, model limitations and building effective systems.
              </p>
            )}
            {/* Subheading for e-commerce-platform (This website) */}
            {slug === 'e-commerce-platform' && (
              <p className="text-[#d4d4d4] text-xl mb-6 leading-relaxed">
                Full-stack design, development and deployment
              </p>
            )}
            {/* Subheading for spotify-recommendation-engine */}
            {slug === 'spotify-recommendation-engine' && (
              <p className="text-[#d4d4d4] text-xl mb-6 leading-relaxed">
                Solving my own need for better recommendations on Spotify
              </p>
            )}
            {/* Single pill for LiveScore features or Personal project for others and GitHub button */}
            <div className="flex items-center gap-4">
              <div 
                className="backdrop-blur-[2px] rounded-[100px] inline-block shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.6)'
                }}
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="content-stretch flex items-center justify-center px-[12px] py-[8px] relative">
                    <p className="font-['DM_Mono:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
                      {(slug === 'live-match-summary' || slug === 'lineup-changes') ? 'LiveScore feature' : 'Personal project'}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-[-0.25px] pointer-events-none shadow-[inset_0px_-4px_4px_0px_rgba(0,0,0,0.25),inset_0px_4px_4px_0px_rgba(255,255,255,0.1)] rounded-[100px]" />
              </div>
              
              {project && 'githubUrl' in project && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-black hover:opacity-90 transition-opacity px-4 py-2 rounded-lg font-medium text-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>View on GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div 
                className="rounded-2xl p-6 shadow-xl border-2 border-white/30"
                style={{
                  background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                }}
              >
                <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-lg text-white mb-4">
                  Contents
                </h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => scrollToSection('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === 'overview'
                        ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                  >
                    Overview
                  </button>
                  {project && 'skills' in project && (
                    <button
                      onClick={() => scrollToSection('skills')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'skills'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      Skills used
                    </button>
                  )}
                  {slug === 'rag-ai-system' && (
                    <button
                      onClick={() => scrollToSection('workflows')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'workflows'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      Workflows
                    </button>
                  )}
                  {slug === 'live-match-summary' && (
                    <button
                      onClick={() => scrollToSection('user-needs')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'user-needs'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      User need
                    </button>
                  )}
                  {slug === 'lineup-changes' && (
                    <button
                      onClick={() => scrollToSection('key-info')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'key-info'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      Key info
                    </button>
                  )}
                  {slug === 'live-match-summary' && (
                    <button
                      onClick={() => scrollToSection('output-challenges')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'output-challenges'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      Challenges
                    </button>
                  )}
                  {slug === 'lineup-changes' && (
                    <button
                      onClick={() => scrollToSection('lineup-challenge')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'lineup-challenge'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      Challenge
                    </button>
                  )}
                  {slug === 'e-commerce-platform' && (
                    <button
                      onClick={() => scrollToSection('tech-stack')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'tech-stack'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      Tech Stack
                    </button>
                  )}
                  {project && 'prd' in project && (
                    <button
                      onClick={() => scrollToSection('prd')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        activeSection === 'prd'
                          ? 'bg-[#8a8686]/40 text-white font-medium border border-[#8a8686]'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`}
                    >
                      PRD
                    </button>
                  )}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            
            {/* Overview Card */}
            <section id="overview" className="scroll-mt-24">
              <div 
                className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                style={{
                  background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                    Product Overview
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-6 mt-8 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-4 mt-12 pb-2" style={{ borderBottom: '1px solid #8a8686' }}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-[#d4d4d4] leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-4 space-y-2 list-disc pl-6 text-[#d4d4d4]">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-4 space-y-2 list-decimal pl-6 text-[#d4d4d4]">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-[#d4d4d4] leading-relaxed pl-2">
                          {children}
                        </li>
                      ),
                      code: ({ children }) => (
                        <code className="text-[#00ff6f] bg-[#393234] px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                      hr: () => (
                        <hr className="my-8" style={{ borderColor: '#8a8686' }} />
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => {
                        const text = String(children);
                        // Italicize "what's happening in this match?"
                        if (text.includes("what's happening in this match?") || text === "what's happening in this match?") {
                          return <em className="italic text-[#d4d4d4]">{children}</em>;
                        }
                        return <em className="not-italic font-semibold text-white">{children}</em>;
                      },
                      img: ({ src, alt }) => (
                        <span className="block my-8">
                          <span className="block rounded-xl overflow-hidden border-2 border-white/30">
                            <img src={src} alt={alt || ''} className="w-full h-auto block" />
                          </span>
                        </span>
                      ),
                    }}
                  >
                    {project.overview}
                  </ReactMarkdown>
                  {/* Concept image for live-match-summary in overview */}
                  {slug === 'live-match-summary' && 'conceptImage' in project && (
                    <div className="my-8">
                      <div className="rounded-xl overflow-hidden border-2 border-white/30">
                        <img src={project.conceptImage} alt="Initial concept designs" className="w-full h-auto block" />
                      </div>
                      <p className="text-[#b8b8b8] text-sm italic text-center mt-2">Initial concept designs</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Skills Card */}
            {project && 'skills' in project && (
              <section id="skills" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      Skills used
                    </h2>
                  </div>
                  <p className="text-[#d4d4d4] text-lg leading-relaxed">
                    {project.skills}
                  </p>
                </div>
              </section>
            )}

            {/* Workflows Section */}
            {slug === 'rag-ai-system' && (
              <section id="workflows" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      System workflows
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Workflow 1 */}
                    <div>
                      <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-xl text-white mb-3">
                        Workflow 1: Ingestion & Vectorisation
                      </h3>
                      <p className="text-[#d4d4d4] mb-4 leading-relaxed">
                        Data pipeline that extracts content from Notion, generates embeddings, and stores vectors in Supabase for semantic search.
                      </p>
                      <div className="rounded-xl overflow-hidden border-2 border-white/30">
                        <img
                          src={workflowIngestion}
                          alt="n8n workflow for data ingestion and vectorization"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    {/* Workflow 2 */}
                    <div>
                      <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-xl text-white mb-3">
                        Workflow 2: Query & Synthesis
                      </h3>
                      <p className="text-[#d4d4d4] mb-4 leading-relaxed">
                        Chat interface that embeds user queries, retrieves relevant excerpts, and generates grounded responses with full source traceability.
                      </p>
                      <div className="rounded-xl overflow-hidden border-2 border-white/30">
                        <img
                          src={workflowChat}
                          alt="n8n workflow for chat and retrieval"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* PRD Section */}
            {project && 'prd' in project && (
              <section id="prd" className="scroll-mt-24">
                <div 
                  className="rounded-2xl shadow-xl overflow-hidden border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="px-8 py-6" style={{ borderBottom: '1px solid #8a8686' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                          Product Requirements Document
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Format Toggle - Single segmented control */}
                        <div className="inline-flex rounded-lg p-0.5 bg-[#4a4647]" style={{ border: '1px solid #8a8686' }}>
                          <button
                            onClick={() => setViewMode('text')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              viewMode === 'text'
                                ? 'bg-[#8a8686] text-white'
                                : 'text-[#b8b8b8] hover:text-white'
                            }`}
                          >
                            Formatted
                          </button>
                          <button
                            onClick={() => setViewMode('markdown')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              viewMode === 'markdown'
                                ? 'bg-[#8a8686] text-white'
                                : 'text-[#b8b8b8] hover:text-white'
                            }`}
                          >
                            Markdown
                          </button>
                        </div>
                        
                        {/* Copy Button */}
                        <button
                          onClick={handleCopyToClipboard}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            copied
                              ? 'bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-black'
                              : 'bg-[#4a4647] text-white hover:text-[#d4d4d4]'
                          }`}
                          style={!copied ? { border: '1px solid #8a8686' } : {}}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied PRD
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy PRD
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {viewMode === 'text' ? (
                      <div className="prose prose-lg max-w-none prose-invert">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-6 mt-8 first:mt-0">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-4 mt-12 pb-2" style={{ borderBottom: '1px solid #8a8686' }}>
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-[#d4d4d4] leading-relaxed mb-4">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="my-4 space-y-2 list-disc pl-6 text-[#d4d4d4]">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="my-4 space-y-2 list-decimal pl-6 text-[#d4d4d4]">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-[#d4d4d4] leading-relaxed pl-2">
                                {children}
                              </li>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-[#00a1ff] pl-6 pr-4 italic my-6 bg-[#3a3638] py-5 rounded-r-lg text-[#e8e8e8] text-lg">
                                {children}
                              </blockquote>
                            ),
                            code: ({ children }) => (
                              <code className="text-[#00ff6f] bg-[#393234] px-2 py-1 rounded text-sm font-mono">
                                {children}
                              </code>
                            ),
                            hr: () => (
                              <hr className="my-8" style={{ borderColor: '#8a8686' }} />
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-white">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="not-italic font-semibold text-white">{children}</em>
                            ),
                          }}
                        >
                          {project.prd}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-sm text-[#d4d4d4] bg-[#1a1a1a] p-6 rounded-lg overflow-x-auto">
                        {project.prd}
                      </pre>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* User Needs Section */}
            {slug === 'live-match-summary' && (
              <section id="user-needs" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      User need
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[#d4d4d4] text-lg leading-relaxed">
                      Live sports has an old, universal user need: quickly understand the match narrative right now. Pure data lacks narrative, and traditional commentary feeds lack detail.
                    </p>
                    
                    <div>
                      <p className="text-[#d4d4d4] text-lg font-semibold mb-2">Example scenarios:</p>
                      <ul className="space-y-2 text-[#d4d4d4] text-lg leading-relaxed list-disc pl-6">
                        <li className="pl-2">User can't watch the game, wants to quickly get up to speed on what's happening</li>
                        <li className="pl-2">User thinking about switching on the TV to watch, wants to know if worth watching or not</li>
                        <li className="pl-2">User interested in placing in-play bet, wants to understand momentum</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Key Info Section for lineup-changes */}
            {slug === 'lineup-changes' && project && 'keyInfo' in project && (
              <section id="key-info" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      Key info
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none prose-invert">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-6 mt-8 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-4 mt-12 pb-2" style={{ borderBottom: '1px solid #8a8686' }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-[#d4d4d4] leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-4 space-y-2 list-disc pl-6 text-[#d4d4d4]">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-4 space-y-2 list-decimal pl-6 text-[#d4d4d4]">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[#d4d4d4] leading-relaxed pl-2">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[#00a1ff] pl-6 pr-4 italic my-6 bg-[#3a3638] py-5 rounded-r-lg text-[#e8e8e8] text-lg">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="text-[#00ff6f] bg-[#393234] px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        hr: () => (
                          <hr className="my-8" style={{ borderColor: '#8a8686' }} />
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="not-italic font-semibold text-white">{children}</em>
                        ),
                      }}
                    >
                      {project.keyInfo}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            )}

            {/* Output Challenges Section */}
            {slug === 'live-match-summary' && (
              <section id="output-challenges" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      Challenges
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none prose-invert">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-6 mt-8 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-white mb-3 mt-8">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-[#d4d4d4] leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-4 space-y-2 list-disc pl-6 text-[#d4d4d4]">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-4 space-y-2 list-decimal pl-6 text-[#d4d4d4]">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[#d4d4d4] leading-relaxed pl-2">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[#00a1ff] pl-6 pr-4 italic my-6 bg-[#00a1ff]/10 py-4 rounded-r-lg text-[#d4d4d4]">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="text-[#00ff6f] bg-[#393234] px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        hr: () => (
                          <hr className="my-8" style={{ borderColor: '#8a8686' }} />
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-[#d4d4d4]">{children}</em>
                        ),
                      }}
                    >
                      {project.prd.split('# Challenges')[1].replace(/^[\s\n]*/, '')}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            )}

            {/* Challenge Section for lineup-changes */}
            {slug === 'lineup-changes' && project && 'challenge' in project && (
              <section id="lineup-challenge" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <Workflow className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      Challenge
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none prose-invert">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-6 mt-8 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-4 mt-12 pb-2" style={{ borderBottom: '1px solid #8a8686' }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-[#d4d4d4] leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-4 space-y-2 list-disc pl-6 text-[#d4d4d4]">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-4 space-y-2 list-decimal pl-6 text-[#d4d4d4]">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[#d4d4d4] leading-relaxed pl-2">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[#00a1ff] pl-6 pr-4 italic my-6 bg-[#3a3638] py-5 rounded-r-lg text-[#e8e8e8] text-lg">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="text-[#00ff6f] bg-[#393234] px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        hr: () => (
                          <hr className="my-8" style={{ borderColor: '#8a8686' }} />
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="not-italic text-white">{children}</em>
                        ),
                      }}
                    >
                      {project.challenge}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            )}

            {/* Tech Stack Section for e-commerce-platform */}
            {slug === 'e-commerce-platform' && project && 'challenge' in project && (
              <section id="tech-stack" className="scroll-mt-24">
                <div 
                  className="rounded-2xl p-8 shadow-xl border-2 border-white/30"
                  style={{
                    background: 'linear-gradient(to bottom, #6C696A, #4B4744)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-white/40 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-white">
                      Tech Stack
                    </h2>
                  </div>
                  
                  {/* Tech Stack Workflow Diagram */}
                  <div className="mb-8">
                    <p className="text-[#d4d4d4] leading-relaxed mb-4">
                      Diagram shows end-to-end tooling for each stage:
                    </p>
                    <img 
                      src={techStackWorkflow} 
                      alt="Tech stack workflow diagram" 
                      className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setExpandedImage(true)}
                    />
                  </div>
                  
                  <div className="prose prose-lg max-w-none prose-invert">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-6 mt-8 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-['Instrument_Serif:Regular',sans-serif] text-white mb-4 mt-12 pb-2" style={{ borderBottom: '1px solid #8a8686' }}>
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-white mb-3 mt-8">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-[#d4d4d4] leading-relaxed mb-4">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-4 space-y-2 list-disc pl-6 text-[#d4d4d4]">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-4 space-y-2 list-decimal pl-6 text-[#d4d4d4]">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-[#d4d4d4] leading-relaxed pl-2">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-[#00a1ff] pl-6 pr-4 italic my-6 bg-[#3a3638] py-5 rounded-r-lg text-[#e8e8e8] text-lg">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="text-[#00ff6f] bg-[#393234] px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        hr: () => (
                          <hr className="my-8" style={{ borderColor: '#8a8686' }} />
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="not-italic text-white">{children}</em>
                        ),
                        img: ({ src, alt }) => (
                          <img src={src} alt={alt || ''} className="w-full rounded-lg my-8" />
                        ),
                      }}
                    >
                      {project.challenge}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setExpandedImage(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img 
              src={techStackWorkflow} 
              alt="Tech stack workflow diagram - expanded" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setExpandedImage(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              aria-label="Close expanded image"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}