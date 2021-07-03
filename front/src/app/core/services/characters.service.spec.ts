// import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
// import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
// import { Character } from 'src/app/shared/models/character';
// import { authenticationMockService } from 'src/app/shared/tests/services/authentication.mock.service';
// import { environment } from 'src/environments/environment';
// import { AuthenticationService } from './authentication.service';
// import { CharactersService } from './characters.service';

// fdescribe('Given CharactersService', () => {
//   let service: CharactersService;
//   // let httpClient: HttpTestingController;
//   // let authService: AuthenticationService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//       ],
//       providers: [
//         CharactersService,
//         {
//           provide: AuthenticationService,
//           useValue: authenticationMockService,
//         },
//         // {
//         //   provide: HttpClient,
//         //   useValue: httpClientMockService,
//         // },
//         // HttpTestingController,
//       ]
//     });
//     service = TestBed.inject(CharactersService);
//     // httpClient = TestBed.inject(HttpTestingController);
//     // authService = TestBed.inject(AuthenticationService);
//   });

//   describe('When service is called', () => {
//     it('Then it should be created', () => {
//       expect(service).toBeTruthy();
//     });
//   });

//   describe('When searching for current user\'s characters', () => {
//     let response;
//     let requestWrapper: TestRequest;
//     const requestResponse = [new Character()];

//     beforeEach(
//       fakeAsync(
//         inject([AuthenticationService, HttpTestingController],
//           (authService: AuthenticationService, httpClient: HttpTestingController) => {
//             // const url = 'https://example.com/login';

//             // const responseObject = {
//             //   success: true,
//             //   message: 'login was successful'
//             // };
//             // const user = new User('test@example.com', 'testpassword');
//             // let response = null;
//             // End Setup
//             authService.getCurrentUserId = jasmine.createSpy('getCurrentUserId').and.returnValue('1');


//             service.getAllByUserId().subscribe((res) => {
//               response = res;
//               console.log('res', res);
//             });
//             // authService.onLogin(user).subscribe(
//             //   (receivedResponse: any) => {
//             //     response = receivedResponse;
//             //   },
//             //   (error: any) => {}
//             // );

//             requestWrapper = httpClient.expectOne({ url: `${environment.apiUrl}/characters/${authService.getCurrentUserId()}` });
//             requestWrapper.flush(requestResponse);

//             tick();
//           }),
//       ),
//     );

//     it('Then API retreive them', () => {
//       expect(response.body).toEqual(requestResponse);
//     });

//     it('Then API status code = 200', () => {
//       expect(response.status).toBe(200);
//     });
//   });
// });
