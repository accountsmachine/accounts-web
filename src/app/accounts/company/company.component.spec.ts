import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsCompanyComponent } from './accounts-company.component';

describe('AccountsCompanyComponent', () => {
  let component: AccountsCompanyComponent;
  let fixture: ComponentFixture<AccountsCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
