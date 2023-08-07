import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CogsComponent } from './cogs.component';

describe('CogsComponent', () => {
  let component: CogsComponent;
  let fixture: ComponentFixture<CogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CogsComponent]
    });
    fixture = TestBed.createComponent(CogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
