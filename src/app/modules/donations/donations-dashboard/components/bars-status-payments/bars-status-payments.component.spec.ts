import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarsStatusPaymentsComponent } from './bars-status-payments.component';

describe('BarsStatusPaymentsComponent', () => {
  let component: BarsStatusPaymentsComponent;
  let fixture: ComponentFixture<BarsStatusPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarsStatusPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarsStatusPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
