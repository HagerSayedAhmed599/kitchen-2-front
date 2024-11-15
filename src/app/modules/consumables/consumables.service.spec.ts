import { TestBed } from '@angular/core/testing';

import { ConsumablesService } from './consumables.service';

describe('ConsumablesService', () => {
  let service: ConsumablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
