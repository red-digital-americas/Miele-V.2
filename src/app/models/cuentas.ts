export class cuentas {
  constructor() { }

  public id: number = 0;
  public id_Canal: number = 0;
  public cuenta_es: string = "";
  public cuenta_en: string = "";
  public forma_pago : boolean [] = [];//-



  public cat_condicionespago: cat_condicionespago[] = [];//-
  public cat_Formas_Pago: cat_condicionespago[] = []; 

}

export class cat_condicionespago{
  constructor() { }
  public id_Cat_Formas_Pago: number = 0;
  public FormaPago: string = "";
 // public FormPagoExist: boolean = false;//Verifica si existe una forma de pago 
  public comprobantes_obligatorios: boolean = false ;

}
