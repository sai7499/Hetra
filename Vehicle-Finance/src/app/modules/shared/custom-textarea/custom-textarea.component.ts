import {
  Component,
  Input,
  Output,
  forwardRef,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
 } from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    Validator,
    FormControl,
    NG_VALIDATORS,
  } from '@angular/forms';

@Component({
    selector: 'app-custom-textarea',
    templateUrl: './custom-textarea.component.html',
    styleUrls: ['./custom-textarea.component.css'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => CustomTextAreaComponent),
          multi: true,
        },
        {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => CustomTextAreaComponent),
          multi: true,
        },
      ],
})
export class CustomTextAreaComponent
        implements ControlValueAccessor, Validator, AfterViewInit {

    @Input() rows: number;
    @Input() columns: number;

    data: string;

    set inputValue(value) {
        console.log('value', value)
        this.data = value;
    }

    get inputValue() {
        return this.data;
    }

    private propagateChange = (event) => {
    }


    ngAfterViewInit() {}

    validate(c: FormControl) {
                return {};
    }

    writeValue(obj: any) {
        this.data = obj;
        this.inputValue = obj;
        this.propagateChange(this.data);
        console.log('data', this.data);
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    registerOnValidatorChange() {}




}