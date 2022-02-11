import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserMassiveComponent } from './add-user.component';

describe('AddUserMassiveComponent', () => {
  let component: AddUserMassiveComponent;
  let fixture: ComponentFixture<AddUserMassiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserMassiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
