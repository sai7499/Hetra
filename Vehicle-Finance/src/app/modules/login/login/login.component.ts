import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loginData: {
    email: string,
    password: string
  }

  constructor(
    private loginService: LoginService,
    private router: Router
    ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    this.loginData = this.loginForm.value;
    this.loginService.getLogin(this.loginData).subscribe((res: any) => {
      const response = res;
      if (response.status) {
        const token = response.token;
        console.log('token', token);
        localStorage.setItem('token', token);
        localStorage.setItem('email', this.loginData.email)

        this.loginService.getUserDetails().subscribe((res: any) => {
          const response = res;
          if (response.Error === '0') {
            console.log(response.ProcessVariables.roles[0].name)
            this.router.navigateByUrl('/pages/lead-creation');
          }
        })
      }
    },
    err =>{
      alert('Invalid Login')
      this.loginForm.reset()
    })
  }
}
