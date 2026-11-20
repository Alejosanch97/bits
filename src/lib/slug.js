// Convierte un texto en un nombre de archivo seguro (compartido por la app y el script de audios)
export function slug(text) {
  return String(text)
    .toLowerCase()
    .replace(/ñ/g, 'nn')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Quita tildes para comparar letras (á -> a), pero respeta la ñ
export function baseLetter(ch) {
  if (ch === 'ñ' || ch === 'Ñ') return 'ñ';
  return ch.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
