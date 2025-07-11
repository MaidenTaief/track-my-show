import { admin } from '../config/firebase';

// Core interfaces
export interface Organizer {
  id: string;
  name: string;
  slug: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  category: string;
  businessRegistration?: string;
  taxId?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  verified: boolean;
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  followersCount: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  specialties?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateOrganizerRequest {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  category: string;
  businessRegistration?: string;
  taxId?: string;
  tags?: string[];
  specialties?: string[];
}

export interface UpdateOrganizerRequest {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  address?: any;
  socialMedia?: any;
  category?: string;
  businessRegistration?: string;
  taxId?: string;
  status?: string;
  tags?: string[];
  specialties?: string[];
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface OrganizerFilter {
  status?: string;
  category?: string;
  verified?: boolean;
  search?: string;
  tags?: string[];
  city?: string;
  state?: string;
  country?: string;
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrganizerStats {
  totalShows: number;
  activeShows: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  followersCount: number;
}

// Utility function for slug generation
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to get Firestore instance
const getFirestore = () => {
  try {
    return admin.firestore();
  } catch (error) {
    console.warn('Firestore not available, falling back to in-memory storage');
    return null;
  }
};

export class OrganizerService {
  private collection: string = 'organizers';
  private inMemoryOrganizers: Organizer[] = [];
  private useFirestore: boolean;

  constructor() {
    console.log('=== ORGANIZER SERVICE DEBUG ===');
    try {
      const db = admin.firestore();
      console.log('Firestore available:', !!db);
      console.log('Firestore function type:', typeof admin.firestore);
      const testRef = db.collection('test');
      console.log('Firestore collection reference created successfully');
    } catch (error) {
      console.error('Firestore collection reference failed:', error);
    }
    this.useFirestore = !!admin.firestore();
    console.log('OrganizerService will use Firestore:', this.useFirestore);
    console.log('=== END ORGANIZER SERVICE DEBUG ===');
  }

  async getOrganizers(filter: OrganizerFilter = {}) {
    console.log('OrganizerService.getOrganizers called with filter:', filter);
    const db = getFirestore();
    if (db) {
      return this.getOrganizersFromFirestore(filter, db);
    } else {
      return this.getOrganizersFromMemory(filter);
    }
  }

  private async getOrganizersFromFirestore(filter: OrganizerFilter, db: admin.firestore.Firestore) {
    try {
      console.log('Fetching organizers from Firestore...');
      let query: admin.firestore.Query = db.collection(this.collection);

      // Apply filters
      if (filter.status) {
        query = query.where('status', '==', filter.status);
      }
      if (filter.verified !== undefined) {
        query = query.where('verified', '==', filter.verified);
      }
      if (filter.category) {
        query = query.where('category', '==', filter.category);
      }

      // Apply sorting
      const sortBy = filter.sortBy || 'createdAt';
      const sortOrder = filter.sortOrder || 'desc';
      query = query.orderBy(sortBy, sortOrder);

      const snapshot = await query.get();
      console.log(`Found ${snapshot.docs.length} organizers in Firestore`);
      
      let organizers: Organizer[] = snapshot.docs.map((doc: admin.firestore.DocumentSnapshot) => ({
        id: doc.id,
        ...doc.data()
      })) as Organizer[];

      // Apply search filter (client-side for complex text search)
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        organizers = organizers.filter(organizer => 
          organizer.name.toLowerCase().includes(searchTerm) ||
          organizer.description?.toLowerCase().includes(searchTerm) ||
          organizer.email.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrganizers = organizers.slice(startIndex, endIndex);

      return {
        organizers: paginatedOrganizers,
        pagination: {
          page,
          limit,
          total: organizers.length,
          pages: Math.ceil(organizers.length / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching organizers from Firestore:', error);
      throw new Error('Failed to fetch organizers');
    }
  }

  private getOrganizersFromMemory(filter: OrganizerFilter) {
    console.log('Fetching organizers from memory...');
    let organizers = [...this.inMemoryOrganizers];

    // Apply filters
    if (filter.status) {
      organizers = organizers.filter(org => org.status === filter.status);
    }
    if (filter.verified !== undefined) {
      organizers = organizers.filter(org => org.verified === filter.verified);
    }
    if (filter.category) {
      organizers = organizers.filter(org => org.category === filter.category);
    }
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      organizers = organizers.filter(org => 
        org.name.toLowerCase().includes(searchTerm) ||
        org.description?.toLowerCase().includes(searchTerm) ||
        org.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    const sortBy = filter.sortBy || 'createdAt';
    const sortOrder = filter.sortOrder || 'desc';
    organizers.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrganizers = organizers.slice(startIndex, endIndex);

    console.log(`Returning ${paginatedOrganizers.length} organizers from memory`);

    return {
      organizers: paginatedOrganizers,
      pagination: {
        page,
        limit,
        total: organizers.length,
        pages: Math.ceil(organizers.length / limit)
      }
    };
  }

  async getOrganizerById(id: string): Promise<Organizer | null> {
    console.log('OrganizerService.getOrganizerById called with id:', id);
    const db = getFirestore();
    if (db) {
      try {
        const doc: admin.firestore.DocumentSnapshot = await db.collection(this.collection).doc(id).get();
        if (!doc.exists) {
          console.log('Organizer not found in Firestore');
          return null;
        }
        console.log('Organizer found in Firestore');
        return { id: doc.id, ...doc.data() } as Organizer;
      } catch (error) {
        console.error('Error fetching organizer from Firestore:', error);
        throw new Error('Failed to fetch organizer');
      }
    } else {
      const organizer = this.inMemoryOrganizers.find(org => org.id === id) || null;
      console.log('Organizer found in memory:', !!organizer);
      return organizer;
    }
  }

  async getOrganizerBySlug(slug: string): Promise<Organizer | null> {
    console.log('OrganizerService.getOrganizerBySlug called with slug:', slug);
    const db = getFirestore();
    if (db) {
      try {
        const snapshot = await db.collection(this.collection)
          .where('slug', '==', slug)
          .limit(1)
          .get();
        
        if (snapshot.empty) {
          console.log('Organizer not found by slug in Firestore');
          return null;
        }
        const doc: admin.firestore.DocumentSnapshot = snapshot.docs[0];
        console.log('Organizer found by slug in Firestore');
        return { id: doc.id, ...doc.data() } as Organizer;
      } catch (error) {
        console.error('Error fetching organizer by slug from Firestore:', error);
        throw new Error('Failed to fetch organizer');
      }
    } else {
      const organizer = this.inMemoryOrganizers.find(org => org.slug === slug) || null;
      console.log('Organizer found by slug in memory:', !!organizer);
      return organizer;
    }
  }

  async createOrganizer(organizerData: CreateOrganizerRequest, userId: string): Promise<Organizer> {
    console.log('🔥 === ORGANIZER CREATION DEBUG START ===');
    console.log('🔥 Input data:', JSON.stringify(organizerData, null, 2));
    console.log('🔥 User ID:', userId);
    console.log('🔥 useFirestore flag:', this.useFirestore);
    const now = new Date();
    const slug = generateSlug(organizerData.name);
    const organizer: Organizer = {
      id: '',
      ...organizerData,
      slug,
      verified: false,
      status: 'pending',
      followersCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId
    };
    console.log('🔥 Prepared organizer object:', JSON.stringify(organizer, null, 2));
    if (this.useFirestore) {
      try {
        console.log('🔥 ATTEMPTING FIRESTORE WRITE...');
        console.log('🔥 Collection name:', this.collection);
        const docRef = await admin.firestore().collection(this.collection).add(organizer);
        console.log('🔥 SUCCESS! Firestore document created with ID:', docRef.id);
        organizer.id = docRef.id;
        console.log('🔥 Final organizer with ID:', JSON.stringify(organizer, null, 2));
        return organizer;
      } catch (error) {
        console.error('🔥 FIRESTORE ERROR:', error);
        console.error('🔥 Error details:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to create organizer: ${(error as any).message}`);
      }
    } else {
      console.log('🔥 USING IN-MEMORY STORAGE (Firestore not available)');
      organizer.id = Date.now().toString();
      this.inMemoryOrganizers.push(organizer);
      console.log('🔥 Saved to memory with ID:', organizer.id);
      return organizer;
    }
  }

  async updateOrganizer(id: string, updateData: UpdateOrganizerRequest, userId: string): Promise<Organizer | null> {
    console.log('OrganizerService.updateOrganizer called with id:', id);
    
    const existingOrganizer = await this.getOrganizerById(id);
    if (!existingOrganizer) {
      console.log('Organizer not found for update');
      return null;
    }

    // Only allow valid status values
    let status: Organizer['status'] | undefined = existingOrganizer.status;
    if (updateData.status && ['pending','active','suspended','inactive'].includes(updateData.status)) {
      status = updateData.status as Organizer['status'];
    }
    const updatedOrganizer: Organizer = {
      ...existingOrganizer,
      ...updateData,
      status: status || 'pending',
      updatedAt: new Date(),
      updatedBy: userId
    };

    // Update slug if name changed
    if (updateData.name && updateData.name !== existingOrganizer.name) {
      updatedOrganizer.slug = generateSlug(updateData.name);
    }

    const db = getFirestore();
    if (db) {
      try {
        console.log('Updating organizer in Firestore...');
        await db.collection(this.collection).doc(id).update(updatedOrganizer as any);
        console.log('Successfully updated in Firestore');
        return updatedOrganizer;
      } catch (error) {
        console.error('Error updating organizer in Firestore:', error);
        throw new Error('Failed to update organizer');
      }
    } else {
      console.log('Updating organizer in memory...');
      const index = this.inMemoryOrganizers.findIndex(org => org.id === id);
      if (index !== -1) {
        this.inMemoryOrganizers[index] = updatedOrganizer;
        console.log('Successfully updated in memory');
        return updatedOrganizer;
      }
      return null;
    }
  }

  async updateOrganizerStatus(id: string, status: string, userId: string): Promise<Organizer | null> {
    console.log('OrganizerService.updateOrganizerStatus called with:', { id, status, userId });
    return this.updateOrganizer(id, { status }, userId);
  }

  async updateOrganizerVerification(id: string, verified: boolean, verificationNotes?: string, userId?: string): Promise<Organizer | null> {
    console.log('OrganizerService.updateOrganizerVerification called with:', { id, verified, verificationNotes, userId });
    
    const updateData: Partial<Organizer> = {
      verified,
      verificationNotes,
      verifiedAt: verified ? new Date() : undefined,
      verifiedBy: verified ? userId : undefined
    };

    return this.updateOrganizer(id, updateData, userId || '');
  }

  async deleteOrganizer(id: string): Promise<boolean> {
    console.log('OrganizerService.deleteOrganizer called with id:', id);
    
    const db = getFirestore();
    if (db) {
      try {
        console.log('Deleting organizer from Firestore...');
        await db.collection(this.collection).doc(id).delete();
        console.log('Successfully deleted from Firestore');
        return true;
      } catch (error) {
        console.error('Error deleting organizer from Firestore:', error);
        throw new Error('Failed to delete organizer');
      }
    } else {
      console.log('Deleting organizer from memory...');
      const index = this.inMemoryOrganizers.findIndex(org => org.id === id);
      if (index !== -1) {
        this.inMemoryOrganizers.splice(index, 1);
        console.log('Successfully deleted from memory');
        return true;
      }
      console.log('Organizer not found in memory');
      return false;
    }
  }

  async getOrganizerCategories(): Promise<string[]> {
    console.log('OrganizerService.getOrganizerCategories called');
    
    // Return common organizer categories
    const categories = [
      'music',
      'theater',
      'comedy',
      'dance',
      'art',
      'sports',
      'conference',
      'workshop',
      'festival',
      'other'
    ];
    
    console.log('Returning categories:', categories);
    return categories;
  }

  async getOrganizerShows(organizerId: string, includeInactive: boolean = false): Promise<any[]> {
    console.log('OrganizerService.getOrganizerShows called with:', { organizerId, includeInactive });
    
    // This would typically query the shows collection
    // For now, return empty array - implement when Show service is ready
    console.log('Returning empty shows array (not implemented yet)');
    return [];
  }

  async getOrganizerStats(organizerId: string): Promise<OrganizerStats> {
    console.log('OrganizerService.getOrganizerStats called with organizerId:', organizerId);
    
    // Calculate statistics for the organizer
    const organizer = await this.getOrganizerById(organizerId);
    if (!organizer) {
      throw new Error('Organizer not found');
    }

    const stats: OrganizerStats = {
      totalShows: 0,
      activeShows: 0,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      totalReviews: 0,
      followersCount: organizer.followersCount || 0
    };

    console.log('Returning organizer stats:', stats);
    return stats;
  }
} 