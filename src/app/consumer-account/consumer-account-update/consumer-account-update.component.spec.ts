import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAccountUpdateComponent } from './consumer-account-update.component';

describe('ConsumerAccountUpdateComponent', () => {
  let component: ConsumerAccountUpdateComponent;
  let fixture: ComponentFixture<ConsumerAccountUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerAccountUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAccountUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
