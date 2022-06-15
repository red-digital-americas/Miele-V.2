import * as moment from 'moment';

export class Cat_Direccion {
  public id: number;
  //public Clientes cliente:  ;
  public id_cliente: number;
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
  public tipo_direccion: number; //NOTA: No hay catalogo 1 es Instalacion , 2 es Envio 
  public nombrecontacto: string;
  public numExt: string;
  public numInt: string;
  public fecha_Estimada: string;
  public id_localidad: number;
  public id_prefijo_calle: number;
  //public id_cotizacion: number; // REVISAR
  constructor() { }
}

export class Direccion_Cotizacion {
  public id: number;
  // public Cotizaciones cotizacion:  ;
  public id_cotizacion: number;
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
  public tipo_direccion: number; //NOTA: No hay catalogo 1 es Instalacion , 2 es Envio 
  public nombrecontacto: string;
  public numExt: string;
  public numInt: string;
  public fecha_Estimada: string;
  public id_localidad: number;
  public id_prefijo_calle: number;
  constructor() { }
}


export class cat_imagenes_producto {
  constructor() { }
  public id: number;
  public id_producto: number;
  public url: string;
}

export class Cotizaciones {
  constructor() { }
  public Id: number;
  public Numero: string = "";
  public Id_Cliente: string;
  public Id_Vendedor: string;
  public referencia: string;
  public fecha_cotiza: string = moment().format("MM/DD/YYYY");
  public Inporte: string = "0.00";
  public Inporte_Final: string = "0.00";
  public Estatus: number = 1;
  public Acciones: number = 0;
  public Id_Canal: number;
  public Id_Cuenta: number;
  public Id_Estado_Instalacion: number = 0;
  public Observaciones: string = "";
  public creadopor: number = 0;
  public id_formapago: number = 0;
  public refirio: number;
  public vigencia_ref: string;
  public ibs: string;
  public motivo_rechazo: string = "";
  public rechazada: boolean = false;
  public id_cotizacion_padre: number = 0;
  public id_user_entrega_sol: boolean = false;
  public entrega_sol: boolean = false;
  public requiere_fact: boolean = false;
  public coment_cancel: string = "";
  public cancelada: boolean = false;
  public acepto_terminos_condiciones: boolean = false;
  public comision_vendedor: number = 0;
  public id_tarjeta: number = 0;
}

export class cotizacion_detalle_post {
  constructor() { }
  public cotizacion: Cotizaciones;
  public direccion_ins: Cat_Direccion;
  public direccion_env: Cat_Direccion;
  public fiscales: DatosFiscales;
  public cliente: Clientes;
}

export class vendedores_ddl {
  constructor() { }
  public id: number = 0;
  public nombrecompleto: string = "";
}

export class documentos_cotizacion {
  constructor() { }
  public Id: number = 0;
  public Id_Cotizacion: number = 0;
  public Id_foto: string = "";
  public tipo_docto: number = 0;// 1 foto 2 orden c.
}

export class formas_pago_ddl {
  constructor() { }
  public id: number = 0;
  public formaPago: string = "";
}

export class condiciones_det {
  constructor() { }
  public id: number = 0;
  public id_condicion: number = 0;
  public id_cuenta: number = 0;
  public Vigencia_inicial: string = moment().format("MM/DD/YYYY");
  public Vigencia_final: string = moment().format("MM/DD/YYYY");
  public condicion: string = "";
}

export class Productos_Cotizacion {
  public Id: number = 0;
  public Id_Producto: number = 0;
  public Id_Cotizacion: number = 0;
  public cantidad: number = 0;
  public fecha_creacion: string = moment().format("MM/DD/YYYY");
  constructor() { }
}


export class Clientes {
  public id: number = 0;
  public folio: string = "";
  public nombre: string;
  public paterno: string;
  public materno: string;
  public nombre_comercial: string;
  public nombre_contacto: string;
  public email: string;
  public telefono: string;
  public telefono_movil: string;
  public referencias: string;
  public tipo_persona: string;
  public estatus: boolean = true;
  public creado: string = moment().format("MM/DD/YYYY");
  public creadopor: number = 0;
  public actualizado: string = moment().format("MM/DD/YYYY");
  public actualizadopor: number = 0;
  public referidopor: number = 0;
  public vigencia_ref: string = moment().format("MM/DD/YYYY");
  public id_sucursal?: number = 0;
  constructor() { }
}

export class DatosFiscales {
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
  public ext_fact: string = "";
  public int_fact: string = "";
  public telefono_fact: string = "";
  public id_cliente: number = 0;
  public id_prefijo_calle: number;

}

export class tarjeta_promocion {
  constructor() { }
  public id: number = 0;
  public nombre: string = "";
  public beneficios: string = "";
  public inicio: string = "";
  public fin: string = "";
}

export class Promociones_disponibles {
  constructor() { }
  public id: number = 0;
  public nombre: string = "";
  public beneficios: string = "";
  public inicio: string = "";
  public fin: string = "";
}

export class permisos_cotizacion_detalle {
  constructor() { }
  public mostrar_referencia: boolean = false;
  public mostrar_subir_archivos: boolean = false;
  public mostrar_condiciones_comerciales: boolean = false;
  public mostrar_letrero_ibs: boolean = false;
  public deshabilitar_dir_ins: boolean = false;
  public deshabilitar_dir_env: boolean = false;
  public deshabilitar_fact: boolean = false;
  public deshabilitar_lista_prods: boolean = false;
  public deshabilitar_formas_pago: boolean = false;
  public deshabilitar_referencia: boolean = false;
  public deshabilitar_vendedor: boolean = false;
  public deshabilitar_cliente: boolean = false;
  public deshabilitar_rechazo: boolean = false;
  public deshablitar_btn_guardar_gral: boolean = false;
  public deshabilitar_acepto_terminos: boolean;
  public deshabilitar_agregar_prod: boolean = false;
  public deshabilitar_botones_upload: boolean = false;
  public deshabilitar_editar_promociones: boolean = false;
  public mostrar_btn_rechazar: boolean = false;

  public mostrarBtnOrden: boolean = false;
  public mostrarBtnComp: boolean = false;
  public mostrar_boton_duplicar: boolean = false;
  public mostrar_boton_edit_basicos: boolean = false;
  public mostrar_boton_edit_detalles: boolean = false;
  public mostrar_btn_guardar_gral: boolean = false;
  public texto_btn_guardar_gral: string = "";
  public mostrar_chkfact: boolean;
  public mostrar_acepto_terminos: boolean;
  public mostrar_fact: boolean;
  public mostrar_sol_entrega: boolean;
  public mostrar_boton_IBS: boolean;
  public mostrar_lista_comp: boolean;
  public mostrar_btn_general: boolean;
}
