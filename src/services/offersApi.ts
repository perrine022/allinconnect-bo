import api from "./api";
import { Offer } from "@/types";

// Service pour la gestion des offres
export const offersService = {
  // Visualiser toutes les offres
  getAll: async (): Promise<Offer[]> => {
    try {
      const response = await api.get<Offer[]>('/v1/offers');
      return response.data;
    } catch (error: any) {
      console.error("❌ [OFFERS API] Erreur lors de la récupération des offres:", error);
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

  // Visualiser uniquement les offres actives
  getActive: async (): Promise<Offer[]> => {
    try {
      const response = await api.get<Offer[]>('/v1/offers/active');
      return response.data;
    } catch (error: any) {
      console.error("❌ [OFFERS API] Erreur lors de la récupération des offres actives:", error);
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

  // Visualiser les offres d'un professionnel spécifique
  getByProfessional: async (professionalId: number): Promise<Offer[]> => {
    try {
      const response = await api.get<Offer[]>(`/v1/offers/professional/${professionalId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ [OFFERS API] Erreur lors de la récupération des offres du professionnel:", error);
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
