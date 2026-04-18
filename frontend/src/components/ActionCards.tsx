import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface Props {
  onSend: (text: string, mode: string) => void
  isStreaming: boolean
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── Quick action cards ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  {
    label: 'Write a PRD',
    prompt: "I want to write a PRD. Before we start, ask me the 2–3 questions you need answered to make this genuinely useful — not generic.",
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: 'Create user stories',
    prompt: "Help me write user stories. Ask me about the feature, the persona, and the goal — then generate a clean set with acceptance criteria.",
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    label: 'Help me prioritize',
    prompt: "I need help prioritizing my roadmap or backlog. I'll describe what I'm working with — help me think through the tradeoffs, not just rank items.",
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3" />
      </svg>
    ),
  },
  {
    label: 'Review my document',
    prompt: "I have a product document I'd like you to review. What should I share with you so you can give me the most useful feedback?",
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    label: 'Prep stakeholder meeting',
    prompt: "I have a stakeholder meeting coming up and I want to prepare. Ask me what I'm presenting and who will be in the room — then help me pressure-test my narrative.",
    iconBg: 'bg-teal-500/20',
    iconColor: 'text-teal-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    label: 'Define success metrics',
    prompt: "Help me define the right success metrics for a product or feature. Ask me what we're building and what outcomes we care about.",
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
  },
  {
    label: 'Write a one-pager',
    prompt: "I need to write a product one-pager. Ask me about the problem, the solution, and who it's for — then help me write something clear and compelling.",
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
    ),
  },
  {
    label: 'Competitive analysis',
    prompt: "I want to do a competitive analysis. Tell me which product space you're in, and I'll help you structure what to look at and what questions to answer.",
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
]

// ── PM Books ─────────────────────────────────────────────────────────────────

const PM_BOOKS = [
  {
    title: 'INSPIRED',
    author: 'Marty Cagan',
    bg: 'bg-gradient-to-b from-amber-100 to-amber-50',
    titleColor: 'text-amber-600',
    authorColor: 'text-zinc-500',
    accent: 'border-amber-200',
    tagline: 'How to build tech products customers love',
    prompt: "Give me the most important lessons from INSPIRED by Marty Cagan and how I can apply them as a Product Manager today. Cover: the empowered product team model, the role of product discovery, how the best tech companies work differently, and what separates great PMs from average ones. Make it practical and actionable.",
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    bg: 'bg-gradient-to-b from-sky-400 to-sky-600',
    titleColor: 'text-white',
    authorColor: 'text-sky-100',
    accent: 'border-sky-300',
    tagline: 'Notes on startups & the future',
    prompt: "What are the key lessons from Zero to One by Peter Thiel that every Product Manager should know? Cover: the importance of monopoly thinking, going from 0 to 1 vs. 1 to n, the power of secrets, why distribution matters as much as product, and how to think about the future. How do these ideas change how a PM should approach building products?",
  },
  {
    title: 'SCRUM',
    author: 'Jeff Sutherland',
    bg: 'bg-gradient-to-b from-red-600 to-red-800',
    titleColor: 'text-white',
    authorColor: 'text-red-200',
    accent: 'border-red-400',
    tagline: 'The art of doing twice the work in half the time',
    prompt: "Teach me the key lessons from SCRUM by Jeff Sutherland and how a Product Manager should apply them. Cover: why Scrum works, the sprint model, the role of the Product Owner vs. Scrum Master, backlog prioritization, velocity, and how to run retrospectives that actually improve the team. What do most teams get wrong about Scrum?",
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    bg: 'bg-gradient-to-b from-zinc-100 to-zinc-200',
    titleColor: 'text-zinc-800',
    authorColor: 'text-zinc-500',
    accent: 'border-zinc-300',
    tagline: 'Build · Measure · Learn',
    prompt: "What are the most important lessons from The Lean Startup by Eric Ries for Product Managers? Cover: the Build-Measure-Learn loop, validated learning, the MVP concept, pivot vs. persevere decisions, and innovation accounting. How do these ideas apply to my day-to-day work as a PM building features and testing hypotheses?",
  },
  {
    title: 'Hooked',
    author: 'Nir Eyal',
    bg: 'bg-gradient-to-b from-indigo-900 to-indigo-950',
    titleColor: 'text-indigo-300',
    authorColor: 'text-indigo-400',
    accent: 'border-indigo-700',
    tagline: 'How to build habit-forming products',
    prompt: "Explain the key lessons from Hooked by Nir Eyal for Product Managers. Walk me through the Hook Model: Trigger, Action, Variable Reward, and Investment. How do I apply each stage when designing a product? Give me real examples of products that use this model well (like Instagram, Duolingo, Slack). What are the ethical considerations a PM should think about?",
  },
  {
    title: 'Continuous Discovery Habits',
    author: 'Teresa Torres',
    bg: 'bg-gradient-to-b from-violet-700 to-violet-900',
    titleColor: 'text-violet-200',
    authorColor: 'text-violet-300',
    accent: 'border-violet-500',
    tagline: 'Discover products that create customer value',
    prompt: "What are the most important lessons from Continuous Discovery Habits by Teresa Torres? Cover: what continuous discovery means and why weekly customer touchpoints matter, the opportunity solution tree, assumption testing, and how to make discovery a team habit rather than a one-time research sprint. How do I start doing continuous discovery if my team has never done it before?",
  },
  {
    title: 'The Mom Test',
    author: 'Rob Fitzpatrick',
    bg: 'bg-gradient-to-b from-orange-400 to-orange-600',
    titleColor: 'text-white',
    authorColor: 'text-orange-100',
    accent: 'border-orange-300',
    tagline: 'How to talk to customers & learn if your business is a good idea',
    prompt: "Give me the key lessons from The Mom Test by Rob Fitzpatrick and how they apply to a Product Manager doing customer research. Cover: why most customer interviews fail, how to ask questions that get real answers (not validation), the 3 rules of The Mom Test, and how to structure a customer conversation that gives you honest signal. Give me 5 example bad questions vs. good questions.",
  },
  {
    title: 'Shape Up',
    author: 'Ryan Singer · Basecamp',
    bg: 'bg-gradient-to-b from-zinc-800 to-zinc-900',
    titleColor: 'text-zinc-100',
    authorColor: 'text-zinc-400',
    accent: 'border-zinc-600',
    tagline: 'Stop running in circles, ship work that matters',
    prompt: "What are the key ideas from Shape Up by Ryan Singer (Basecamp) that every PM should know? Cover: appetite vs. estimates, shaping work before it's scheduled, betting table vs. backlog, hill charts for tracking progress, and the 6-week cycle model. How does Shape Up differ from Scrum, and when should a team consider adopting it?",
  },
  {
    title: 'Escaping the Build Trap',
    author: 'Melissa Perri',
    bg: 'bg-gradient-to-b from-fuchsia-800 to-fuchsia-950',
    titleColor: 'text-fuchsia-200',
    authorColor: 'text-fuchsia-300',
    accent: 'border-fuchsia-600',
    tagline: 'How effective product management creates real value',
    prompt: "Explain the key lessons from Escaping the Build Trap by Melissa Perri. What is the build trap, why do so many companies fall into it, and how does a PM escape it? Cover: output vs. outcome thinking, the product kata, building a product strategy that connects to business goals, and what it takes to become an outcome-oriented product organization.",
  },
  {
    title: 'Crossing the Chasm',
    author: 'Geoffrey Moore',
    bg: 'bg-gradient-to-b from-teal-700 to-teal-900',
    titleColor: 'text-teal-100',
    authorColor: 'text-teal-300',
    accent: 'border-teal-500',
    tagline: 'Marketing & selling disruptive products',
    prompt: "What are the key lessons from Crossing the Chasm by Geoffrey Moore for Product Managers? Cover: the Technology Adoption Life Cycle, what the 'chasm' is and why most products die there, the beachhead strategy, and how to position a product to move from early adopters to mainstream customers. Give me a real example of a product that successfully crossed the chasm.",
  },
]

