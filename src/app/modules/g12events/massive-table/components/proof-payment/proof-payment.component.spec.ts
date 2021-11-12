import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofPaymentComponent } from './proof-payment.component';

describe('ProofPaymentComponent', () => {
  let component: ProofPaymentComponent;
  let fixture: ComponentFixture<ProofPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
