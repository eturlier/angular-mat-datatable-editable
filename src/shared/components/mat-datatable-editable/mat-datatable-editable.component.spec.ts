import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDatatableEditableComponent } from './mat-datatable-editable.component';

describe('MatDatatableEditableComponent', () => {
  let component: MatDatatableEditableComponent;
  let fixture: ComponentFixture<MatDatatableEditableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatDatatableEditableComponent]
    });
    fixture = TestBed.createComponent(MatDatatableEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
