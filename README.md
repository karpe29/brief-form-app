# Brief Form Creator

A standalone React application for creating comprehensive campaign briefs with all 4 sections and JSON download functionality.

## Features

- **4 Main Sections:**
  1. **Strategy & Objective** - Business goals, marketing objectives, KPIs, CTAs
  2. **Audience Positioning** - Target demographics, psychographics, geographic targeting
  3. **Creative & Tone** - Channels, voiceover, brand guidelines, tone & emotion
  4. **Personalization** - Audience-based personalization settings

- **Key Functionality:**
  - Clean, focused interface without sidebar distractions
  - Real-time progress tracking
  - JSON download capability
  - Responsive design
  - Form validation
  - Multi-select options
  - File upload support (UI ready)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd BriefFormApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Fill out the form sections** by navigating through the 4 tabs
2. **Track your progress** using the progress indicator in the sidebar
3. **Download your brief** as JSON using the "Download JSON" button
4. **Save your work** using the "Save Brief" button (when minimum requirements are met)

## Form Structure

The brief form captures comprehensive campaign information across 4 main sections:

### Section 1: Strategy & Objective
- Business goals (Awareness, Consideration, Conversion)
- Marketing objectives
- Primary KPI targets
- Call to action
- Reason for urgency
- Brand differentiator
- Offers/promotions

### Section 2: Audience Positioning
- Target demographics
- Target psychographics
- Geographic targeting (allow/deny lists)
- Familiarity levels
- Key takeaways
- Multiple audience support

### Section 3: Creative & Tone
- Channel/platform selection
- Voiceover requirements
- Brand guidelines
- Winning ads (file upload + URLs)
- Reference videos (file upload + URLs)
- Additional links/documents
- Desired feelings
- Message style
- Brand role
- Brand tone
- Creative direction

### Section 4: Personalization
- Audience-based personalization settings
- Language, length, and ratio options

## JSON Output

The downloaded JSON follows this structure:
```json
{
  "campaign_id": "new-campaign",
  "brief_data": {
    "section_1_campaign_strategy_objective": { ... },
    "section_2_audience_positioning": { ... },
    "section_3_creative_delivery_context": { ... },
    "section_4_tone_emotion": { ... }
  }
}
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Lucide React** - Icons
- **Custom CSS** - Styling (no external UI library dependencies)

## Project Structure

```
BriefFormApp/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── BriefForm.tsx # Main form component
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## Customization

The app is designed to be easily customizable:

- **Styling**: Modify `src/index.css` for global styles
- **Form fields**: Update the form structure in `src/components/BriefForm.tsx`
- **UI components**: Customize components in `src/components/ui/`
- **Validation**: Add custom validation logic as needed

## License

This project is part of the BackendV2GCP system and follows the same licensing terms.
