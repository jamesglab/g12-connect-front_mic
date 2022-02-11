import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailEventComponent } from './email-event.component';

describe('EmailEventComponent', () => {
  let component: EmailEventComponent;
  let fixture: ComponentFixture<EmailEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
