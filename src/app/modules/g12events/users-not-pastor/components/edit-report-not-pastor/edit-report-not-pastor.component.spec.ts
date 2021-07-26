import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReportNotPastorComponent } from './edit-report-not-pastor.component';

describe('EditReportNotPastorComponent', () => {
  let component: EditReportNotPastorComponent;
  let fixture: ComponentFixture<EditReportNotPastorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReportNotPastorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReportNotPastorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
