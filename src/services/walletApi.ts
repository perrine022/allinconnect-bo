import api from "./api";

// Interface pour l'utilisateur dans les objets wallet
export interface WalletUser {
  id: number;
  email: string;
}

// Interface pour une transaction de cagnotte (WalletHistory)
export interface WalletTransaction {
  id: number;
  amount: number; // Négatif pour une utilisation, positif pour un gain
  description: string;
  date: string;
  user: WalletUser;
  [key: string]: any;
}

// Interface pour une demande de cagnotte (WalletRequest)
export interface WalletRequest {
  id: number;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  professionals: string; // Ex: "Coiffeur Nice: 10€"
  createdAt: string;
  user: WalletUser;
  [key: string]: any;
}

// Interface pour créer une demande de cagnotte
export interface CreateWalletRequestDto {
  amount: number;
  professionals: string; // Ex: "Coiffeur Nice: 10€"
}

// Type pour le statut d'une demande
export type WalletRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Service pour la gestion de la cagnotte
export const walletService = {
  // ========== ENDPOINTS UTILISATEUR ==========
  
  // Consulter mon propre historique de cagnotte (Utilisateur)
  getHistory: async (): Promise<WalletTransaction[]> => {
    try {
      const response = await api.get<WalletTransaction[]>('/v1/wallet/history');
      return response.data;
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la récupération de l'historique:", error);
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

  // Consulter mes propres demandes de cagnotte (Utilisateur)
  getRequests: async (): Promise<WalletRequest[]> => {
    try {
      const response = await api.get<WalletRequest[]>('/v1/wallet/requests');
      return response.data;
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la récupération des demandes:", error);
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

  // Créer une nouvelle demande d'utilisation de la cagnotte (Utilisateur)
  createRequest: async (dto: CreateWalletRequestDto): Promise<WalletRequest> => {
    try {
      const response = await api.post<WalletRequest>('/v1/wallet/request', dto);
      return response.data;
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la création de la demande:", error);
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

  // ========== ENDPOINTS ADMIN ==========

  // Récupérer tout l'historique de cagnotte (Admin)
  getAdminHistory: async (): Promise<WalletTransaction[]> => {
    try {
      const response = await api.get<WalletTransaction[]>('/v1/wallet/admin/history');
      return response.data;
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la récupération de l'historique admin:", error);
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

  // Récupérer toutes les demandes de cagnotte (Admin)
  getAdminRequests: async (): Promise<WalletRequest[]> => {
    try {
      const response = await api.get<WalletRequest[]>('/v1/wallet/admin/requests');
      return response.data;
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la récupération des demandes admin:", error);
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

  // Modifier le statut d'une demande (Admin)
  updateRequestStatus: async (requestId: number, status: WalletRequestStatus): Promise<WalletRequest> => {
    try {
      const response = await api.put<WalletRequest>(
        `/v1/wallet/admin/requests/${requestId}/status`,
        null,
        {
          params: { status }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la modification du statut:", error);
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

  // Remise à zéro (Admin)
  resetWallet: async (userId: number): Promise<void> => {
    try {
      await api.post(`/v1/wallet/admin/reset/${userId}`);
    } catch (error: any) {
      console.error("❌ [WALLET API] Erreur lors de la remise à zéro:", error);
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

