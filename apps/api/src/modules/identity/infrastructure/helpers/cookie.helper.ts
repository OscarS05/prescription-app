import { Response } from 'express';

type NAME_COOKIE = 'refreshToken' | 'accessToken';

export const setCookie = (res: Response, name: NAME_COOKIE, token: string): void => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:
      name === 'accessToken'
        ? parseInt(process.env.JWT_ACCESS_TTL || '86400')
        : parseInt(process.env.JWT_REFRESH_TTL || '604800'),
  });
};

export const clearCookie = (res: Response, name: string): void => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};