// ── Situations ───────────────────────────────────────────────────────────────

const SITUATIONS = [
  {
    label: "Can't get engineering to prioritize my features",
    emoji: '😤',
    prompt: "I'm struggling to get engineering to prioritize the features I need to ship. They keep deprioritizing my work for technical debt or other team requests. As a PM, how do I get better alignment with engineering leadership? What have you seen work in real companies? Give me concrete strategies, scripts for difficult conversations, and how to frame product work in terms engineers actually care about.",
  },
  {
    label: "Stakeholder keeps changing requirements",
    emoji: '🔄',
    prompt: "I have a stakeholder who keeps changing requirements mid-sprint or after we've already started building. It's disrupting the team and delaying delivery. What's the best way to handle this as a PM? Cover: how to set expectations upfront, how to document decisions so they stick, how to have the difficult conversation about scope changes, and how to build a change control process without being bureaucratic.",
  },
  {
    label: "Team can't agree on what to build",
    emoji: '🤝',
    prompt: "My product team (engineering, design, and stakeholders) can't align on what to build next. Everyone has a different opinion and we're going in circles. How do I facilitate a decision as a PM? Give me a framework for running an alignment session, how to use data and customer evidence to cut through opinions, and how to make a call when there's no clear consensus.",
  },
  {
    label: "Need to say no to a feature request",
    emoji: '🚫',
    prompt: "A senior stakeholder (or customer) is pushing hard for a feature that I don't think we should build right now. How do I say no without damaging the relationship? Give me a framework for evaluating the request, the language to use when declining, how to offer alternatives, and how to document the decision so it doesn't come back to haunt me.",
  },
  {
    label: "Product launch didn't go as planned",
    emoji: '📉',
    prompt: "We just launched a feature or product and the results are disappointing — low adoption, bad feedback, or missed metrics. What should I do as a PM? Walk me through: how to diagnose what went wrong (discovery, build, or launch problem?), how to communicate with leadership, how to decide whether to iterate or pivot, and what a proper post-mortem looks like.",
  },
  {
    label: "Not sure if my idea is worth building",
    emoji: '🤔',
    prompt: "I have a product idea but I'm not confident it's worth building. How do I validate it before investing engineering time? Walk me through: how to define the core hypothesis, what the cheapest way to test it is, what signals should make me feel confident to proceed, and what signals should make me stop. Give me a step-by-step validation plan I can run in 2 weeks.",
  },
  {
    label: "Overwhelmed as a new PM",
    emoji: '😰',
    prompt: "I'm a new Product Manager and I feel completely overwhelmed. There are too many things to do, too many meetings, and I'm not sure what to focus on. What advice do you have for someone new to the PM role? Cover: how to prioritize your time in the first 90 days, the most important things to learn first, how to build credibility quickly, and what mistakes new PMs most commonly make.",
  },
  {
    label: "Roadmap is a mess — need to clean it up",
    emoji: '🗺️',
    prompt: "My product roadmap is a mess — it's either too full, not strategic, or nobody trusts it. How do I rebuild it the right way? Cover: how to audit and clean a bloated roadmap, how to structure it so it connects to company goals, how to communicate roadmap uncertainty without losing stakeholder confidence, and what a healthy roadmap review cadence looks like.",
  },
  {
    label: "How to present to the CEO or leadership",
    emoji: '🎤',
    prompt: "I have to present my product strategy (or roadmap or results) to the CEO or senior leadership. How do I prepare and what should I include? Cover: what executives actually care about vs. what PMs think they care about, how to structure the presentation (problem → insight → decision needed), how to handle tough questions, and what common mistakes PMs make in exec presentations.",
  },
  {
    label: "My team is burning out",
    emoji: '🔥',
    prompt: "My product team is showing signs of burnout — people are stressed, velocity is dropping, and morale is low. As a PM, what can I do? Cover: how to identify the root cause (too much scope? unclear priorities? bad process?), what's in my control vs. my manager's, how to have honest conversations with the team, and what structural changes actually reduce burnout vs. just symptoms.",
  },
  {
    label: "Need to hire my first PM",
    emoji: '👥',
    prompt: "I need to hire a Product Manager (either my first PM hire or adding to the team). How do I do this well? Cover: how to write a job description that attracts the right people, what to look for in a PM interview, the best interview questions and exercises, how to evaluate PM candidates who come from different backgrounds, and what onboarding mistakes to avoid.",
  },
  {
    label: "How to break into product management",
    emoji: '🚀',
    prompt: "I want to break into product management but I don't have a PM title yet. What's the most realistic path in? Cover: the different ways people transition into PM roles (from engineering, design, business), what skills to build first, how to get PM experience without the title, how to position my background in interviews, and what the first 90 days look like in a junior PM role.",
  },
]

// ── Technical Knowledge ───────────────────────────────────────────────────────

