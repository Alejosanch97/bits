import { useParams } from 'react-router-dom';
import { GRADOS } from '../data/grados.js';

// Grado activo según la URL (/g/pj/...). Devuelve el grado y un ayudante para armar enlaces.
export function useGrado() {
  const { grado } = useParams();
  const g = GRADOS[grado] || GRADOS.j;
  const base = `/g/${g.id}`;
  return { g, base, to: (p = '') => `${base}${p}` };
}
