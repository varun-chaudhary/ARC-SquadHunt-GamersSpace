
export type Role = 'player' | 'organizer' | 'admin';

export type UserStatus = 'active' | 'inactive';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
};

export type OpportunityStatus = 'pending' | 'approved' | 'closed';

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  location?: string;
  eventDate?: string;
  capacity?: number;
  organizerId: string;
  organizer: User;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
};
