import { TestBed } from '@angular/core/testing';

import { CompanyLookupService } from './company-lookup.service';

describe('CompanyLookupService', () => {
  let service: CompanyLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
