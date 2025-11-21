import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER_EMAIL,
  USER_PASSWORD,
} from '../../../config/env.config';
import { LoginModel } from '../models/login.model';
import { SignUpModel } from '../models/sign-up.model';

export const defaultUsers: Record<string, LoginModel> = {
  admin: {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  },
  user: {
    email: USER_EMAIL,
    password: USER_PASSWORD,
  },
};

export const invalidCredentials: Record<string, LoginModel> = {
  wrongEmail: {
    email: 'wrongEmail@example.com',
    password: ADMIN_PASSWORD,
  },
  wrongPassword: {
    email: ADMIN_EMAIL,
    password: 'wrongPassword',
  },
};

export const invalidInputs: Record<string, LoginModel> = {
  emptyEmail: {
    email: '',
    password: ADMIN_PASSWORD,
  },
  emptyPassword: {
    email: ADMIN_EMAIL,
    password: '',
  },
  emptyBoth: {
    email: '',
    password: '',
  },
};

export const signUpData: SignUpModel = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
};
