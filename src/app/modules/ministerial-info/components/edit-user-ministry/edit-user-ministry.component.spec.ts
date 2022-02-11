import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserMinistryComponent } from './edit-user-ministry.component';

describe('EditUserMinistryComponent', () => {
  let component: EditUserMinistryComponent;
  let fixture: ComponentFixture<EditUserMinistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserMinistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserMinistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