const TECH_TOPICS = [
  {
    name: 'Frontend vs Backend',
    tag: 'Architecture',
    tagColor: 'bg-sky-500/15 text-sky-400',
    description: 'What each side does & why it matters for specs',
    prompt: "Explain the difference between frontend and backend to me as a Product Manager — no coding required. Cover: what the frontend is responsible for (UI, user interactions, performance in the browser), what the backend is responsible for (business logic, databases, APIs, security), how they communicate, and why this distinction matters when I'm writing specs or estimating work. Give me real examples: when I ask for a change, how do I know if it's a frontend or backend change? Why does that matter for effort estimates? What questions should I ask engineers to understand the scope of a change?",
  },
  {
    name: 'APIs Explained',
    tag: 'Architecture',
    tagColor: 'bg-sky-500/15 text-sky-400',
    description: 'What APIs are, REST vs GraphQL, and why PMs care',
    prompt: "Explain APIs to me as a Product Manager in plain language. Cover: what an API is (a contract between systems), why APIs matter for product decisions (third-party integrations, mobile vs. web, partner ecosystems), the difference between REST and GraphQL at a conceptual level, what API rate limits and versioning mean for PMs, and what happens when an API changes (breaking vs. non-breaking changes). Give me examples of product decisions that are heavily influenced by API design — like building a marketplace, opening a developer platform, or integrating with Salesforce.",
  },
  {
    name: 'Databases 101',
    tag: 'Architecture',
    tagColor: 'bg-sky-500/15 text-sky-400',
    description: 'SQL vs NoSQL, queries & why schema changes are risky',
    prompt: "Explain databases to me as a Product Manager — just enough to have smart conversations with engineers. Cover: what a database is and the difference between SQL (relational) and NoSQL at a conceptual level, why PMs need to understand schema changes (and why they're risky and slow), what a migration is, what 'query performance' means for product features, and why some product decisions (like adding a new filter or search field) might be harder than they look. Give me 3 real examples of product decisions that were much more complex than expected because of database constraints.",
  },
  {
    name: 'Microservices vs Monolith',
    tag: 'Architecture',
    tagColor: 'bg-sky-500/15 text-sky-400',
    description: 'How system architecture affects your roadmap',
    prompt: "Explain microservices vs. monolithic architecture to me as a PM — not to build it, but to understand how it affects product decisions. Cover: what a monolith is, what microservices are, the tradeoffs (monolith is simpler and faster to build, microservices scale better but add complexity), how architectural choices affect how fast features can ship, why splitting a monolith into microservices is a big engineering investment, and how this affects my roadmap planning. Give me real examples of companies that moved from monolith to microservices and what it meant for the product team.",
  },
  {
    name: 'Git & Version Control',
    tag: 'Dev Process',
    tagColor: 'bg-violet-500/15 text-violet-400',
    description: 'Branches, pull requests & what "merging" means',
    prompt: "Explain Git and version control to me as a Product Manager — enough to understand what engineers are talking about. Cover: what Git is (a way to track code changes), what a branch is and why engineers work in branches, what a pull request (PR) is and why it exists, what 'merging' and 'conflicts' mean, and how all of this connects to the product release process. Why do some PRs take days to review? What does it mean when engineers say 'we need to merge main into our branch'? How does Git branching strategy affect how we do releases and feature flags?",
  },
  {
    name: 'CI/CD Pipelines',
    tag: 'Dev Process',
    tagColor: 'bg-violet-500/15 text-violet-400',
    description: 'How code goes from laptop to production',
    prompt: "Explain CI/CD (Continuous Integration / Continuous Deployment) to me as a Product Manager. Cover: what CI/CD is in plain English (automated testing + automated deployment), why it matters for product velocity, what a 'build failure' or 'pipeline failure' means, what environments are (dev, staging, production) and why code moves through them, and how CI/CD connects to our release process. How does a healthy CI/CD pipeline make a PM's life better? What should I do when the CI pipeline is broken and blocking the sprint? What's the difference between continuous delivery and continuous deployment?",
  },
  {
    name: 'Feature Flags',
    tag: 'Dev Process',
    tagColor: 'bg-violet-500/15 text-violet-400',
    description: 'Ship safely, roll out gradually, kill switches',
    prompt: "Explain feature flags to me as a Product Manager and why they're one of the most powerful tools I have for launches. Cover: what a feature flag is (a toggle that turns features on/off without redeployment), how to use them for gradual rollouts (10% → 50% → 100%), canary releases, A/B testing, and kill switches for bad launches, why feature flags change the launch checklist, and what the risks of feature flags are (flag debt, complexity). Give me a concrete example of how a PM used feature flags to safely launch a major feature and roll back when something went wrong.",
  },
  {
    name: 'Dev / Staging / Prod',
    tag: 'Dev Process',
    tagColor: 'bg-violet-500/15 text-violet-400',
    description: 'What environments are and how to use them',
    prompt: "Explain the concept of environments (development, staging, production) to me as a Product Manager. Cover: what each environment is for, why code must pass through each one, how to use the staging environment for QA and demos, why you should never test directly in production, what 'environment parity' means, and common PM mistakes related to environments (like demoing to a customer in staging and calling it live). How does environment management affect sprint planning and release timelines? What should I check in staging before approving a release?",
  },
  {
    name: 'Event Tracking & Analytics Instrumentation',
    tag: 'Data',
    tagColor: 'bg-amber-500/15 text-amber-400',
    description: 'How to spec tracking so you can measure what matters',
    prompt: "Explain event tracking and analytics instrumentation to me as a Product Manager — this is critical for measuring product success. Cover: what an event is (a user action that gets tracked), how event tracking works (client-side vs. server-side), how to write an instrumentation spec for a new feature, what properties to attach to each event, the difference between page views, clicks, and custom events, how this data flows into tools like Amplitude or Mixpanel, and what happens when you forget to add tracking before shipping. Give me a template for an instrumentation spec I can use when writing requirements.",
  },
  {
    name: 'SQL for PMs',
    tag: 'Data',
    tagColor: 'bg-amber-500/15 text-amber-400',
    description: 'Read data yourself without waiting for the data team',
    prompt: "Teach me enough SQL to be useful as a Product Manager — not to build databases, but to query data and answer my own questions. Cover: what SELECT, FROM, WHERE, GROUP BY, ORDER BY, and LIMIT do in plain English, how to count users who did something (basic aggregation), how to join two tables, and how to write a query that answers a real PM question like 'how many users completed onboarding this week?' Give me 5 example SQL queries that every PM should know how to write. What tools do most companies use for PMs to run SQL (Metabase, Mode, Looker, etc.)?",
  },
  {
    name: 'Data Pipelines',
    tag: 'Data',
    tagColor: 'bg-amber-500/15 text-amber-400',
    description: 'How raw events become dashboards (and why it breaks)',
    prompt: "Explain data pipelines to me as a PM in plain language. Cover: what a data pipeline is (the path from raw event → warehouse → dashboard), why data is sometimes delayed or wrong, what ETL means, what a data warehouse is (Snowflake, BigQuery, Redshift) vs. a production database, why the data in Amplitude sometimes doesn't match the data in the data warehouse, and what PMs should do when they discover a data quality issue. How do I spec a data instrumentation requirement so the data team can build a reliable pipeline for my feature's metrics?",
  },
  {
    name: 'Performance & Latency',
    tag: 'Performance',
    tagColor: 'bg-emerald-500/15 text-emerald-400',
    description: 'Load time, response time & how they affect users',
    prompt: "Explain web and app performance to me as a Product Manager — enough to make smart product decisions about it. Cover: what latency is, what page load time means and why it matters (every 100ms of latency costs conversion), what Core Web Vitals are (LCP, FID, CLS), what causes slow APIs and how engineers fix them, what caching is and how it helps performance, and how to think about performance as a product feature (when to prioritize it vs. new features). Give me real examples of companies that made performance a product priority and the results they saw. How do I write a performance requirement in a spec?",
  },
  {
    name: 'Scalability & Uptime',
    tag: 'Performance',
    tagColor: 'bg-emerald-500/15 text-emerald-400',
    description: 'SLAs, 99.9% uptime & what happens when it breaks',
    prompt: "Explain scalability and uptime to me as a Product Manager. Cover: what 'scalability' means (handling more users/load without degrading), what uptime and SLAs mean (99.9% = ~8.7 hours downtime/year — what does that really mean?), what an incident is and what the PM's role is during one, what a post-mortem is and how to run one, and how to think about reliability as a product requirement. What does it cost to go from 99.9% to 99.99% uptime? How do I write a reliability or SLA requirement in a spec that engineering can actually build to?",
  },
  {
    name: 'Authentication & Authorization',
    tag: 'Security',
    tagColor: 'bg-rose-500/15 text-rose-400',
    description: 'Login, permissions & who can access what',
    prompt: "Explain authentication and authorization to me as a Product Manager — the difference matters for product design. Cover: what authentication is (proving who you are — login, SSO, MFA), what authorization is (what you're allowed to do — roles, permissions, access control), the difference between OAuth and SSO, what JWT tokens are in simple terms, and why these concepts affect product decisions like feature rollouts, admin panels, and enterprise features. Give me examples of product features where understanding auth/authz changed how the spec was written. What questions should I ask my security team before launching a new login or permissions feature?",
  },
  {
    name: 'GDPR & Data Privacy',
    tag: 'Security',
    tagColor: 'bg-rose-500/15 text-rose-400',
    description: 'What PMs must know about user data & compliance',
    prompt: "Explain GDPR, CCPA, and data privacy to me as a Product Manager — what I'm legally and ethically responsible for. Cover: what GDPR and CCPA require at a product level (consent, data deletion, data portability, right to be forgotten), what a privacy-by-design approach means, what PII is and why I need to track which data my product collects, what happens to a company when it violates GDPR, and how to work with Legal to build compliant features. Give me a data privacy checklist for new features. What are the most common product decisions that create GDPR risk without the PM realizing it?",
  },
  {
    name: 'How AI & ML Work',
    tag: 'AI / ML',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    description: 'Models, training data & what "accuracy" really means',
    prompt: "Explain AI and machine learning to me as a Product Manager — not to build models, but to make smart product decisions about AI features. Cover: what a machine learning model is (a system trained on data to make predictions), what training data is and why it matters for model quality, what 'model accuracy' means and why 95% accurate can still be a bad product, what bias in AI means and why it's a product risk, the difference between supervised and unsupervised learning in plain English, and what it means to 'retrain' a model. Give me examples of AI product decisions that went wrong because the PM didn't understand these concepts.",
  },
  {
    name: 'LLMs & Generative AI',
    tag: 'AI / ML',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    description: 'How ChatGPT-style AI works & product implications',
    prompt: "Explain Large Language Models (LLMs) and generative AI to me as a Product Manager building AI-powered features. Cover: what an LLM is and how it works at a conceptual level (next-token prediction, transformer architecture — no math needed), what a prompt is and why prompt engineering matters for product quality, what hallucinations are and why they're a product risk, what RAG (Retrieval-Augmented Generation) is and when to use it, the difference between fine-tuning and prompting, and what latency and token costs mean for product decisions. Give me a framework for evaluating whether to use AI for a product feature and what risks to anticipate.",
  },
  {
    name: 'Native vs Web vs Hybrid Apps',
    tag: 'Mobile',
    tagColor: 'bg-teal-500/15 text-teal-400',
    description: 'iOS, Android, React Native & when each makes sense',
    prompt: "Explain the difference between native, web, and hybrid mobile apps to me as a Product Manager — so I can make smart platform decisions. Cover: what native apps are (built specifically for iOS or Android), what web apps are (run in a browser), what hybrid/cross-platform apps are (React Native, Flutter), the tradeoffs in performance, development speed, and maintenance cost, and when each approach makes sense for a product. What questions should I ask engineering before deciding on a mobile strategy? What are the product implications of choosing React Native vs. native Swift/Kotlin?",
  },
  {
    name: 'App Store Review Process',
    tag: 'Mobile',
    tagColor: 'bg-teal-500/15 text-teal-400',
    description: 'iOS & Android submission, rejection risks & timelines',
    prompt: "Explain the App Store (iOS) and Play Store (Android) review process to me as a Product Manager — this directly affects my release planning. Cover: how long review takes for each store, what the most common reasons for rejection are (and how to avoid them), what expedited review is and when to use it, how to handle a rejection that blocks a critical launch, how the review process affects how I plan mobile releases, and what the difference is between a 'hotfix' submission and a regular release. Give me a mobile launch checklist that accounts for app store review timelines.",
  },
  {
    name: 'Webhooks & Integrations',
    tag: 'Integrations',
    tagColor: 'bg-orange-500/15 text-orange-400',
    description: 'How systems talk to each other in real time',
    prompt: "Explain webhooks and third-party integrations to me as a Product Manager. Cover: what a webhook is (a push notification between systems — when X happens in System A, it automatically tells System B), how webhooks differ from polling APIs, what the most common integration patterns are, what failure modes exist (webhook retries, dead letter queues), and how to spec an integration requirement so engineering can build it reliably. Give me examples of product features that rely on webhooks (Slack notifications, Stripe payments, Zapier) and what can go wrong. What questions should I ask when evaluating whether to build or buy an integration?",
  },
  {
    name: 'Rate Limits & API Quotas',
    tag: 'Integrations',
    tagColor: 'bg-orange-500/15 text-orange-400',
    description: 'Why "just call the API" has limits — and what to do',
    prompt: "Explain API rate limits and quotas to me as a Product Manager. Cover: what a rate limit is (a cap on how many API calls you can make in a time window), why third-party APIs have rate limits, what happens when you hit a rate limit (errors, degraded experience), how rate limits affect product design decisions (like real-time data refresh, bulk imports, or notification volume), and how engineers typically handle rate limits (caching, queuing, backoff strategies). Give me 3 real product examples where rate limits created unexpected constraints. What should I ask when evaluating a third-party API for a new feature?",
  },
]

