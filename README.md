# GrayMate

GrayMate is a hackathon-ready mobile web prototype for Post-AGI social wellness. It demonstrates how a multi-agent system can help elderly hosts and students move from first-time onboarding to a supervised, safety-reviewed co-living match.

The product narrative is simple: AI agents can recommend, explain, and monitor relational wellness, but high-stakes decisions still require human approval.

## What This Demo Shows

- A first-use onboarding flow for both elderly users and students
- AI-assisted consent, boundary setting, and lifestyle screening
- Simulated sub-agent interviews that generate a structured Kizuna Profile
- Automatic match selection by a Match Evaluator Agent
- A human review gate before the match becomes approved
- A post-match daily app with check-ins, tasks, agreement reminders, and wellness reporting
- An operator workspace that shows the trust and safety layer behind the match

## Core Product Flow

1. Choose a role: elderly user or student
2. Confirm consent, privacy boundaries, and non-caregiver responsibilities
3. Review a basic profile generated from mock user data
4. Complete a simulated agent interview
5. Generate an AI profile across rhythm, privacy, communication, meals, and care boundaries
6. Receive one agent-selected match recommendation
7. Review why the match works and what risks need discussion
8. Pass through human review with family and operator approval
9. Open the daily wellness app after the match is approved

## Design Principles

- Mobile-first interface for realistic user interaction
- Large, readable actions for elderly users
- Compact task-oriented screens for students
- Minimal visual design with warm, credible colors
- Clear safety boundaries: students are companions, not medical caregivers
- No fake production complexity: the demo is focused on the product story and core user value

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- lucide-react
- framer-motion
- Static mock data

There is no backend, database, authentication, voice recording, or live AI API integration in this prototype.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/
  App.tsx                     Operator workspace and app mode entry
  UserApp.tsx                 User-facing onboarding and daily app flow
  data/
    mockCase.ts               Operator case review mock data
    userMock.ts               Daily app mock data
    userOnboardingMock.ts     First-use onboarding and matching mock data
public/
  assets/generated-ui/        Generated product visuals used in the demo
```

## Demo Scope

This is a hackathon prototype, not a production system. All data is mocked and all agent outputs are simulated to make the end-to-end product flow reliable during a live presentation.

Production versions would require identity verification, consent management, audit logging, safety escalation, family approval workflows, background checks, privacy controls, and real operational oversight.

## Hackathon Positioning

GrayMate is designed for the theme "Wellness AI in the Post-AGI Era." Instead of using AI to replace human care, it uses AI to make human connection safer, more measurable, and easier to coordinate.

The key thesis:

> AI should help humans create the relationships that AI cannot replace.
