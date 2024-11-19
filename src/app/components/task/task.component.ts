import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app-material.module';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { Tareas } from '../../models/tareas.model';
import { TareaService } from '../../services/tarea.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, AppComponent, CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  taskForm: FormGroup;
  idProyecto: number;
  priorities = [
    { value: 'low', viewValue: 'Low' },
    { value: 'medium', viewValue: 'Medium' },
    { value: 'high', viewValue: 'High' }
  ];

  task:Tareas = {
    nombre: "",
    descripcion: "",
    fecha_vencimiento: new Date(Date.now()),
    prioridad: "medium",
    proyectos: {
      idProyecto: -1,
    }
  }

  constructor(
    public dialogRef: MatDialogRef<TaskComponent>,
    private fb: FormBuilder,
    private taskService: TareaService,
    @Inject(MAT_DIALOG_DATA) public data: { idProyecto: number }
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      expirationDate: [null],
      priority: ['medium']
    });
    this.idProyecto = data.idProyecto;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData: Tareas = {
        nombre: this.taskForm.value.name,
        descripcion: this.taskForm.value.description,
        fecha_vencimiento: this.taskForm.value.expirationDate,
        prioridad: this.taskForm.value.priority,
        proyectos: { idProyecto: this.data.idProyecto }  // Asignar el proyecto seleccionado
      };

      // Llamada al servicio para registrar la tarea
      this.taskService.registrarTask(taskData).subscribe(response => {
        console.log('Task created:', response);
        this.dialogRef.close(response);  // Cerrar el diálogo y devolver la tarea creada
      });
    }
  }
}