// ── Meetings ──────────────────────────────────────────────────────────────────

const CADENCE_COLORS: Record<string, string> = {
  'Daily':      'bg-rose-500/15 text-rose-400',
  'Weekly':     'bg-emerald-500/15 text-emerald-400',
  'Bi-weekly':  'bg-indigo-500/15 text-indigo-400',
  'Monthly':    'bg-amber-500/15 text-amber-400',
  'Quarterly':  'bg-violet-500/15 text-violet-400',
  'As needed':  'bg-zinc-500/15 text-zinc-400',
}

const MEETINGS = [
  // ── 1:1s ──
  {
    name: '1:1 with Your Manager',
    cadence: 'Weekly',
    category: '1:1s',
    description: 'Alignment, blockers & career growth',
    prompt: "Give me a complete guide to running my weekly 1:1 with my manager as a Product Manager. Cover: what to put on the agenda (status updates vs. topics that need discussion vs. career development), how to come prepared so the time is valuable, how to use 1:1s to get unblocked fast, how to bring up concerns without seeming negative, and how to follow up after the meeting. Include a reusable 1:1 agenda template I can use every week. What mistakes do PMs make in manager 1:1s that hurt their career?",
  },
  {
    name: '1:1 with Engineering Manager',
    cadence: 'Bi-weekly',
    category: '1:1s',
    description: 'Delivery health, priorities & trust building',
    prompt: "Give me a guide to running effective bi-weekly 1:1s with my Engineering Manager as a PM. Cover: what topics to bring (upcoming spec clarity, delivery risks, resourcing, team morale signals), what the EM needs from me to do their job well, how to build a strong PM-EM relationship that makes the whole team faster, how to handle disagreements about scope or timeline in 1:1s, and how to follow up. Include a reusable agenda template. What do Engineering Managers wish PMs understood about their role?",
  },
  {
    name: '1:1 with Tech Lead',
    cadence: 'Weekly',
    category: '1:1s',
    description: 'Technical feasibility & early problem-solving',
    prompt: "Give me a guide to running effective weekly 1:1s with my Tech Lead as a PM. Cover: what to discuss (upcoming technical decisions, feasibility questions, architecture concerns, dependency risks), how to build trust with a technical lead when you're non-technical, what questions to ask to surface technical risks early, how to balance technical debt conversations vs. feature discussions, and how to follow up on decisions made. Include an agenda template. What do Tech Leads wish PMs knew about working with them?",
  },
  {
    name: '1:1 with Product Designer',
    cadence: 'Bi-weekly',
    category: '1:1s',
    description: 'Design direction, feedback & collaboration',
    prompt: "Give me a guide to running effective 1:1s with my Product Designer as a PM. Cover: what to discuss (upcoming design work, feedback on in-progress designs, research plans, bandwidth and timeline), how to give good design feedback in a 1:1 vs. a formal design review, how to involve design earlier in discovery, how to handle disagreements about design direction, and how to follow up. What does a healthy PM-designer working relationship actually look like day to day?",
  },
  {
    name: '1:1 with Other PMs',
    cadence: 'Monthly',
    category: '1:1s',
    description: 'Knowledge sharing & cross-product alignment',
    prompt: "Give me a guide to running effective monthly 1:1s with peer Product Managers. Cover: what to discuss (cross-product dependencies, shared learnings, industry observations, career feedback), how to make peer PM 1:1s genuinely useful vs. just a catch-up, how to use peer PMs as a sounding board for difficult decisions, how to share roadmap context that prevents surprises, and how to follow up on action items. How do the best PMs use their peer network to grow faster?",
  },
  // ── Engineering ceremonies ──
  {
    name: 'Daily Standup',
    cadence: 'Daily',
    category: 'Engineering',
    description: 'Blockers, progress & team sync',
    prompt: "Give me a complete guide to the daily standup from a Product Manager's perspective. Cover: what the PM's role is in standup (observer vs. active participant), what to listen for (blockers, scope creep signals, morale issues), what PMs should and should not say in standup, how to handle it when standup turns into a problem-solving session, how to follow up on blockers raised in standup same-day, and what a healthy vs. dysfunctional standup looks like. How should a PM respond when a standup reveals the sprint is off track?",
  },
  {
    name: 'Sprint Planning',
    cadence: 'Bi-weekly',
    category: 'Engineering',
    description: 'Scope, stories & sprint commitment',
    prompt: "Give me a complete guide to sprint planning for Product Managers. Cover: how to prepare the backlog before planning (story refinement, acceptance criteria, prioritization), what happens during sprint planning and the PM's role, how to facilitate a realistic capacity conversation with the team, how to handle scope pushback from engineering, how to set sprint goals that are meaningful (not just a list of tickets), and how to follow up after planning. Include a sprint planning checklist. What makes a sprint planning session go badly, and how do I prevent it?",
  },
  {
    name: 'Sprint Retrospective',
    cadence: 'Bi-weekly',
    category: 'Engineering',
    description: 'Process improvement & team health',
    prompt: "Give me a complete guide to sprint retrospectives for Product Managers. Cover: what the PM's role is in retro (facilitator vs. participant), the best retro formats (Start/Stop/Continue, 4Ls, Mad/Sad/Glad), how to create psychological safety so people say what's actually wrong, how to turn retro feedback into real process changes (not just a list that gets ignored), and how to follow up on action items between retros. What are the most common retro anti-patterns? How do I run a retro when there's real tension on the team?",
  },
  {
    name: 'Epic Kickoff',
    cadence: 'As needed',
    category: 'Engineering',
    description: 'Align the team before building starts',
    prompt: "Give me a complete guide to running an epic kickoff meeting as a Product Manager. Cover: what should be ready before the kickoff (spec, design, acceptance criteria, success metrics), who to invite, the agenda for the session (problem context → solution walkthrough → open questions → task breakdown → timeline), how to handle technical questions you can't answer on the spot, and how to follow up after the kickoff. Include an epic kickoff agenda template. What happens when you skip the kickoff, and what problems does it cause?",
  },
  {
    name: 'Backlog Grooming',
    cadence: 'Weekly',
    category: 'Engineering',
    description: 'Refine, estimate & sequence upcoming work',
    prompt: "Give me a complete guide to backlog grooming (refinement) for Product Managers. Cover: what grooming is and why it matters, how to prepare stories for grooming (what 'ready' looks like), how to run the session (walking through stories, clarifying requirements, estimation), how to handle stories that are too big or too vague, how to prioritize what gets groomed first, and how to follow up. Include a checklist for what makes a story 'groomed and ready.' How often should grooming happen and how long should it take?",
  },
  // ── Product meetings ──
  {
    name: 'Product Area Sync',
    cadence: 'Weekly',
    category: 'Product',
    description: 'Team status, risks & decisions',
    prompt: "Give me a guide to running effective weekly product area sync meetings as a PM. Cover: what to put on the agenda (sprint status, upcoming milestones, risks, decisions needed, cross-team dependencies), how to run it efficiently so it doesn't become a status read-out, how to create a shared doc that captures decisions and action items, how to follow up on items raised, and how to keep the meeting from becoming bloated over time. Include a reusable sync agenda template. What's the difference between a good product sync and one that wastes everyone's time?",
  },
  {
    name: 'Roadmap Presentation',
    cadence: 'Quarterly',
    category: 'Product',
    description: 'Share the plan, get alignment & buy-in',
    prompt: "Give me a complete guide to presenting the product roadmap to stakeholders as a PM. Cover: how to structure the presentation (context → strategy → roadmap → how we decided → what we need), how to present uncertainty without losing confidence, how to handle stakeholders who want to see different things on the roadmap, how to present to engineering vs. sales vs. executives (different audiences, different emphasis), how to follow up after the presentation, and how to document the decisions made. What are the most common mistakes PMs make in roadmap presentations?",
  },
  {
    name: 'Requirements Review',
    cadence: 'As needed',
    category: 'Product',
    description: 'Validate specs with engineering & design',
    prompt: "Give me a guide to running a requirements review meeting as a PM. Cover: when to call a requirements review vs. just sharing a doc for async review, who should attend (engineering lead, design, QA, sometimes data), how to walk through a spec without just reading it aloud, how to capture open questions and decisions in real time, how to handle scope challenges from engineering, and how to follow up with a decisions log. Include an agenda template. What makes the difference between a requirements review that unblocks a team vs. one that creates more confusion?",
  },
  // ── Cross-functional ──
  {
    name: 'Customer Call',
    cadence: 'Weekly',
    category: 'Cross-functional',
    description: 'Discovery, feedback & relationship building',
    prompt: "Give me a complete guide to customer calls for Product Managers. Cover: the different types of customer calls (discovery interview, feedback session, QBR, escalation, sales support), how to prepare for each type, the most important questions to ask and the ones to avoid, how to listen for what customers mean vs. what they say, how to take notes that turn into product decisions, and how to follow up with the customer after the call. Include a customer interview question guide. How do I synthesize learnings across multiple customer calls to find real patterns?",
  },
  {
    name: 'Cross-Functional Sync',
    cadence: 'Bi-weekly',
    category: 'Cross-functional',
    description: 'Align with Sales, Marketing, CS & Ops',
    prompt: "Give me a guide to running effective cross-functional sync meetings as a Product Manager. Cover: who to include and why (Sales, Marketing, Customer Success, Operations — and when to include each), how to structure the agenda so every team gets value (what's launching, what's coming, what we need from each team), how to prevent it from becoming a complaint session, how to capture and follow up on cross-functional action items, and how to make these meetings feel useful rather than obligatory. What's the right cadence for cross-functional syncs at different company sizes?",
  },
  {
    name: 'UX Research Readout',
    cadence: 'As needed',
    category: 'Cross-functional',
    description: 'Share insights & align on next steps',
    prompt: "Give me a guide to running a UX research readout meeting as a PM. Cover: how to structure the readout (research goals → methodology → key findings → implications → recommended next steps), how to present qualitative findings to an audience that wants data, how to facilitate the 'so what do we do with this?' conversation, how to handle findings that contradict the team's assumptions, and how to follow up with a written summary and action items. How do I make sure research findings actually influence product decisions rather than getting filed away?",
  },
  // ── Launch ──
  {
    name: 'Pre-Launch Readiness Review',
    cadence: 'As needed',
    category: 'Launch',
    description: 'Go / No-go decision before shipping',
    prompt: "Give me a complete guide to running a pre-launch readiness review as a PM. Cover: what a launch readiness checklist looks like (feature complete, QA done, docs ready, GTM prepared, rollback plan in place, metrics instrumented, support team briefed), who should be in the readiness review meeting, how to run a go/no-go vote, how to handle disagreements about whether you're ready, and how to follow up after the meeting (launch day communication, monitoring plan). Include a launch readiness checklist template. What are the most common things teams think are ready but aren't?",
  },
  {
    name: 'Go-to-Market Sync',
    cadence: 'As needed',
    category: 'Launch',
    description: 'Align on launch messaging, timing & channels',
    prompt: "Give me a guide to running a go-to-market (GTM) sync meeting as a Product Manager. Cover: who to include (Marketing, Sales, Customer Success, Support, sometimes Legal), what to cover in the session (launch date, ICP targeting, messaging and positioning, launch channels, enablement needs for Sales and CS, pricing and packaging), how to assign owners for each GTM workstream, and how to follow up with a GTM tracker doc. What does a great PM-owned GTM sync look like vs. a disorganized one? Include a GTM sync agenda template.",
  },
]

