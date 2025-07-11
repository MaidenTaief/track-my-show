const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface Organizer {
  id: string;
  name: string;
  email: string;
  category: string;
  description?: string;
  phone?: string;
  slug: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  followersCount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateOrganizerRequest {
  name: string;
  email: string;
  category: string;
  description?: string;
  phone?: string;
}

export interface UpdateOrganizerRequest {
  name?: string;
  email?: string;
  category?: string;
  description?: string;
  phone?: string;
  status?: 'pending' | 'approved' | 'rejected';
  verified?: boolean;
}

export interface OrganizerFilter {
  status?: 'pending' | 'approved' | 'rejected';
  category?: string;
  search?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

class OrganizerService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/organizers${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all organizers
  async getOrganizers(filter?: OrganizerFilter): Promise<{ success: boolean; data: Organizer[]; pagination: any; message?: string }> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    return this.request(endpoint);
  }

  // Get organizer by ID
  async getOrganizerById(id: string): Promise<{ success: boolean; data: Organizer; message: string }> {
    return this.request(`/${id}`);
  }

  // Create new organizer
  async createOrganizer(organizerData: CreateOrganizerRequest): Promise<{ success: boolean; data: Organizer; message: string }> {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(organizerData),
    });
  }

  // Update organizer
  async updateOrganizer(id: string, updateData: UpdateOrganizerRequest): Promise<{ success: boolean; data: Organizer; message: string }> {
    return this.request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Delete organizer
  async deleteOrganizer(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/${id}`, {
      method: 'DELETE',
    });
  }
}

export const organizerService = new OrganizerService(); 