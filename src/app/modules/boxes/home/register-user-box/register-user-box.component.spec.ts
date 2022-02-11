import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUserBoxComponent } from './register-user-box.component';

describe('RegisterUserBoxComponent', () => {
  let component: RegisterUserBoxComponent;
  let fixture: ComponentFixture<RegisterUserBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterUserBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
