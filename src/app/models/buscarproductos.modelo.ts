

export class Articulo {
  constructor() { }
  public id: number;
  public sku: string;
  public modelo: string;
  public nombre: string;
  public descripcion_corta: string;
  public descripcion_larga: string
  public atributos: string;
  public precio_sin_iva: number;
  public precio_con_iva: number;
  public id_categoria: number;
  public id_linea: number;
  public id_sublinea: number;
  public ficha_tecnica: string;
  public estatus: boolean;
  public imgs: cat_imagenes_producto[];
}

export class cat_imagenes_producto {
  constructor() { }
    public id: number;
    public id_producto: number;
    public url: string;
}
