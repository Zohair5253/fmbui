import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptPrintComponent } from './receipt-print.component';

describe('ReceiptPrintComponent', () => {
  let component: ReceiptPrintComponent;
  let fixture: ComponentFixture<ReceiptPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
