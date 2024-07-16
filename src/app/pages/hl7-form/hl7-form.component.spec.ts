import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hl7FormComponent } from './hl7-form.component';

describe('Hl7FormComponent', () => {
  let component: Hl7FormComponent;
  let fixture: ComponentFixture<Hl7FormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Hl7FormComponent]
    });
    fixture = TestBed.createComponent(Hl7FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
