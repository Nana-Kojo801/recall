---

# 📘 **Recall — Enhanced Flashcard App Specification (Final)**

## 1. Overview

**Recall** is a minimal yet feature-rich flashcard application designed to help users **create, organize, and review flashcards** in a distraction-free, professional environment.

The app is **frontend-only**, offline-first, and optimized for **mobile-first responsive use**.

---

## 2. Goals

* Enable fast flashcard creation and review
* Support multiple decks and card organization
* Provide clear, motivating progress tracking
* Showcase polished, professional UI/UX
* Work fully offline

**Non-goals**

* Authentication / backend
* Social or sharing features
* Cloud sync

---

## 3. Pages & Navigation

* **Single-page application**
* `/` → Main app interface
* **Add-card functionality** handled via a modal (no separate page)
* Optional deck modal / side panel for deck selection

---

## 4. Layout Structure

### 4.1 Header

* App name: **Recall**
* Minimal and unobtrusive
* Optional subtitle or tagline

---

### 4.2 Deck Selector / Side Panel

* Switch between multiple decks
* Default deck: “General”
* Compact dropdown or sliding panel on mobile/desktop
* Shows deck stats (total, known, learning) per deck

---

### 4.3 Stats & Progress Dashboard

* Current deck stats:

  * Total cards
  * Known cards
  * Learning cards
* Daily review stats:

  * Cards reviewed today
  * Accuracy %
  * Optional review streak
* Small, subtle progress bars
* Optional motivational messages

---

### 4.4 Flashcard Viewer

* Central focus of the page
* Displays **front (question)** and **back (answer)**
* Card can have **tags** displayed as chips (e.g., Vocabulary, History)
* Flip animation (3D rotation, subtle shadow)
* Optional: color-coded for Known / Learning

---

### 4.5 Review Actions

Buttons / controls:

* **Known** → mark card as known
* **Still Learning** → mark card as learning
* **Next** → move to next card

Optional keyboard shortcuts:

* Arrow keys: flip / next
* Keys for Known / Learning

---

### 4.6 Add Card Modal

* Form with inputs:

  * Question (textarea)
  * Answer (textarea)
  * Optional tags
* Save / Cancel buttons
* Validation: no empty fields
* Lightweight, Linear-inspired modal animation

---

## 5. Data Model

### Flashcard Object

```ts
{
  id: string
  deckId: string
  question: string
  answer: string
  tags: string[]
  status: "known" | "learning"
  createdAt: number
}
```

### Deck Object

```ts
{
  id: string
  name: string
  createdAt: number
}
```

### App State

```ts
decks: Deck[]
cards: Flashcard[]
currentDeckId: string
currentCardIndex: number
isFlipped: boolean
```

---

## 6. Review Logic

* Cards shown in **queue order** or **shuffle mode**
* Priority options: Learning first / Known first
* Marking:

  * **Known** → moves card back in queue
  * **Learning** → keeps card earlier in queue
* “Next” skips without changing status

---

## 7. Persistence

* Store all decks, cards, and progress in `localStorage`
* Load on app start
* Save changes automatically
* Optional: keep 7-day history for daily stats

---

## 8. Empty & Completion States

* Deck empty → “Add your first card” with subtle illustration
* All cards known → celebratory animation and motivational message
* Filter returns no cards → show empty state messaging

---

## 9. UX & Responsiveness

* Mobile-first
* Flashcard viewer centered and scalable
* Buttons compact but thumb-accessible
* Deck selection / filters responsive (dropdown on mobile, panel on desktop)
* Minimal, calm spacing and typography

---

## 10. Design Requirements

* **Modern** — clean, up-to-date visual style
* **Sleek** — minimal clutter, smooth interactions
* **Professional** — looks like a polished productivity tool
* **Compact** — UI elements sized efficiently, nothing oversized
* **Mobile-first** — fully responsive
* **Beautiful** — visually pleasing color palette, typography, and spacing
* **Unique UI for this app only** — no generic templates
* **Linear-inspired**:

  * Neutral colors
  * Subtle shadows or borders
  * One restrained accent color
  * Clear visual hierarchy
  * Fast, subtle animations
* **Microinteractions** for flips, buttons, modals, and transitions

---

## 11. Definition of Done

* User can create **multiple decks** and flashcards
* Cards can be reviewed with **Known / Learning / Next**
* Flashcards display **tags** and stats update correctly
* Deck switching works
* Progress dashboard shows daily stats
* Mobile-first and responsive design
* Local storage persists all data
* Polished UI with Linear-inspired style
* Deployed with README + screenshots

---