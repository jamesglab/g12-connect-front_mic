import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMassiveComponent } from './create-massive.component';

describe('CreateMassiveComponent', () => {
  let component: CreateMassiveComponent;
  let fixture: ComponentFixture<CreateMassiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMassiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
