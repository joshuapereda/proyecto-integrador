import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app-material.module';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Colores } from '../../models/colores.model';
import { Project } from '../../models/project.model';
import { UtilService } from '../../services/util.service';
import { AppComponent } from '../../app.component';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import Swal from 'sweetalert2';
import { TaskComponent } from '../task/task.component';


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [AppMaterialModule,AppComponent, CommonModule, FormsModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  projectForm: FormGroup;
  colors: Colores[] = [];


  project: Project = {
    nombre: "",
    colors: {
      idColor: -1
    },
    favorito: "No",
    vista: 0
  }


  constructor(
    public dialogRef: MatDialogRef<ProjectComponent>,
    private fb: FormBuilder,
    private utilService: UtilService,
    private projectService:ProjectService,// Assuming UtilService is a service that provides the necessary API calls
    private dialog:MatDialog
  ) {
    this.projectForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      validaColor: ['', [Validators.required]],

    });
  }

  ngOnInit(){
    this.utilService.listaColores().subscribe(
      tipos => this.colors = tipos
    )

  }

  onFavoriteChange() {
    // Convertimos el valor del slide-toggle entre "Si" y "No"
    this.project.favorito = this.project.favorito === "No" ? "Si" : "No";
    console.log('Favorito:', this.project.favorito);  // Imprime "Si" si está seleccionado, "No" si no lo está
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  registra() {
    console.log(">>> registra [inicio]");
          console.log(">>> registra [inicio] " + this.project);
          console.log(this.project);
          if (this.projectForm.valid) {
          this.projectService.registrarProject(this.project).subscribe(
            x=>{
              Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
              this.project ={
                nombre: "",
                colors: {
                  idColor: -1
                },
                favorito: "No",
                vista: 0
              };
          }
          )}
          this.dialogRef.close(this.projectForm.value);

  }

  


}
