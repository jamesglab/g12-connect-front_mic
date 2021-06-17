import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsersCountsComponent } from './show-users-counts.component';

describe('ShowUsersCountsComponent', () => {
  let component: ShowUsersCountsComponent;
  let fixture: ComponentFixture<ShowUsersCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowUsersCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowUsersCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
