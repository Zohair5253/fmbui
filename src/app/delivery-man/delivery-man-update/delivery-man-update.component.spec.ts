import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryManUpdateComponent } from './delivery-man-update.component';

describe('DeliveryManUpdateComponent', () => {
  let component: DeliveryManUpdateComponent;
  let fixture: ComponentFixture<DeliveryManUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryManUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryManUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
