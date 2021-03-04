import { Component, ElementRef, forwardRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator} from "@angular/forms";
import { CustomInputComponent } from '../custom-input/custom-input.component';

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
 implements ControlValueAccessor, Validator {

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

  @Input() set isDirty(value) {
    if (value) {
      this.checkIsFirst = false;
      this.checkValidation(this.inputValue);
    }
  }
 
  onChange;
  onTouched;

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

  change( $event ) {
    this.onChange($event.target.value);
    this.onTouched($event.target.value);
  }

  onBlurMethod(event) {
    let newValue = event.target.value;
  }

  validate(c?: FormControl) {
    return !this.inputError
      ? null
      : {
        customError: {
          valid: false,
        }
      };
  }

  checkValidation(value) {
    const newValue = value;
    if (!newValue && !this.isRequired) {
      this.inputError = false;
      return;
    }
    if ((newValue === null || newValue == undefined || newValue === "") && this.isRequired) {
      // this.displayError(this.checkIsFirst ? '' : this.isRequired);
      if (!this.checkIsFirst) {
        this.displayError(this.isRequired)
      }
      this.checkIsFirst = false;
      return;
    }
    this.inputError = false;
  }

  displayError(msg) {
    this.errorMsg = msg;
    this.inputError = true;
   }

}
