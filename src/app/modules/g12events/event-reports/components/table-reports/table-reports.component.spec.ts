import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReportsComponent } from './table-reports.component';

describe('TableReportsComponent', () => {
  let component: TableReportsComponent;
  let fixture: ComponentFixture<TableReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
