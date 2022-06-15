export class Cat_Sucursales {
    constructor() { }

  public id: number = 0;
  public id_Cuenta: number = 0;
  public id_Canal: number = 0; 
  public sucursal: string = "";
  public margen_vendedores: number = 0; 
  public url_logo: string = "";
  public tipo: string;
  public imagenes: any[] = [];
  public datosFiscales_Sucursales: datosFiscales_Sucursales[] = [];//-
  public cat_direccion_sucursales: direccion_Sucursal[] = [];
  public condiones_comerciales_sucursal: condiones_comerciales_sucursal[] = [];

}

export class condiones_comerciales_sucursal {
  constructor() { }

  public id: number = 0;
  public id_Cat_SubLinea_Producto: number = 0;
  public id_Cat_Sucursales: number = 0;
  public margen: number = 0;
}

export class  datosFiscales_Sucursales {
  constructor() { }
  public id: number = 0;
  public nombre_fact: string = "";
  public razon_social: string = "";
  public rfc: string = "";
  public email: string = "";
  public calle_numero: string = "";
  public cp: string = "";
  public id_estado: number = 0;
  public id_municipio: number = 0;
  public colonia: string = "";
  public Ext_fact: string = "";
  public Int_fact: string = "";
  public id_Sucursal: number = 0;
  public telefono_fact: number = 0; 
 
}

export class direccion_Sucursal {
  constructor() { }
  public id: number;
  public id_sucursales: number;
  public calle_numero: string;
  public cp: string;
  public id_estado: number;
  public id_municipio: number;
  public colonia: string;
  public telefono: string;
  public telefono_movil: string;
  public estatus: boolean = true;
  public creado: string;
  public creadopor: number;
  public actualizado: string;
  public actualizadopor: number;
  public tipo_direccion: number;
  public numExt: string;
  public numInt: string;
  public id_localidad: number;
  public id_prefijo_calle: number;
}
