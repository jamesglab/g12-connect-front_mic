import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponsReportsComponent } from './cupons-reports.component';

describe('CuponsReportsComponent', () => {
  let component: CuponsReportsComponent;
  let fixture: ComponentFixture<CuponsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuponsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuponsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
