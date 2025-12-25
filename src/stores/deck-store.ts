import { create } from "zustand"

interface Deck {
    id: string;
    name: string;
}

interface DeckStore {
    decks: Deck[]
    addDeck: (name: string) => string
}

const deckStore = create<DeckStore>((set, get) => ({
    decks: [],
    addDeck: (name) => {
        const id = crypto.randomUUID()
        set({ decks: [...get().decks, { name, id }] })
        return id
    }
}))