import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryManAddComponent } from './delivery-man-add.component';

describe('DeliveryManAddComponent', () => {
  let component: DeliveryManAddComponent;
  let fixture: ComponentFixture<DeliveryManAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryManAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryManAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
