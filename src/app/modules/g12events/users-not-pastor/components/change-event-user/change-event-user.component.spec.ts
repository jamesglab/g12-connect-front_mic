import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { changeEventUserComponent } from './change-event-user.component';

describe('changeEventUserComponent', () => {
  let component: changeEventUserComponent;
  let fixture: ComponentFixture<changeEventUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ changeEventUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(changeEventUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
