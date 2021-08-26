import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareYearsComponent } from './compare-years.component';

describe('CompareYearsComponent', () => {
  let component: CompareYearsComponent;
  let fixture: ComponentFixture<CompareYearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareYearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
