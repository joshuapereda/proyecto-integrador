import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app-material.module';
import { AppComponent } from '../../app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProjectComponent } from '../project/project.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';
import { TaskComponent } from '../task/task.component';
import { TareaService } from '../../services/tarea.service';
import { Tareas } from '../../models/tareas.model';
import { TokenService } from '../../auth/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [AppMaterialModule, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  userInitial: string = '';
  selectedProject: Project[] = [];
  selectedProjectId: number | null = null;
  projects: Project[] = [];
  tasks :Tareas [] = [];

  tasksByDay: { [key: string]: any[] } = {  // Mapa de tareas agrupadas por días de la semana
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: []
  };

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private taskService: TareaService,
    private authService: TokenService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.loadProjects();
    this.loadTaskForToday();
  }

  loadProjects(){
    this.projectService.listProject().subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    )
  }

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  showSettings = false;

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }


  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects.push(result.name);
        // Here you would typically send the new project to your backend
        console.log('New project created:', result);
      }
    });
  }
  selectProject(project: Project): void {
    project = project;
    console.log('Selected project:', project);
  }
  createTask(): void {
    if (this.selectedProjectId) {  // Verifica que haya un proyecto seleccionado
      const dialogRef = this.dialog.open(TaskComponent, {
        width: '400px',
        data: { idProyecto: this.selectedProjectId } // Pasa el id del proyecto seleccionado al diálogo
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Agrega la nueva tarea a la lista y muestra un mensaje de éxito en la consola
          this.tasks.push(result);
          console.log('New task created:', result);
        }
      });
    } else {
      console.warn('No project selected'); // Opcional: muestra un mensaje si no hay proyecto seleccionado
    }
  }

  openCreateTaskDialog(idProyecto: number): void {
    const dialogRef = this.dialog.open(TaskComponent, {
      data: { idProyecto }  // Pasa el id del proyecto seleccionado al componente de tareas
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Task created successfully:', result);
      }
    });
  }

  loadTasksByProject(idProyecto: number): void{
    this.selectedProjectId = idProyecto;
    this.taskService.listarByProject(idProyecto).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  loadTasks():void{
    this.taskService.listarTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.groupTasksByDay();

    });
  }

  loadTaskForToday(): void{
    const today = new Date();
    today.setHours(0,0,0,0);

    this.taskService.listarTasks().subscribe((tasks) => {
      this.tasks = tasks.filter((tasks) =>{
        if (!tasks.fecha_vencimiento) {
          return false; // Si no tiene fecha de vencimiento, no la incluyas
        }
        const taskDate = new Date(tasks.fecha_vencimiento);
        taskDate.setHours(0,0,0,0);
        return taskDate.getTime() === today.getTime();
      })
    });
  }


  loadUpcomingTasks(): void {
    console.log('Loading upcoming tasks...');  // Verifica si esta línea se ejecuta
    const upcomingTasks = this.filterTasksByWeek();
    console.log('Filtered tasks for the week: ', upcomingTasks);  // Verifica qué tareas se están filtrando

    // Resetea el agrupamiento por día
    this.tasksByDay = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    };

    // Agrupar tareas filtradas por día
    upcomingTasks.forEach(task => {
      const taskDate = new Date(task.fecha_vencimiento ?? new Date());
      const dayOfWeek = taskDate.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      if (this.tasksByDay[dayOfWeek]) {
        this.tasksByDay[dayOfWeek].push(task);
      }
    });

    console.log('Tasks grouped by day: ', this.tasksByDay);  // Verifica cómo se agrupan las tareas
  }

  // Filtra las tareas para la semana actual
  filterTasksByWeek(): Tareas[] {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(today);
    const endOfWeek = this.getEndOfWeek(today);
    return this.tasks.filter(task => {
      const taskDate = new Date(task.fecha_vencimiento ?? new Date());
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  }

  // Obtiene el inicio de la semana (lunes)
  getStartOfWeek(date: Date): Date {
    const day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? -6 : 1); // El lunes es el primer día de la semana
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);  // Aseguramos que solo la fecha sea considerada
    return startOfWeek;
  }

  // Obtiene el fin de la semana (domingo)
  getEndOfWeek(date: Date): Date {
    const day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? 0 : 7); // El domingo es el último día de la semana
    const endOfWeek = new Date(date.setDate(diff));
    endOfWeek.setHours(23, 59, 59, 999);  // Aseguramos que se considere todo el día
    return endOfWeek;
  }

  // Agrupa las tareas por día de la semana
  groupTasksByDay(): void {
    this.tasksByDay = {
      lunes: [], martes: [], miercoles: [], jueves: [], viernes: [], sabado: [], domingo: []
    };

    this.tasks.forEach(task => {
      const taskDate = new Date(task.fecha_vencimiento ?? new Date());
      const dayOfWeek = taskDate.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      if (this.tasksByDay[dayOfWeek]) {
        this.tasksByDay[dayOfWeek].push(task); // Asegura que 'nombre', 'descripcion' y 'fecha_vencimiento' están presentes
      }
    });
  }

  logout(): void {
    this.authService.logOut();
    this.router.navigate(['']);

  }

}
