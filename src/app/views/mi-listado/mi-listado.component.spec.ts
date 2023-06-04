import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MiListadoComponent } from './mi-listado.component';

describe('MiListadoComponent', () => {
  let component: MiListadoComponent;
  let fixture: ComponentFixture<MiListadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiListadoComponent]
    });
    fixture = TestBed.createComponent(MiListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
