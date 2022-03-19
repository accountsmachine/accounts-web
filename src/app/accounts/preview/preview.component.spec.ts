import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPreviewComponent } from './accounts-preview.component';

describe('AccountsPreviewComponent', () => {
  let component: AccountsPreviewComponent;
  let fixture: ComponentFixture<AccountsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
