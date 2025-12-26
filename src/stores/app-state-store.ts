import { create } from 'zustand'

interface AppStateStore {
  isCardModalOpen: boolean
  setIsCardModalOpen: (value: boolean) => void
  isEditCardModalOpen: boolean
  setIsEditCardModalOpen: (value: boolean) => void
  isDeleteCardConfirmModalOpen: boolean
  setIsDeleteCardConfirmModalOpen: (value: boolean) => void
  selectedCardId: string | null
  setSelectedCardId: (value: string | null) => void

  isDeckSelectorOpen: boolean
  setIsDeckSelectorOpen: (value: boolean) => void
  isCreateDeckModalOpen: boolean
  setIsCreateDeckModalOpen: (value: boolean) => void
  isEditDeckModalOpen: boolean
  setIsEditDeckModalOpen: (value: boolean) => void
  isDeleteDeckConfirmModalOpen: boolean
  setIsDeleteDeckConfirmModalOpen: (value: boolean) => void
  selectedDeckId: string | null
  setSelectedDeckId: (value: string | null) => void

  selectedEditDeckId: string | null
  setSelectedEditDeckId: (value: string | null) => void

  selectedDeleteDeckId: string | null
  setSelectedDeleteDeckId: (value: string | null) => void

  selectedDeleteCardId: string | null
  setSelectedDeleteCardId: (value: string | null) => void

  handleCreateDeckClick: () => void
  handleEditDeck: (id: string) => void
  handleDeleteDeck: (id: string) => void
  handleReturnToDeckSelector: () => void

  handleEditCard: (id: string) => void
  handleDeleteCard: (id: string) => void
}

export const useAppStateStore = create<AppStateStore>((set) => ({
  isCardModalOpen: false,
  setIsCardModalOpen: (value: boolean) => set({ isCardModalOpen: value }),
  isEditCardModalOpen: false,
  setIsEditCardModalOpen: (value: boolean) =>
    set({ isEditCardModalOpen: value }),
  isDeleteCardConfirmModalOpen: false,
  setIsDeleteCardConfirmModalOpen: (value: boolean) =>
    set({ isDeleteCardConfirmModalOpen: value }),

  selectedCardId: null,
  setSelectedCardId: (value: string | null) => set({ selectedCardId: value }),

  isDeckSelectorOpen: false,
  setIsDeckSelectorOpen: (value: boolean) => set({ isDeckSelectorOpen: value }),

  isCreateDeckModalOpen: false,
  setIsCreateDeckModalOpen: (value: boolean) =>
    set({ isCreateDeckModalOpen: value }),
  isEditDeckModalOpen: false,
  setIsEditDeckModalOpen: (value: boolean) =>
    set({ isEditDeckModalOpen: value }),
  isDeleteDeckConfirmModalOpen: false,
  setIsDeleteDeckConfirmModalOpen: (value: boolean) =>
    set({ isDeleteDeckConfirmModalOpen: value }),
  selectedDeckId: null,
  setSelectedDeckId: (value: string | null) => set({ selectedDeckId: value }),

  selectedEditDeckId: null,
  setSelectedEditDeckId: (value) => set({ selectedEditDeckId: value }),

  selectedDeleteDeckId: null,
  setSelectedDeleteDeckId: (value) => set({ selectedDeleteDeckId: value }),

  selectedDeleteCardId: null,
  setSelectedDeleteCardId: (value) => set({ selectedDeleteCardId: value }),

  handleCreateDeckClick: () =>
    set({ isDeckSelectorOpen: false, isCreateDeckModalOpen: true }),
  handleEditDeck: (id: string) =>
    set({
      isDeckSelectorOpen: false,
      isEditDeckModalOpen: true,
      selectedEditDeckId: id,
    }),
  handleDeleteDeck: (id: string) =>
    set({
      isDeckSelectorOpen: false,
      isDeleteDeckConfirmModalOpen: true,
      selectedDeleteDeckId: id,
    }),
  handleReturnToDeckSelector: () => set({ isDeckSelectorOpen: true }),

  handleEditCard: (id: string) =>
    set({ isEditCardModalOpen: true, selectedCardId: id }),
  handleDeleteCard: (id: string) =>
    set({ isDeleteCardConfirmModalOpen: true, selectedDeleteCardId: id }),
}))

export const useIsCardModalOpen = () =>
  useAppStateStore((state) => state.isCardModalOpen)
export const useSetIsCardModalOpen = () =>
  useAppStateStore((state) => state.setIsCardModalOpen)

export const useIsEditCardModalOpen = () =>
  useAppStateStore((state) => state.isEditCardModalOpen)
export const useSetIsEditCardModalOpen = () =>
  useAppStateStore((state) => state.setIsEditCardModalOpen)

export const useIsDeleteCardConfirmModalOpen = () =>
  useAppStateStore((state) => state.isDeleteCardConfirmModalOpen)
export const useSetIsDeleteCardConfirmModalOpen = () =>
  useAppStateStore((state) => state.setIsDeleteCardConfirmModalOpen)

export const useIsDeckSelectorOpen = () =>
  useAppStateStore((state) => state.isDeckSelectorOpen)
export const useSetIsDeckSelectorOpen = () =>
  useAppStateStore((state) => state.setIsDeckSelectorOpen)

export const useIsCreateDeckModalOpen = () =>
  useAppStateStore((state) => state.isCreateDeckModalOpen)
export const useSetIsCreateDeckModalOpen = () =>
  useAppStateStore((state) => state.setIsCreateDeckModalOpen)

export const useIsEditDeckModalOpen = () =>
  useAppStateStore((state) => state.isEditDeckModalOpen)
export const useSetIsEditDeckModalOpen = () =>
  useAppStateStore((state) => state.setIsEditDeckModalOpen)

export const useIsDeleteDeckConfirmModalOpen = () =>
  useAppStateStore((state) => state.isDeleteDeckConfirmModalOpen)
export const useSetIsDeleteDeckConfirmModalOpen = () =>
  useAppStateStore((state) => state.setIsDeleteDeckConfirmModalOpen)

export const useSelectedDeckId = () =>
  useAppStateStore((state) => state.selectedDeckId)
export const useSetSelectedDeckId = () =>
  useAppStateStore((state) => state.setSelectedDeckId)

export const useSelectedEditDeckId = () =>
  useAppStateStore((state) => state.selectedEditDeckId)
export const useSetSelectedEditDeckId = () =>
  useAppStateStore((state) => state.setSelectedEditDeckId)

export const useHandleReturnToDeckSelector = () =>
  useAppStateStore((state) => state.handleReturnToDeckSelector)

export const useHandleCreateDeckClick = () =>
  useAppStateStore((state) => state.handleCreateDeckClick)

export const useHandleEditDeck = () =>
  useAppStateStore((state) => state.handleEditDeck)

export const useHandleDeleteDeck = () =>
  useAppStateStore((state) => state.handleDeleteDeck)

export const useHandleEditCard = () =>
  useAppStateStore((state) => state.handleEditCard)

export const useHandleDeleteCard = () =>
  useAppStateStore((state) => state.handleDeleteCard)

export const useSelectedCardId = () =>
  useAppStateStore((state) => state.selectedCardId)
export const useSetSelectedCardId = () =>
  useAppStateStore((state) => state.setSelectedCardId)
