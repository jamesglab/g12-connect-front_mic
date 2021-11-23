import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoxUserComponent } from './add-box-user.component';

describe('AddBoxUserComponent', () => {
  let component: AddBoxUserComponent;
  let fixture: ComponentFixture<AddBoxUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBoxUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBoxUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
