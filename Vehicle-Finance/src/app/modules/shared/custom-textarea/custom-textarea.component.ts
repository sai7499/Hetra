import { Component, ElementRef, forwardRef, HostListener, Input, OnChanges, Renderer2, ViewChild, SimpleChanges } from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from "@angular/forms";

@Component({
  selector: 'app-custom-textarea',
  templateUrl: './custom-textarea.component.html',
  styleUrls: ['./custom-textarea.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },]
})
export class CustomTextareaComponent
 implements ControlValueAccessor, Validator, OnChanges {

  @ViewChild('customText', {static: true}) customText;

  @Input() className: any;
  @Input() placeholder: any;

  maxLengthValid: {
    rule?: number;
    msg?: string;
  }

  @Input() inputValue: any;

  @Input() minLength: {
    rule?: number;
    msg?: string;
  };

  @Input() set maxLength(value)  {
    if (value) {
      this.maxLengthValid = {
        rule: value.rule,
        msg: value.msg
      }
    }
  };

  private checkIsFirst = true;
  inputError = false;
  errorMsg: any;
  @Input() isDisabled: boolean;
  @Input() isRequired: string;
  @Input() value: string;

  isFirstChange: boolean = true;

  @Input() set isDirty(value) {
    console.log(value, 'isDirty', this.isRequired)
    if (value) {
      this.checkIsFirst = false;
      this.checkValidation(this.inputValue);
    }
  }
 
  onChange;
  onTouched;

  validate(c?: FormControl) {
    return !this.inputError
      ? null
      : {
        customError: {
          valid: false,
        },
      };
  }

  writeValue( value : any ) : void {
    console.log('writeValue', value);
    const limit = this.customText.nativeElement;

    this.inputValue = value;
    this.renderer.setProperty(limit, 'textContent', value);
  }

  registerOnChange( fn : any ) : void {
    console.log('registerOnChange');
    this.onChange = fn;
  }

  registerOnTouched( fn : any ) : void {
    console.log('registerOnTouched');
    this.onTouched = fn;
  }

  constructor( private renderer : Renderer2 ) {
  }

  change($event ) {
    this.onChange($event.target.value);
    this.onTouched($event.target.value);
    this.inputError = $event.target.value ? false: true;
    // this.inputValue = String(this.inputValue || '').toUpperCase();
  }

  onBlurMethod(event) {
      const newValue = event.target.value;
      if (!newValue && this.isRequired) {
        this.displayError(this.isRequired);
        return;
      }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    console.log('simpleChanges',simpleChanges);
    const isRequired = simpleChanges.isRequired || null;
    if (isRequired) {
      if (this.isFirstChange) {
        return this.isFirstChange = false;
      }
     this.checkValidation(this.inputValue);
    }
 
   }

  checkValidation(value) {
    const newValue = value;
    if (!newValue && !this.isRequired) {
      this.inputError = false;
      return;
    }
    if ((newValue === null || newValue == undefined || newValue === "") && this.isRequired) {
      if (!this.checkIsFirst) {
        this.displayError(this.isRequired)
      }
      this.checkIsFirst = false;
      return;
    }
    // this.inputError = false;
  }

  displayError(msg) {
    this.errorMsg = msg;
    this.inputError = true;
   }

}
