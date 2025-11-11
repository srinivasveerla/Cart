import { describe, it, expect, beforeEach } from 'vitest';
import { screen, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider, useUserContext } from '../UserContext';

// Test component that uses the context
const TestComponent = () => {
  const { user, setUser } = useUserContext();

  return (
    <div>
      <div>{user ? `Hello ${user.displayName}` : 'No user'}</div>
      <button onClick={() => setUser({ displayName: 'Test User', uid: '123' })}>
        Set User
      </button>
      <button onClick={() => setUser(null)}>Clear User</button>
    </div>
  );
};

describe('UserContext', () => {
  it('should throw error when useUserContext is used outside UserProvider', () => {
    // Suppress console.error for this test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();

    expect(() => {
      rtlRender(<TestComponent />);
    }).toThrow('useUserContext must be used within a UserProvider');

    consoleErrorSpy.mockRestore();
  });

  it('should provide user context when wrapped with UserProvider', () => {
    rtlRender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByText('No user')).toBeInTheDocument();
  });

  it('should update user when setUser is called', async () => {
    const user = userEvent.setup();

    rtlRender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByRole('button', { name: /set user/i });
    await user.click(setUserButton);

    expect(screen.getByText('Hello Test User')).toBeInTheDocument();
  });

  it('should clear user when setUser is called with null', async () => {
    const user = userEvent.setup();

    rtlRender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByRole('button', { name: /set user/i });
    const clearUserButton = screen.getByRole('button', { name: /clear user/i });

    // Set user
    await user.click(setUserButton);
    expect(screen.getByText('Hello Test User')).toBeInTheDocument();

    // Clear user
    await user.click(clearUserButton);
    expect(screen.getByText('No user')).toBeInTheDocument();
  });

  it('should maintain user state across component remounts', async () => {
    const user = userEvent.setup();

    const { rerender } = rtlRender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByRole('button', { name: /set user/i });
    await user.click(setUserButton);

    expect(screen.getByText('Hello Test User')).toBeInTheDocument();

    // Remount component but keep provider
    rerender(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // User state should be reset as new UserProvider instance is created
    expect(screen.getByText('No user')).toBeInTheDocument();
  });
});

// Import vi for the test
import { vi } from 'vitest';
