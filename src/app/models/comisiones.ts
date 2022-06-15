export class comisiones {
  constructor() { }

  public id: number = 0;
  public id_comision: number = 0;

  public id_canal: number = 0;
  public canal: string = "";

  public estatus: number = 0;
  public estatus_: string = "";

  public pagada: boolean ; 

  public id_cuenta: number = 0;
  public cuenta: string = "";
  public tipo_comision: string = "";
  public com_directa: boolean = false;//-
  public mostrar_todo: boolean = false;//-
  public mostrar_pagadas: boolean = false;//-

  public importe_promociones: number = 0; 
  public iva_promociones: number = 0; 
  public comisiontotal: number = 0;
  public comisiontotalpagada: number = 0;
  public fec_generacion: number = 0; 

  public sucursal: string = "";


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
  public id_cat_tipo_comision: number = 0;
  public fecha_pago: number = 0; 

}
