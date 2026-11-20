// English Island — vocabulario por categorías. Formato: [word, emoji] o [word, null, '#color']
import { toEnglish } from '../lib/numbers.js';

const raw = [
  { id: 'farm', titulo: 'On the Farm', icon: '🚜', color: '#2E9E5B', items: [['cow', '🐮'], ['pig', '🐷'], ['horse', '🐴'], ['sheep', '🐑'], ['goat', '🐐'], ['chicken', '🐔'], ['rooster', '🐓'], ['chick', '🐥'], ['duck', '🦆'], ['turkey', '🦃'], ['donkey', '🫏'], ['rabbit', '🐰'], ['dog', '🐶'], ['cat', '🐱'], ['tractor', '🚜'], ['barn', '🛖'], ['farmer', '🧑‍🌾'], ['egg', '🥚'], ['milk', '🥛'], ['corn', '🌽'], ['goose', '🪿'], ['mouse', '🐭']] },
  { id: 'school', titulo: 'At School', icon: '🏫', color: '#1D2A6B', items: [['school', '🏫'], ['teacher', '🧑‍🏫'], ['book', '📖'], ['pencil', '✏️'], ['crayon', '🖍️'], ['scissors', '✂️'], ['backpack', '🎒'], ['ruler', '📏'], ['paper', '📄'], ['notebook', '📓'], ['glue', '🧴'], ['paint', '🎨'], ['clock', '🕒'], ['computer', '💻'], ['chair', '🪑'], ['bus', '🚌'], ['ball', '⚽'], ['globe', '🌎'], ['bell', '🔔'], ['lunchbox', '🍱']] },
  { id: 'colors', titulo: 'Colors', icon: '🎨', color: '#E0598B', items: [['red', null, '#E8412C'], ['blue', null, '#2F6FD8'], ['yellow', null, '#FFD23F'], ['green', null, '#2E9E5B'], ['orange', null, '#F28C1D'], ['purple', null, '#7A4FD6'], ['pink', null, '#FF8FB1'], ['brown', null, '#8B5A2B'], ['black', null, '#1E1E24'], ['white', null, '#FFFFFF'], ['gray', null, '#9AA0A6'], ['light blue', null, '#7CCBF2']] },
  { id: 'animals', titulo: 'Wild Animals', icon: '🦁', color: '#F2A20C', items: [['lion', '🦁'], ['tiger', '🐯'], ['elephant', '🐘'], ['giraffe', '🦒'], ['monkey', '🐒'], ['zebra', '🦓'], ['bear', '🐻'], ['panda', '🐼'], ['fox', '🦊'], ['wolf', '🐺'], ['snake', '🐍'], ['crocodile', '🐊'], ['hippo', '🦛'], ['kangaroo', '🦘'], ['owl', '🦉'], ['parrot', '🦜'], ['sloth', '🦥'], ['koala', '🐨'], ['gorilla', '🦍'], ['frog', '🐸']] },
  { id: 'ocean', titulo: 'Under the Sea', icon: '🐳', color: '#2F8FD8', items: [['fish', '🐟'], ['whale', '🐳'], ['dolphin', '🐬'], ['shark', '🦈'], ['octopus', '🐙'], ['crab', '🦀'], ['turtle', '🐢'], ['jellyfish', '🪼'], ['seal', '🦭'], ['shrimp', '🦐'], ['lobster', '🦞'], ['shell', '🐚'], ['coral', '🪸'], ['squid', '🦑']] },
  { id: 'fruits', titulo: 'Fruits', icon: '🍓', color: '#E8412C', items: [['apple', '🍎'], ['banana', '🍌'], ['grapes', '🍇'], ['strawberry', '🍓'], ['orange', '🍊'], ['pear', '🍐'], ['pineapple', '🍍'], ['watermelon', '🍉'], ['cherry', '🍒'], ['lemon', '🍋'], ['peach', '🍑'], ['mango', '🥭'], ['kiwi', '🥝'], ['coconut', '🥥'], ['blueberry', '🫐'], ['avocado', '🥑']] },
  { id: 'food', titulo: 'Yummy Food', icon: '🍕', color: '#F26B1D', items: [['pizza', '🍕'], ['bread', '🍞'], ['cheese', '🧀'], ['rice', '🍚'], ['soup', '🍜'], ['cake', '🎂'], ['cookie', '🍪'], ['ice cream', '🍦'], ['juice', '🧃'], ['water', '💧'], ['carrot', '🥕'], ['potato', '🥔'], ['tomato', '🍅'], ['sandwich', '🥪'], ['popcorn', '🍿'], ['candy', '🍬'], ['honey', '🍯'], ['salad', '🥗']] },
  { id: 'body', titulo: 'My Body', icon: '🙋', color: '#E0598B', items: [['eye', '👁️'], ['ear', '👂'], ['nose', '👃'], ['mouth', '👄'], ['tooth', '🦷'], ['tongue', '👅'], ['hand', '✋'], ['foot', '🦶'], ['leg', '🦵'], ['arm', '💪'], ['brain', '🧠'], ['heart', '❤️'], ['hair', '💇'], ['finger', '☝️']] },
  { id: 'family', titulo: 'My Family', icon: '👨‍👩‍👧', color: '#7A4FD6', items: [['mom', '👩'], ['dad', '👨'], ['baby', '👶'], ['sister', '👧'], ['brother', '👦'], ['grandma', '👵'], ['grandpa', '👴'], ['family', '👨‍👩‍👧‍👦'], ['friend', '🧑‍🤝‍🧑'], ['house', '🏠']] },
  { id: 'transport', titulo: 'Let’s Go!', icon: '🚀', color: '#2F8FD8', items: [['car', '🚗'], ['bus', '🚌'], ['train', '🚂'], ['plane', '✈️'], ['boat', '⛵'], ['ship', '🚢'], ['bike', '🚲'], ['motorcycle', '🏍️'], ['helicopter', '🚁'], ['rocket', '🚀'], ['truck', '🚚'], ['taxi', '🚕'], ['ambulance', '🚑'], ['fire truck', '🚒'], ['police car', '🚓'], ['scooter', '🛴']] },
  { id: 'clothes', titulo: 'Clothes', icon: '👕', color: '#2E9E5B', items: [['shirt', '👕'], ['pants', '👖'], ['dress', '👗'], ['shoes', '👟'], ['socks', '🧦'], ['hat', '👒'], ['cap', '🧢'], ['jacket', '🧥'], ['scarf', '🧣'], ['gloves', '🧤'], ['boots', '👢'], ['glasses', '👓'], ['skirt', '🩳']] },
  { id: 'weather', titulo: 'Weather & Sky', icon: '🌈', color: '#F2A20C', items: [['sun', '☀️'], ['moon', '🌙'], ['star', '⭐'], ['cloud', '☁️'], ['rain', '🌧️'], ['snow', '❄️'], ['wind', '🌬️'], ['rainbow', '🌈'], ['storm', '⛈️'], ['hot', '🥵'], ['cold', '🥶'], ['umbrella', '☂️']] },
  { id: 'toys', titulo: 'Toys & Play', icon: '🧸', color: '#E8412C', items: [['teddy bear', '🧸'], ['ball', '⚽'], ['kite', '🪁'], ['yo-yo', '🪀'], ['doll', '🪆'], ['blocks', '🧱'], ['puzzle', '🧩'], ['balloon', '🎈'], ['drum', '🥁'], ['robot', '🤖'], ['slide', '🛝'], ['game', '🎮']] },
  { id: 'feelings', titulo: 'Feelings', icon: '😄', color: '#7A4FD6', items: [['happy', '😄'], ['sad', '😢'], ['angry', '😠'], ['scared', '😱'], ['surprised', '😲'], ['sleepy', '😴'], ['silly', '🤪'], ['love', '🥰'], ['cool', '😎'], ['hungry', '😋']] },
  { id: 'actions', titulo: 'Action Words', icon: '🏃', color: '#F26B1D', items: [['run', '🏃'], ['jump', '🤸'], ['swim', '🏊'], ['dance', '💃'], ['sing', '🎤'], ['eat', '🍽️'], ['sleep', '😴'], ['read', '📖'], ['write', '✍️'], ['paint', '🎨'], ['clap', '👏'], ['wave', '👋']] },
  { id: 'shapes', titulo: 'Shapes', icon: '🔺', color: '#1D2A6B', items: [['circle', '⚪'], ['square', '🟥'], ['triangle', '🔺'], ['star', '⭐'], ['heart', '💜'], ['diamond', '🔷']] },
];

const numbers = {
  id: 'numbers',
  titulo: 'Numbers 1–20',
  icon: '🔢',
  color: '#2F8FD8',
  items: Array.from({ length: 20 }, (_, i) => [toEnglish(i + 1), null, null, i + 1]),
};

export const ENGLISH = [...raw.slice(0, 3), numbers, ...raw.slice(3)].map((cat) => ({
  ...cat,
  items: cat.items.map(([texto, emoji, swatch, numero]) => ({ texto, emoji, swatch, numero })),
}));
