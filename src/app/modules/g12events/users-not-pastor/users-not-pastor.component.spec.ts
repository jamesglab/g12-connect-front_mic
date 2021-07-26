import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNotPastorComponent } from './users-not-pastor.component';

describe('UsersNotPastorComponent', () => {
  let component: UsersNotPastorComponent;
  let fixture: ComponentFixture<UsersNotPastorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersNotPastorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersNotPastorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
