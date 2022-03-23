import { TestBed } from '@angular/core/testing';

import { FilingConfigService } from './filing-config.service';

describe('FilingConfigService', () => {
  let service: FilingConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilingConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
