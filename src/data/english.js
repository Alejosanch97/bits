// =====================================================================
//  ENGLISH — vocabulario por mundos, espejo de lo que ven en español
//  Cada mundo va de lo más fácil a lo más difícil:
//    Pre-Jardín ve las primeras palabras, Jardín más y Transición todas.
//  Formato: "word:emoji:español" (usa _ para espacios). El emoji es opcional.
// =====================================================================
import { toEnglish } from '../lib/numbers.js';
import { MQRB_TODAS } from './mqrb.js';

const W = (str) => str.trim().split(/\s+/).map((tok) => {
  const [en, emoji, es] = tok.split(':');
  return { texto: en.replace(/_/g, ' '), emoji: emoji || null, es: es ? es.replace(/_/g, ' ') : null };
});

const MUNDOS = [
  { id: 'colors', titulo: 'Colors', icon: '🎨', color: '#E0598B', swatch: true, items: W(`
    red:🔴:rojo blue:🔵:azul yellow:🟡:amarillo green:🟢:verde orange:🟠:naranja purple:🟣:morado pink::rosado brown:🟤:café black:⚫:negro white:⚪:blanco
    gray::gris light_blue::azul_claro dark_blue::azul_oscuro gold:🥇:dorado silver:🥈:plateado rainbow:🌈:arcoíris primary_colors:🎨:colores_primarios`) },
  { id: 'shapes', titulo: 'Shapes', icon: '🔷', color: '#2F8FD8', items: W(`
    circle:⚪:círculo square:🟥:cuadrado triangle:🔺:triángulo rectangle:▬:rectángulo oval:🥚:óvalo star:⭐:estrella heart:❤️:corazón rhombus:🔷:rombo
    diamond:💎:diamante pentagon::pentágono hexagon::hexágono heptagon::heptágono octagon:🛑:octágono sphere:⚽:esfera cube:🎲:cubo pyramid:🔺:pirámide
    cone:🍦:cono cylinder:🥫:cilindro line::línea straight_line::línea_recta curved_line::línea_curva side::lado corner::esquina`) },
  { id: 'positions', titulo: 'Where is it?', icon: '⬆️', color: '#7A4FD6', items: W(`
    up:⬆️:arriba down:⬇️:abajo in:📥:dentro out:📤:fuera on:🔝:encima under:👇:debajo big:🐘:grande small:🐭:pequeño
    left:⬅️:izquierda right:➡️:derecha near:🤏:cerca far:🔭:lejos in_front_of::delante behind::detrás tall:🦒:alto short::bajo
    heavy:🏋️:pesado light:🪶:liviano fat::gordo thin::delgado many::muchos few::pocos the_same::igual different::diferente
    in_the_middle::en_el_medio above::arriba below::abajo long::largo thick::grueso first:🥇:primero last::último`) },
  { id: 'farm', titulo: 'On the Farm', icon: '🚜', color: '#2E9E5B', items: W(`
    cow:🐮:vaca pig:🐷:cerdo horse:🐴:caballo sheep:🐑:oveja duck:🦆:pato chicken:🐔:gallina dog:🐶:perro cat:🐱:gato
    hen:🐔:gallina rooster:🐓:gallo chick:🐥:pollito goat:🐐:cabra rabbit:🐰:conejo donkey:🫏:burro turkey:🦃:pavo goose:🪿:ganso
    mouse:🐭:ratón bull:🐂:toro lamb:🐑:cordero calf:🐄:ternero farmer:🧑‍🌾:granjero tractor:🚜:tractor barn:🛖:granero egg:🥚:huevo
    milk:🥛:leche corn:🌽:maíz hay:🌾:heno fence::cerca pond::estanque field:🌾:campo`) },
  { id: 'wild', titulo: 'Wild Animals', icon: '🦁', color: '#F2A20C', items: W(`
    lion:🦁:león tiger:🐯:tigre elephant:🐘:elefante giraffe:🦒:jirafa monkey:🐒:mono bear:🐻:oso zebra:🦓:cebra snake:🐍:serpiente
    frog:🐸:rana panda:🐼:panda koala:🐨:koala fox:🦊:zorro wolf:🐺:lobo crocodile:🐊:cocodrilo hippo:🦛:hipopótamo kangaroo:🦘:canguro
    gorilla:🦍:gorila sloth:🦥:perezoso deer:🦌:venado camel:🐫:camello rhino:🦏:rinoceronte leopard:🐆:leopardo jaguar:🐆:jaguar squirrel:🐿️:ardilla
    hedgehog:🦔:erizo raccoon:🦝:mapache skunk:🦨:zorrillo bat:🦇:murciélago llama:🦙:llama turtle:🐢:tortuga lizard:🦎:lagartija iguana:🦎:iguana
    dinosaur:🦕:dinosaurio dragon:🐉:dragón unicorn:🦄:unicornio`) },
  { id: 'ocean', titulo: 'Under the Sea', icon: '🐳', color: '#2F8FD8', items: W(`
    fish:🐟:pez whale:🐳:ballena dolphin:🐬:delfín shark:🦈:tiburón octopus:🐙:pulpo crab:🦀:cangrejo turtle:🐢:tortuga starfish:⭐:estrella_de_mar
    seal:🦭:foca jellyfish:🪼:medusa shrimp:🦐:camarón lobster:🦞:langosta shell:🐚:concha seahorse::caballito_de_mar squid:🦑:calamar coral:🪸:coral
    penguin:🐧:pingüino oyster:🦪:ostra sea:🌊:mar wave:🌊:ola boat:⛵:bote submarine::submarino`) },
  { id: 'bugs', titulo: 'Bugs & Birds', icon: '🦋', color: '#E8412C', items: W(`
    bee:🐝:abeja butterfly:🦋:mariposa ant:🐜:hormiga ladybug:🐞:mariquita spider:🕷️:araña bird:🐦:pájaro owl:🦉:búho parrot:🦜:loro
    worm:🪱:gusano caterpillar:🐛:oruga snail:🐌:caracol fly:🪰:mosca mosquito:🦟:zancudo cricket:🦗:grillo beetle:🪲:escarabajo eagle:🦅:águila
    dove:🕊️:paloma swan:🦢:cisne flamingo:🦩:flamenco peacock:🦚:pavo_real toucan::tucán hummingbird::colibrí ostrich::avestruz nest:🪺:nido feather:🪶:pluma`) },
  { id: 'fruits', titulo: 'Fruits', icon: '🍓', color: '#E8412C', items: W(`
    apple:🍎:manzana banana:🍌:banano grapes:🍇:uvas strawberry:🍓:fresa orange:🍊:naranja pear:🍐:pera pineapple:🍍:piña watermelon:🍉:sandía
    cherry:🍒:cereza lemon:🍋:limón peach:🍑:durazno mango:🥭:mango kiwi:🥝:kiwi coconut:🥥:coco blueberry:🫐:mora melon:🍈:melón
    avocado:🥑:aguacate papaya::papaya guava::guayaba tangerine:🍊:mandarina plum::ciruela blackberry::mora passion_fruit::maracuyá fig::higo`) },
  { id: 'veggies', titulo: 'Vegetables', icon: '🥕', color: '#2E9E5B', items: W(`
    carrot:🥕:zanahoria tomato:🍅:tomate potato:🥔:papa corn:🌽:maíz lettuce:🥬:lechuga onion:🧅:cebolla broccoli:🥦:brócoli cucumber:🥒:pepino
    pepper:🫑:pimentón garlic:🧄:ajo pumpkin:🎃:calabaza peas:🫛:arvejas beans:🫘:fríjoles mushroom:🍄:champiñón eggplant:🍆:berenjena celery::apio
    spinach::espinaca cassava:🍠:yuca chili:🌶️:ají cabbage:🥬:repollo`) },
  { id: 'food', titulo: 'Yummy Food', icon: '🍕', color: '#F26B1D', items: W(`
    pizza:🍕:pizza bread:🍞:pan cheese:🧀:queso milk:🥛:leche water:💧:agua juice:🧃:jugo cake:🎂:torta cookie:🍪:galleta
    ice_cream:🍦:helado egg:🥚:huevo rice:🍚:arroz soup:🍜:sopa chicken:🍗:pollo candy:🍬:dulce chocolate:🍫:chocolate honey:🍯:miel
    sandwich:🥪:sándwich hamburger:🍔:hamburguesa hot_dog:🌭:perro_caliente popcorn:🍿:palomitas salad:🥗:ensalada pasta:🍝:pasta fries:🍟:papas_fritas pancake:🥞:pancake
    yogurt:🥣:yogur butter:🧈:mantequilla jam:🍓:mermelada salt:🧂:sal sugar::azúcar coffee:☕:café tea:🍵:té breakfast:🥞:desayuno lunch:🍱:almuerzo dinner:🍽️:cena
    arepa::arepa empanada:🥟:empanada lollipop:🍭:chupeta donut:🍩:dona cupcake:🧁:ponqué`) },
  { id: 'body', titulo: 'My Body', icon: '🙋', color: '#E0598B', items: W(`
    head:🙆:cabeza eyes:👀:ojos ears:👂:orejas nose:👃:nariz mouth:👄:boca hand:✋:mano feet:🦶:pies hair:💇:pelo
    teeth:🦷:dientes tongue:👅:lengua arm:💪:brazo leg:🦵:pierna finger:☝️:dedo face:🙂:cara neck::cuello back::espalda
    knee::rodilla elbow::codo shoulder::hombro belly::barriga heart:❤️:corazón brain:🧠:cerebro bones:🦴:huesos lips:👄:labios eyebrows::cejas eyelashes::pestañas nails:💅:uñas`) },
  { id: 'family', titulo: 'My Family', icon: '👨‍👩‍👧', color: '#7A4FD6', items: W(`
    mom:👩:mamá dad:👨:papá baby:👶:bebé sister:👧:hermana brother:👦:hermano grandma:👵:abuela grandpa:👴:abuelo family:👨‍👩‍👧‍👦:familia
    boy:🧒:niño girl:👧:niña friend:🧑‍🤝‍🧑:amigo aunt::tía uncle::tío cousin::primo mother:👩:madre father:👨:padre
    son::hijo daughter::hija man:👨:hombre woman:👩:mujer kid:🧒:niño people::gente home:🏠:hogar love:❤️:amor`) },
  { id: 'jobs', titulo: 'Community Helpers', icon: '👮', color: '#1D2A6B', items: W(`
    teacher:🧑‍🏫:profesora doctor:👨‍⚕️:médico nurse:👩‍⚕️:enfermera police:👮:policía firefighter:🧑‍🚒:bombero farmer:🧑‍🌾:granjero chef:🧑‍🍳:chef baker::panadero
    dentist:🦷:dentista pilot:🧑‍✈️:piloto astronaut:🧑‍🚀:astronauta painter:🧑‍🎨:pintor singer:🎤:cantante dancer:💃:bailarina mail_carrier:📬:cartero driver:🚕:conductor
    vet::veterinario builder:👷:obrero engineer:👷:ingeniero scientist:🧑‍🔬:científico king:🤴:rey queen:👸:reina princess:👸:princesa clown:🤡:payaso magician:🧙:mago`) },
  { id: 'school', titulo: 'At School', icon: '🏫', color: '#1D2A6B', items: W(`
    school:🏫:colegio teacher:🧑‍🏫:profesora book:📖:libro pencil:✏️:lápiz crayon:🖍️:crayola backpack:🎒:maleta scissors:✂️:tijeras glue:🧴:pegante
    notebook:📓:cuaderno eraser::borrador ruler:📏:regla paper:📄:papel chair:🪑:silla table:🪑:mesa board::tablero clock:🕒:reloj
    computer:💻:computador lunchbox:🍱:lonchera paint:🎨:pintura brush:🖌️:pincel classroom::salón playground:🛝:parque bus:🚌:bus uniform:🎽:uniforme
    bell:🔔:campana flag:🚩:bandera library:📚:biblioteca friends:🧑‍🤝‍🧑:amigos student::estudiante homework:📝:tarea sharpener::sacapuntas pen:🖊️:esfero`) },
  { id: 'house', titulo: 'My House', icon: '🏠', color: '#F26B1D', items: W(`
    house:🏠:casa door:🚪:puerta window:🪟:ventana bed:🛏️:cama table:🪑:mesa chair:🪑:silla sofa:🛋️:sofá kitchen:🍳:cocina
    bathroom:🛁:baño bedroom:🛏️:habitación living_room:🛋️:sala TV:📺:televisor lamp:🪔:lámpara light:💡:luz phone:📱:teléfono stove:🔥:estufa
    refrigerator:🧊:nevera plate:🍽️:plato cup:☕:taza spoon:🥄:cuchara fork:🍴:tenedor knife:🔪:cuchillo pot:🍲:olla glass:🥛:vaso
    soap:🧼:jabón towel::toalla toothbrush:🪥:cepillo_de_dientes mirror:🪞:espejo key:🔑:llave roof::techo garden:🏡:jardín stairs:🪜:escalera`) },
  { id: 'toys', titulo: 'Toys & Play', icon: '🧸', color: '#E8412C', items: W(`
    ball:⚽:balón doll:🪆:muñeca teddy_bear:🧸:oso_de_peluche car:🚗:carro kite:🪁:cometa balloon:🎈:globo blocks:🧱:bloques yo-yo:🪀:yoyo
    puzzle:🧩:rompecabezas robot:🤖:robot drum:🥁:tambor game:🎮:juego slide:🛝:rodadero swing::columpio top:🪀:trompo dice:🎲:dados
    jump_rope::lazo skateboard:🛹:patineta bike:🚲:bicicleta piñata:🪅:piñata party:🎉:fiesta gift:🎁:regalo bubbles:🫧:burbujas marbles::canicas`) },
  { id: 'transport', titulo: 'Let’s Go!', icon: '🚀', color: '#2F8FD8', items: W(`
    car:🚗:carro bus:🚌:bus train:🚂:tren plane:✈️:avión boat:⛵:bote bike:🚲:bicicleta truck:🚚:camión taxi:🚕:taxi
    ship:🚢:barco motorcycle:🏍️:moto helicopter:🚁:helicóptero rocket:🚀:cohete ambulance:🚑:ambulancia fire_truck:🚒:carro_de_bomberos police_car:🚓:patrulla tractor:🚜:tractor
    scooter:🛴:patineta subway:🚇:metro van:🚐:camioneta canoe:🛶:canoa wheel:🛞:rueda road:🛣️:carretera traffic_light:🚦:semáforo bridge:🌉:puente`) },
  { id: 'clothes', titulo: 'Clothes', icon: '👕', color: '#2E9E5B', items: W(`
    shirt:👕:camisa pants:👖:pantalón dress:👗:vestido shoes:👟:zapatos socks:🧦:medias hat:👒:sombrero cap:🧢:gorra jacket:🧥:chaqueta
    skirt::falda boots:👢:botas gloves:🧤:guantes scarf:🧣:bufanda glasses:👓:gafas pajamas::pijama coat:🧥:abrigo shorts:🩳:pantaloneta
    sweater::saco belt::cinturón tie:👔:corbata uniform:🎽:uniforme sandals:🩴:sandalias umbrella:☂️:paraguas`) },
  { id: 'nature', titulo: 'Weather & Nature', icon: '🌈', color: '#F2A20C', items: W(`
    sun:☀️:sol moon:🌙:luna star:⭐:estrella cloud:☁️:nube rain:🌧️:lluvia tree:🌳:árbol flower:🌸:flor rainbow:🌈:arcoíris
    snow:❄️:nieve wind:🌬️:viento hot:🥵:calor cold:🥶:frío leaf:🍃:hoja grass:🌱:pasto sky:🌤️:cielo water:💧:agua
    river:🏞️:río mountain:⛰️:montaña beach:🏖️:playa volcano:🌋:volcán storm:⛈️:tormenta lightning:⚡:rayo day:☀️:día night:🌃:noche
    rock:🪨:piedra sand::arena earth:🌍:tierra planet:🪐:planeta space:🌌:espacio forest:🌲:bosque island:🏝️:isla lake::lago`) },
  { id: 'time', titulo: 'Days & Time', icon: '📅', color: '#7A4FD6', items: W(`
    Monday::lunes Tuesday::martes Wednesday::miércoles Thursday::jueves Friday::viernes Saturday::sábado Sunday::domingo
    today::hoy yesterday::ayer tomorrow::mañana morning:🌅:mañana afternoon::tarde night:🌃:noche clock:⏰:reloj
    January::enero February::febrero March::marzo April::abril May::mayo June::junio July::julio August::agosto
    September::septiembre October::octubre November::noviembre December::diciembre birthday:🎂:cumpleaños week::semana month::mes year::año
    hour::hora minute_hand::minutero hour_hand::horario o'clock::en_punto`) },
  { id: 'actions', titulo: 'Action Words', icon: '🏃', color: '#F26B1D', items: W(`
    run:🏃:correr jump:🤸:saltar eat:🍽️:comer sleep:😴:dormir sing:🎤:cantar dance:💃:bailar read:📖:leer play::jugar
    swim:🏊:nadar walk:🚶:caminar write:✍️:escribir paint:🎨:pintar clap:👏:aplaudir wave:👋:saludar drink:🥤:tomar cry:😢:llorar
    laugh:😂:reír open::abrir close::cerrar sit_down:🪑:sentarse stand_up:🧍:pararse listen:👂:escuchar look:👀:mirar draw:🖍️:dibujar
    count:🔢:contar wash:🧼:lavar cook:🍳:cocinar fly:🕊️:volar climb::trepar throw::lanzar catch::atrapar kick:⚽:patear hug:🤗:abrazar`) },
  { id: 'feelings', titulo: 'Feelings', icon: '😄', color: '#7A4FD6', items: W(`
    happy:😄:feliz sad:😢:triste angry:😠:enojado scared:😱:asustado tired:😴:cansado hungry:😋:hambre surprised:😲:sorprendido silly:🤪:chistoso
    love:🥰:amor cool:😎:genial sick:🤒:enfermo calm:😌:tranquilo shy:😊:tímido brave:🦸:valiente proud::orgulloso excited:🤩:emocionado`) },
  { id: 'music', titulo: 'Music & Sports', icon: '🎵', color: '#E0598B', items: W(`
    music:🎵:música drum:🥁:tambor guitar:🎸:guitarra piano:🎹:piano violin:🎻:violín flute:🪈:flauta trumpet:🎺:trompeta song:🎶:canción
    soccer:⚽:fútbol basketball:🏀:baloncesto tennis:🎾:tenis swimming:🏊:natación karate:🥋:karate volleyball:🏐:voleibol baseball:⚾:béisbol skating:⛸️:patinaje
    xylophone:🎼:xilófono saxophone:🎷:saxofón microphone:🎤:micrófono tambourine:🪘:pandereta water_polo:🤽:waterpolo boxing:🥊:boxeo team::equipo goal:🥅:gol`) },
  { id: 'classroom', titulo: 'Classroom Words', icon: '👋', color: '#2E9E5B', items: W(`
    hello:👋:hola goodbye:🤚:adiós please:🙏:por_favor thank_you:💐:gracias yes:👍:sí no:👎:no sorry::perdón good_morning:🌅:buenos_días
    sit_down:🪑:siéntate stand_up:🧍:ponte_de_pie listen:👂:escucha look:👀:mira quiet:🤫:silencio line_up:🚶:hagan_fila clean_up:🧹:a_recoger good_job:🌟:muy_bien
    good_afternoon::buenas_tardes good_night:🌙:buenas_noches how_are_you?::¿cómo_estás? I'm_fine::estoy_bien my_name_is::mi_nombre_es raise_your_hand:✋:levanta_la_mano open_your_book:📖:abre_tu_libro`) },
];

