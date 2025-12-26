import { Dexie, type EntityTable } from "dexie"

interface Card {
  id: string
  deckId: string
  question: string
  answer: string
  known: boolean
}

export interface Deck {
  id: string
  name: string
}

const db = new Dexie("RecallDatabase") as Dexie & {
  decks: EntityTable<Deck, "id", Omit<Deck, "id">>,
  cards: EntityTable<Card, "id", Omit<Card, "id">>
}

db.version(1).stores({
    decks: "++id, name",
    cards: "++id, deckId, question, answer, known"
})

export default db