import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRegisterComponent } from './detail-register.component';

describe('DetailRegisterComponent', () => {
  let component: DetailRegisterComponent;
  let fixture: ComponentFixture<DetailRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
