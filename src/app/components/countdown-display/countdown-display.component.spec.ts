import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountdownDisplayComponent } from './countdown-display.component';
import { CommonModule } from '@angular/common';

describe('CountdownDisplayComponent', () => {
  let component: CountdownDisplayComponent;
  let fixture: ComponentFixture<CountdownDisplayComponent>;
  let mockTitleElement: HTMLElement;
  let mockTimeRemainingContainer: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownDisplayComponent, CommonModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountdownDisplayComponent);
    component = fixture.componentInstance;

    mockTitleElement = document.createElement('h1');
    mockTimeRemainingContainer = document.createElement('div');
    
    component['titleElement'] = { nativeElement: mockTitleElement } as any;
    component['timeRemainingContainer'] = { nativeElement: mockTimeRemainingContainer } as any;

    const localStorageMock = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem')
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('');
    expect(component.endDate).toBe('');
    expect(component.titleFontSize).toBe('2.5rem');
    expect(component.timeRemainingFontSize).toBe('2rem');
    expect(component.timeRemaining).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  });

  it('should update title and store in localStorage', () => {
    const newTitle = 'New Title';
    component.title = newTitle;
    
    expect(component.title).toBe(newTitle);
    expect(localStorage.setItem).toHaveBeenCalledWith('countdownTitle', newTitle);
  });

  it('should update endDate and store in localStorage', () => {
    const newDate = '2024-12-31';
    component.endDate = newDate;
    
    expect(component.endDate).toBe(newDate);
    expect(localStorage.setItem).toHaveBeenCalledWith('countdownDate', newDate);
  });

  it('should load stored values from localStorage on init', () => {
    const storedTitle = 'Stored Title';
    const storedDate = '2024-12-31';
    
    (localStorage.getItem as jasmine.Spy).and.returnValues(storedTitle, storedDate);

    component.ngOnInit();

    expect(component.title).toBe(storedTitle);
    expect(component.endDate).toBe(storedDate);
  });

  it('should emit stored values when loading from localStorage', () => {
    const storedTitle = 'Stored Title';
    const storedDate = '2024-12-31';
    
    (localStorage.getItem as jasmine.Spy).and.returnValues(storedTitle, storedDate);

    const titleSpy = spyOn(component.storedTitle, 'emit');
    const dateSpy = spyOn(component.storedDate, 'emit');

    component.ngOnInit();

    expect(titleSpy).toHaveBeenCalledWith(storedTitle);
    expect(dateSpy).toHaveBeenCalledWith(storedDate);
  });

  it('should set time remaining to zero when end date is in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    component.endDate = pastDate.toISOString().split('T')[0];
    component['updateTimeRemaining']();

    expect(component.timeRemaining).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
  });

  it('should calculate font size based on container width', () => {
    const containerWidth = 1000;
    const element = document.createElement('div');
    element.style.fontSize = '2.5rem';
    element.style.width = '100px';
    element.textContent = 'Test Title';
    document.body.appendChild(element);
    
    Object.defineProperty(element, 'scrollWidth', { value: 800 });
    
    const fontSize = component['calculateFontSize'](element, containerWidth);
    document.body.removeChild(element);
    
    expect(fontSize).toBe('2.5rem');
  });

  it('should reduce font size when content is too wide', () => {
    const containerWidth = 500;
    const element = document.createElement('div');
    element.style.fontSize = '2.5rem';
    element.textContent = 'This is a very long title that should cause the font size to reduce';
    document.body.appendChild(element);
    
    const fontSize = component['calculateFontSize'](element, containerWidth);
    document.body.removeChild(element);
    
    expect(parseFloat(fontSize)).toBeLessThan(2.5);
  });

  it('should not reduce font size below minimum', () => {
    const containerWidth = 100;
    const element = document.createElement('div');
    element.style.fontSize = '2.5rem';
    element.textContent = 'This is an extremely long title that should cause the font size to reduce to minimum';
    document.body.appendChild(element);
    
    const fontSize = component['calculateFontSize'](element, containerWidth);
    document.body.removeChild(element);
    
    expect(parseFloat(fontSize)).toBeGreaterThanOrEqual(0.5);
  });

  it('should cleanup timer and event listeners on destroy', () => {
    const clearIntervalSpy = spyOn(window, 'clearInterval');
    const removeEventListenerSpy = spyOn(window, 'removeEventListener');

    component.ngOnDestroy();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
