import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatNewComponent } from './vat-new.component';

describe('VatNewComponent', () => {
  let component: VatNewComponent;
  let fixture: ComponentFixture<VatNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
