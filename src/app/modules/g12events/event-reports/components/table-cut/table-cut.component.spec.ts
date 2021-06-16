import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCutComponent } from './table-cut.component';

describe('TableCutComponent', () => {
  let component: TableCutComponent;
  let fixture: ComponentFixture<TableCutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableCutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
