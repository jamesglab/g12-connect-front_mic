import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryComponent } from './ministry.component';

describe('MinistryComponent', () => {
  let component: MinistryComponent;
  let fixture: ComponentFixture<MinistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
