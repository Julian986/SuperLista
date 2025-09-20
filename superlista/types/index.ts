export interface SupermarketItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  place: string;
  status: string;
  addedBy: string;
  addedAt: Date;
  checked: boolean;
}

export interface AddItemFormData {
  name: string;
  qty: number;
  unit: string;
  place: string;
  status: string;
}

export const PLACES = [
  'Supermercado',
  'Almacén',
  'Verdulería',
  'Carnicería',
  'Panadería',
  'Farmacia',
  'Otros'
] as const;

export const UNITS = [
  'unidad',
  'kg',
  'g',
  'L',
  'ml',
  'paquete',
  'caja',
  'bolsa',
  'botella',
  'lata',
  'sobre',
  'tableta',
  'rollo',
  'hoja',
  'pieza'
] as const;

export const STATUSES = [
  'Agotado',
  'Poco',
  'Disponible'
] as const;

export type Place = typeof PLACES[number];
export type Unit = typeof UNITS[number];
export type Status = typeof STATUSES[number];
