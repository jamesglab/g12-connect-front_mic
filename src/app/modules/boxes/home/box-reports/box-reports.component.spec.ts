import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxReportsComponent } from './box-reports.component';

describe('BoxReportsComponent', () => {
  let component: BoxReportsComponent;
  let fixture: ComponentFixture<BoxReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
