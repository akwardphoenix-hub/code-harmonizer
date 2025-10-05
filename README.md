# ✨ Code Harmonizer - Universal Code Intelligence Platform

[![CI](https://github.com/akwardphoenix-hub/code-harmonizer/actions/workflows/main.yml/badge.svg)](https://github.com/akwardphoenix-hub/code-harmonizer/actions/workflows/main.yml)

A web-based code harmonization platform that transforms code based on developer intentions, going beyond simple formatting to achieve true code harmony through AI-powered analysis and transformation.

![Code Harmonizer](https://github.com/user-attachments/assets/de82f096-4bfe-414f-b41a-ea8ea5bda79b)

## 🚀 Features

- **Intention-Based Transformation**: Select from 6 categories of code improvements
  - Performance & Optimization
  - Language Translation
  - Security Enhancement
  - Modernization
  - Bug Fixes
  - Code Enhancement

- **Real-time Harmonization**: AI-powered code transformation with progress tracking
- **Complete Audit Trail**: Full transparency with transformation history and reasoning
- **Rollback Capability**: One-click rollback to original code
- **State Persistence**: Your work is automatically saved to localStorage

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

The application will be available at `http://localhost:5000`

## 💡 How It Works

### Development Mode
The application includes smart fallbacks for local development:

1. **Storage**: Uses localStorage instead of Spark KV for state management
2. **LLM**: Includes mock harmonization when Spark LLM is unavailable
   - Tries Spark LLM first if available
   - Falls back to intelligent mock transformations
   - Provides realistic code improvements based on selected intentions

### Usage

1. **Enter Code**: Paste or type your code in the Source Code tab, or click "Load Sample"
2. **Select Intentions**: Choose one or more transformation goals from the Intention Library
3. **Harmonize**: Click "Harmonize Code" to transform your code
4. **Review**: Check the harmonized output and audit trail
5. **Rollback**: Use the rollback button if needed

## 🏗️ Architecture

### Key Components

- **App.tsx**: Main application component with state management
- **CodeEditor**: Syntax-highlighted code input/output with language detection
- **IntentionLibrary**: Selection interface for transformation goals
- **HarmonizationEngine**: Orchestrates the transformation process
- **AuditTrail**: Displays transformation history and metrics

### Custom Hooks

- **useLocalKV**: localStorage-backed state management (mimics Spark's useKV)

### Libraries

- **callLLM**: Intelligent LLM wrapper with mock fallback for development

## 🎨 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Phosphor Icons
- **State Management**: React Hooks + localStorage

## 📦 Project Structure

```
code-harmonizer/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── CodeEditor.tsx
│   │   ├── IntentionLibrary.tsx
│   │   ├── HarmonizationEngine.tsx
│   │   └── AuditTrail.tsx
│   ├── hooks/
│   │   └── useLocalKV.ts # localStorage hook
│   ├── lib/
│   │   └── llm.ts        # LLM helper with mock
│   ├── App.tsx
│   └── main.tsx
├── eslint.config.js      # ESLint configuration
├── vite.config.ts        # Vite configuration
└── package.json
```

## 🧪 Testing

The project uses a multi-tiered testing approach:

### Unit/Integration Tests (Agent-Safe)
```bash
npm run test:ci      # in agent/local fast mode (no network)
npm run test:unit    # in watch mode for development
```

### End-to-End Tests
E2E tests run in CI or locally with browser support:
```bash
ALLOW_E2E=1 npm run test:e2e
```

### Agent Mode (Copilot Sandbox)

Copilot's sandbox environment blocks HTTP and apt. Use Agent Mode for firewall-proof testing:

**What it does:**
- Uses deterministic KV/LLM fallbacks (no network)
- Builds once, opens via `file://` in Playwright
- Runs smoke test only (`00-agent-smoke.spec.ts`)

**Commands:**
```bash
npm run build
npm run test:e2e:agent
```

Or combined:
```bash
npm run prepublish:agent
```

See [TESTING.md](./TESTING.md) for detailed testing guide.

All features have been tested and verified:
- ✅ Code input and editing
- ✅ Intention selection (single and multiple)
- ✅ Harmonization with progress tracking
- ✅ Output display with language detection
- ✅ Audit trail with transformation details
- ✅ Rollback functionality
- ✅ State persistence across refreshes

## 🤝 Contributing

This is a Spark template project. Feel free to customize it for your needs!

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
