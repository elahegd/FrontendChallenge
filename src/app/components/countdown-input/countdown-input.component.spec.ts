import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CountdownInputComponent } from './countdown-input.component';

describe('CountdownInputComponent', () => {
  let component: CountdownInputComponent;
  let fixture: ComponentFixture<CountdownInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownInputComponent, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountdownInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.inputValue).toBe('');
    expect(component.selectedDate).toBe(new Date().toISOString().split('T')[0]);
    expect(component.today).toBe(new Date().toISOString().split('T')[0]);
  });

  it('should emit input value changes', () => {
    const spy = spyOn(component.inputValueChange, 'emit');
    const newValue = 'New Title';

    component.onInputValueChange(newValue);

    expect(component.inputValue).toBe(newValue);
    expect(spy).toHaveBeenCalledWith(newValue);
  });

  it('should emit date changes', () => {
    const spy = spyOn(component.selectedDateChange, 'emit');
    const newDate = '2024-12-31';

    component.onSelectedDateChange(newDate);

    expect(component.selectedDate).toBe(newDate);
    expect(spy).toHaveBeenCalledWith(newDate);
  });

  it('should not allow selecting dates before today', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    const dateInput = fixture.nativeElement.querySelector('#date-input');
    expect(dateInput.min).toBe(component.today);
  });

  it('should update input value when @Input changes', () => {
    const newValue = 'Updated Title';
    const inputElement = fixture.nativeElement.querySelector('#countdown-input');
    
    inputElement.value = newValue;

    inputElement.dispatchEvent(new Event('input'));

    component.inputValue = newValue;

    fixture.detectChanges();

    expect(inputElement.value).toBe(newValue);
  });

  it('should update date input when @Input changes', () => {
    const newDate = '2024-12-31';
    const dateInput = fixture.nativeElement.querySelector('#date-input');
    
    
    dateInput.value = newDate;
    
    dateInput.dispatchEvent(new Event('change'));
    
    component.selectedDate = newDate;
   
    fixture.detectChanges();

    expect(dateInput.value).toBe(newDate);
  });
});
