import { Request, Response } from 'express';
import { OrganizerService } from '../services/OrganizerService';
import { CreateOrganizerRequest, UpdateOrganizerRequest, OrganizerFilter } from '../services/OrganizerService';

// AsyncHandler utility (matches ArticleController pattern)
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export class OrganizerController {
  private organizerService: OrganizerService;

  constructor() {
    this.organizerService = new OrganizerService();
  }

  // Get all organizers (admin with filters)
  getOrganizers = asyncHandler(async (req: Request, res: Response) => {
    const filter: OrganizerFilter = {
      status: req.query.status as string,
      category: req.query.category as string,
      search: req.query.search as string,
      verified: req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };

    const result = await this.organizerService.getOrganizers(filter);
    res.json({
      success: true,
      data: result.organizers,
      pagination: result.pagination
    });
  });

  // Get verified organizers (public)
  getVerifiedOrganizers = asyncHandler(async (req: Request, res: Response) => {
    const filter: OrganizerFilter = {
      verified: true,
      status: 'active',
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      search: req.query.search as string
    };

    const result = await this.organizerService.getOrganizers(filter);
    res.json({
      success: true,
      data: result.organizers,
      pagination: result.pagination
    });
  });

  // Get organizer by ID
  getOrganizerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const organizer = await this.organizerService.getOrganizerById(id);
    
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer
    });
  });

  // Get organizer by slug
  getOrganizerBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const organizer = await this.organizerService.getOrganizerBySlug(slug);
    
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer
    });
  });

  // Get organizer's shows/events
  getOrganizerShows = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeInactive = req.query.includeInactive === 'true';
    
    const shows = await this.organizerService.getOrganizerShows(id, includeInactive);
    
    res.json({
      success: true,
      data: shows
    });
  });

  // Get organizer statistics
  getOrganizerStats = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const stats = await this.organizerService.getOrganizerStats(id);
    
    res.json({
      success: true,
      data: stats
    });
  });

  // Create organizer
  createOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const organizerData: CreateOrganizerRequest = req.body;
    
    // TODO: Replace with real user ID from auth middleware
    const userId = 'mock-user-id';
    
    const organizer = await this.organizerService.createOrganizer(organizerData, userId);
    
    res.status(201).json({
      success: true,
      data: organizer,
      message: 'Organizer created successfully'
    });
  });

  // Update organizer
  updateOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: UpdateOrganizerRequest = req.body;
    
    // TODO: Replace with real user ID from auth middleware
    const userId = 'mock-user-id';
    
    const organizer = await this.organizerService.updateOrganizer(id, updateData, userId);
    
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer,
      message: 'Organizer updated successfully'
    });
  });

  // Update organizer status
  updateOrganizerStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // TODO: Replace with real user ID from auth middleware
    const userId = 'mock-user-id';
    
    const organizer = await this.organizerService.updateOrganizerStatus(id, status, userId);
    
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer,
      message: 'Organizer status updated successfully'
    });
  });

  // Update organizer verification
  updateOrganizerVerification = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { verified, verificationNotes } = req.body;
    
    // TODO: Replace with real user ID from auth middleware
    const userId = 'mock-user-id';
    
    const organizer = await this.organizerService.updateOrganizerVerification(
      id, 
      verified, 
      verificationNotes, 
      userId
    );
    
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      data: organizer,
      message: `Organizer ${verified ? 'verified' : 'unverified'} successfully`
    });
  });

  // Delete organizer
  deleteOrganizer = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const success = await this.organizerService.deleteOrganizer(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    res.json({
      success: true,
      message: 'Organizer deleted successfully'
    });
  });

  // Get organizer categories
  getOrganizerCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.organizerService.getOrganizerCategories();
    
    res.json({
      success: true,
      data: categories
    });
  });
} 