import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutTransactionsComponent } from './donut-transactions.component';

describe('DonutTransactionsComponent', () => {
  let component: DonutTransactionsComponent;
  let fixture: ComponentFixture<DonutTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
