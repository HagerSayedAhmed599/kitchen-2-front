import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenStatusReportComponent } from './kitchen-status-report.component';

describe('KitchenStatusReportComponent', () => {
  let component: KitchenStatusReportComponent;
  let fixture: ComponentFixture<KitchenStatusReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KitchenStatusReportComponent]
    });
    fixture = TestBed.createComponent(KitchenStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
