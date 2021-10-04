import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNetworkComponent } from './main-network.component';

describe('MainNetworkComponent', () => {
  let component: MainNetworkComponent;
  let fixture: ComponentFixture<MainNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
