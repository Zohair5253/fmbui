import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAccountViewComponent } from './consumer-account-view.component';

describe('ConsumerAccountViewComponent', () => {
  let component: ConsumerAccountViewComponent;
  let fixture: ComponentFixture<ConsumerAccountViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerAccountViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
