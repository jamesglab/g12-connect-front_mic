import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassiveTableComponent } from './massive-table.component';

describe('MassiveTableComponent', () => {
  let component: MassiveTableComponent;
  let fixture: ComponentFixture<MassiveTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassiveTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassiveTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
