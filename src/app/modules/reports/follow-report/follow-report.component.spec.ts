import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowReportComponent } from './follow-report.component';

describe('FollowReportComponent', () => {
  let component: FollowReportComponent;
  let fixture: ComponentFixture<FollowReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FollowReportComponent]
    });
    fixture = TestBed.createComponent(FollowReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
