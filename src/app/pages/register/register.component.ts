import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import { AuthService } from '../../../providers/auth-service';
import 'style-loader!./register.scss';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import { Login } from '../login/login';
import {Router} from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.html',
})
export class Register {

  public form:FormGroup;
  public name:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;
 public cpf:AbstractControl;
  public submitted:boolean = false;
  public birthdate:AbstractControl;

  constructor(fb:FormBuilder, public authService: AuthService, private router: Router) {

    this.form = fb.group({
      'cpf': ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      'birthdate': ['', Validators.compose([Validators.required])],
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
    this.cpf =this.form.controls['cpf'];
    this.birthdate=this.form.controls['birthdate'];
  }


validaCPF(str) {
      console.log(str);
            if (str) {
              str = str.replace('.', '');
              str = str.replace('.', '');
              str = str.replace('-', '');

              var cpf = str;
              var numeros, digitos, soma, i, resultado, digitos_iguais;
              digitos_iguais = 1;
              if (cpf.length < 11)
                return false;
              for (i = 0; i < cpf.length - 1; i++)
                if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                  digitos_iguais = 0;
                  break;
                }
              if (!digitos_iguais) {
                numeros = cpf.substring(0, 9);
                digitos = cpf.substring(9);
                soma = 0;
                for (i = 10; i > 1; i--)
                  soma += numeros.charAt(10 - i) * i;
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0))
                  return false;
                numeros = cpf.substring(0, 10);
                soma = 0;
                for (i = 11; i > 1; i--)
                  soma += numeros.charAt(11 - i) * i;
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1))
                  return false;
                return true;
              }
              else
                return false;
            }
  }
      

  public onSubmit(values:Object):void {
       console.log("1=====", values);
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      console.log(values);
        this.authService.register(values['email'], values['passwords'].password, values['name'], values['cpf'], values['birthdate']
      ).then( authService => {
         setTimeout(()=>{
          this.router.navigate(['pages/login']);
         },4000);
         
         
         
      }, error => {
        this.submitted = false;
          console.log("error");
      });

    }
  }
}
