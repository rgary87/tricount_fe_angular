import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRefundComponent } from './add-refund.component';

describe('AddRefundComponent', () => {
  let component: AddRefundComponent;
  let fixture: ComponentFixture<AddRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
