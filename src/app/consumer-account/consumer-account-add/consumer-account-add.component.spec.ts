import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAccountAddComponent } from './consumer-account-add.component';

describe('ConsumerAccountAddComponent', () => {
  let component: ConsumerAccountAddComponent;
  let fixture: ComponentFixture<ConsumerAccountAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerAccountAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAccountAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
