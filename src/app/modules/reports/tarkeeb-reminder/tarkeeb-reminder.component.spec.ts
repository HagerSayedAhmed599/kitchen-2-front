import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarkeebReminderComponent } from './tarkeeb-reminder.component';

describe('TarkeebReminderComponent', () => {
  let component: TarkeebReminderComponent;
  let fixture: ComponentFixture<TarkeebReminderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarkeebReminderComponent]
    });
    fixture = TestBed.createComponent(TarkeebReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
