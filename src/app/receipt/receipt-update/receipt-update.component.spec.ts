import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptUpdateComponent } from './receipt-update.component';

describe('ReceiptUpdateComponent', () => {
  let component: ReceiptUpdateComponent;
  let fixture: ComponentFixture<ReceiptUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
