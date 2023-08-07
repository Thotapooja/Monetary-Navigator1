import { TestBed } from '@angular/core/testing';

import { OtherRevenueService } from './other-revenue.service';

describe('OtherRevenueService', () => {
  let service: OtherRevenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherRevenueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
