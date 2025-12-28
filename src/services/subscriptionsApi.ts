import api from "./api";
import { SubscriptionPlan, Payment } from "@/types";

// Service pour la gestion des abonnements
export const subscriptionsService = {
  // Lister tous les plans disponibles
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const response = await api.get<SubscriptionPlan[]>('/v1/subscriptions/plans');
      return response.data;
    } catch (error: any) {
      console.error("❌ [SUBSCRIPTIONS API] Erreur lors de la récupération des plans:", error);
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

  // Souscrire à un plan
  subscribe: async (planId: number): Promise<Payment> => {
    try {
      const response = await api.post<Payment>(`/v1/subscriptions/subscribe/${planId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ [SUBSCRIPTIONS API] Erreur lors de la souscription:", error);
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

  // Consulter mes paiements
  getMyPayments: async (): Promise<Payment[]> => {
    try {
      const response = await api.get<Payment[]>('/v1/subscriptions/my-payments');
      return response.data;
    } catch (error: any) {
      console.error("❌ [SUBSCRIPTIONS API] Erreur lors de la récupération des paiements:", error);
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

  // Créer un nouveau plan d'abonnement
  createPlan: async (plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    try {
      const response = await api.post<SubscriptionPlan>('/v1/subscriptions/plans', plan);
      return response.data;
    } catch (error: any) {
      console.error("❌ [SUBSCRIPTIONS API] Erreur lors de la création du plan:", error);
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

  // Modifier un plan d'abonnement existant
  updatePlan: async (planId: number, plan: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    try {
      const response = await api.put<SubscriptionPlan>(`/v1/subscriptions/plans/${planId}`, plan);
      return response.data;
    } catch (error: any) {
      console.error("❌ [SUBSCRIPTIONS API] Erreur lors de la modification du plan:", error);
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

  // Supprimer un plan d'abonnement
  deletePlan: async (planId: number): Promise<void> => {
    try {
      await api.delete(`/v1/subscriptions/plans/${planId}`);
    } catch (error: any) {
      console.error("❌ [SUBSCRIPTIONS API] Erreur lors de la suppression du plan:", error);
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
