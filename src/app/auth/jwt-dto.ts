import { Opcion } from "./opcion";

export class JwtDto {

  token?: string;
  type?:string;
  nombreUsuario?: string;
  authorities?:string[];
  opciones?:Opcion[];
}
