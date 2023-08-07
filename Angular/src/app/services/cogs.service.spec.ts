import { TestBed } from '@angular/core/testing';

import { CogsService } from './cogs.service';

describe('CogsService', () => {
  let service: CogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
