import { TestBed } from '@angular/core/testing';

import { MainWarehouseService } from './main-warehouse.service';

describe('MainWarehouseService', () => {
  let service: MainWarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainWarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
