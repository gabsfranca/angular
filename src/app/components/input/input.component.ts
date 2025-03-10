import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, input, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor{

  @Input() label: string = 'digite algo';
  @Input() type: string = 'text';
  @Input() placeHolder: string ='digite aqui...';

  value: string | number = '';

  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => {};

  writeValue(value: any): void {
      this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }
}