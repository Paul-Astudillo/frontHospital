import { TestBed } from '@angular/core/testing';

import { ApichatgptService } from './apichatgpt.service';

describe('ApichatgptService', () => {
  let service: ApichatgptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApichatgptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
