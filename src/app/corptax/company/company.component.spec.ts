import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorptaxCompanyComponent } from './corptax-company.component';

describe('CorptaxCompanyComponent', () => {
  let component: CorptaxCompanyComponent;
  let fixture: ComponentFixture<CorptaxCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorptaxCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorptaxCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
