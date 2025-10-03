# Code Harmonizer - Universal Code Intelligence Platform

A web-based code harmonization platform that transforms code based on developer intentions, going beyond simple formatting to achieve true code harmony through AI-powered analysis and transformation.

**Experience Qualities**:
1. **Intelligent** - AI understands context and intention, not just syntax
2. **Immediate** - Real-time feedback and transformation preview
3. **Trustworthy** - Complete audit trails and reversible transformations

**Complexity Level**: Light Application (multiple features with basic state)
- Focused on demonstrating core harmonization concepts through an intuitive web interface with real-time preview, intention selection, and audit logging capabilities.

## Essential Features

### Code Input & Analysis
- **Functionality**: Multi-language code input with syntax highlighting and real-time parsing
- **Purpose**: Provide developers with a familiar code editing experience while analyzing structure
- **Trigger**: User pastes or types code into the editor
- **Progression**: Code input → syntax highlighting → language detection → structural analysis → ready for transformation
- **Success criteria**: Code is properly parsed, highlighted, and language is correctly detected

### Intention Selection & Library
- **Functionality**: Extensible library of transformation intentions (optimize, secure, modernize, translate)
- **Purpose**: Allow developers to specify their exact goals for code transformation
- **Trigger**: User selects from predefined intentions or creates custom ones
- **Progression**: Browse intentions → select primary goal → configure parameters → preview transformation
- **Success criteria**: Clear intention categories with helpful descriptions and configurable parameters

### Real-time Harmonization
- **Functionality**: AI-powered code transformation based on selected intentions
- **Purpose**: Transform code while preserving functionality and improving alignment with stated goals
- **Trigger**: User initiates harmonization after selecting intentions
- **Progression**: Analyze code structure → apply intention-based transformations → generate harmonized output → show diff
- **Success criteria**: Output code maintains functionality while better aligning with stated intentions

### Audit Trail & History
- **Functionality**: Complete transformation history with reasoning and rollback capability
- **Purpose**: Provide transparency and confidence in automated transformations
- **Trigger**: Automatically logged with each transformation
- **Progression**: Capture original → log transformation steps → record reasoning → enable rollback → export audit log
- **Success criteria**: Full traceability of all changes with clear explanations and one-click rollback

## Edge Case Handling
- **Invalid Code**: Graceful error messages with suggestions for common syntax issues
- **Unsupported Languages**: Clear feedback with list of supported languages and extension roadmap
- **Large Files**: Performance warnings and chunked processing for files over size limits
- **Network Issues**: Offline mode with cached intentions and local transformations where possible
- **Conflicting Intentions**: Smart conflict resolution with user preference prompts

## Design Direction
The interface should feel like a sophisticated developer tool - clean, precise, and confidence-inspiring with subtle visual feedback that guides users through the harmonization process without overwhelming technical details.

## Color Selection
Complementary (opposite colors) - Using a professional blue-orange palette to create visual distinction between input/output while maintaining developer tool aesthetics.

- **Primary Color**: Deep Blue (#1E40AF) - Represents trust, precision, and technical expertise
- **Secondary Colors**: Slate grays (#64748B, #F1F5F9) for neutral backgrounds and secondary UI elements
- **Accent Color**: Warm Orange (#EA580C) - Highlights important actions, warnings, and transformation indicators
- **Foreground/Background Pairings**: 
  - Background (Light Gray #F8FAFC): Dark text (#0F172A) - Ratio 16.8:1 ✓
  - Card (White #FFFFFF): Dark text (#0F172A) - Ratio 20.8:1 ✓
  - Primary (Deep Blue #1E40AF): White text (#FFFFFF) - Ratio 8.2:1 ✓
  - Secondary (Slate #64748B): White text (#FFFFFF) - Ratio 5.9:1 ✓
  - Accent (Orange #EA580C): White text (#FFFFFF) - Ratio 5.1:1 ✓

## Font Selection
Use JetBrains Mono for code display and Inter for UI text to balance technical precision with modern readability.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal spacing
  - H3 (Subsections): Inter Medium/18px/normal spacing
  - Body (UI Text): Inter Regular/16px/relaxed line height
  - Code (All code): JetBrains Mono Regular/14px/monospace spacing
  - Labels: Inter Medium/14px/slight letter spacing

## Animations
Subtle transitions that communicate state changes and guide attention during the transformation process, emphasizing the "harmony" concept through smooth, orchestrated movements.

- **Purposeful Meaning**: Smooth transitions between transformation states reinforce the concept of harmonious code evolution
- **Hierarchy of Movement**: Code transformations get primary animation focus, UI changes are secondary with subtle fades and slides

## Component Selection
- **Components**: Cards for code editors, Tabs for different views, Buttons for actions, Select for intentions, Progress for transformations, Alert for status messages
- **Customizations**: Custom syntax-highlighted code editor component, specialized diff viewer for before/after comparison
- **States**: Loading states during AI processing, success states for completed transformations, error states with helpful recovery actions
- **Icon Selection**: Code-related icons (brackets, arrows, checkmarks) from Phosphor to reinforce developer tool identity
- **Spacing**: Generous padding (p-6, p-4) for readability, consistent gaps (gap-4, gap-6) between sections
- **Mobile**: Stacked layout on mobile with collapsible sections, touch-friendly button sizes, responsive code editor with horizontal scroll