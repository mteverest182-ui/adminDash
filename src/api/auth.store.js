import { create } from "zustand";

import {
  getCurrentUser,
  logout as logoutApi,
} from "../api/auth.api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => {
    set({
      user,
    });
  },

  setLoading: (loading) => {
    set({
      loading,
    });
  },

  initialize: async () => {
    try {
      set({
        loading: true,
      });

      const response = await getCurrentUser();

      set({
        user: response.data,
        loading: false,
        initialized: true,
      });

      return response.data;
    } catch (error) {
      console.error("INITIALIZE AUTH ERROR:", error);

      set({
        user: null,
        loading: false,
        initialized: true,
      });

      return null;
    }
  },

  refreshUser: async () => {
    try {
      set({
        loading: true,
      });

      const response = await getCurrentUser();

      set({
        user: response.data,
        loading: false,
      });

      return response.data;
    } catch (error) {
      console.error("REFRESH USER ERROR:", error);

      set({
        user: null,
        loading: false,
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      set({
        user: null,
        loading: false,
      });
    }
  },
}));