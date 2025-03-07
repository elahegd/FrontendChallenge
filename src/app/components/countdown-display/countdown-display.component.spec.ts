import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownDisplayComponent } from './countdown-display.component';

describe('CountdownDisplayComponent', () => {
  let component: CountdownDisplayComponent;
  let fixture: ComponentFixture<CountdownDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountdownDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
