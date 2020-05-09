import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerUpdateComponent } from './consumer-update.component';

describe('ConsumerUpdateComponent', () => {
  let component: ConsumerUpdateComponent;
  let fixture: ComponentFixture<ConsumerUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
