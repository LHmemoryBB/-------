import { request } from '../request';

/**
 * 系统登录接口
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string, captchaVerification: string) {
  return request<Api.Auth.LoginToken>({
    url: '/api/login',
    method: 'post',
    data: {
      userName,
      password,
      captchaVerification
    }
  });
}
/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
