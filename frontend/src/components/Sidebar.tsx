import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccountMenu from './AccountMenu'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatSession {
  id: string
  title: string
  updatedAt: string
}

interface Props {
  currentSessionId: string
  sessions: ChatSession[]
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
  onSelectTemplate: (prompt: string) => void
  isStreaming: boolean
}

interface StepItem {
  label: string
  prompt: string
}

interface StepTool {
  label: string
  category: string
  prompt: string
}

interface RoadmapStepData {
  number: number
  label: string
  color: string
  badge: string
  items: StepItem[]
  tools: StepTool[]
}

// ── PM Roadmap steps ──────────────────────────────────────────────────────────

const ROADMAP_STEPS: RoadmapStepData[] = [
  {
    number: 1,
    label: 'Product Discovery & Ideation',
    color: 'text-violet-400',
    badge: 'bg-violet-500/20 text-violet-300',
    items: [
      {
        label: 'Problem Identification',
        prompt: "Teach me how to identify a real product problem worth solving. Give me a framework for spotting user 'symptoms' vs. root causes, and show me a real-world example of how a PM identified a problem that led to a successful product.",
      },
      {
        label: 'Customer Research',
        prompt: "Walk me through how to run effective customer interviews and market research as a PM. Include: what questions to ask, how to avoid leading questions, how to spot patterns across interviews, and how to turn research findings into actionable insights. Give me a practical example.",
      },
      {
        label: 'Idea Management',
        prompt: "How do I build and manage a product idea backlog effectively? Explain how to collect, organize, and screen ideas from customers, support tickets, sales, and internal stakeholders. Include a framework for scoring and filtering ideas before they hit the roadmap.",
      },
    ],
    tools: [
      {
        label: 'Hotjar',
        category: 'Analytics',
        prompt: "Tell me everything a PM needs to know about Hotjar. What is it, what does it do, and why is it valuable in the Discovery phase? Cover: heatmaps, session recordings, feedback polls, and funnels. How do I use Hotjar to uncover user pain points I didn't know existed? What are the key features a PM should use first? What's the pricing like, and what are the best alternatives (e.g. FullStory, Microsoft Clarity)?",
      },
      {
        label: 'Maze',
        category: 'User Testing',
        prompt: "Explain Maze to me as a PM tool. What problem does it solve, and why is it useful in product discovery? Cover: rapid prototype testing, unmoderated usability tests, heatmaps, and analytics on task completion rates. How do I set up my first Maze test on a Figma prototype? What metrics should I look at in the results? What's the pricing, and how does it compare to UserTesting or Lookback?",
      },
      {
        label: 'UserTesting',
        category: 'User Research',
        prompt: "Give me a complete PM's guide to UserTesting (the platform). What is it used for in the discovery phase, and what types of studies can I run? Cover: moderated vs. unmoderated tests, remote interviews, and panel recruitment. How do I write a good test plan? What should I look for when reviewing recordings? How does it compare to Maze, Lookback, and Dscout in terms of use case and cost?",
      },
      {
        label: 'Miro',
        category: 'Collaboration',
        prompt: "How do PMs use Miro during product discovery and ideation? Walk me through the most useful Miro templates for PMs: affinity mapping, journey mapping, assumption mapping, and How Might We brainstorming. How do I run a remote discovery workshop in Miro? What's the best way to organize findings from customer interviews in Miro? How does it compare to FigJam and Lucidspark?",
      },
      {
        label: 'Typeform',
        category: 'Surveys',
        prompt: "Explain how PMs use Typeform in the discovery phase. What makes Typeform better than a standard Google Form for user research? Cover: conversational survey design, logic branching, and response analytics. How do I design a discovery survey that actually gets useful answers? What questions should I avoid? How do I analyze the results? What are the best alternatives like SurveyMonkey, Tally, or Sprig for user research?",
      },
      {
        label: 'Productboard',
        category: 'Idea Management',
        prompt: "Give me a PM's guide to Productboard. What problem does it solve, and when should I use it over a simple spreadsheet or Jira? Cover: capturing user feedback, linking insights to features, prioritization scoring, and roadmap views. How do I set up Productboard to funnel feedback from Intercom, Zendesk, and Slack into one place? What's the pricing, and how does it compare to Aha!, Pendo Feedback, and Canny?",
      },
      {
        label: 'Dovetail',
        category: 'Research Ops',
        prompt: "What is Dovetail and why is it considered one of the best tools for PMs doing qualitative research? Cover: tagging interview transcripts, building a research repository, finding themes across studies, and sharing insights with stakeholders. How do I import an interview transcript and extract key insights in Dovetail? What's the workflow for building a living research repository? How does it compare to Notion, Airtable, or EnjoyHQ for research ops?",
      },
    ],
  },
  {
    number: 2,
    label: 'Strategy & Defining the Vision',
    color: 'text-indigo-400',
    badge: 'bg-indigo-500/20 text-indigo-300',
    items: [
      {
        label: 'Product Vision',
        prompt: "Help me understand how to craft a compelling product vision. What makes a vision statement powerful vs. generic? Show me examples of strong product visions (like Spotify or Airbnb) and walk me through how to write one for my own product.",
      },
      {
        label: 'Value Proposition',
        prompt: "Teach me how to define a clear value proposition for my product. Walk me through the Value Proposition Canvas framework and show me how to use it to identify what makes my product unique compared to competitors. Give me a real example.",
      },
      {
        label: 'Roadmapping',
        prompt: "Explain how to build a product roadmap that leadership and engineering will actually trust. Cover: Now/Next/Later vs. timeline roadmaps, how to communicate tradeoffs, how to handle stakeholder pressure, and what a good vs. bad roadmap looks like. Include an example.",
      },
    ],
    tools: [
      {
        label: 'Aha!',
        category: 'Roadmapping',
        prompt: "Give me a full PM's guide to Aha! (the product management platform). What is it, and why do enterprise PMs use it over Jira or Productboard for strategy? Cover: goals and initiatives, roadmap views (now/next/later, Gantt, timeline), OKR tracking, and stakeholder sharing. How do I set up a product strategy hierarchy in Aha!? What's the learning curve like? How does it compare to Productboard, Airfocus, and ProdPad for strategy work?",
      },
      {
        label: 'ProductPlan',
        category: 'Roadmapping',
        prompt: "Explain ProductPlan to me as a PM. What is it designed for, and when should I use it instead of a spreadsheet or Aha!? Cover: building visual roadmaps, sharing with stakeholders without giving edit access, and the parking lot for unscheduled ideas. How do I create a Now/Next/Later roadmap in ProductPlan? How do I present it to executives? What's the pricing, and how does it compare to Roadmunk and Aha!?",
      },
      {
        label: 'Miro',
        category: 'Strategy Workshops',
        prompt: "How do PMs use Miro specifically for strategy work — not just ideation? Cover: building strategy canvases (Business Model Canvas, Lean Canvas, SWOT), running remote strategy workshops, creating OKR trees, and mapping competitive landscapes. Give me a step-by-step guide for running a product strategy workshop in Miro with a distributed team.",
      },
      {
        label: 'Confluence',
        category: 'Documentation',
        prompt: "How should a PM use Confluence effectively for product strategy documentation? Cover: writing and maintaining a product vision doc, creating a product strategy page, managing meeting notes, and setting up a PM wiki. What are the best Confluence page templates for PMs? How do I keep strategy docs from going stale? How does Confluence compare to Notion for PM documentation, and when should I choose one over the other?",
      },
      {
        label: 'Notion',
        category: 'Documentation',
        prompt: "Give me a PM's guide to using Notion for product strategy. What makes Notion uniquely powerful compared to Confluence or Google Docs for PMs? Cover: building a product wiki, creating a strategy database with linked pages, managing OKRs in a database, and sharing with stakeholders. What are the best Notion templates for PMs? Walk me through setting up a product strategy hub in Notion from scratch.",
      },
      {
        label: 'Productboard',
        category: 'Vision & Prioritization',
        prompt: "How do PMs use Productboard specifically for strategy and vision alignment? Cover: defining product objectives in Productboard, linking features to strategic initiatives, and using the prioritization matrix to align the roadmap with the strategy. How do I show stakeholders how the roadmap connects to business goals inside Productboard? What's the best way to run a quarterly roadmap planning session using Productboard?",
      },
    ],
  },
  {
    number: 3,
    label: 'Concept Development & Validation',
    color: 'text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300',
    items: [
      {
        label: 'Prototyping',
        prompt: "Walk me through the different levels of prototyping as a PM — from paper sketches to high-fidelity prototypes. When should I use each type? What should I be testing with each? Give me a practical example of a PM using a prototype to validate an idea before writing a single line of code.",
      },
      {
        label: 'User Testing',
        prompt: "Teach me how to run usability testing as a PM. Cover: how to recruit the right participants, how to design test scenarios, how to observe without influencing, and how to synthesize findings into product decisions. Include common mistakes PMs make in usability testing.",
      },
    ],
    tools: [
      {
        label: 'Figma',
        category: 'Prototyping',
        prompt: "Give me a complete PM's guide to Figma. I'm not a designer — what do I actually need to know about Figma to do my job well? Cover: reading and commenting on design files, understanding components and variants, using the prototype mode to review interactions, and running basic usability tests with a Figma prototype link. How do I use Figma Dev Mode to hand off specs to engineering? What is FigJam and when do I use it? How does Figma compare to Sketch and Adobe XD?",
      },
      {
        label: 'InVision',
        category: 'Prototyping',
        prompt: "What is InVision, and is it still relevant for PMs in 2024? Cover: building clickable prototypes from static screens, Freehand (InVision's whiteboard), and sharing prototypes with stakeholders for feedback. How does InVision compare to Figma for prototype sharing and feedback collection? What's InVision's main strength vs. what Figma does better? When would a PM still choose InVision today?",
      },
      {
        label: 'Maze',
        category: 'Concept Testing',
        prompt: "How do PMs use Maze specifically to validate concepts and prototypes before development? Walk me through the full flow: importing a Figma prototype into Maze, writing test tasks, recruiting testers, and interpreting the heatmaps and task completion data. What does a good 'concept validation test' look like in Maze? How do I use the results to make a go/no-go decision on a concept?",
      },
      {
        label: 'UserTesting',
        category: 'Validation',
        prompt: "How do PMs use UserTesting to validate product concepts before building them? Cover: setting up a concept test (vs. a usability test), recruiting the right panel, writing tasks and questions that test desirability and comprehension, and analyzing video clips for stakeholder presentations. How do I build a highlight reel from UserTesting to convince skeptical stakeholders that a concept needs changes?",
      },
      {
        label: 'Loom',
        category: 'Async Communication',
        prompt: "How should PMs use Loom during the concept development and validation phase? Cover: recording async walkthroughs of prototypes for stakeholder feedback, sharing concept videos with remote user testers, and using Loom to document design decisions. What's the best way to structure a Loom video that gets useful feedback from stakeholders or engineers? How does Loom compare to Claap and Wistia for product feedback use cases?",
      },
      {
        label: 'Optimal Workshop',
        category: 'UX Research',
        prompt: "What is Optimal Workshop, and why do PMs use it for concept validation? Cover: card sorting (open and closed), tree testing, first-click testing, and qualitative surveys. When should I use card sorting vs. tree testing? How do I run a card sort to validate the information architecture of a new feature? How do I interpret the results and translate them into navigation or taxonomy decisions? How does Optimal Workshop compare to UserZoom and Maze for IA testing?",
      },
    ],
  },
  {
    number: 4,
    label: 'Technical Specifications & Planning',
    color: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
    items: [
      {
        label: 'Requirements & User Stories',
        prompt: "Explain how to write clear functional requirements and user stories that engineers can actually build from. Show me the difference between weak and strong user stories, what good acceptance criteria looks like, and how to avoid the most common mistakes PMs make when writing specs.",
      },
      {
        label: 'Prioritization Frameworks',
        prompt: "Walk me through the most useful product prioritization frameworks: MoSCoW, RICE, ICE, and Now/Next/Later. For each one, explain when to use it, how to score items, and what its limitations are. Then give me a worked example using a real backlog scenario.",
      },
    ],
    tools: [
      {
        label: 'Jira',
        category: 'Project Tracking',
        prompt: "Give me a thorough PM's guide to Jira for specs and sprint planning. Cover: creating epics, stories, sub-tasks, and bugs; writing good acceptance criteria in the description; using story points; setting up a sprint board; and creating a product backlog. What are the most important Jira settings a new PM should configure? What are the most common PM mistakes in Jira that slow down engineering? How does Jira compare to Linear for product teams?",
      },
      {
        label: 'Linear',
        category: 'Project Tracking',
        prompt: "Explain Linear to me as a PM. Why are many modern tech companies switching from Jira to Linear? Cover: creating issues and cycles (sprints), triage workflow, roadmap views, and the keyboard-first workflow. How do I set up a product backlog and run a sprint in Linear? What does Linear do significantly better than Jira, and what does it do worse? What's the pricing, and how does it work for small vs. large teams?",
      },
      {
        label: 'Confluence',
        category: 'Spec Writing',
        prompt: "How should PMs use Confluence for writing technical specs and PRDs? Give me a best-practice template for a Product Requirements Document (PRD) in Confluence. Cover: using page templates, embedding Jira tickets inside spec pages, maintaining a decision log, and versioning spec documents. How do I structure a spec page so engineers can find answers quickly without reading everything? What makes a Confluence PRD better than a Google Doc PRD?",
      },
      {
        label: 'Notion',
        category: 'Spec Writing',
        prompt: "How do PMs use Notion for writing specs, PRDs, and planning documents? Walk me through how to set up a product spec database in Notion with status tracking. What's the best way to write a PRD in Notion that engineers will actually read and reference? Cover: using linked databases to connect specs to roadmap items, templates, and collaborative editing. How does Notion for specs compare to Confluence in terms of structure and discoverability?",
      },
      {
        label: 'StoriesOnBoard',
        category: 'Story Mapping',
        prompt: "What is StoriesOnBoard and why do PMs use it for release planning? Cover: building a user story map with activities, tasks, and story slices; defining MVP scope vs. future releases; and exporting stories to Jira. Walk me through a hands-on example of building a story map for a new user onboarding flow in StoriesOnBoard. When should a PM use story mapping over a standard backlog? How does StoriesOnBoard compare to Avion and Jira's built-in story map?",
      },
      {
        label: 'Productboard',
        category: 'Backlog Planning',
        prompt: "How do PMs use Productboard specifically for backlog planning and release prioritization? Cover: linking user insights to features, using the prioritization matrix to score features, organizing features by release, and exporting to Jira. How do I set up a quarterly planning view in Productboard? How do I use the data from customer feedback to justify prioritization decisions to engineering leadership?",
      },
    ],
  },
  {
    number: 5,
    label: 'Development (Delivery)',
    color: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
    items: [
      {
        label: 'Agile & Scrum',
        prompt: "Explain Agile and Scrum from a PM perspective. Cover: sprint planning, standups, backlog grooming, sprint reviews, and retrospectives. What is the PM's role in each ceremony? What should a PM never do that slows the team down? Give me a real example of a well-run Agile sprint.",
      },
      {
        label: 'MVP Strategy',
        prompt: "Teach me how to define a true MVP (Minimum Viable Product) — not a watered-down version of everything, but the smallest thing that tests the core hypothesis. Walk me through how to identify the riskiest assumption, scope the MVP around it, and decide when the MVP has done its job. Include a famous MVP example.",
      },
    ],
    tools: [
      {
        label: 'Jira',
        category: 'Sprint Management',
        prompt: "How do PMs use Jira specifically to manage an active development sprint? Cover: sprint planning ceremonies in Jira, managing the sprint board during the sprint, tracking velocity over time, handling mid-sprint scope changes, and running the sprint retrospective with data from Jira reports. What are the most useful Jira reports for PMs during delivery — burndown, velocity, cumulative flow? How do I use these to have better conversations with engineering?",
      },
      {
        label: 'Linear',
        category: 'Sprint Management',
        prompt: "How do PMs use Linear during active development? Cover: running a cycle (sprint) in Linear, managing the triage inbox, using the 'In Progress' workflow states, and tracking progress against milestones. What does Linear's roadmap view show during development, and how do I share it with stakeholders? What are Linear's best features for keeping a fast-moving engineering team unblocked?",
      },
      {
        label: 'GitHub',
        category: 'Engineering Visibility',
        prompt: "What does a non-technical PM need to know about GitHub to work effectively with an engineering team? Cover: understanding pull requests and code reviews (as a PM observer), reading a GitHub Projects board, using GitHub Issues alongside Jira or Linear, and understanding GitHub Actions for CI/CD awareness. How do I use GitHub to track deployment status without bothering engineers? What does a PM need to know about GitHub milestones and releases?",
      },
      {
        label: 'Figma',
        category: 'Design Handoff',
        prompt: "How do PMs use Figma specifically during the development phase — not design, but delivery? Cover: reviewing designs against spec in Figma, using Dev Mode to inspect spacing/colors/assets, leaving review comments on designs, and verifying that what got built matches what was designed. What's the PM's role in the Figma → dev handoff process? How do I use Figma to catch design inconsistencies before they reach QA?",
      },
      {
        label: 'Slack',
        category: 'Team Communication',
        prompt: "How should PMs use Slack effectively to manage a development team without creating noise and interruptions? Cover: setting up a good channel structure (per-feature, #dev-alerts, #product-updates), using Slack for async standups, managing stakeholder updates via Slack, and integrating Jira/GitHub/Linear notifications into Slack channels. What are the most common ways PMs misuse Slack that hurt engineering productivity? Share best practices for PMs managing Slack communication during a sprint.",
      },
      {
        label: 'Loom',
        category: 'Async Updates',
        prompt: "How do PMs use Loom during the development phase to reduce meetings and keep stakeholders updated? Cover: recording sprint demo videos, creating async QA walkthroughs, sharing bug reproduction recordings with engineering, and sending weekly product update Looms to leadership. What makes a great sprint demo Loom — how long should it be, what should I show, and how should I structure it? How does Loom reduce the need for sync meetings during development?",
      },
      {
        label: 'Shortcut',
        category: 'Project Tracking',
        prompt: "What is Shortcut (formerly Clubhouse) and why do some product teams prefer it over Jira and Linear? Cover: epics, stories, iterations (sprints), workflow states, and the roadmap view. How is Shortcut's story structure different from Jira's? What types of teams is Shortcut best suited for? What are its strengths and weaknesses compared to Jira and Linear? Give me a walkthrough of setting up a new project in Shortcut.",
      },
    ],
  },
  {
    number: 6,
    label: 'Launch & Marketing',
    color: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300',
    items: [
      {
        label: 'Go-to-Market Plan',
        prompt: "Walk me through how to build a Go-to-Market (GTM) plan as a PM. Cover: defining the ICP, positioning, messaging, launch channels, and success criteria. What does a PM own vs. marketing? What does a strong GTM look like vs. a weak one? Give me a real product launch example.",
      },
      {
        label: 'Release Management',
        prompt: "Explain the different types of product releases: soft launch, beta, phased rollout, and general availability (GA). When should I use each? How do I manage feature flags, rollback plans, and stakeholder communication during a release? Give me a checklist for a successful launch day.",
      },
    ],
    tools: [
      {
        label: 'HubSpot',
        category: 'CRM & Marketing',
        prompt: "What does a PM need to know about HubSpot during a product launch? Cover: how HubSpot connects the CRM to launch email campaigns, how to use HubSpot for in-app messaging and onboarding emails, and how to track lead-to-conversion metrics tied to a launch. How do PMs collaborate with marketing in HubSpot without stepping on toes? What launch metrics can I pull from HubSpot to measure launch success? How does HubSpot compare to Intercom and Braze for launch communication?",
      },
      {
        label: 'Intercom',
        category: 'Customer Messaging',
        prompt: "Give me a complete PM's guide to Intercom for product launches. Cover: using Intercom for in-app announcements, targeted product tours, onboarding checklists, and proactive support messages. How do I set up a launch sequence in Intercom that announces a new feature to the right user segment? How do I use Intercom's message targeting to avoid showing launch messages to the wrong users? How does Intercom compare to Pendo and Appcues for in-app feature announcements?",
      },
      {
        label: 'LaunchDarkly',
        category: 'Feature Flags',
        prompt: "What is LaunchDarkly and why is it considered the gold standard for feature flag management? Cover: what feature flags are and why PMs care about them, how to use LaunchDarkly for phased rollouts (10% → 50% → 100%), canary releases, kill switches, and A/B testing. How do I set up a feature flag in LaunchDarkly for a new feature launch? How do feature flags change the PM's launch checklist? How does LaunchDarkly compare to Unleash, Split, and Growthbook?",
      },
      {
        label: 'Notion',
        category: 'Launch Planning',
        prompt: "How do PMs use Notion to plan and coordinate a product launch? Walk me through building a launch plan in Notion — including a launch checklist database, stakeholder task assignments, go/no-go criteria tracking, and a launch retrospective template. What's the best way to use Notion as a launch war room document that marketing, sales, and engineering all contribute to? Share a best-practice Notion launch plan structure.",
      },
      {
        label: 'Amplitude',
        category: 'Launch Analytics',
        prompt: "How do PMs use Amplitude specifically on and after launch day? Cover: setting up a launch dashboard in Amplitude, tracking feature adoption with funnel analysis, monitoring for drop-offs in the new feature flow, and setting up alerts for anomalies. What are the 5 most important charts I should have in my launch day Amplitude dashboard? How do I use cohort analysis to understand which user segments are adopting the new feature fastest?",
      },
      {
        label: 'Pendo',
        category: 'In-App Guidance',
        prompt: "Give me a PM's guide to using Pendo for product launches. Cover: creating in-app guides and tooltips to announce new features, building onboarding walkthroughs, using Pendo analytics to track feature adoption, and segmenting users for targeted in-app messaging. How does Pendo differ from Intercom and Appcues for in-app launch communication? What's the best Pendo setup for a B2B SaaS product launch to existing users?",
      },
    ],
  },
  {
    number: 7,
    label: 'Post-Launch Analytics & Iteration',
    color: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300',
    items: [
      {
        label: 'Analytics & Monitoring',
        prompt: "Teach me how to measure product success after launch. What metrics should I track for activation, retention, engagement, and revenue? How do I set up a North Star metric? What does a healthy post-launch analytics review look like? Give me a real example of a PM using data to make a post-launch decision.",
      },
      {
        label: 'Feedback Loops',
        prompt: "Explain how to build continuous feedback loops as a PM after launch. Cover: how to collect user feedback at scale, how to prioritize what to act on, how to close the loop with users, and how to use feedback to drive the next sprint. Include practical tools and methods.",
      },
      {
        label: 'Sunsetting Features',
        prompt: "Walk me through how to sunset a feature or product the right way. How do I know when something should be retired? How do I get stakeholder buy-in to remove something? What's the right way to communicate this to users? Give me a framework and a real example.",
      },
    ],
    tools: [
      {
        label: 'Amplitude',
        category: 'Product Analytics',
        prompt: "Give me a deep PM's guide to Amplitude for post-launch analytics. Cover: event tracking architecture (what to instrument and how), building retention curves, funnel analysis, user path analysis (Journeys), cohort comparisons, and A/B test analysis. What are the 10 most important Amplitude charts every PM should know how to build? How do I go from raw event data to a clear product decision? How does Amplitude compare to Mixpanel and Heap for product analytics?",
      },
      {
        label: 'Mixpanel',
        category: 'Product Analytics',
        prompt: "Give me a PM's guide to Mixpanel as a post-launch analytics tool. What does Mixpanel do that Amplitude doesn't, and vice versa? Cover: funnel reports, retention reports, signal reports, user profiles, and the new Mixpanel Boards feature. How do I set up a post-launch monitoring dashboard in Mixpanel? What's the event naming convention I should use? How does Mixpanel's pricing model work, and how does it compare to Amplitude for a growing startup?",
      },
      {
        label: 'Hotjar',
        category: 'Behavioral Analytics',
        prompt: "How do PMs use Hotjar after a feature launch to understand how users are actually behaving? Cover: analyzing heatmaps on the new feature pages, watching session recordings filtered to users who used the new feature, using on-page feedback widgets to collect reactions, and setting up conversion funnels in Hotjar. How do I use Hotjar alongside Amplitude — what does each tool tell me that the other doesn't? Give me a post-launch Hotjar investigation checklist.",
      },
      {
        label: 'Pendo',
        category: 'Adoption & NPS',
        prompt: "How do PMs use Pendo for post-launch feature adoption tracking and user feedback? Cover: Pendo's feature adoption analytics (page views, feature clicks, time on feature), NPS survey setup inside Pendo, segmenting NPS by feature usage, and using Pendo Feedback for collecting and prioritizing feature requests. How do I set up a 30-day feature adoption report in Pendo? How do I use NPS data from Pendo to prioritize the next iteration?",
      },
      {
        label: 'Typeform',
        category: 'Feedback Surveys',
        prompt: "How do PMs use Typeform to collect post-launch user feedback? Cover: designing a post-launch satisfaction survey, using logic branching to ask follow-up questions based on responses, integrating Typeform with Slack or Notion to route feedback automatically, and analyzing results in Typeform's reporting view. What's the ideal survey cadence after launch — when and how often should I survey users? How does Typeform compare to Sprig, Delighted, and Google Forms for post-launch feedback?",
      },
      {
        label: 'Intercom',
        category: 'User Feedback',
        prompt: "How do PMs use Intercom to collect structured feedback after a product launch? Cover: using Intercom surveys and conversation tagging to categorize post-launch feedback, setting up automated check-in messages to new feature users, and creating a feedback inbox workflow so the team can action user responses. How do I use Intercom data to identify users who are struggling with the new feature and need proactive support? How does Intercom compare to Pendo and Delighted for post-launch feedback loops?",
      },
      {
        label: 'FullStory',
        category: 'Session Replay',
        prompt: "What is FullStory and how do PMs use it for post-launch analysis? Cover: session replay with DX Data (frustration signals like rage clicks, error clicks, dead clicks), funnel analysis, and retroactive event definition without pre-instrumentation. What makes FullStory different from Hotjar and LogRocket for post-launch debugging? How do I use FullStory to find the root cause of a drop in conversion after a release? What's the best FullStory workflow for a PM doing a post-launch audit?",
      },
      {
        label: 'Delighted',
        category: 'NPS & CSAT',
        prompt: "What is Delighted and why is it one of the best tools for collecting NPS and CSAT at scale? Cover: setting up an NPS survey in Delighted, delivery channels (email, in-app, SMS, link), setting the right survey frequency, analyzing NPS trends over time, and using the open-text responses for qualitative insight. How do I build a post-launch NPS program with Delighted? How do I close the loop with detractors? How does Delighted compare to Medallia, Qualtrics, and Pendo for NPS programs?",
      },
    ],
  },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

const icons = {
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  wrench: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-2.5 h-2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
    </svg>
  ),
}

