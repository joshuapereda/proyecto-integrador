import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder,FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMaterialModule } from '../../app-material.module';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of } from 'rxjs';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AppMaterialModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  usuario: Usuario = {
    name: '',
    userName: '',
    email: '',
    dni: undefined,
    password: '',
    fechaRegistro: ''
  }

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/)]],
      userName: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(30)],[this.validaUserName()]],
      email: ['', [Validators.required, Validators.email] ,[this.validaEmail()]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)], [this.validaDni()]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/)]],   // ejm de clave: passwordMiClave1!, si o si debe tener numero, expresiones como "!,#,$" y letras
    });
  }

  onSubmit() {
    this.usuario = {
      ...this.usuario,
      name: this.registerForm.get('name')?.value ?? '',
      userName: this.registerForm.get('userName')?.value ?? '',
      email: this.registerForm.get('email')?.value ?? '',
      dni: Number(this.registerForm.get('dni')?.value ?? 0),
      password: this.registerForm.get('password')?.value ?? '',
    };

    this.usuarioService.registrar(this.usuario).subscribe(
      () => {
        Swal.fire({
          icon: 'info',
          title: 'Registro exitoso',
          text: 'Usuario registrado correctamente',
        }).then(()=>{
          this.router.navigate(['/login']);
        }); // retorna al login
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el usuario.',
        });
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  validaUserName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(">>> validaDescripcion [inicio] " + control.value);

      return this.usuarioService.validaUserName(control.value).pipe(
        map((resp: any) => {
          console.log(">>> validaUserName [resp] " + resp.valid);
          return resp.valid ? null : { existeUserName: true };
        }),
        // En caso de error en la llamada HTTP, manejamos el error devolviendo null (sin error de validación)
        catchError(() => of(null))
      );
    };
  }

  validaEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(">>> validaEmail [inicio] " + control.value);

      return this.usuarioService.validaEmail(control.value).pipe(
        map((resp: any) => {
          console.log(">>> validaEmail [resp] " + resp.valid);
          return resp.valid ? null : { existeEmail: true };
        }),
        // En caso de error en la llamada HTTP, manejamos el error devolviendo null (sin error de validación)
        catchError(() => of(null))
      );
    };
  }

  validaDni(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(">>> validaDni [inicio] " + control.value);

      return this.usuarioService.validaDni(control.value).pipe(
        map((resp: any) => {
          console.log(">>> validaDni [resp] " + resp.valid);
          return resp.valid ? null : { existeDni: true };
        }),
        // En caso de error en la llamada HTTP, manejamos el error devolviendo null (sin error de validación)
        catchError(() => of(null))
      );
    };
  }

}
