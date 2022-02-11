import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundChartComponent } from './not-found-chart.component';

describe('NotFoundChartComponent', () => {
  let component: NotFoundChartComponent;
  let fixture: ComponentFixture<NotFoundChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
