import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import useLogin from '../hooks/useLogin';
import validation from '../validation';

// Mock the useLogin hook and validation functions
jest.mock('../hooks/useLogin');
jest.mock('../validation');

describe('Login Component', () => {
  const loginMock = jest.fn();

  beforeEach(() => {
    useLogin.mockReturnValue({
      login: loginMock,
      error: '',
      isLoading: false,
    });
    validation.checkEmail.mockClear();
    validation.checkLoginPassword.mockClear();
    loginMock.mockClear();
  });

  // 1. Test for rendering the component
  test('renders Login component without crashing', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // 2. Test for form submission with valid input
  test('calls login function on form submission with valid input', async () => {
    validation.checkEmail.mockReturnValue(true);
    validation.checkLoginPassword.mockReturnValue(true);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(validation.checkEmail).toHaveBeenCalledWith('test@example.com');
      expect(validation.checkLoginPassword).toHaveBeenCalledWith('password123');
      expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  // 3. Test for form submission with error from login function
  test('shows error from login function', async () => {
    useLogin.mockReturnValue({
      login: jest.fn().mockRejectedValue('Login error'),
      error: 'Login error',
      isLoading: false,
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Login error')).toBeInTheDocument();
    });
  });
});
