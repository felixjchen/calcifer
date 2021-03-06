import { TestBed } from '@angular/core/testing';

import { MonacoLanguageService } from './monaco-language.service';

describe('MonacoLanguageService', () => {
  let service: MonacoLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonacoLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
