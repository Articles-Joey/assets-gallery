import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

import generateRandomNickname from '@/util/generateRandomNickname';

export const useStore = create()(
  persist(
    (set, get) => ({

      ...typicalZustandStoreStateSlice(set, get, generateRandomNickname),

      character: '',
      setCharacter: (character) => set({ character }),

      loginInfoModal: false,
      setLoginInfoModal: (value) => set({ loginInfoModal: value }),
      toggleLoginInfoModal: () => set({ loginInfoModal: !get().loginInfoModal }),

      assets: [],
      setAssets: (assets) => set({ assets }),
      lastAssetUpdate: null,
      setLastAssetUpdate: (timestamp) => set({ lastAssetUpdate: timestamp }),

      controlType: "Mouse and Keyboard",
      setControlType: (newValue) => {
        set((prev) => ({
          controlType: newValue
        }))
      },

      showApiInfoModal: false,
      setShowApiInfoModal: (value) => set({ showApiInfoModal: value }),

      // hasNoMouse: null,
      // setHasNoMouse: (value) => set({ hasNoMouse: value }),
      // hasNoMouseCheck: null,
      // setHasNoMouseCheck: (value) => set({ hasNoMouseCheck: value }),

    }),
    {
      name: 'assets-gallery-storage', // name of the item in the storage (must be unique)
      version: 3,
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      },
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            ...typicalZustandStoreExcludes,
          ].includes(key))
        ),
    },
  ),
)