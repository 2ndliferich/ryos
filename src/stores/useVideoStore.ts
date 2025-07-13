import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Video {
  id: string;
  url: string;
  title: string;
  artist?: string;
}

export const DEFAULT_VIDEOS: Video[] = [
  {
    id: "0pP3ZjMDzF4",
    url: "https://youtu.be/0pP3ZjMDzF4",
    title: "Make Something Wonderful",
    artist: "Steve Jobs",
  },
  {
    id: "EKBVLzOZyLw",
    url: "https://youtu.be/EKBVLzOZyLw",
    title: "On Focus",
    artist: "Jony Ive",
  },
  {
    id: "wLb9g_8r-mE",
    url: "https://youtu.be/wLb9g_8r-mE",
    title: "A Conversation with Jony Ive",
    artist: "Jony Ive",
  },
  {
    id: "3vq9p00T08I",
    url: "https://youtu.be/3vq9p00T08I",
    title: "Macintosh (1984)",
    artist: "Apple Computer",
  },
  {
    id: "2B-XwPjn9YY",
    url: "https://youtu.be/2B-XwPjn9YY",
    title: "Macintosh Introduction (1984)",
    artist: "Steve Jobs",
  },
  {
    id: "VFP-VZtgb0s",
    url: "https://youtu.be/VFP-VZtgb0s",
    title: "iMac G3 vs PC Simplicity (1998)",
    artist: "Apple Computer",
  },
  {
    id: "dtaSDVpAo4c",
    url: "https://youtu.be/dtaSDVpAo4c",
    title: "Apple Back on Track (1998)",
    artist: "Steve Jobs",
  },
  {
    id: "Ko4V3G4NqII",
    url: "https://youtu.be/Ko4V3G4NqII",
    title: "Mac OS X Introduction Part 1 (2000)",
    artist: "Steve Jobs",
  },
  {
    id: "6-fkYFV7rOY",
    url: "https://youtu.be/6-fkYFV7rOY",
    title: "Mac OS X Introduction Part 2 (2000)",
    artist: "Steve Jobs",
  },
  {
    id: "mE_bDNaYAr8",
    url: "https://youtu.be/mE_bDNaYAr8",
    title: "iPod Ad (2001)",
    artist: "Apple Computer",
  },
  {
    id: "Mc_FiHTITHE",
    url: "https://youtu.be/Mc_FiHTITHE",
    title: "iPod Introduction (2001)",
    artist: "Steve Jobs",
  },
  {
    id: "b5P3QDm61go",
    url: "https://youtu.be/b5P3QDm61go",
    title: "iMac G4 \"Lamp\" Ad (2002)",
    artist: "Apple Computer",
  },
  {
    id: "TDVYfgRoVAo",
    url: "https://youtu.be/TDVYfgRoVAo",
    title: "iMac G4 Introduction (2002)",
    artist: "Steve Jobs",
  },
  {
    id: "9AJ1oSXlzCo",
    url: "https://youtu.be/9AJ1oSXlzCo",
    title: "iPod Nano Ad (2005)",
    artist: "Apple Computer",
  },
  {
    id: "VQKMoT-6XSg",
    url: "https://youtu.be/VQKMoT-6XSg?si=XzKqJ_mnXDH_P4zH",
    title: "iPhone Introduction (2007)",
    artist: "Steve Jobs",
  },
  {
    id: "dMBW1G4U54g",
    url: "https://youtu.be/dMBW1G4U54g",
    title: "MacBook Air Ad (2008)",
    artist: "Apple Computer",
  },
  {
    id: "KEaLJpFxR9Q",
    url: "https://www.youtube.com/watch?v=KEaLJpFxR9Q",
    title: "iPhone 4 Ad (2010)",
    artist: "Apple Computer",
  },
  {
    id: "b6-yFqenAy4",
    url: "https://www.youtube.com/watch?v=b6-yFqenAy4",
    title: "iPhone 4 Introduction (2010)",
    artist: "Steve Jobs",
  },
];

interface VideoStoreState {
  videos: Video[];
  currentVideoId: string | null;
  loopAll: boolean;
  loopCurrent: boolean;
  isShuffled: boolean;
  isPlaying: boolean;
  // actions
  setVideos: (videos: Video[] | ((prev: Video[]) => Video[])) => void;
  setCurrentVideoId: (videoId: string | null) => void;
  setLoopAll: (val: boolean) => void;
  setLoopCurrent: (val: boolean) => void;
  setIsShuffled: (val: boolean) => void;
  togglePlay: () => void;
  setIsPlaying: (val: boolean) => void;
  // derived state helpers
  getCurrentIndex: () => number;
  getCurrentVideo: () => Video | null;
}

const CURRENT_VIDEO_STORE_VERSION = 6; // Increment version to force migration

