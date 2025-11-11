import { vi } from 'vitest';

// Mock Firebase Auth
export const mockAuth = {
  currentUser: null,
  signOut: vi.fn(),
};

// Mock Firebase Database
export const mockDb = {};

// Mock Firebase functions
export const mockSignInWithPopup = vi.fn();
export const mockSignOut = vi.fn();
export const mockOnAuthStateChanged = vi.fn();
export const mockRef = vi.fn();
export const mockOnValue = vi.fn();
export const mockSet = vi.fn();
export const mockUpdate = vi.fn();
export const mockRemove = vi.fn();
export const mockGet = vi.fn();

// Mock user object
export const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
};

// Helper function to create mock Firebase listener
export const createMockListener = (data: any) => {
  return vi.fn((callback: Function) => {
    callback(data);
    return vi.fn(); // Return unsubscribe function
  });
};
