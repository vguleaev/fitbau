import { WorkoutPlay } from '@prisma/client';
import { create } from 'zustand';

type PlayDetailsBottomCanvasStore = {
  isPlayDetailsCanvasOpen: boolean;
  selectedPlay: WorkoutPlay | null;
  setPlayDetailsCanvasOpen: (isOpen: boolean) => void;
  setSelectedPlay: (play: WorkoutPlay) => void;
};

const usePlayDetailsBottomCanvasStore = create<PlayDetailsBottomCanvasStore>((set) => ({
  isPlayDetailsCanvasOpen: false,
  selectedPlay: null,
  setPlayDetailsCanvasOpen: (isOpen) => {
    set({ isPlayDetailsCanvasOpen: isOpen });
  },
  setSelectedPlay: (exercise) => {
    set({ selectedPlay: exercise });
  },
}));

export { usePlayDetailsBottomCanvasStore };