// Safe state validation function
const validateState = (state: Partial<VideoStoreState>): VideoStoreState => {
  const videos = Array.isArray(state.videos) ? state.videos : DEFAULT_VIDEOS;
  
  // Handle migration from old currentIndex to currentVideoId
  let currentVideoId = state.currentVideoId;
  if (currentVideoId === undefined && typeof (state as Partial<VideoStoreState> & { currentIndex?: number }).currentIndex === 'number') {
    // Migrate from old currentIndex to currentVideoId
    const currentIndex = (state as Partial<VideoStoreState> & { currentIndex?: number }).currentIndex!;
    const safeIndex = Math.max(0, Math.min(currentIndex, videos.length - 1));
    currentVideoId = videos[safeIndex]?.id || null;
  }
  
  // Ensure currentVideoId is valid
  if (currentVideoId && !videos.find(v => v.id === currentVideoId)) {
    currentVideoId = videos.length > 0 ? videos[0].id : null;
  }
  
  return {
    videos,
    currentVideoId: currentVideoId || (videos.length > 0 ? videos[0].id : null),
    loopAll: typeof state.loopAll === 'boolean' ? state.loopAll : true,
    loopCurrent: typeof state.loopCurrent === 'boolean' ? state.loopCurrent : false,
    isShuffled: typeof state.isShuffled === 'boolean' ? state.isShuffled : false,
    isPlaying: false, // Always start with not playing
    // Include all required methods (they'll be added by the create function)
    setVideos: (() => {}) as any,
    setCurrentVideoId: (() => {}) as any,
    setLoopAll: (() => {}) as any,
    setLoopCurrent: (() => {}) as any,
    setIsShuffled: (() => {}) as any,
    togglePlay: (() => {}) as any,
    setIsPlaying: (() => {}) as any,
    getCurrentIndex: (() => {}) as any,
    getCurrentVideo: (() => {}) as any,
  };
};

const getInitialState = () => ({
  videos: DEFAULT_VIDEOS,
  currentVideoId: DEFAULT_VIDEOS.length > 0 ? DEFAULT_VIDEOS[0].id : null,
  loopAll: true,
  loopCurrent: false,
  isShuffled: false,
  isPlaying: false,
});

export const useVideoStore = create<VideoStoreState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setVideos: (videosOrUpdater) => {
        set((state) => {
          const newVideos =
            typeof videosOrUpdater === "function"
              ? (videosOrUpdater as (prev: Video[]) => Video[])(state.videos)
              : videosOrUpdater;
          
          // Validate currentVideoId when videos change
          let currentVideoId = state.currentVideoId;
          if (currentVideoId && !newVideos.find(v => v.id === currentVideoId)) {
            currentVideoId = newVideos.length > 0 ? newVideos[0].id : null;
          }
          
          return { 
            videos: newVideos,
            currentVideoId
          };
        });
      },
      setCurrentVideoId: (videoId) => set((state) => {
        // Ensure videoId exists in videos array
        const validVideoId = videoId && state.videos.find(v => v.id === videoId) ? videoId : null;
        return { currentVideoId: validVideoId };
      }),
      setLoopAll: (val) => set({ loopAll: val }),
      setLoopCurrent: (val) => set({ loopCurrent: val }),
      setIsShuffled: (val) => set({ isShuffled: val }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (val) => set({ isPlaying: val }),
      
      // Derived state helpers
      getCurrentIndex: () => {
        const state = get();
        return state.currentVideoId ? state.videos.findIndex(v => v.id === state.currentVideoId) : -1;
      },
      getCurrentVideo: () => {
        const state = get();
        return state.currentVideoId ? state.videos.find(v => v.id === state.currentVideoId) || null : null;
      },
    }),
    {
      name: "ryos:videos",
      version: CURRENT_VIDEO_STORE_VERSION,
      migrate: (persistedState, version) => {
        console.log(
          `Migrating video store from version ${version} to ${CURRENT_VIDEO_STORE_VERSION}`
        );
        
        try {
          // Validate and fix any corrupted state
          const validatedState = validateState(persistedState as Partial<VideoStoreState>);
          
          // For major version changes, reset to defaults
          if (version < CURRENT_VIDEO_STORE_VERSION) {
            return {
              videos: DEFAULT_VIDEOS,
              currentVideoId: DEFAULT_VIDEOS.length > 0 ? DEFAULT_VIDEOS[0].id : null,
              loopAll: validatedState.loopAll,
              loopCurrent: validatedState.loopCurrent,
              isShuffled: validatedState.isShuffled,
            };
          }
          
          return validatedState;
        } catch (error) {
          console.error("Error migrating video store, resetting to defaults:", error);
          return getInitialState();
        }
      },
      // Persist videos array to prevent ID-based errors
      partialize: (state) => ({
        videos: state.videos,
        currentVideoId: state.currentVideoId,
        loopAll: state.loopAll,
        loopCurrent: state.loopCurrent,
        isShuffled: state.isShuffled,
      }),
    }
  )
); 