import { TestBed } from '@angular/core/testing';

import { CompanyConfigService } from './company-config.service';

describe('CompanyConfigService', () => {
  let service: CompanyConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
