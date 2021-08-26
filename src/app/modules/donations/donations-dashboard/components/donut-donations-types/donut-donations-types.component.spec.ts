import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutDonationsTypesComponent } from './donut-donations-types.component';

describe('DonutDonationsTypesComponent', () => {
  let component: DonutDonationsTypesComponent;
  let fixture: ComponentFixture<DonutDonationsTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonutDonationsTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutDonationsTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
