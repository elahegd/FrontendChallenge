import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './countdown-display.component.html',
  styleUrls: ['./countdown-display.component.scss']
})
export class CountdownDisplayComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('titleElement') titleElement!: ElementRef;
  @ViewChild('timeRemainingContainer') timeRemainingContainer!: ElementRef;

  @Output() storedTitle = new EventEmitter<string>();
  @Output() storedDate = new EventEmitter<string>();

  @Input() set title(value: string) {
    if (this._title !== value) {
      this._title = value;
      localStorage.setItem('countdownTitle', value);
      if (!value) {
        this.titleFontSize = '2.5rem';
      }
      setTimeout(() => this.updateTitleFontSize(), 0);
    }
  }
  get title(): string {
    return this._title;
  }

  @Input() set endDate(value: string) {
    if (this._endDate !== value) {
      this._endDate = value;
      localStorage.setItem('countdownDate', value);
      setTimeout(() => this.updateTimeRemainingFontSize(), 0);
    }
  }
  get endDate(): string {
    return this._endDate;
  }

  private _title: string = '';
  private _endDate: string = '';
  titleFontSize: string = '2.5rem';
  timeRemainingFontSize: string = '2rem';
  timeRemaining = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  private timer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStoredValues();
    this.startCountdown();
  }

  ngAfterViewInit() {
    this.updateTitleFontSize();
    this.updateTimeRemainingFontSize();
    window.addEventListener('resize', () => this.updateTitleFontSize());
    window.addEventListener('resize', () => this.updateTimeRemainingFontSize());
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private loadStoredValues(): void {
    const storedTitle = localStorage.getItem('countdownTitle');
    const storedDate = localStorage.getItem('countdownDate');
    
    if (storedTitle) {
      this._title = storedTitle;
      this.storedTitle.emit(storedTitle);
    }
    
    if (storedDate) {
      this._endDate = storedDate;
      this.storedDate.emit(storedDate);
    }
  }

  private startCountdown(): void {
    this.updateTimeRemaining();
    this.timer = setInterval(() => {
      this.updateTimeRemaining();
      this.cdr.detectChanges();
    }, 1000);
  }

  private updateTitleFontSize(): void {
    if (!this.titleElement) return;

    const containerWidth = document.documentElement.clientWidth;
    const title = this.titleElement.nativeElement;
    
    this.titleFontSize = this.calculateFontSize(title, containerWidth);
    this.cdr.detectChanges();
  }

  private updateTimeRemainingFontSize(): void {
    if (!this.timeRemainingContainer) return;

    const containerWidth = this.timeRemainingContainer.nativeElement.offsetWidth;
    const timeRemaining = this.timeRemainingContainer.nativeElement;

    this.timeRemainingFontSize = this.calculateFontSize(timeRemaining, containerWidth, {
      maxFontSize: 2,
      minFontSize: 1.5,
      padding: 20
    });
    this.cdr.detectChanges();
  }

  private calculateFontSize(
    element: HTMLElement, 
    containerWidth: number,
    options: {
      maxFontSize?: number;
      minFontSize?: number;
      padding?: number;
    } = {}
  ): string {
    const {
      maxFontSize = 2.5,
      minFontSize = 0.5,
      padding = 40
    } = options;
    
    let fontSize = maxFontSize;
    element.style.fontSize = `${fontSize}rem`;

    while (fontSize > minFontSize) {
      if (element.scrollWidth < containerWidth - padding) {
        break;
      }
      fontSize = parseFloat((fontSize - 0.1).toFixed(1));
      element.style.fontSize = `${fontSize}rem`;
    }

    return `${fontSize}rem`;
  }

  private updateTimeRemaining(): void {
    if (!this.endDate) return;

    const end = new Date(this.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      this.timeRemaining = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
      return;
    }

    this.timeRemaining = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  private cleanup(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    window.removeEventListener('resize', () => this.updateTitleFontSize());
    window.removeEventListener('resize', () => this.updateTimeRemainingFontSize());
  }
}
