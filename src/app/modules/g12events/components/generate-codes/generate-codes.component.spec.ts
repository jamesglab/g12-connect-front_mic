import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCodesComponent } from './generate-codes.component';

describe('GenerateCodesComponent', () => {
  let component: GenerateCodesComponent;
  let fixture: ComponentFixture<GenerateCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
