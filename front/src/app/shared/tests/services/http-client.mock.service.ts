export const httpClientMockService = {
  post: jasmine.createSpy('post'),
  get: jasmine.createSpy('get'),
  patch: jasmine.createSpy('patch'),
  delete: jasmine.createSpy('delete'),
};
