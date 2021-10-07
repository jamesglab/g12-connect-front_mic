import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangueEventUserComponent } from './changue-event-user.component';

describe('ChangueEventUserComponent', () => {
  let component: ChangueEventUserComponent;
  let fixture: ComponentFixture<ChangueEventUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangueEventUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangueEventUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
