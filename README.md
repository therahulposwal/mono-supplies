# Mono Supplies | B2B Procurement Excellence

**The Invisible Concierge.**  
Curated hospitality essentials — kettles, hair dryers, mini bars, safes, and more.  
Architectural design meets institutional performance.

---

## 🏛️ Vision

Mono Supplies is a premium B2B procurement platform designed for the modern hospitality sector. We provide a "Quiet Luxury" experience for hotel operators, offering a curated selection of essential items that blend seamlessly into high-end environments. 

Our digital interface mirrors our physical products: it is silent, effortless, and impeccably polished.

## ✨ Key Features

- **Cinematic Shopping Experience**: HD editorial video backgrounds and fluid Framer Motion transitions create an immersive atmosphere.
- **Smart Bundle Quiz**: An intelligent recommendation engine that helps hotel operators curate the perfect selection for their property size and aesthetic.
- **B2B Requisition Flow**: A sophisticated multi-step inquiry system that handles volume pricing, SKU management, and institutional logistics.
- **Micro-interactions**: Subtle, high-end animations and hover effects that enhance the procurement journey without distraction.
- **Mobile-First Responsive Design**: Optimized for on-the-go procurement, ensuring a seamless experience across all device types.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) / [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Database/Auth** | [Supabase](https://supabase.com/) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) / [Base UI](https://base-ui.com/) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- NPM / Yarn / PNPM
- A Supabase project (for product data)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/therahulposwal/mono-supplies.git
   cd mono-supplies
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the platform.

## 📁 Project Structure

```text
mono-supplies/
├── src/
│   ├── app/            # Next.js App Router (pages & layouts)
│   ├── components/     # Atomic UI components & layout sections
│   ├── context/        # React Context (Requisition & State)
│   ├── lib/            # Types, utilities, and Supabase client
│   └── styles/         # Global CSS & Tailwind configuration
├── public/             # Static assets (Editorial videos, images, logos)
├── supabase/           # Database schemas & migrations
└── ...                 # Configuration files (TS, ESLint, PostCSS)
```

## 🎨 Design Principles: "Quiet Luxury"

- **Geometric Consistency**: 4px corner radiuses across all interactive elements.
- **Refined Typography**: Using Geist Sans and Geist Mono for an architectural, minimalist feel.
- **Harmonious Palette**: A neutral-heavy palette (`#f8f9fa`, `#191c1d`) with subtle contrast.
- **Institutional Trust**: Integration of "Prestige Marquees" and authentic trust markers to establish B2B authority.

---

## 📄 License

Private/Proprietary — All rights reserved.

---

> *"Design is not just what it looks like and feels like. Design is how it works."*  
> — **Mono Supplies Engineering Team**
