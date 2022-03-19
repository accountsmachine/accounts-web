import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatTokenComponent } from './vat-token.component';

describe('VatTokenComponent', () => {
  let component: VatTokenComponent;
  let fixture: ComponentFixture<VatTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
