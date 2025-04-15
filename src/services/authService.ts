
import { AuthUser, Role } from '@/types';

// Authentication APIs
export const login = async (email: string, password: string): Promise<AuthUser> => {
  // For demo purposes, we'll mock the login API with different user types
  const mockUsers = {
    'admin@arc.com': {
      id: '1',
      name: 'Admin User',
      email: 'admin@arc.com',
      role: 'admin' as Role,
      password: 'admin123',
      token: 'mock_jwt_token_for_admin_user',
    },
    'organizer@arc.com': {
      id: '2',
      name: 'Organizer User',
      email: 'organizer@arc.com',
      role: 'organizer' as Role,
      password: 'organizer123',
      token: 'mock_jwt_token_for_organizer_user',
    },
    'player@arc.com': {
      id: '3',
      name: 'Player User',
      email: 'player@arc.com',
      role: 'player' as Role,
      password: 'player123',
      token: 'mock_jwt_token_for_player_user',
    },
  };
  
  const user = mockUsers[email as keyof typeof mockUsers];
  
  if (user && user.password === password) {
    const { password: _, ...authUser } = user;
    localStorage.setItem('auth_token', authUser.token);
    return authUser;
  }
  
  throw new Error('Invalid credentials');
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
};
