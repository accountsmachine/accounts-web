import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatPreviewComponent } from './vat-preview.component';

describe('VatPreviewComponent', () => {
  let component: VatPreviewComponent;
  let fixture: ComponentFixture<VatPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
