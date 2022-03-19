import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsNavComponent } from './navigator.component';

describe('AccountsNavComponent', () => {
  let component: AccountsNavComponent;
  let fixture: ComponentFixture<AccountsNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
