
export class producto {
  constructor() { }

  public id: number = 0; //-
  public nombre: string = "";//-
  public sku: string = "";
  public atributos: string = ""
  public imagenes: any[] = [];
  public categoria: number;
  public descripcion: string = "";
  public descripcionLarga: string = "";
  public status: boolean = true;
  public lienaID: number;
  public subLineaID: number;
  public caracteristicaBId: number;
  public modelo: string = "";
  public precioIVA: number;
  public precio: number;
  public precioHora: number;
  public instalacion: boolean;
  public tipoID: any;
  public guiaURL: string = '';
  public manualURL: string = '';
  public impresionURL: string = '';
  public fichaTecnica: string = '';
  public visiblePartners: boolean;
}

export class productoBase {
  constructor() { }

  public id: number = 0; //-
  public nombre: string = "";//-
  public sku: string = "";
  public descripcion: string = "";
  public linea: string;
  public sublinea: string;
  public categoria: string;
}

export class productos_relacionados {
  constructor() { }
  id: number = 0;
  id_producto: number = 0;
  id_producto_2: number = 0;
  nombre: string;
  sku: string;
  categoria: string;
  linea: string;
  sublinea: string;
}

export class tipo_servicio {
  constructor() { }
  id: number = 0;
  desc_tipo_servicio: string;
  estatus: boolean;
}

export class subLine {
  constructor() { }
  id: number = 0;
  id_linea_producto: number;
  descripcion: string;
  rel_categoria: rel_categoria[];
  estatus: boolean = true;
}

export class rel_categoria {
  constructor() { }
  id: number = 0;
  no_tecnicos: number;
  horas_tecnicos: string;
  id_categoria: number;
  precio_visita: number;
  precio_hora_tecnico: number;
  id_tipo_servicio: number;
  servicio: string;
  estatus: boolean;
}

export class linea {
  constructor() { }
  id: number = 0;
  descripcion: string = "";
  estatus: boolean;
  id_categoria?: number;
}

export class subLinea {
  constructor() { }
  id: number = 0;
  lineaID: number;
  descripcion: string;
  status: boolean;
}

export class categoria {
  constructor() { }
  id: number = 0;
  codigo: string;
  descripcion: string;
  estatus: boolean;
}
