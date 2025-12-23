import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Copy, Check, Github } from 'lucide-react';

// Import workflow images
import workflowIngestion from 'figma:asset/1dad7059420c1200f434ef05c34bb334b30cabd9.png';
import workflowChat from 'figma:asset/f69fa785f0984779afcf647e0664899405374bcc.png';

// Mock project data - you can expand this with real data
const projectsData = {
  'rag-ai-system': {
    title: 'Knowledge: RAG AI system',
    overview: '_Knowledge_ is an AI-powered information retrieval system designed to store vectorised long-form text and surface relevant insights through high-precision semantic search. The system uses a Retrieval-Augmented Generation (RAG) architecture to enable connecting ideas across sources, domains and concepts. Responses are grounded in a controlled pair of relational vector databases, prioritising retrieval quality, traceability, and observability over latency and generative fluency.',
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
    prd: `# Knowledge — AI System PRD (Portfolio Version)

**Skills used:** AI system design · Retrieval-Augmented Generation (RAG) · data transformation (Notion → Supabase) · vectorization/embeddings · SQL joins · workflow automation (n8n) · prompt & guardrail design · evaluation design · observability/debugging · model selection

---

## 1) User Need / Context

Users capture insights and information across long-form sources (books, articles, podcasts, videos) but struggle to retrieve them later in a meaningful way. Over time, previously captured knowledge becomes difficult to reference, particularly when connections are conceptual or cross-domain.

Traditional keyword search is insufficient for this use case: it relies on exact phrasing, fails to surface semantically related content, and does not support conceptual linking across topics or disciplines.

---

## 2) Why Retrieval-Augmented Generation (RAG)

The system is designed around **Retrieval-Augmented Generation (RAG)** to ensure responses are grounded in a controlled knowledge base rather than relying on the language model's latent training data.

RAG was selected for three primary reasons:

1. **Grounded responses**  
   All outputs should be traceable to stored sources and excerpts, establishing a clear source of truth for what the system "knows."

2. **Semantic retrieval over unstructured content**  
   Vector-based retrieval enables concept-level search across long-form text, outperforming keyword or API-based retrieval for exploratory and cross-domain queries.

3. **Separation of concerns**  
   Retrieval quality, data structure, and provenance are handled by the system design, while the language model is used strictly for synthesis and explanation.

Alternative approaches such as direct API access to a note-taking system (e.g. via MCP) were considered. While suitable for structured lookups or live data access, they do not provide the same level of semantic indexing, retrieval precision, or deterministic observability required for this use case.

> **Terminology note:** This project implements a *RAG pipeline / RAG system*, not a "RAG model." The language model is a component, not the system itself.

---

## 3) Goals

The system is designed to meet the following goals:

1. **High-precision semantic retrieval**  
   Retrieve the most relevant passages for a query based on meaning, not keywords, prioritising precision over recall.

2. **Deterministic ingestion and retrieval**  
   Re-running ingestion or retrieval workflows should not introduce silent drift, duplication, or ambiguity in system state.

3. **Traceable answers with source grounding**  
   All generated responses must be attributable to specific stored excerpts and their parent sources.

4. **Observable system behaviour**  
   It must be possible to inspect what data was ingested, what was retrieved, and why a given answer was produced.

---

## 4) System Overview

### High-level architecture

- **Authoring layer:** Notion databases used to capture sources and excerpts  
- **Indexing layer:** Supabase vector database for semantic retrieval  
- **Orchestration:** n8n workflows for ingestion, embedding, and chat  
- **Interface:** Chat-based entry point for querying the knowledge base (frontend TBD)

### Workflows

#### Workflow 1: \`knowledge-RAG\` (Ingestion & Vectorisation)

1. Fetch selected fields from Notion Sources and Excerpts databases  
2. Normalize and combine content with required metadata  
3. Validate relational integrity between excerpts and sources  
4. Generate embeddings for each excerpt  
5. Write rows and vectors to Supabase  

#### Workflow 2: \`knowledge-chat\` (Query & Synthesis)

1. Receive a user query  
2. Embed the query  
3. Retrieve top-K relevant excerpts from Supabase  
4. Join excerpts with parent source metadata  
5. Generate a grounded response using retrieved context  

---

## 5) Data Model

> **Note:** Sample rows for each database will be added once provided.

### Notion — Sources

Represents primary materials (books, articles, podcasts, videos).

Key fields:
- title  
- author / creator  
- source type  
- year (where applicable)  
- summary  
- reflections  
- tags / topics  

### Notion — Excerpts

Represents the atomic retrieval unit.

Key fields:
- quoted passage  
- reflective notes  
- relation to parent source (required)  

Excerpts are the **unit of retrieval**; sources provide provenance and context.

---

## 6) Vector Database Design

Each excerpt is stored in Supabase with:

- embedding vector (semantic index)  
- excerpt text (retrieval content)  
- stable identifiers  
- metadata (author, title, source type, etc.)  
- reference to parent source  

### Design rationale

- **Vector embeddings** enable semantic similarity search over meaning rather than phrasing.  
- **Excerpt-level indexing** improves retrieval precision and context efficiency.  
- **Metadata fields** support filtering, disambiguation, citation, and debugging.  
- **Relational joins** reconstruct full provenance at query time.  

The language model does not access the database directly; it only receives retrieved excerpts and associated metadata.

---

## 7) Model Usage

### Embeddings

An embeddings model is used to convert excerpts and queries into vectors for similarity search.

Rationale:
- Optimised for semantic representation  
- Cost-effective for batch processing  
- Produces a stable retrieval space  

### Chat / Synthesis

A general-purpose chat model is used to synthesize responses from retrieved context.

Rationale:
- Strong multi-document reasoning  
- Reliable instruction following  
- Capable of structured, grounded responses  

*(Exact model names are implementation details and intentionally abstracted here.)*

---

## 8) Retrieval Strategy & Constraints

### Retrieval strategy

1. Embed user query  
2. Perform vector similarity search over excerpt embeddings  
3. Retrieve top-K excerpts above a relevance threshold  
4. Join with parent source metadata  
5. Pass retrieved context to the chat model with grounding instructions  

### Constraints

- Limit K to prevent context dilution  
- Exclude excerpts without valid source relationships  
- Prefer fewer, higher-signal passages over broad recall  
- Do not generate answers when retrieval evidence is insufficient  

These constraints exist to prioritise answer quality and trustworthiness over fluency.

---

## 9) Model Behaviour & Guardrails

The model is constrained to:

- Use only retrieved excerpts as evidence  
- Cite sources for substantive claims  
- Explicitly acknowledge insufficient information  
- Avoid inventing sources, quotations, or provenance  

The model is treated as a **synthesis component**, not a source of truth.

---

## 10) Failure Modes & Mitigations

### Broken joins (orphan excerpts)
- **Risk:** Ungrounded or unverifiable answers  
- **Mitigation:** Enforce required source relationships; exclude invalid rows from retrieval  

### Duplicate rows from ingestion
- **Risk:** Noisy retrieval and silent drift  
- **Mitigation:** Deterministic clear-and-rebuild ingestion for MVP  

### Stale embeddings
- **Risk:** Retrieval mismatch after content edits  
- **Mitigation:** Track update timestamps and re-embed modified rows  

### Over-retrieval
- **Risk:** Generic or averaged responses  
- **Mitigation:** Similarity thresholds and conservative top-K values  

---

## 11) Observability & Evaluation

### Observability requirements

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

### Evaluation approach

- Curated query set covering recall, synthesis, and cross-domain linking  
- Manual relevance scoring of retrieved excerpts  
- Citation coverage checks  
- Consistency checks across repeated runs of identical queries  

Observability is treated as a first-class product requirement.

---

## 12) Success Metrics

- **Join coverage:** target ~100%  
- **Citation rate:** % of responses with valid source references  
- **Retrieval relevance:** human-evaluated precision  
- **Consistency:** overlap of retrieved excerpt IDs across repeated runs  
- **Silent failure rate:** unexpected drift in row counts, joins, or similarity distributions  

---

## 13) Open Questions & Trade-offs

### Ingestion strategy

The current approach clears and rebuilds the vector database on each run to guarantee determinism and avoid silent duplication. This is acceptable at MVP scale.

**Future approach:**
- Use stable IDs (e.g. Notion page IDs)  
- Compare Notion \`last_edited_time\` with stored vectorisation timestamps  
- Insert new rows, update modified rows, delete removed rows  

### Additional open considerations

- Hybrid retrieval (vector + keyword)  
- Re-ranking strategies  
- Versioning of knowledge snapshots  
- Frontend affordances for citation inspection  
- Long-term scalability limits`
  },
  'e-commerce-platform': {
    title: 'E-Commerce Platform',
    overview: 'Led comprehensive product strategy for a complete platform overhaul, focusing on user experience improvements and conversion optimization. The project resulted in a 45% increase in conversion rates through data-driven design decisions and streamlined checkout processes.',
    imageUrl: 'https://images.unsplash.com/photo-1709715357549-f2d587846ee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGV2ZWxvcG1lbnQlMjBzdHJhdGVneXxlbnwxfHx8fDE3NjYwOTI0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    prd: `# Product Requirements Document: E-Commerce Platform Overhaul

## 1. Executive Summary
Complete redesign of the e-commerce platform to improve user experience, increase conversion rates, and streamline operations.

## 2. Business Objectives
- Increase conversion rate by 40%
- Reduce cart abandonment by 30%
- Improve mobile experience
- Enhance product discovery

## 3. User Stories

### 3.1 Customer Journey
- As a customer, I want to easily find products so that I can make purchasing decisions quickly
- As a customer, I want a streamlined checkout process so that I can complete my purchase efficiently
- As a customer, I want personalized recommendations so that I can discover relevant products

### 3.2 Admin Experience
- As an admin, I want real-time analytics so that I can make data-driven decisions
- As an admin, I want easy product management so that I can update inventory efficiently

## 4. Features

### 4.1 Enhanced Search
- AI-powered search suggestions
- Faceted filtering
- Visual search capability

### 4.2 Checkout Optimization
- One-page checkout
- Multiple payment options
- Guest checkout option
- Save payment methods

### 4.3 Personalization
- Product recommendations
- Recently viewed items
- Wishlist functionality
- Email reminders for cart items

## 5. Technical Stack
- Frontend: React, Next.js
- Backend: Node.js, PostgreSQL
- Payments: Stripe integration
- Analytics: Google Analytics, Mixpanel

## 6. Success Metrics
- Conversion rate improvement: 45%
- Cart abandonment reduction: 32%
- Page load time: < 2 seconds
- Mobile traffic conversion: 50% of desktop`
  },
  'user-research-initiative': {
    title: 'User Research Initiative',
    overview: 'Designed and executed a comprehensive user research program across 5 different markets to inform product roadmap decisions. The research included qualitative interviews, quantitative surveys, and usability testing sessions that shaped the product strategy for the next 18 months.',
    imageUrl: 'https://images.unsplash.com/photo-1723987251277-18fc0a1effd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcmVzZWFyY2glMjBhbmFseXRpY3N8ZW58MXx8fHwxNzY2MDkyNDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    prd: `# Product Requirements Document: User Research Initiative

## 1. Research Objectives
Conduct comprehensive user research across 5 markets to understand user needs, pain points, and opportunities for product improvement.

## 2. Scope

### 2.1 Markets
- United States
- United Kingdom
- Germany
- Japan
- Australia

### 2.2 Research Methods
- In-depth interviews (60 participants)
- Online surveys (2,000+ responses)
- Usability testing sessions (40 participants)
- Competitive analysis

## 3. Research Questions
- What are the primary pain points in the current user experience?
- How do user needs vary across different markets?
- What features would provide the most value to users?
- How do competitors address similar user needs?

## 4. Methodology

### 4.1 Qualitative Research
- **In-depth Interviews**: 60-minute sessions with target users
- **Usability Testing**: Task-based testing with think-aloud protocol
- **Focus Groups**: 90-minute sessions with 6-8 participants

### 4.2 Quantitative Research
- **Surveys**: Online questionnaires with 50+ questions
- **Analytics Review**: Analysis of existing usage data
- **A/B Testing**: Validation of research findings

## 5. Deliverables
- Comprehensive research report
- User personas (5 primary personas)
- Journey maps
- Feature prioritization matrix
- Roadmap recommendations

## 6. Timeline
- Week 1-2: Research planning and recruitment
- Week 3-6: Data collection
- Week 7-8: Analysis and synthesis
- Week 9-10: Reporting and presentation

## 7. Key Findings
- 78% of users found the current onboarding confusing
- Mobile users had 2x higher friction in checkout
- Personalization features ranked as top priority
- Cross-market differences in feature preferences identified

## 8. Recommendations
- Redesign onboarding flow
- Optimize mobile checkout experience
- Implement personalization engine
- Develop market-specific features`
  },
  'analytics-dashboard': {
    title: 'Analytics Dashboard',
    overview: 'Product-led development of a real-time analytics platform that enables data-driven decision-making across the organization. The dashboard provides customizable views, real-time data visualization, and automated reporting capabilities that reduced time-to-insight by 70%.',
    imageUrl: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwZGFzaGJvYXJkJTIwZGVzaWdufGVufDF8fHx8MTc2NjA5MjQ5MXww&ixlib=rb-4.1.0&q=80&w=1080',
    prd: `# Product Requirements Document: Analytics Dashboard

## 1. Product Vision
Build a comprehensive real-time analytics dashboard that empowers teams to make data-driven decisions quickly and confidently.

## 2. Goals
- Reduce time-to-insight by 70%
- Enable self-service analytics
- Provide real-time data visibility
- Support customizable reporting

## 3. Target Users
- Product Managers
- Marketing Teams
- Sales Teams
- Executive Leadership
- Data Analysts

## 4. Core Features

### 4.1 Real-Time Data Visualization
- Live updating charts and graphs
- Multiple visualization types (line, bar, pie, scatter)
- Drill-down capabilities
- Time-range selection

### 4.2 Customizable Dashboards
- Drag-and-drop widget arrangement
- Save custom dashboard layouts
- Share dashboards with team members
- Template library

### 4.3 Automated Reporting
- Scheduled report generation
- Email distribution
- PDF export
- Custom report templates

### 4.4 Data Integration
- Connect to multiple data sources
- Support for SQL databases
- API integrations
- CSV import/export

### 4.5 Collaboration
- Comment on visualizations
- Share insights
- Tagging and notifications
- Dashboard version history

## 5. Technical Requirements

### 5.1 Performance
- Dashboard load time < 3 seconds
- Real-time updates with < 1 second latency
- Support for 100+ concurrent users
- Handle datasets up to 10M rows

### 5.2 Infrastructure
- Cloud-based architecture (AWS)
- Microservices design
- Caching layer for performance
- Auto-scaling capabilities

### 5.3 Security
- Role-based access control
- Data encryption at rest and in transit
- Audit logging
- SSO integration

## 6. User Flows

### 6.1 Dashboard Creation
1. User selects "Create Dashboard"
2. Chooses from templates or starts blank
3. Adds widgets from widget library
4. Configures data sources and metrics
5. Customizes visualization settings
6. Saves and shares dashboard

### 6.2 Report Generation
1. User selects "Create Report"
2. Chooses dashboard or creates custom report
3. Selects time range and filters
4. Previews report
5. Schedules or downloads report

## 7. Success Metrics
- Time-to-insight reduction: 70%
- Dashboard adoption rate: 85% of target users
- Average dashboards per user: 3+
- User satisfaction score: 4.5+/5
- Report automation: 60% of regular reports`
  }
};

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<'text' | 'markdown'>('text');
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const project = slug ? projectsData[slug as keyof typeof projectsData] : null;

  const handleCopyToClipboard = async () => {
    if (project) {
      try {
        await navigator.clipboard.writeText(project.prd);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleCopyJsonToClipboard = async () => {
    if (project && 'n8nJson' in project) {
      try {
        await navigator.clipboard.writeText(project.n8nJson);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
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
    <div className="min-h-screen bg-[#f0eae1]">
      {/* Header */}
      <div className="bg-[#5a5452] py-8 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#f0eae1] hover:text-[#00ff6f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
            
            {project && 'githubUrl' in project && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#f0eae1] hover:text-[#00ff6f] transition-colors px-4 py-2 rounded-lg border border-[#f0eae1] hover:border-[#00ff6f]"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            )}
          </div>
          <h1 className="font-['Instrument_Serif:Regular',sans-serif] text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] mb-4">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Overview Section */}
        <section className="mb-12">
          <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-[#5a5452] mb-6">
            Project Overview
          </h2>
          <div className="text-[#5a5452] text-lg leading-relaxed space-y-4">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-4">{children}</p>
                ),
                em: ({ children }) => (
                  <em className="not-italic font-semibold">{children}</em>
                ),
              }}
            >
              {project.overview}
            </ReactMarkdown>
          </div>
          
          {project && 'skills' in project && (
            <div className="mt-8">
              <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-2xl text-[#5a5452] mb-4">
                Skills Used
              </h3>
              <p className="text-[#5a5452] leading-relaxed">
                {project.skills}
              </p>
            </div>
          )}
        </section>

        {/* Image Section */}
        <section className="mb-12">
          {slug === 'rag-ai-system' ? (
            <div className="space-y-6">
              {/* Workflow 1: Ingestion */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-[#1a1a1a]">
                <div className="p-4 bg-[#252525] border-b border-gray-700">
                  <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-xl text-white">
                    Workflow 1: knowledge-RAG (Ingestion & Vectorisation)
                  </h3>
                </div>
                <div className="p-6">
                  <img
                    src={workflowIngestion}
                    alt="n8n workflow for data ingestion and vectorization"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Workflow 2: Chat */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-[#1a1a1a]">
                <div className="p-4 bg-[#252525] border-b border-gray-700">
                  <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-xl text-white">
                    Workflow 2: knowledge-chat (Query & Synthesis)
                  </h3>
                </div>
                <div className="p-6">
                  <img
                    src={workflowChat}
                    alt="n8n workflow for chat and retrieval"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}
        </section>

        {/* PRD Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-[#5a5452]">
              Product Requirements Document
            </h2>
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('text')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'text'
                    ? 'bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-white'
                    : 'text-[#5a5452] hover:bg-gray-100'
                }`}
              >
                Text
              </button>
              <button
                onClick={() => setViewMode('markdown')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'markdown'
                    ? 'bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-white'
                    : 'text-[#5a5452] hover:bg-gray-100'
                }`}
              >
                .md
              </button>
              <button
                onClick={handleCopyToClipboard}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  copied
                    ? 'bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-white'
                    : 'text-[#5a5452] hover:bg-gray-100'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              {project && 'n8nJson' in project && (
                <button
                  onClick={handleCopyJsonToClipboard}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    copiedJson
                      ? 'bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-white'
                      : 'text-[#5a5452] hover:bg-gray-100'
                  }`}
                >
                  {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-lg">
            {viewMode === 'text' ? (
              <div className="space-y-6">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-['Instrument_Serif:Regular',sans-serif] text-[#5a5452] mb-8 mt-12 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-3xl font-['Instrument_Serif:Regular',sans-serif] text-[#5a5452] mb-6 mt-16 pb-3 border-b border-gray-200">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-[#5a5452] mb-4 mt-10">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-[#5a5452] leading-loose mb-6">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-6 space-y-3 list-disc list-inside">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-6 space-y-3 list-decimal list-inside">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[#5a5452] leading-loose ml-4">
                        {children}
                      </li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#00a1ff] pl-6 pr-4 italic my-8 bg-gray-50 py-4">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="text-[#00a1ff] bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    hr: () => (
                      <hr className="my-12 border-gray-300" />
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-[#5a5452]">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {project.prd}
                </ReactMarkdown>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-[#5a5452] font-mono overflow-x-auto leading-loose">
                {project.prd}
              </pre>
            )}
          </div>
        </section>

        {/* n8n Workflow Section */}
        {project && 'n8nJson' in project && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-3xl text-[#5a5452]">
                n8n Workflow Configuration
              </h2>
              <button
                onClick={handleCopyJsonToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copiedJson
                    ? 'bg-gradient-to-r from-[#00a1ff] to-[#00ff6f] text-white'
                    : 'bg-white text-[#5a5452] hover:bg-gray-100 shadow-sm'
                }`}
              >
                {copiedJson ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#1e1e1e] rounded-2xl p-8 shadow-lg overflow-hidden">
              <pre className="text-sm text-[#d4d4d4] font-mono overflow-x-auto leading-relaxed">
                <code>{project.n8nJson}</code>
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}