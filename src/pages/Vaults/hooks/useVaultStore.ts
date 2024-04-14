import { create } from 'zustand'
import { persist, } from 'zustand/middleware'

export type ViewType = 'column' | 'list';
export type VaultStore = {
    viewType: ViewType,
    setViewType: (viewType: ViewType) => void
}

export const useVaultStore = create<VaultStore, [["zustand/persist", any]]>(
    persist(
        (set, get) => ({
            viewType: 'column',
            setViewType: (viewType) => set(() => ({ viewType })),
        }),
        {
            partialize: (state) => ({ viewType: state.viewType }),
            name: 'vault-storage',
        }
    )
)

