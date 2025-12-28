import api from "./api";
import { User, UpdateProfileDto, UserType } from "@/types";

// Interface pour la recherche de professionnels
export interface SearchProfessionalsParams {
  city?: string;
  category?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
}

// Interface pour le changement de mot de passe
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

// Service pour la gestion des utilisateurs
export const usersService = {
  // Lister tous les utilisateurs (Clients + Pros + Admins)
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/v1/users');
      return response.data;
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors de la récupération de tous les utilisateurs:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Lister tous les professionnels
  getProfessionals: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/v1/users/professionals');
      return response.data;
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors de la récupération des professionnels:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Rechercher des professionnels
  searchProfessionals: async (params: SearchProfessionalsParams): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/v1/users/professionals/search', {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors de la recherche de professionnels:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Lister les favoris
  getFavorites: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/v1/users/favorites');
      return response.data;
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors de la récupération des favoris:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Mettre à jour le profil de l'utilisateur connecté
  updateProfile: async (dto: UpdateProfileDto): Promise<User> => {
    try {
      const response = await api.put<User>('/v1/users/profile', dto);
      return response.data;
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors de la mise à jour du profil:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Changer le mot de passe
  changePassword: async (dto: ChangePasswordDto): Promise<void> => {
    try {
      await api.post('/v1/users/change-password', dto);
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors du changement de mot de passe:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },

  // Lister les catégories de professionnels
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get<string[]>('/v1/users/professionals/categories');
      return response.data;
    } catch (error: any) {
      console.error("❌ [USERS API] Erreur lors de la récupération des catégories:", error);
      if (error.response) {
        throw new Error(
          error.response.data?.message || 
          error.response.data?.error || 
          `Erreur ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        throw new Error(`Erreur de configuration: ${error.message}`);
      }
    }
  },
};