// ── Teams ─────────────────────────────────────────────────────────────────────

const TEAMS = [
  {
    name: 'Sales',
    icon: '💼',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    tagColor: 'bg-emerald-500/15 text-emerald-400',
    focus: 'Revenue, quotas & deal velocity',
    prompt: "Give me a complete PM guide to working with the Sales team. Cover: what Sales cares about most (quota attainment, deal velocity, win rate, competitive differentiators), the metrics they live by, what they typically need from Product (and where conflict arises), how to run a productive sales-product feedback session, how to present the roadmap to Sales in a way they actually care about, and how to say no to a sales-driven feature request without damaging the relationship. Include real examples of PM-Sales collaboration done well and done poorly.",
  },
  {
    name: 'Marketing',
    icon: '📣',
    iconBg: 'bg-pink-500/15',
    iconColor: 'text-pink-400',
    tagColor: 'bg-pink-500/15 text-pink-400',
    focus: 'Pipeline, brand & go-to-market',
    prompt: "Give me a complete PM guide to working with Marketing. Cover: what Marketing cares about (pipeline generation, MQLs, brand positioning, content, campaigns, demand gen), the metrics they live by, what they need from Product (messaging, release timing, case studies), how to collaborate on a product launch, how to brief Marketing on a new feature so they can position it correctly, and how to navigate disagreements about launch timing or messaging. What does great PM-Marketing collaboration look like in a B2B SaaS company?",
  },
  {
    name: 'Finance',
    icon: '💰',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    tagColor: 'bg-amber-500/15 text-amber-400',
    focus: 'ROI, budget & unit economics',
    prompt: "Give me a complete PM guide to working with Finance. Cover: what Finance cares about (ROI, budget allocation, cost reduction, revenue forecasting, unit economics, payback period), the metrics they track, what they need from Product (business cases, cost estimates, revenue projections), how to build a business case that Finance will approve, how to justify product investment with data, and how to handle budget cuts to the product roadmap. What language should a PM use when presenting to CFOs or Finance business partners?",
  },
  {
    name: 'Engineering',
    icon: '⚙️',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    focus: 'Reliability, velocity & tech debt',
    prompt: "Give me a complete PM guide to working with Engineering effectively. Cover: what engineers care about (technical debt, code quality, architecture, system reliability, scalability, clear requirements), the metrics they track (velocity, lead time, deployment frequency, incident rate), what makes engineers frustrated with PMs, how to write specs that engineers can actually build from, how to handle the tech debt vs. feature tradeoff conversation, how to run sprint planning well, and how to build genuine trust with your engineering lead. What separates PMs that engineers love from ones they dread working with?",
  },
  {
    name: 'Design & UX',
    icon: '🎨',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    tagColor: 'bg-violet-500/15 text-violet-400',
    focus: 'Usability, accessibility & design systems',
    prompt: "Give me a complete PM guide to working with Design and UX. Cover: what designers care about (user experience quality, accessibility, design system consistency, time for proper research and iteration), the metrics they track (usability scores, task completion, error rates, NPS), what frustrates designers about PMs (jumping to solutions, skipping discovery, compressing design timelines), how to give good design feedback, how to involve design early in discovery, and how to build a strong PM-design partnership. What does a healthy PM-design workflow look like from kick-off to handoff?",
  },
  {
    name: 'Data & BI',
    icon: '📊',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    tagColor: 'bg-sky-500/15 text-sky-400',
    focus: 'Dashboards, data quality & insights',
    prompt: "Give me a complete PM guide to working with the Data and BI team. Cover: what Data/BI cares about (data quality, pipeline reliability, dashboard accuracy, self-serve analytics, governance), the metrics they track, what they need from Product (instrumentation requirements, data contracts, event taxonomies), how to write a good analytics requirements doc, how to prioritize BI work alongside feature work, and how to build a collaborative relationship so data insights actually influence product decisions. What are the most common mistakes PMs make when working with data teams?",
  },
  {
    name: 'Customer Success',
    icon: '🤝',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    tagColor: 'bg-teal-500/15 text-teal-400',
    focus: 'Retention, NPS & churn prevention',
    prompt: "Give me a complete PM guide to working with Customer Success (CS). Cover: what CS cares about (retention rate, churn, NPS, time-to-value, customer health scores, expansion revenue), the metrics they live by, what they need from Product (faster fixes for customer pain points, better onboarding, release notes they can share), how to run a productive CS-product feedback session, how to use CS data to prioritize the roadmap, and how to handle the tension between new feature requests from CS vs. strategic roadmap work. What does great PM-CS collaboration look like?",
  },
  {
    name: 'Operations',
    icon: '⚡',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    tagColor: 'bg-orange-500/15 text-orange-400',
    focus: 'Efficiency, processes & scalability',
    prompt: "Give me a complete PM guide to working with the Operations team. Cover: what Ops cares about (process efficiency, cost per unit, error rates, SLA compliance, operational scalability), the metrics they track, what they need from Product (tools that reduce manual work, automation, reliable integrations), how to uncover operational pain points that should be product problems, how to prioritize internal tooling alongside customer-facing features, and how to run a discovery session with an ops team that isn't used to being asked what they need. What are the best examples of product teams building for internal operations?",
  },
  {
    name: 'Legal & Compliance',
    icon: '⚖️',
    iconBg: 'bg-zinc-500/15',
    iconColor: 'text-zinc-400',
    tagColor: 'bg-zinc-500/15 text-zinc-400',
    focus: 'Risk, privacy & regulatory compliance',
    prompt: "Give me a complete PM guide to working with Legal and Compliance. Cover: what Legal cares about (regulatory compliance, data privacy, GDPR/CCPA, terms of service, IP risk, liability), how they think about product decisions differently from PMs, what they need from Product (early involvement, clear documentation, time to review), how to involve Legal early so they don't become a launch blocker, how to navigate a situation where Legal wants to kill a feature, and how to build a working relationship where Legal is a partner not a gatekeeper. What are the most common Legal-Product conflicts and how do they get resolved?",
  },
  {
    name: 'HR & People',
    icon: '👥',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    tagColor: 'bg-rose-500/15 text-rose-400',
    focus: 'Hiring, culture & employee experience',
    prompt: "Give me a complete PM guide to working with HR and People teams — both as a cross-functional partner and as a consumer of their work. Cover: what HR cares about (employee engagement, retention, time-to-hire, culture, DEI, performance management), how they measure success, what they need from Product (headcount clarity, job descriptions, interview panel time, manager feedback), how to partner with HR when scaling a product team, how to navigate difficult people situations (underperformers, team conflict) with HR support, and what PMs building HR tech or internal tools should know about this team's pain points.",
  },
]

