import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMassiveComponent } from './edit-massive.component';

describe('EditMassiveComponent', () => {
  let component: EditMassiveComponent;
  let fixture: ComponentFixture<EditMassiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMassiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
