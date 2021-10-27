import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponsTableComponent } from './cupons-table.component';

describe('CuponsTableComponent', () => {
  let component: CuponsTableComponent;
  let fixture: ComponentFixture<CuponsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuponsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuponsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
