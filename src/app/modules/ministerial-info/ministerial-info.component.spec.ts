import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterialInfoComponent } from './ministerial-info.component';

describe('MinisterialInfoComponent', () => {
  let component: MinisterialInfoComponent;
  let fixture: ComponentFixture<MinisterialInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinisterialInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinisterialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
