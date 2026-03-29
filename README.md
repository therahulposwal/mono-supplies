# 🛋️ Mono Supplies 

### A Personal Take on High-End Hospitality Procurement

I've always been fascinated by how the best hotels in the world manage their "silent" details—the perfect kettle, the heavy-duty hair dryer, the discrete safe. These are the things you don't notice unless they're perfect. 

I built **Mono Supplies** as a personal project to explore that intersection of "Quiet Luxury" and technical efficiency. It's an experimental B2B platform that feels more like an editorial magazine than a standard procurement portal.

---

## 💡 Why I Built This

Most B2B platforms look like spreadsheets from the 90s. I wanted to see if I could build a procurement tool that felt as premium as the products it sells. 

This project was a way for me to dive into:
- **Next.js 16**: Pushing the boundaries of the latest React features.
- **Tailwind CSS 4**: Experimenting with its updated engine for architectural styling.
- **Framer Motion**: Creating cinematic transitions that don't feel "gimmicky."
- **Institutional UX**: Solving complex B2B flows (like volume tiered pricing) without the clutter.

---

## ✨ Things I'm Proud Of

- **The "Invisible Concierge" Aesthetic**: I spent way too much time getting the corner radiuses and background blurs just right. Everything follows a strict 4px grid to maintain that architectural feel.
- **Cinematic Experience**: The site uses HD video backgrounds and fluid motion to guide you through the catalogue. It's meant to be immersive.
- **Smart Bundle Quiz**: Instead of just lists, I built an interactive quiz that helps a "hotel owner" (me, in my imagination) figure out exactly what they need based on their room count and vibe.
- **The Requisition Flow**: I built a custom multi-step cart system that handles volume-based pricing and generates clean inquiry forms for institutional orders.

---

## 🛠️ The Tech I Used

I wanted to keep the stack modern and lean:
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 & Lucide Icons
- **Motion**: Framer Motion for all those smooth transitions
- **Backend**: Supabase for the product database
- **Components**: A mix of Shadcn UI and custom components to keep everything uniquely "Mono."

---

## 🚀 How to Run It Locally

If you want to play around with the code or see the animations in action:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/therahulposwal/mono-supplies.git
   cd mono-supplies
   ```

2. **Setup your environment:**
   Create a `.env.local` with your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

---

## 📁 A Peek Under the Hood

- `src/app`: Where all the Next.js magic happens.
- `src/components`: The atoms of the UI—from buttons to the product detail modals.
- `src/context`: Where I manage the requisition (cart) state.
- `src/styles`: The core of the "Quiet Luxury" tokens.

---

> *"Design is how it works, and procurement is how it arrives."*  
> — **Rahul Poswal** (Creator)
