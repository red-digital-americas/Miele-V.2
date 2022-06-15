export class usuarios {
  constructor() { }
  
  public id: number = 0;
  public creadopor: number = 0;
  public id_Sucursales: number = 0;
  public id_canal: number = 0;
  public id_cuenta: number = 0;
  public id_rol: number = 0;
  public name: string = "";
  public nivel: string = "";
  public paterno: string = "";
  public materno: string = "";
  public username: string = "";
  public email: string = "";
  public telefono: number = 0;
  public telefono_movil: number = 0;
  public password: string = "";
  public estatus: true;

}

export class PerfilUsuario {
  email: string = "";
  id: number = 0;
  id_app: number = 0;
  id_canal: number = 0;
  materno: string = "";
  movil: string = "";
  name: string = "";
  nivel: string = "";
  noalmacen: null
  password: null
  paterno: string = "";
  productos: null
  rol: string = "";
  telefono: string = "";
  username: string = "";
}
