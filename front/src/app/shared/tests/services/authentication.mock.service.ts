export const authenticationMockService = {
  register: jasmine.createSpy('register'),
  login: jasmine.createSpy('login'),
  isLoggedIn: jasmine.createSpy('isLoggedIn'),
  getCurrentUser: jasmine.createSpy('getCurrentUser'),
  getToken: jasmine.createSpy('getToken'),
};
