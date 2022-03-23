import { TestBed } from '@angular/core/testing';

import { FrontPageService } from './front-page.service';

describe('FrontPageService', () => {
  let service: FrontPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
