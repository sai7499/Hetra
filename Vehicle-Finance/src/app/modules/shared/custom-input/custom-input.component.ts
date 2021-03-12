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
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validator,
  FormControl,
  NG_VALIDATORS,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent
  implements ControlValueAccessor, Validator, AfterViewInit, OnChanges {
  defaultMaxLength = 100;
  maxLengthValidation: {
    rule?: number;
    msg?: string;
  };
  @Input() set maxLength(value) {

    if (!value || !value.rule) {
      return;
    }

    this.defaultMaxLength = value.rule;
    this.maxLengthValidation = {
      rule: value.rule,
      msg: value.msg
    };
  };
   @Input() className = 'form-control  form-control-cus';
  @Input() minLength: {
    rule?: number;
    msg?: string;
  };
  @Input() type = 'text';
  @Input() labelName: string;
  @Input() id: string;

  @Input() patternCheck;
  @Input() custom: {
    rule?: Function;
    msg?: string;
  }[];
  @Input() qdeValue;
  @Output() change = new EventEmitter();
  @Input() isRequired: string;
  @Input() value: string;

  @Input() inputClass: string;

  //@Input() isDisabled: boolean = false;

  @Input() dynamicDataBinding: boolean;

  @Input() placeholder = '';

  htmlInputElement: any;


  @ViewChild('customInput', { static: false }) customInput: ElementRef;

  errorMsg: string;
  inputError = false;
  @Input() isDisabled: boolean;
  private data: any;
  @Input() set isDirty(value) {
    if (value) {
      this.checkIsFirst = false;
      this.checkValidation(this.data);
      //this.propagateChange(this.data);
    }
  }
  private checkIsFirst = true;
  private propagateChange = (event) => {
    // this.change.emit(event);
  };

  decimalTimeOut;
  isFirstChange = true;
  constructor(private elementRef: ElementRef) { }

  ngOnChanges(simpleChanges: SimpleChanges) {
  //  console.log('simpleChanges',simpleChanges);
   const isRequired = simpleChanges.isRequired || null;
   if (isRequired) {
     if (this.isFirstChange) {
       return this.isFirstChange = false;
     }
    this.checkValidation(this.data);
   }

  }

  ngAfterViewInit() {
    this.htmlInputElement = this.customInput;
  }

  // this is the initial value set to the component
  writeValue(obj: any) {
    if (this.dynamicDataBinding) {
      // this.checkIsFirst = false;
    }
    if (obj === '') {
      return;
    }
    // this.data = String(obj || '' ).toUpperCase()
    this.data = obj;
    this.inputValue = this.data;
    this.checkValidation(this.data);
    this.propagateChange(this.data);
  }

  set inputValue(value) {
    this.data = value;
  }

  get inputValue() {
    return this.data;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  validate(c?: FormControl) {
    return !this.inputError
      ? null
      : {
        customError: {
          valid: false,
        },
      };
  }

  // not used, used for touch input
  public registerOnTouched() { }

  // updateChanges(value: string) {



  //   setTimeout(() => {
  //     if (this.type.includes('decimal')) {
  //       const decimalLength = Number(this.type.split('-')[1] || 2);

  //       if (value.length >= this.defaultMaxLength) {
  //         this.maxLengthValidation = {
  //           ...this.maxLengthValidation,
  //           rule: this.defaultMaxLength + 1

  //         }

  //         if (value.charCodeAt(this.defaultMaxLength) === 46) {
  //           this.maxLengthValidation = {
  //             ...this.maxLengthValidation,
  //             rule: this.defaultMaxLength + 1 + decimalLength
  //           }

  //           if (value.split('.').length > 2) {
  //             this.displayError('Invalid Number');
  //             this.propagateChange(this.inputValue);
  //           }
  //         } else {
  //           setTimeout(() => {
  //             this.inputValue = value.slice(0, this.defaultMaxLength)
  //           })
  //         }

  //       }

  //       if (value.includes('.')) {
  //         const length = this.defaultMaxLength + decimalLength + 1;
  //         this.maxLengthValidation.rule = length;
  //         const roundValue = value.split('.')[0];
  //         const afterDecimal = value.split('.')[1];
  //         if (afterDecimal === '') {
  //           this.displayError('Invalid number');
  //           return;
  //         }
  //         const decimalValues = value.split('.')[1].slice(0, decimalLength);
  //         const formatedValue = roundValue + '.' + decimalValues;



  //         this.data = formatedValue;
  //         setTimeout(() => {

  //           //this.value= formatedValue;
  //           this.inputValue = formatedValue;
  //         })
  //       }

  //     } else {
  //       this.maxLengthValidation = {
  //         ...this.maxLengthValidation,
  //         rule: this.defaultMaxLength
  //       };
  //     }
  //     setTimeout(() => {
  //       this.checkValidation(this.data);
  //       this.propagateChange(this.data);
  //     })
  //   })


  // }

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

    if (this.patternCheck) {
      let toLower = String(newValue);
      if (this.inputClass === 'text-uppercase') {
        toLower = toLower.toUpperCase();
      }
      if (!RegExp(this.patternCheck.rule).test(toLower)) {
        this.displayError(this.patternCheck.msg);
        return;
      }
    }

    if (
      this.minLength &&
      newValue.length < this.minLength.rule &&
      this.minLength.msg
    ) {
      this.displayError(this.minLength.msg);
      return;
    }

    if (
      this.maxLengthValidation &&
      newValue.length < this.maxLengthValidation.rule &&
      this.maxLengthValidation.msg
    ) {
      this.displayError(this.maxLengthValidation.msg);
      return;
    }

    if (this.custom) {
      for (let i = 0; i < this.custom.length; i++) {
        const customVal = this.custom[i].rule;
        if (customVal(newValue)) {
          console.log(
            'this.custom[i].msg',
            this.custom[i].msg,
            'i',
            i,
            'custom',
            this.custom
          );
          this.displayError(this.custom[i].msg);
          return;
        }
      }
    }

    if (this.type && this.type.includes('decimal')) {
      this.checkDecimalValidation(this.inputValue);
      return;
    }

    this.inputError = false;
  }

  onBlurMethod(event) {
    const newValue = event.target.value;
    // if (this.type.includes('decimal')) {
    //   this.allowDecimal(event, this.type);
    // }

    if (!newValue && this.isRequired) {
      this.displayError(this.isRequired);
      return;
    }
  }

  displayError(msg: string) {
    // if (!msg) {
      this.errorMsg = msg;
      this.inputError = true;
    // }
  }

  setDisabledState(disabled: boolean) {
    this.isDisabled = disabled;
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    switch (this.type) {
      case 'number':
        this.valuePatternCheck(event, /[^0-9]*/g);
        // this.allowNumberOnly(event);
        break;
      case 'alpha-numeric':
        this.valuePatternCheck(event, /[^a-zA-Z0-9 ]/g);
        // this.allowAlphaNumericOnly(event);
        break;
      case 'alpha':
        this.valuePatternCheck(event, /[^a-zA-Z ]/g);
        // this.allowAlphaOnly(event);
        break;
      case 'custom-special-alpha-numeric':
        this.valuePatternCheck(event, /[^0-9a-zA-Z\s\r\n\-\/|:]/g);;
        break;
        case 'custom-comma-special-alpha-numeric':
          this.valuePatternCheck(event, /[^0-9a-zA-Z\s\r\n\-\/|_]/g);;
          break;
      case 'special-alpha-numeric':
        this.valuePatternCheck(event, /[^0-9a-zA-Z\s\r\n@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\?]+$/g);
        // this.allowSpecialAlphaNumericOnly(event);
        break;
      case 'alpha-numeric-nospace':
        this.valuePatternCheck(event, /[^a-zA-Z0-9]/g);
        // this.allowAlphaNumericNoSpace(event);
        break;
      case 'percent':
        this.allowPercentageFormat(event);
        break;
      case 'alpha-numeric-slash':
        this.valuePatternCheck(event, /[^a-zA-Z0-9/]/g);
        // this.allowAlphaNumericWithSlashOnly(event)
        break;
      case 'alpha-nospace':
        this.valuePatternCheck(event, /[^a-zA-Z]/g);
        // this.allowAlphaNumericNoSpace(event);
        break;
    }
    if (this.type.includes('decimal')) {
      const initialValue = event.target.value;
      // setTimeout(() => {
        // this.inputValue = initialValue.replace(/[^0-9 .]*/g, '');
      // });
      this.inputValue = initialValue
      .replace(/[^\d.]/g, '')
      .replace(/(\..*)\./g, '$1');  // decimal can't exist more than once
    }
    this.checkValidation(this.inputValue);
    this.propagateChange(this.inputValue);
  }


  // allowDecimal(event, type: string) {
  //   const decimalPoints = type.split('-')[1] || 2;

  //   let zeros = '';
  //   for (let i = 0; i < decimalPoints; i++) {
  //     zeros += '0';
  //   }
  //   const initialValue = event.target.value;
  //   const secondValue = initialValue.split('.')[1]
  //   if (this.decimalTimeOut) {
  //     clearTimeout(this.decimalTimeOut);
  //   }
  //   this.decimalTimeOut = setTimeout(() => {
  //     if (!initialValue.includes('.') && this.inputValue) {
  //       this.inputValue += '.' + zeros;
  //     } else if (initialValue.includes('.') && this.inputValue) {
  //       if (secondValue == '') {
  //         this.inputValue += zeros;
  //       } else {
  //         this.inputValue = this.inputValue;
  //       }

  //     }
  //   });

  //   this.inputValue = initialValue.replace(/[^0-9 .]*/g, '');
  // }

  valuePatternCheck(event, pattern) {
   const initialValue = event.target.value;
   this.inputValue = initialValue.replace(pattern, '');
  }

  // allowNumberOnly(event) {
  //   const initialValue = event.target.value;
  //   this.inputValue = initialValue.replace(/[^0-9]*/g, '');
  // }

  // allowAlphaNumericOnly(event) {
  //   const initialValue = event.target.value;
  //   this.inputValue = initialValue.replace(/[^a-zA-Z0-9 ]/g, '');
  // }

  // allowAlphaNumericWithSlashOnly(event) {
  //   const initialValue = event.target.value;
  //   this.inputValue = initialValue.replace(/[^a-zA-Z0-9/]/g, '');
  // }


  // allowAlphaOnly(event) {
  //   const initialValue = event.target.value;
  //   this.inputValue = initialValue.replace(/[^a-zA-Z ]/g, '');
  // }
  // allowSpecialAlphaNumericOnly(event) {
  //   const initialValue = event.target.value;
  //   this.inputValue = initialValue.replace(
  //     /[^0-9a-zA-Z\s\r\n@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\?]+$/g,
  //     ''
  //   );
  //   // this.inputValue = initialValue.replace(
  //   //   /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g, ''
  //   //   );

  // }
  // allowAlphaNumericNoSpace(event) {
  //   const initialValue = event.target.value;
  //   this.inputValue = initialValue.replace(/[^a-zA-Z0-9]/g, '');
  // }

  allowPercentageFormat(event) {
    const initialValue = event.target.value;
    this.inputValue = initialValue
      .replace(/[^\d.]/g, '')             // numbers and decimals only
      .replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 2 digits at the beginning
      .replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
      .replace(/(\.[\d]{2})./g, '$1');    // not more than 2 digits after decimal
    // this.inputValue = initialValue.replace(/[^a-zA-Z0-9 ]/g, '');
  }

  checkDecimalValidation(value) {
    if (this.type.includes('decimal')) {
      const decimalLength = Number(this.type.split('-')[1] || 2);
      value = String(value);
      if (value.length >= this.defaultMaxLength) {
        this.maxLengthValidation = { // increase length by 1 to enter dot('.')
          ...this.maxLengthValidation,
          rule: this.defaultMaxLength + 1
        };
        if (value.charCodeAt(this.defaultMaxLength) === 46) { // check entered value is dot
          this.maxLengthValidation = {
            ...this.maxLengthValidation,
            rule: this.defaultMaxLength + 1 + decimalLength // increase length to enter decimal value
          };
          // if (value.split('.').length > 2) {
          //   this.displayError('Invalid Number');
          //   this.propagateChange(this.inputValue);
          // }
        } else {
          // setTimeout(() => {
            this.inputValue = value.slice(0, this.defaultMaxLength);
          // })
        }

      }

      if (value.includes('.')) {
        // const length = this.defaultMaxLength + decimalLength + 1;
        // this.maxLengthValidation.rule = length;
        const roundValue = value.split('.')[0];
        const afterDecimal = value.split('.')[1];
        if (afterDecimal === '') {
          this.displayError('Invalid number');
          return;
        }
        const decimalValues = value.split('.')[1].slice(0, decimalLength);
        const formatedValue = roundValue + '.' + decimalValues;



        this.data = formatedValue;
        // setTimeout(() => {

        //   //this.value= formatedValue;
        this.inputValue = formatedValue;
        // this.propagateChange(this.inputValue);
        // })
      }

    } else {
      this.maxLengthValidation = {
        ...this.maxLengthValidation,
        rule: this.defaultMaxLength
      };
    }

    this.inputError = false;
  }
  // valueChange(){
  //   this.inputValue = String(this.inputValue || '').toUpperCase();
  // }

}
