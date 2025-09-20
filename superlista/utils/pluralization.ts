/**
 * Función para obtener la forma pluralizada de una unidad
 * @param quantity - Cantidad del item
 * @param unit - Unidad del item
 * @returns String con la cantidad y unidad pluralizada si corresponde
 */
export const getPluralizedUnit = (quantity: number, unit: string): string => {
  // Si la cantidad es 1, usar forma singular
  if (quantity === 1) {
    return `${quantity} ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
  }

  // Si la cantidad es mayor a 1, usar forma plural
  const pluralForms: Record<string, string> = {
    'unidad': 'Unidades',
    'paquete': 'Paquetes',
    'caja': 'Cajas',
    'bolsa': 'Bolsas',
    'botella': 'Botellas',
    'lata': 'Latas',
    'sobre': 'Sobres',
    'tableta': 'Tabletas',
    'rollo': 'Rollos',
    'hoja': 'Hojas',
    'pieza': 'Piezas',
    'kg': 'kg',
    'g': 'g',
    'L': 'L',
    'ml': 'ml'
  };

  const pluralUnit = pluralForms[unit] || unit.charAt(0).toUpperCase() + unit.slice(1) + 's';
  return `${quantity} ${pluralUnit}`;
};
