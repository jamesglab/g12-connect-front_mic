import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTransactionsComponent } from './total-transactions.component';

describe('TotalTransactionsComponent', () => {
  let component: TotalTransactionsComponent;
  let fixture: ComponentFixture<TotalTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
