import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { CountdownInputComponent } from './components/countdown-input/countdown-input.component'
import { CountdownDisplayComponent } from './components/countdown-display/countdown-display.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CountdownInputComponent, CountdownDisplayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'FrontendChallenge'
  inputValue: string = '';
  selectedDate: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const storedDate = localStorage.getItem('countdownDate');
    const storedTitle = localStorage.getItem('countdownTitle');
    
    if (storedDate) {
      this.selectedDate = storedDate;
    }
    
    if (storedTitle) {
      this.inputValue = storedTitle;
    }
    
    this.cdr.detectChanges();
  }
}
