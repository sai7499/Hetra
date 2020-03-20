import { Component, OnInit, Input, forwardRef, OnChanges } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: "vf-custom-select",
  templateUrl: "./custom-select.component.html",
  styleUrls: ["./custom-select.component.css"]
})
export class CustomSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() className = "form-control mandatory";
  @Input() defaultOption = {
    key: '',
    value: "-- select one --"
  };
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

  constructor() {
  }

  ngOnInit() {
    this.selectedOption = this.selectedOption || this.defaultOption.key;
  }

  ngOnChanges() {
    if(this.selectedOption) {
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
}
