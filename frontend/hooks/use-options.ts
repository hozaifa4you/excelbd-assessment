import { create } from 'zustand';

type Store = {
   isRegisterSuccess: boolean;
   registerSuccessMessage: string;
   setRegisterSuccess: (message: string) => void;
};

export const useOptions = create<Store>()((set) => ({
   isRegisterSuccess: false,
   registerSuccessMessage: '',
   setRegisterSuccess: (message: string) =>
      set({ isRegisterSuccess: true, registerSuccessMessage: message }),
}));
