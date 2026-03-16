# 📝 PLAN.md: Phishing Insight MVP Implementation

## 1. Project Overview
- **Name**: Phishing Insight (피싱 인사이트)
- **Concept**: AI-based phishing simulation and behavior diagnosis.
- **Goal**: Build a high-fidelity demo for a competition (Screen Recording).
- **Architecture**: Frontend-focused (Next.js + LocalStorage + OpenAI API Routes).

---

## 2. Responsive UI Breakpoints (Tailwind)
- **Mobile (`base`)**: Vertical stack, full-screen chat, hidden sidebars.
- **Tablet (`md`)**: 2-column layout (Main + Sidebar for Stats).
- **Desktop/Laptop (`lg`, `xl`)**: Centralized chat container (`max-w-4xl`), Persistent sideboards for real-time detection status.

---

## 3. Directory Architecture
```text
afechoice-frontend/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts          # AI API Gateway
│   │   ├── admin/page.tsx             # [Screen 1] Case Setting & Mock Upload
│   │   ├── simulate/page.tsx          # [Screen 2] Responsive Chat Room
│   │   └── report/[sessionId]/page.tsx # [Screen 3] Diagnostic Results
│   ├── features/
│   │   ├── admin/
│   │   │   ├── ScenarioUploader.tsx   # Mock PDF Analysis UI
│   │   │   └── scenarioStore.ts       # LocalStorage: Settings Logic
│   │   ├── simulation/
│   │   │   ├── ChatInterface.tsx      # Core Chat UI (Responsive)
│   │   │   ├── MessageBubble.tsx      # Bubble components (Tailwind classes)
│   │   │   └── useSimulation.ts       # Hook: Chat logic & PII detection
│   │   └── analysis/
│   │       ├── VulnerabilityChart.tsx # Recharts: Radar/Bar Charts
│   │       └── reportStore.ts         # Final Diagnosis logic
│   ├── shared/
│   │   ├── components/                # UI Atoms (Button, Input, Card)
│   │   ├── types/
│   │   │   └── domain.ts              # Global TypeScript Interfaces
│   │   └── utils/
│   │       ├── detector.ts            # Regex: Personal Info Detection
│   │       └── storage.ts             # LocalStorage abstraction

```

---

## 4. Domain Models (`shared/types/domain.ts`)

```typescript
export type PhishingCategory = 'VOICE_PHISHING' | 'ROMANCE_SCAM';

export interface AdminSettings {
  category: PhishingCategory;
  persona: string;
  rules: string[];
  caseTitle: string;
}

export interface DetectedInfo {
  type: 'ADDRESS' | 'ACCOUNT' | 'PHONE' | 'JOB';
  value: string;
  context: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface SessionData {
  id: string;
  settings: AdminSettings;
  messages: ChatMessage[];
  detectedInfos: DetectedInfo[];
  isEnded: boolean;
}

```

---

## 5. Core Logic (Pseudo-code)

### A. PII Detection (`shared/utils/detector.ts`)

```typescript
// const patterns = { ADDRESS: /regex/, ACCOUNT: /regex/ };
const detectSensitiveInfo = (text: string): DetectedInfo[] => {
  // 1. Iterate through REGEX patterns.
  // 2. Map matches to DetectedInfo structure.
  // 3. Return results for UI highlighting.
};

```

### B. AI Proxy (`app/api/chat/route.ts`)

```typescript
export const POST = async (req: Request) => {
  const { messages, settings } = await req.json();
  // 1. Prepend System Prompt: "You are an attacker with {persona}..."
  // 2. Request OpenAI API (gpt-4o).
  // 3. Return { content: string }.
};

```

### C. Simulation Hook (`features/simulation/useSimulation.ts`)

```typescript
const useSimulation = (sessionId: string) => {
  const [session, setSession] = useLocalStorage(sessionId);
  
  const handleSendMessage = async (input: string) => {
    // 1. Save user input to session.messages.
    // 2. Run detectSensitiveInfo(input).
    // 3. Update session.detectedInfos.
    // 4. Fetch AI response and save.
    // 5. If info leaked > 2, trigger setSession(isEnded: true).
  };
  
  return { session, handleSendMessage };
};

```

---

## 6. Implementation Guidelines

* **Responsive Design**: Use `flex flex-col md:flex-row`, `w-full lg:max-w-4xl`, and `hidden lg:block` to adjust for device sizes.
* **Coding Style**:
* Always use `const Component = () => {}`.
* Prefix event handlers with `handle`.
* Use early returns for conditional rendering.
* No `todo` placeholders; implement full logic for demo.



---

## 7. Development Roadmap

1. [ ] Global Styles & Theme Setup (Tailwind Config).
2. [ ] Define `domain.ts` types.
3. [ ] Create `app/api/chat/route.ts`.
4. [ ] Implement `Admin` Page (LocalStorage Write).
5. [ ] Build `Simulation` Page (Real-time PII detection).
6. [ ] Build `Report` Page (Recharts integration).
