import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsNewComponent } from './accounts-new.component';

describe('AccountsNewComponent', () => {
  let component: AccountsNewComponent;
  let fixture: ComponentFixture<AccountsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