// ── Frameworks ───────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    name: 'RICE Scoring',
    tag: 'Prioritization',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    description: 'Reach · Impact · Confidence · Effort',
    prompt: "Teach me the RICE prioritization framework in depth. Cover: exactly how to calculate a RICE score (Reach × Impact × Confidence / Effort), what each factor means and how to estimate it, common mistakes teams make, when RICE works well vs. when it falls short, and walk me through a real worked example with a sample backlog of 5 features.",
  },
  {
    name: 'OKRs',
    tag: 'Goal Setting',
    tagColor: 'bg-emerald-500/15 text-emerald-400',
    description: 'Objectives & Key Results',
    prompt: "Give me a complete guide to OKRs (Objectives and Key Results) for Product Managers. Cover: what makes a great Objective vs. a weak one, how to write measurable Key Results that aren't just tasks, how OKRs connect to the product roadmap, common OKR mistakes (like setting too many or making them output-based), and walk me through writing a full set of OKRs for a B2B SaaS product team.",
  },
  {
    name: 'Jobs-to-be-Done',
    tag: 'Discovery',
    tagColor: 'bg-violet-500/15 text-violet-400',
    description: 'What job is the customer hiring your product to do?',
    prompt: "Explain the Jobs-to-be-Done (JTBD) framework in depth for Product Managers. Cover: what a 'job' is (functional, emotional, social), the difference between JTBD and user personas, how to run a JTBD interview, the switch interview technique, how to write a Job Statement, and how to use JTBD insights to make better product decisions. Give me a real example of how a company used JTBD to find a non-obvious insight.",
  },
  {
    name: 'North Star Metric',
    tag: 'Strategy',
    tagColor: 'bg-amber-500/15 text-amber-400',
    description: 'The single metric that captures the core value you deliver',
    prompt: "Teach me everything about the North Star Metric framework for Product Managers. Cover: what a North Star Metric is and why it matters, how to choose the right one (and what makes a bad North Star), how it relates to input metrics and leading indicators, how to align the team around it, and give me 5 real examples of North Star Metrics from well-known products (Airbnb, Spotify, Slack, etc.) and why they work.",
  },
  {
    name: 'Value Proposition Canvas',
    tag: 'Discovery',
    tagColor: 'bg-teal-500/15 text-teal-400',
    description: 'Map customer jobs, pains, and gains to your product',
    prompt: "Walk me through the Value Proposition Canvas framework in depth. Cover: the Customer Profile side (jobs, pains, gains) and the Value Map side (products & services, pain relievers, gain creators), how to fill it out using real customer research, how to achieve product-market fit using the canvas, and give me a worked example using a real product. How do I use this in a product discovery workshop with my team?",
  },
  {
    name: 'MoSCoW Method',
    tag: 'Prioritization',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    description: 'Must have · Should have · Could have · Won\'t have',
    prompt: "Explain the MoSCoW prioritization method for Product Managers. Cover: what each category means (Must, Should, Could, Won't), how to facilitate a MoSCoW session with stakeholders, the most common mistake (everything becomes Must Have), when to use MoSCoW vs. RICE or ICE, and walk me through a realistic example of running a MoSCoW session for a product release scope.",
  },
  {
    name: 'Kano Model',
    tag: 'Prioritization',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    description: 'Categorize features by customer delight',
    prompt: "Teach me the Kano Model and how Product Managers use it. Cover: the 5 categories (Basic, Performance, Excitement/Delight, Indifferent, Reverse), how to run a Kano survey to categorize features, how to use Kano results to make prioritization decisions, and give me a real example of a product team discovering that a feature they planned to build was 'Indifferent' to customers.",
  },
  {
    name: 'Opportunity Solution Tree',
    tag: 'Discovery',
    tagColor: 'bg-violet-500/15 text-violet-400',
    description: 'Connect outcomes to opportunities to solutions',
    prompt: "Explain the Opportunity Solution Tree (OST) framework by Teresa Torres for Product Managers. Cover: what the 4 levels are (desired outcome → opportunities → solutions → experiments), how to build one with your team, how it prevents jumping straight to solutions, and how it connects continuous discovery to delivery. Give me a step-by-step example of building an OST for a B2C app trying to improve retention.",
  },
  {
    name: 'Story Mapping',
    tag: 'Planning',
    tagColor: 'bg-rose-500/15 text-rose-400',
    description: 'Map user journeys to plan releases',
    prompt: "Walk me through User Story Mapping as a product planning technique. Cover: what a story map looks like (user activities → user tasks → story slices), how it's different from a flat backlog, how to run a story mapping session with the team, how to use it to define MVP scope and release slices, and give me a worked example of a story map for a feature like 'user onboarding'. What tool should I use?",
  },
  {
    name: 'Heart Framework',
    tag: 'Metrics',
    tagColor: 'bg-pink-500/15 text-pink-400',
    description: 'Happiness · Engagement · Adoption · Retention · Task Success',
    prompt: "Explain Google's HEART framework for product metrics. Cover: what each dimension measures (Happiness, Engagement, Adoption, Retention, Task Success), how to define Goals-Signals-Metrics for each, how to choose which dimensions matter most for your product, and give me a real example of a PM applying the HEART framework to a specific product or feature. How does HEART compare to the AARRR pirate metrics?",
  },
  {
    name: 'AARRR Pirate Metrics',
    tag: 'Metrics',
    tagColor: 'bg-pink-500/15 text-pink-400',
    description: 'Acquisition · Activation · Retention · Referral · Revenue',
    prompt: "Teach me the AARRR (Pirate Metrics) framework by Dave McClure for Product Managers. Cover: what each stage measures and what good metrics look like at each stage, how to identify which stage is your biggest bottleneck, how to run a funnel analysis, and walk me through a worked example of applying AARRR to a SaaS product. How does AARRR connect to the North Star Metric?",
  },
  {
    name: 'ICE Scoring',
    tag: 'Prioritization',
    tagColor: 'bg-indigo-500/15 text-indigo-400',
    description: 'Impact · Confidence · Ease',
    prompt: "Explain the ICE scoring prioritization framework for Product Managers. Cover: how to score Impact, Confidence, and Ease (1–10 scale), how ICE differs from RICE, when to use ICE instead of RICE (speed vs. precision tradeoff), how to run an ICE scoring session with your team, and give me a worked example comparing 6 features using ICE scores. What are the limitations I should watch out for?",
  },
]

