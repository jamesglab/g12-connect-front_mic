import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMassivesComponent } from './report-massives.component';

describe('ReportMassivesComponent', () => {
  let component: ReportMassivesComponent;
  let fixture: ComponentFixture<ReportMassivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMassivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMassivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