// Cuántas palabras de cada mundo ve cada grado
const CORTE = { pj: 0.4, j: 0.7, t: 1 };
const MUNDOS_PJ = ['colors', 'shapes', 'positions', 'farm', 'wild', 'ocean', 'bugs', 'fruits', 'food', 'body', 'family', 'school', 'house', 'toys', 'transport', 'clothes', 'nature', 'feelings', 'classroom', 'actions', 'time'];

const COLOR_SWATCH = { red: '#E8412C', blue: '#2F6FD8', yellow: '#FFD23F', green: '#2E9E5B', orange: '#F28C1D', purple: '#7A4FD6', pink: '#FF8FB1', brown: '#8B5A2B', black: '#1E1E24', white: '#FFFFFF', gray: '#9AA0A6', 'light blue': '#7CCBF2', 'dark blue': '#1D2A6B', gold: '#E9B824', silver: '#C0C6CC' };

function numeros(grado) {
  const hasta = grado === 'pj' ? 50 : grado === 'j' ? 100 : 100;
  const items = [];
  for (let n = grado === 'pj' ? 1 : 0; n <= hasta; n++) items.push({ texto: toEnglish(n), numero: n > 0 && n <= 20 ? n : null, es: String(n) });
  if (grado !== 'pj') for (let n = 200; n <= (grado === 'j' ? 200 : 1000); n += 100) items.push({ texto: toEnglish(n), es: String(n) });
  if (grado === 't') for (let n = 2000; n <= 10000; n += 1000) items.push({ texto: toEnglish(n), es: String(n) });
  if (grado === 't') ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'].forEach((w, i) => items.push({ texto: w, es: `${i + 1}°` }));
  return { id: 'numbers', titulo: grado === 'pj' ? 'Numbers 1–50' : grado === 'j' ? 'Numbers 0–200' : 'Numbers 0–10,000', icon: '🔢', color: '#2F8FD8', items };
}

export function englishDeGrado(grado = 't') {
  const corte = CORTE[grado] || 1;
  const mundos = MUNDOS.filter((m) => grado !== 'pj' || MUNDOS_PJ.includes(m.id)).map((m) => {
    const n = Math.max(8, Math.ceil(m.items.length * corte));
    const items = m.items.slice(0, n).map((it) => (m.swatch && COLOR_SWATCH[it.texto] ? { ...it, emoji: null, swatch: COLOR_SWATCH[it.texto] } : it));
    return { ...m, items };
  });
  const mqrb = { id: 'mqrb', titulo: 'My Quick Reading Book', icon: '📘', color: '#1D2A6B', items: MQRB_TODAS.map((p) => ({ texto: p.en[0], emoji: p.emoji, es: p.es })) };
  return [mundos[0], numeros(grado), ...mundos.slice(1), mqrb];
}

// Compatibilidad: todos los mundos completos
export const ENGLISH = englishDeGrado('t');