// ── Roadmap step (collapsible) ────────────────────────────────────────────────
function RoadmapStep({
  number, label, color, badge, items, tools, onSelect, isStreaming,
}: {
  number: number
  label: string
  color: string
  badge: string
  items: StepItem[]
  tools: StepTool[]
  onSelect: (prompt: string) => void
  isStreaming: boolean
}) {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors"
      >
        <span className={`flex-shrink-0 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${badge}`}>
          {number}
        </span>
        <span className={`text-[11px] font-medium flex-1 text-left ${color}`}>{label}</span>
        <span className={`text-zinc-600 transition-transform duration-150 flex-shrink-0 ${open ? '' : '-rotate-90'}`}>
          {icons.chevronDown}
        </span>
      </button>

      {open && (
        <div className="mt-0.5 ml-2 space-y-0.5">
          {/* Learn items */}
          {items.map(item => (
            <button
              key={item.label}
              onClick={() => onSelect(item.prompt)}
              disabled={isStreaming}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-zinc-400 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          {/* Tools sub-section */}
          <div className="mt-1 pt-1 border-t border-zinc-800/70">
            <button
              onClick={e => { e.stopPropagation(); setToolsOpen(t => !t) }}
              className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-left transition-colors hover:bg-zinc-800/50 group"
            >
              <span className="text-amber-500/80 flex-shrink-0">{icons.wrench}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 group-hover:text-zinc-400 flex-1">
                Tools
              </span>
              <span className="text-[9px] text-zinc-700 bg-zinc-800 rounded-full px-1.5 py-0.5 font-medium flex-shrink-0">
                {tools.length}
              </span>
              <span className={`text-zinc-600 transition-transform duration-150 flex-shrink-0 ${toolsOpen ? '' : '-rotate-90'}`}>
                {icons.chevronDown}
              </span>
            </button>

            {toolsOpen && (
              <div className="mt-0.5 space-y-0.5">
                {tools.map(tool => (
                  <button
                    key={tool.label}
                    onClick={() => onSelect(tool.prompt)}
                    disabled={isStreaming}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed group"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-600/60 group-hover:bg-amber-500 flex-shrink-0" />
                    <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200 flex-1 truncate">
                      {tool.label}
                    </span>
                    <span className="text-[9px] text-zinc-600 group-hover:text-zinc-500 flex-shrink-0 truncate max-w-[60px]">
                      {tool.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2.5 pb-1 pt-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </span>
      {action}
    </div>
  )
}

// ── Workspace info card ────────────────────────────────────────────────────────
function WorkspaceCard({ user, onClose, onNavigate }: {
  user: { email: string } | null
  onClose: () => void
  onNavigate: (path: string) => void
}) {
  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'
  const name    = user?.email?.split('@')[0] ?? 'Guest'

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute left-2 right-2 top-full z-20 mt-1 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60">
        <div className="p-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white select-none">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-zinc-200">{name}</p>
              <p className="truncate text-[10px] text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <span className="mt-2 inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
            Free plan · Personal workspace
          </span>
        </div>
        <div className="p-1.5 space-y-0.5">
          {[
            { label: 'Account settings', path: '/app/settings/profile' },
            { label: 'Billing & plan',   path: '/app/settings/billing' },
          ].map(({ label, path }) => (
            <button
              key={label}
              onClick={() => { onClose(); onNavigate(path) }}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="border-t border-zinc-800 p-1.5">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] text-zinc-500 bg-zinc-800/50">
            <span>Create workspace</span>
            <span className="text-[10px] text-zinc-600 bg-zinc-700 px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Sidebar({
  currentSessionId,
  sessions,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onSelectTemplate,
  isStreaming,
}: Props) {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [accountMenuOpen,   setAccountMenuOpen]   = useState(false)
  const [workspaceCardOpen, setWorkspaceCardOpen] = useState(false)

  const initials     = user?.email?.charAt(0).toUpperCase() ?? '?'
  const displayName  = user?.email?.split('@')[0] ?? 'Guest'
  const usedChats    = sessions.length
  const totalChats   = 40

  const handleTemplateSelect = (prompt: string) => {
    onSelectTemplate(prompt)
  }

  return (
    <aside className="relative flex h-full w-[220px] flex-shrink-0 flex-col bg-zinc-900 border-r border-zinc-800">

      {/* ── TOP: Logo + workspace switcher ────────────────────────── */}
      <div className="relative border-b border-zinc-800 px-3 py-3 space-y-2">
        <NavLink to="/" className="flex items-center px-1 py-1">
          <img src="/logo-dark.svg" alt="Product Path" className="h-6 select-none" />
        </NavLink>

        <button
          onClick={() => { setWorkspaceCardOpen(o => !o); setAccountMenuOpen(false) }}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-800"
        >
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white select-none">
            {initials}
          </div>
          <span className="flex-1 truncate text-left text-[13px] font-medium text-zinc-300">
            Personal account
          </span>
          <span className={`text-zinc-500 transition-transform duration-200 ${workspaceCardOpen ? 'rotate-180' : ''}`}>
            {icons.chevronDown}
          </span>
        </button>

        {workspaceCardOpen && (
          <WorkspaceCard
            user={user}
            onClose={() => setWorkspaceCardOpen(false)}
            onNavigate={navigate}
          />
        )}
      </div>

      {/* ── NEW CHAT BUTTON ───────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onNewChat}
          disabled={isStreaming}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {icons.plus}
          New chat
        </button>
      </div>

      {/* ── SCROLLABLE BODY ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

        {/* ── ROADMAP ───────────────────────────────────────────── */}
        <div className="px-2 border-b border-zinc-800 pb-3">
          <SectionHeader label="Roadmap" />
          <div className="space-y-0.5 mt-0.5">
            {ROADMAP_STEPS.map(step => (
              <RoadmapStep
                key={step.number}
                number={step.number}
                label={step.label}
                color={step.color}
                badge={step.badge}
                items={step.items}
                tools={step.tools}
                onSelect={handleTemplateSelect}
                isStreaming={isStreaming}
              />
            ))}
          </div>
        </div>


        {/* ── CHATS LIST ────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-h-0 px-2">
          <SectionHeader
            label="Recent chats"
            action={
              <button
                onClick={onNewChat}
                disabled={isStreaming}
                title="New chat"
                className="text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40"
              >
                {icons.edit}
              </button>
            }
          />

          <div className="flex-1 overflow-y-auto space-y-0.5 pb-2">
            {sessions.length === 0 ? (
              <p className="px-2.5 py-2 text-xs text-zinc-600 italic">No chats yet</p>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="group relative">
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={[
                      'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors',
                      session.id === currentSessionId
                        ? 'bg-zinc-700/70 text-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                    ].join(' ')}
                  >
                    <span className="truncate flex-1 pr-5">{session.title}</span>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteSession(session.id) }}
                    title="Delete chat"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden rounded-md p-1 text-zinc-500 hover:bg-red-900/50 hover:text-red-400 group-hover:flex transition-colors"
                  >
                    {icons.trash}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── USAGE BAR ─────────────────────────────────────────── */}
        <div className="border-t border-zinc-800 px-3 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              {usedChats} of {totalChats} free chats
            </span>
            <button
              onClick={() => navigate('/app/settings/billing')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Upgrade
            </button>
          </div>
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${Math.min((usedChats / totalChats) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Account menu ──────────────────────────────────── */}
      <div className="relative border-t border-zinc-800 px-3 py-3">
        <button
          onClick={() => { setAccountMenuOpen(o => !o); setWorkspaceCardOpen(false) }}
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-zinc-800"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 text-xs font-bold text-white select-none">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[13px] font-semibold text-zinc-200">{displayName}</p>
            <p className="text-[10px] text-zinc-500">Free Trial</p>
          </div>
          <span className={`text-zinc-500 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`}>
            {icons.chevronDown}
          </span>
        </button>

        {accountMenuOpen && (
          <AccountMenu onClose={() => setAccountMenuOpen(false)} />
        )}
      </div>

    </aside>
  )
}
