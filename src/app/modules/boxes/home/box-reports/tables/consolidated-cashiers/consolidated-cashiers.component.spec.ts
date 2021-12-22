import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedCashiersComponent } from './consolidated-cashiers.component';

describe('ConsolidatedCashiersComponent', () => {
  let component: ConsolidatedCashiersComponent;
  let fixture: ComponentFixture<ConsolidatedCashiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedCashiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedCashiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
