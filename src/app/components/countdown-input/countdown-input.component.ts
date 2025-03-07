import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-countdown-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './countdown-input.component.html',
  styleUrls: ['./countdown-input.component.scss']
})
export class CountdownInputComponent {
  @Input() inputValue: string = '';
  @Output() inputValueChange = new EventEmitter<string>();

  @Input() selectedDate: string = new Date().toISOString().split('T')[0];
  @Output() selectedDateChange = new EventEmitter<string>();

  today: string = new Date().toISOString().split('T')[0];

  onInputValueChange(value: string) {
    this.inputValue = value;
    this.inputValueChange.emit(value);
  }

  onSelectedDateChange(value: string) {
    this.selectedDate = value;
    this.selectedDateChange.emit(value);
  }
}
