import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatNavComponent } from './navigator.component';

describe('VatNavComponent', () => {
  let component: VatNavComponent;
  let fixture: ComponentFixture<VatNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
