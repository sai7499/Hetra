import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-section',
  templateUrl: './otp-section.component.html',
  styleUrls: ['./otp-section.component.css']
})
export class OtpSectionComponent implements OnInit {

  public otpForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.otpForm = this._fb.group({
      otp: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(6),Validators.pattern('[0-9]*'), Validators.required])]
    })
  }

}
