import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiMenuComponent } from './mi-menu.component';

describe('MiMenuComponent', () => {
  let component: MiMenuComponent;
  let fixture: ComponentFixture<MiMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiMenuComponent]
    });
    fixture = TestBed.createComponent(MiMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
