import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAccountListComponent } from './consumer-account-list.component';

describe('ConsumerAccountListComponent', () => {
  let component: ConsumerAccountListComponent;
  let fixture: ComponentFixture<ConsumerAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
