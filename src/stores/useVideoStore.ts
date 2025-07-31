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
    id: "ohfWKbmFojM",
    url: "https://youtu.be/ohfWKbmFojM",
    title: "Resolving A Horizon Worlds Issue using the WindSurf Cascade Agent",
    artist: "HumAi Club",
  },
  {
    id: "LpKz_qTYgIE",
    url: "https://youtu.be/LpKz_qTYgIE",
    title: "Digital Skills Workshop – Public Q&A (May 19 2025)",
    artist: "HumAi Club",
  },
  {
    id: "eZg9mr9AU8Y",
    url: "https://youtu.be/eZg9mr9AU8Y",
    title: "Building a React App That Pulls WordPress Content with Windsurf",
    artist: "HumAi Club",
  },
  {
    id: "yD0MiVlfpsc",
    url: "https://youtu.be/yD0MiVlfpsc",
    title: "Organizing ChatGPT Projects with Project Files & Windsurf Cascade",
    artist: "HumAi Club",
  },
  {
    id: "UjFSHj1rExQ",
    url: "https://youtu.be/UjFSHj1rExQ",
    title: "AI Self-Research: The World-Changing Future",
    artist: "HumAi Club",
  },
  {
    id: "Tz1ZiH3yAXU",
    url: "https://youtu.be/Tz1ZiH3yAXU",
    title: "Evolving Intelligence: Harnessing AI for Big Ideas",
    artist: "HumAi Club",
  },
  {
    id: "D72CjGOhyw4",
    url: "https://youtu.be/D72CjGOhyw4",
    title: "AI's Inevitable Takeover: We're Going Deeper and Deeper!",
    artist: "HumAi Club",
  },
  {
    id: "DX0FbqZVwyo",
    url: "https://youtu.be/DX0FbqZVwyo",
    title: "Map Gravity Forms Fields to ACF Pro in WordPress — Digital Skills Workshop Clip",
    artist: "HumAi Club",
  },
  {
    id: "qVCHtKhHZAI",
    url: "https://youtu.be/qVCHtKhHZAI",
    title: "Part 2 of AI Vibe‑Coding a WordPress Theme — Full Windsurf & Cascade Tutorial",
    artist: "HumAi Club",
  },
  {
    id: "1nc9BfweVII",
    url: "https://youtu.be/1nc9BfweVII",
    title: "Vibe‑Coding a WordPress Theme — Full Windsurf & Cascade Tutorial ( Part 1)",
    artist: "HumAi Club",
  },
  {
    id: "aVpWgfvm_jY",
    url: "https://youtu.be/aVpWgfvm_jY",
    title: "Horizon Worlds Guided Tour by the Executive Director of CRIISC on 2 19 25",
    artist: "HumAi Club",
  },
  {
    id: "VDn_RzBfyBw",
    url: "https://youtu.be/VDn_RzBfyBw",
    title: "Horizon Worlds Guided Tour by the Executive Director of CRIISC on 2 18 25",
    artist: "HumAi Club",
  },
  {
    id: "RwU3MHMa5Y8",
    url: "https://youtu.be/RwU3MHMa5Y8",
    title: "Our 1st time riding in a level 4 fully autonomous self driving vehicle. Waymo Taxi",
    artist: "HumAi Club",
  },
  {
    id: "oDjhs7Yj3zw",
    url: "https://youtu.be/oDjhs7Yj3zw",
    title: "How to submit our custom avatar request form on HumAi LLC",
    artist: "HumAi Club",
  },
  {
    id: "Wi9TI1l4GuQ",
    url: "https://youtu.be/Wi9TI1l4GuQ",
    title: "2024 Update to Connect your Meta Quest 2 & 3 Headset to a Computer and Transfer Files back and forth",
    artist: "HumAi Club",
  },
  {
    id: "48WAh8GY5kg",
    url: "https://youtu.be/48WAh8GY5kg",
    title: "Make Client-Exclusive Pages in WordPress! | WordPress in Workrooms [9-15-24]",
    artist: "HumAi Club",
  },
  {
    id: "MCSSt-7ncAM",
    url: "https://youtu.be/MCSSt-7ncAM",
    title: "Ai for Humans workshop in Meta Horizon Workrooms session 1",
    artist: "HumAi Club",
  },
  {
    id: "d92l0RH1t2U",
    url: "https://youtu.be/d92l0RH1t2U",
    title: "Comparing a Virtual Tour to a 3D Virtual World in the Metaverse",
    artist: "HumAi Club",
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

const CURRENT_VIDEO_STORE_VERSION = 8; // Force migration to HumAi Club videos

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
      migrate: () => {
        console.log(`Migrating video store to HumAi Club videos version ${CURRENT_VIDEO_STORE_VERSION}`);
        // Always reset to defaults with HumAi Club videos for clean start
        return getInitialState();
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