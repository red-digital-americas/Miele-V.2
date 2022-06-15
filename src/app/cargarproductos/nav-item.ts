export interface NavItem {
  displayName: string;
  idNivel: number;
  route?: string;
  children?: NavItem[];
}
