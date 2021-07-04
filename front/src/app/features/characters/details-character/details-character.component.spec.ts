import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCharacterComponent } from './details-character.component';

describe('DetailsCharacterComponent', () => {
  let component: DetailsCharacterComponent;
  let fixture: ComponentFixture<DetailsCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsCharacterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
