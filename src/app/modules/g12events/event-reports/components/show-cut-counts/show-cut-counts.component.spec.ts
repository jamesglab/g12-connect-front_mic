import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCutCountsComponent } from './show-cut-counts.component';

describe('ShowCutCountsComponent', () => {
  let component: ShowCutCountsComponent;
  let fixture: ComponentFixture<ShowCutCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCutCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCutCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
