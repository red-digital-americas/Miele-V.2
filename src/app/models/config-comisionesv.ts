import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';


export class config_conmisionesv {
  constructor() { }

  public id: number = 0; //-
  public nombre: string = "";//-
  public fecha_hora_inicio: string = '01/01/1900:00:00:00';//-
  public fecha_hora_fin: string = '01/01/1900:00:00:00';//-
  public vigencia_indefinida: boolean = false;//-
  public id_tipos_herencia_promo: number = 0; //cat_tipos_herencia //-
  public id_cat_tipo_condicion: number = 0; //cat_tipo_condicion //-
  public monto_condicion: number = 0; //-
  public monto_superior: number = 0;
  public incluir_desc_adic: boolean = false;//-
  public id_tipo_beneficio: number = 0;
  public entidades_participantes: entidades_participantes[] = [];//-
  public entidades_excluidas: entidades_excluidas[] = [];//-
  public productos_condicion: productos_condicion[] = []; //-
  public productos_excluidos: productos_excluidos[] = []; //-
  public beneficios_promocion:beneficios_promocion[] = []; //-
  public beneficio_desc:beneficio_desc[] = [];
  public beneficio_productos:beneficio_productos[] = [];//-
  public beneficio_msi: beneficio_msi[] = [];
  public beneficio_obligatorio: boolean = false;
  public entidades_obligatorias: entidades_obligatorias[] = [];
  public afectacion_cc:afectacion_cc[] = [];
  public promociones_compatibles: promociones_compatibles[] = [];
}

export class cat_tipos_herencia {
  constructor() { }
  public id: number = 0;
  public tipo: string = "";
}

export class cat_tipo_entidades{
  constructor() { }
  public id: number = 0;
  public tipo_entidad: string = "";
}

export class entidades_participantes {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0;//promocion
  public id_entidad: number = 0;
  public id_tipo_entidad: number = 0; //cat_tipo_entidades
}

export class entidades_excluidas {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0; //promocion
  public id_entidad: number = 0;
  public id_tipo_entidad: number = 0 //cat_tipo_entidades
}

export class entidades_obligatorias {
  constructor() { }
  public id: number = 0;
  public id_promocion: number = 0; //promocion
  public id_entidad: number = 0;
  public id_tipo_entidad: number = 0 //cat_tipo_entidades
}

export class productos_excluidos {
  constructor() { }
  public id: number = 0;
  public id_promocion: number = 0; //promocion
  public id_producto: number = 0; // productos, sublinea, linea
  public id_tipo_categoria: number = 0; // 1 Línea , 2 Sublínea , 3 producto 
}

export class cat_tipo_condicion {
  constructor() { }
  public id: number = 0;
  public tipo_condicion: string = "";
}

export class productos_condicion {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0; //promocion
  public id_producto: number = 0; // productos, sublinea, linea
  public id_tipo_categoria: number =0; // 1 Línea , 2 Sublínea , 3 producto 
  public cantidad: number = 0;
}

export class cat_beneficios {
  constructor() { }
  public id: number = 0;
  public beneficio: string = "";
}

export class beneficios_promocion {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0; //promocion
  public id_cat_beneficios: number = 0; //cat_beneficios
}

export class beneficio_desc {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0; //promocion
  public cantidad: number = 0;
  public es_porcentaje: boolean = false; 
}

export class beneficio_productos {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0; //promocion
  public id_producto: number = 0; //productos
  public cantidad: number = 1;
}

export class beneficio_msi {
  constructor() { }
  public id: number = 0;
  public id_promocion : number = 0; //promocion
  public id_cat_msi: number = 0; //cat_msi
}

export class cat_msi {
  constructor() { }
  public id: number = 0;
  public desc_msi: string = "";
}

export class afectacion_cc {
  constructor() { }
  public id: number = 0;
  public id_promocion: number = 0;
  public id_condiones_comerciales_sucursal: number = 0;
  public margen: number = 0;
}

export class promociones_compatibles {
  constructor() { }
  public  id : number = 0;
  public  id_promocion : number = 0; //promocion
  public  id_promocion_2 : number = 0; //promocion
    }

export class cat_promos {
  constructor() { }
  public cat_tipos_herencia: any[];
  public cat_tipo_condicion: any[];
  public cat_msi: any[];
  public allProductos: any[];
  public justProductos: any[];
  public allEntidades: any[];
  public allEntidades_e: any[];
  public allsublineas: any[];
  public allsucursales: any[];
  public all_promociones: any[]
}
