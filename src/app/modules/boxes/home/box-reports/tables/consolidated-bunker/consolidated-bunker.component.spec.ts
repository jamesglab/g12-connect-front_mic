import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedBunkerComponent } from './consolidated-bunker.component';

describe('ConsolidatedBunkerComponent', () => {
  let component: ConsolidatedBunkerComponent;
  let fixture: ComponentFixture<ConsolidatedBunkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedBunkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedBunkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
