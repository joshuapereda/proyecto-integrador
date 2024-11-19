import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMaterialModule } from '../../app-material.module';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../auth/auth.service';
import { TokenService } from '../../auth/token.service';
import { LoginUsuario } from '../../auth/login-usuario';
import Swal from 'sweetalert2';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [AppMaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  isLogin = true;
  loginUsuario: LoginUsuario = new LoginUsuario(); // Inicialización correcta
  loginForm: FormGroup;
  roles: string[] = [];
  isLogged = false;
  errMsj!: string;
  isLoginFail = false;

  usuario: Usuario = {
    name: '',
    email: '',
    password: '',

  }

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    if (this.tokenService.getToken()) {
        this.isLogged = true;
        this.isLoginFail = false;
        this.roles = this.tokenService.getAuthorities();
    }
  }

  onSubmit():void {

    console.log("AQUI!!!")
      // Proceso de login
      this.authService.login(this.loginUsuario).subscribe(
        (data: any) => {
          this.isLogged = true;
          this.tokenService.setToken(data.token);
          this.tokenService.setUserName(data.login);
          this.tokenService.setUserNameComplete(data.nombreCompleto);
          this.tokenService.setAuthorities(data.authorities);
          this.tokenService.setUserId(data.idUsuario);
          this.tokenService.setOpciones(data.opciones);

          this.roles = data.authorities;
          this.router.navigate(['/app']);

          console.log("onLogin() >> token >>> " +  this.tokenService.getToken());
          console.log("onLogin() >> setUserName >>> " +  this.tokenService.getUserName());
          console.log("onLogin() >> setUserNameComplete >>> " +  this.tokenService.getUserNameComplete());
          console.log("onLogin() >> idUsuario >>> " +  this.tokenService.getUserId());
          console.log("onLogin() >> roles >>> " +  this.tokenService.getAuthorities());
          console.log("onLogin() >> opciones >>> INICIO >> " );
          this.tokenService.getOpciones().forEach(obj => {
            console.log(" >> onLogin() >> " +  obj.nombre );
        });
        console.log("onLogin() >> opciones >>> FIN >> " );
        },
        (err: any) => {
          this.isLogged = false;
          this.errMsj = err.message;
          console.log(err);
          if (err.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El nombre de usuario o contraseña son incorrectos',
            });
          }
        }
      );

  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
