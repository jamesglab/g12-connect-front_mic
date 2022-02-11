import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleTransactionComponent } from './modale-transaction.component';

describe('ModaleTransactionComponent', () => {
  let component: ModaleTransactionComponent;
  let fixture: ComponentFixture<ModaleTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
