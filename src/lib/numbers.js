const ES_0_29 = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
];
const ES_TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const ES_HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function es0to99(n) {
  if (n < 30) return ES_0_29[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? ES_TENS[t] : `${ES_TENS[t]} y ${ES_0_29[u]}`;
}

export function toSpanish(n) {
  if (n === 1000) return 'mil';
  if (n === 100) return 'cien';
  if (n < 100) return es0to99(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r === 0 ? ES_HUNDREDS[h] : `${ES_HUNDREDS[h]} ${es0to99(r)}`;
}

const EN_0_19 = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function en0to99(n) {
  if (n < 20) return EN_0_19[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return u === 0 ? EN_TENS[t] : `${EN_TENS[t]}-${EN_0_19[u]}`;
}

export function toEnglish(n) {
  if (n === 1000) return 'one thousand';
  if (n < 100) return en0to99(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r === 0 ? `${EN_0_19[h]} hundred` : `${EN_0_19[h]} hundred ${en0to99(r)}`;
}
