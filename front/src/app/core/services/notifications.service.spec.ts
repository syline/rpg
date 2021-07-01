import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { matSnackBarMockService } from 'src/app/shared/tests/services/mat-snack-bar.mock.service';
import { NotificationsService } from './notifications.service';

describe('Given NotificationsService', () => {
  let service: NotificationsService;
  let snackBar: MatSnackBar;
  const message = 'message';

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NotificationsService,
      {
        provide: MatSnackBar,
        useValue: matSnackBarMockService,
      },
    ]
  }));

  beforeEach(() => {
    service = TestBed.inject(NotificationsService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  describe('When service is called', () => {
    it('Then it should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('When showInformation is called', () => {
    beforeEach(() => {
      service.showInformation(message);
    });

    it('Then open is called without config', () => {
      expect(snackBar.open).toHaveBeenCalledWith(message, 'OK');
    });
  });

  describe('When showErrorMessage is called', () => {
    beforeEach(() => {
      service.showErrorMessage(message);
    });

    it('Then open is called with error css class', () => {
      const config = new MatSnackBarConfig();
      config.panelClass = 'snack-bar-error';
      expect(snackBar.open).toHaveBeenCalledWith(message, 'OK', config);
    });
  });

  describe('When showSuccessMessage is called', () => {
    beforeEach(() => {
      service.showSuccessMessage(message);
    });

    it('Then open is called with success css class', () => {
      const config = new MatSnackBarConfig();
      config.panelClass = 'snack-bar-success';
      expect(snackBar.open).toHaveBeenCalledWith(message, 'OK', config);
    });
  });
});
