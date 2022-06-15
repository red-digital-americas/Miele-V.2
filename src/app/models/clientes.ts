export class Direccion {
    constructor() { }

    public calle: string; 
    public colonia: string;
    public cp: string;
    public fecha_Estimada: string;
    public id: number;
    public id_estado: number;
    public id_localidad: number;
    public id_municipio: number
    public nombre: string;
    public numExt: string;
    public numInt: string;
    public telefono: string;
    public telefono_movil: string;
    public tipo_direccion: number;
    public details?: any;
    public calle_numero?: number;
    public id_cliente?: number;
    public estatus?: boolean = true;
    public creado?: string;
    public creadopor?: number;
    public actualizado?: string;
    public actualizadopor?: number;
    public nombrecontacto?: string;
    public id_prefijo_calle?: number;
    public prefijo_ins?:string;

}