import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      darkMode: true,
      setDarkMode: (value) => set({ darkMode: value }),
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      character: '',
      setCharacter: (character) => set({ character }),

      randomNickname: () => {
        const adjectives = [
          'Quantum', 'Neon', 'Binary', 'Pixel', 'Nano', 'Cyber', 'Glitch', 'Viral', 'Crypto', 'Turbo', 'Robo', 'Virtual', 'Cloud', 'Circuit', 'Data', 'AI', 'Meta', 'Hyper', 'Logic', 'Vector'
        ];
        const nouns = [
          'Bot', 'Byte', 'Core', 'Node', 'Script', 'Stack', 'Array', 'Cache', 'Kernel', 'Matrix', 'Packet', 'Pixel', 'Proxy', 'Pulse', 'Synth', 'Terminal', 'Wire', 'Drive', 'Chip', 'Loop'
        ];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const nickname = `${adjective}${noun}${Math.floor(Math.random() * 1000)}`;
        set({ nickname });
      },
      nickname: '',
      setNickname: (nickname) => set({ nickname }),

      graphicsQuality: 'High',
      setGraphicsQuality: (value) => set({ graphicsQuality: value }),

      showMenu: false,
      setShowMenu: (value) => set({ showMenu: value }),
      toggleShowMenu: () => set({ showMenu: !get().showMenu }),

      sidebar: true,
      setSidebar: (value) => set({ sidebar: value }),
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

      landingAnimation: true,
      setLandingAnimation: (value) => set({ landingAnimation: value }),
      toggleLandingAnimation: () => set({ landingAnimation: !get().landingAnimation }),

      showInfoModal: false,
      setShowInfoModal: (value) => set({ showInfoModal: value }),
      toggleInfoModal: () => set({ showInfoModal: !get().showInfoModal }),

      loginInfoModal: false,
      setLoginInfoModal: (value) => set({ loginInfoModal: value }),
      toggleLoginInfoModal: () => set({ loginInfoModal: !get().loginInfoModal }),

      showSettingsModal: false,
      setShowSettingsModal: (value) => set({ showSettingsModal: value }),
      toggleSettingsModal: () => set({ showSettingsModal: !get().showSettingsModal }),

      showCreditsModal: false,
      setShowCreditsModal: (value) => set({ showCreditsModal: value }),
      toggleCreditsModal: () => set({ showCreditsModal: !get().showCreditsModal }),

      debug: false,
      toggleDebug: () => set({ debug: !get().debug }),
      setDebug: (value) => set({ debug: value }),

      assets: [],
      setAssets: (assets) => set({ assets }),

      controlType: "Mouse and Keyboard",
      setControlType: (newValue) => {
        set((prev) => ({
          controlType: newValue
        }))
      },

    }),
    {
      name: 'assets-gallery-storage', // name of the item in the storage (must be unique)
      version: 2,
      partialize: (state) => ({
        nickname: state.nickname,
        character: state.character,
        darkMode: state.darkMode,
        graphicsQuality: state.graphicsQuality,
        landingAnimation: state.landingAnimation,
        sidebar: state.sidebar,
        assets: state.assets,
        controlType: state.controlType,
      }),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    },
  ),
)