export const authenticationMockService = {
  register: jasmine.createSpy('register'),
  login: jasmine.createSpy('login'),
  isLoggedIn: jasmine.createSpy('isLoggedIn'),
  getCurrentUserId: jasmine.createSpy('getCurrentUserId'),
  getCurrentUserLogin: jasmine.createSpy('getCurrentUserLogin'),
  getToken: jasmine.createSpy('getToken'),
};