// ── Tab types ─────────────────────────────────────────────────────────────────

type Tab = 'books' | 'situations' | 'frameworks' | 'teams' | 'meetings' | 'technical'

// ── Main component ─────────────────────────────────────────────────────────────

export default function ActionCards({ onSend, isStreaming }: Props) {
  const { user } = useAuth()
  const firstName = user?.email?.split('@')[0]?.split('.')[0] ?? 'there'
  const name = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  const [activeTab, setActiveTab] = useState<Tab>('books')

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 select-none">

      {/* Greeting */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">
          {greeting()}, {name}.
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          What are you working on today?
        </p>
      </div>

      {/* Quick action cards */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {SUGGESTIONS.map(s => (
          <button
            key={s.label}
            onClick={() => onSend(s.prompt, 'pm')}
            disabled={isStreaming}
            className="flex flex-col items-start gap-3 px-4 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-600 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg} ${s.iconColor} transition-transform group-hover:scale-110`}>
              {s.icon}
            </span>
            <span className="text-[12px] font-semibold text-zinc-300 group-hover:text-white transition-colors leading-snug">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Resource tabs */}
      <div className="w-full max-w-2xl">
        {/* Tab headers */}
        <div className="flex items-center gap-1 mb-3 border-b border-zinc-800 pb-0">
          {([
            { key: 'books',      label: '📚 PM Books' },
            { key: 'situations', label: '🎯 Situations' },
            { key: 'frameworks', label: '🧠 Frameworks' },
            { key: 'teams',      label: '🏢 Teams' },
            { key: 'meetings',   label: '📅 Meetings' },
            { key: 'technical',  label: '⚙️ Technical' },
          ] as { key: Tab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                'px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors -mb-px border-b-2',
                activeTab === tab.key
                  ? 'text-zinc-100 border-indigo-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Books tab */}
        {activeTab === 'books' && (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {PM_BOOKS.map(book => (
              <button
                key={book.title}
                onClick={() => onSend(book.prompt, 'pm')}
                disabled={isStreaming}
                className={[
                  'flex-shrink-0 w-[100px] rounded-xl border overflow-hidden text-left transition-all hover:scale-105 hover:shadow-lg hover:shadow-black/40 disabled:opacity-40 disabled:cursor-not-allowed',
                  book.accent,
                ].join(' ')}
              >
                {/* Book cover */}
                <div className={`${book.bg} h-[120px] p-2.5 flex flex-col justify-between`}>
                  <p className={`text-[11px] font-black leading-tight ${book.titleColor}`}>
                    {book.title}
                  </p>
                  <p className={`text-[9px] font-medium leading-tight ${book.authorColor}`}>
                    {book.author}
                  </p>
                </div>
                {/* Ask button strip */}
                <div className="bg-zinc-900 px-2 py-1.5 border-t border-zinc-800">
                  <p className="text-[9px] text-indigo-400 font-semibold">Ask AI →</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Situations tab */}
        {activeTab === 'situations' && (
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {SITUATIONS.map(s => (
              <button
                key={s.label}
                onClick={() => onSend(s.prompt, 'pm')}
                disabled={isStreaming}
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className="text-base leading-none mt-0.5 flex-shrink-0">{s.emoji}</span>
                <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors leading-snug">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Frameworks tab */}
        {activeTab === 'frameworks' && (
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {FRAMEWORKS.map(f => (
              <button
                key={f.name}
                onClick={() => onSend(f.prompt, 'pm')}
                disabled={isStreaming}
                className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {f.name}
                  </span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${f.tagColor}`}>
                    {f.tag}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-snug group-hover:text-zinc-400 transition-colors">
                  {f.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Teams tab */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {TEAMS.map(t => (
              <button
                key={t.name}
                onClick={() => onSend(t.prompt, 'pm')}
                disabled={isStreaming}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base ${t.iconBg}`}>
                  {t.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-snug group-hover:text-zinc-400 transition-colors mt-0.5">
                    {t.focus}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Meetings tab */}
        {activeTab === 'meetings' && (
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {MEETINGS.map(m => (
              <button
                key={m.name}
                onClick={() => onSend(m.prompt, 'pm')}
                disabled={isStreaming}
                className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                    {m.name}
                  </span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${CADENCE_COLORS[m.cadence]}`}>
                    {m.cadence}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-snug group-hover:text-zinc-400 transition-colors">
                  {m.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Technical tab */}
        {activeTab === 'technical' && (
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {TECH_TOPICS.map(t => (
              <button
                key={t.name}
                onClick={() => onSend(t.prompt, 'pm')}
                disabled={isStreaming}
                className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                    {t.name}
                  </span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap ${t.tagColor}`}>
                    {t.tag}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-snug group-hover:text-zinc-400 transition-colors">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
