import { Project } from "./project.model";

export class Tareas {

  idTarea?: number;
  nombre?: string;
  descripcion?: string;
  fecha_vencimiento?: Date;
  prioridad?: string;
  proyectos?: Project
}
