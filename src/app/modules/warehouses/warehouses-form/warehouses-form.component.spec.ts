import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousesFormComponent } from './warehouses-form.component';

describe('WarehousesFormComponent', () => {
  let component: WarehousesFormComponent;
  let fixture: ComponentFixture<WarehousesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousesFormComponent]
    });
    fixture = TestBed.createComponent(WarehousesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
