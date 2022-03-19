import { TestBed } from '@angular/core/testing';

import { VatRecordService } from './vat-record.service';

describe('VatRecordService', () => {
  let service: VatRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VatRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
