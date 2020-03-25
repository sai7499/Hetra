import { Component, OnInit, Input, forwardRef, OnChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DataService } from '../../lead-creation/service/data.service';
import { LovDataService } from 'src/app/services/lov-data.service';

@Component({
  selector: 'app-vf-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() className = 'form-control mandatory';
  @Input() defaultOption = {
    key: '',
    value: '-- select one --'
  };
  isDisabled: boolean;
  // tslint:disable-next-line:no-input-rename
  @Input('selectedOption') val: any ;
  @Input() values: any[];

  onChange: any = () => {};
  onTouch: any = () => {};

  set selectedOption(val) {
    this.val = val;
    this.onChange(this.val);
  }

  get selectedOption() {
    return this.val;
  }

  constructor(private lovDataService: LovDataService) {
  }

  ngOnInit() {
    this.selectedOption = this.selectedOption || this.defaultOption.key;
  }

  ngOnChanges() {
    if (this.selectedOption) {
       this.onChange(this.val);
    }
  }

  writeValue(val) {
    this.val = val;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }
  setDisabledState(state: boolean) {
    this.isDisabled = state;
  }
}
