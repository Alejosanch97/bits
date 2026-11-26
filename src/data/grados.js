// =====================================================================
//  CONTENIDO POR GRADO — tomado de los libros de CREAR
//  PJ = Pre-Jardín (PreKindergarten) · J = Jardín (Kindergarten) · T = Transición
//  Palabras: "palabra:emoji" o "palabra" (bit de lectura pura). Usa _ para espacios.
//  Las palabras de cada letra salen primero del libro; luego se completan con
//  palabras sencillas con imagen del banco general (solo si son del nivel).
// =====================================================================
import { parse, EMOJI, PALABRAS_CON_IMAGEN, TODAS_LAS_PALABRAS } from './espanol.js';
import { BANCO_EXTRA } from './banco-extra.js';
import { baseLetter } from '../lib/slug.js';

const COLORES = ['#E8412C', '#1D2A6B', '#F2A20C', '#2E9E5B', '#2F8FD8', '#E0598B', '#7A4FD6', '#F26B1D'];

// ---------------------------------------------------------------------
//  PRE-JARDÍN — libro "Spanish Module PreKindergarten"
// ---------------------------------------------------------------------
const PJ_LETRAS = [
  { l: 'o', frase: 'Oso, ola, ojo.', p: 'oso:🐻 ola:🌊 olla:🍲 oveja:🐑 oreja:👂 ojo:👁️ ojos:👀 ocho:8️⃣ oruga:🐛 oca:🪿 oro:🪙 ostra:🦪 olas:🌊 oso_polar:🐻‍❄️' },
  { l: 'i', frase: 'Isla, iglú, imán.', p: 'isla:🏝️ iglesia:⛪ iguana:🦎 iglú:🛖 imán:🧲 insecto:🪲 idea:💡 invierno:☃️ iglesias:⛪ islas:🏝️' },
  { l: 'a', frase: 'Abeja, avión, árbol.', p: 'abeja:🐝 águila:🦅 avión:✈️ anillo:💍 araña:🕷️ ala:🪽 ardilla:🐿️ árbol:🌳 agua:💧 ajo:🧄 aguacate:🥑 ancla:⚓ arroz:🍚 abuela:👵 abuelo:👴 azul:🔵 arcoíris:🌈 arco:🏹' },
  { l: 'e', frase: 'Erizo, estrella, elefante.', p: 'erizo:🦔 estrella:⭐ escalera:🪜 elefante:🐘 estufa:🔥 escoba:🧹 esqueleto:💀 espejo:🪞 escuela:🏫 ensalada:🥗 empanada:🥟 edificio:🏢 enano:🧌' },
  { l: 'u', frase: 'Uno, uvas, uña.', p: 'uno:1️⃣ uvas:🍇 uña:💅 urraca:🐦 unicornio:🦄 uniforme:🎽 ukelele:🪕 uva:🍇 luna:🌙 gusano:🐛' },
  { l: 'm', frase: 'Mamá ama a Memo.', p: 'mamá:👩 mapa:🗺️ mesa:🪑 mico:🐒 moto:🏍️ mula:🫏 manzana:🍎 mago:🧙 momia:🧟 mono:🐒 miel:🍯 mano:✋ mariposa:🦋 maleta:🧳 mamá_ama_a_Memo mío mima amo ama mami Ema Memo Emilio miau mua' },
  { l: 's', frase: 'Ese oso se asoma.', p: 'sol:☀️ sapo:🐸 suma:➕ semáforo:🚦 sirena:🧜‍♀️ sofá:🛋️ silla:🪑 sandía:🍉 sombrero:👒 serpiente:🐍 sombrilla:⛱️ sobre:✉️ serrucho:🪚 seis:6️⃣ sopa:🍜 soldado:💂 mesa masa oso Susi museo sala Sami así más' },
  { l: 'p', frase: 'Mi papá nos ama.', p: 'papá:👨 pulpo:🐙 pez:🐟 pocillo:☕ payaso:🤡 pájaro:🐦 perro:🐶 pato:🦆 pera:🍐 pingüino:🐧 paraguas:☂️ pavo:🦃 pelota:⚽ palmera:🌴 peine:🪮 pie:🦶 papa:🥔 puma:🐆 pizza:🍕 piña:🍍 pipa mapa:🗺️ sapo:🐸 sopa:🍜 apio Pepe papi piso pomo' },
  { l: 'l', frase: 'Pamela mima a la paloma.', p: 'luna:🌙 lupa:🔍 león:🦁 loro:🦜 lámpara:🪔 lima:🍋 limón:🍋 lápiz:✏️ libro:📖 lana:🧶 langosta:🦞 lata:🥫 paloma:🕊️ lobo:🐺 leche:🥛 isla:🏝️ sol:☀️ miel:🍯 ola:🌊 ala:🪽 pala palo pila Lulú Paula Pamela loma lulo' },
  { l: 't', frase: 'Tito tiene siete años.', p: 'televisor:📺 tiburón:🦈 tulipán:🌷 tambor:🥁 toro:🐂 teléfono:📱 tomate:🍅 taza:☕ tijeras:✂️ tortuga:🐢 maleta:🧳 paleta:🍭 torta:🎂 termómetro:🌡️ tucán:🦜 tren:🚂 tina:🛁 moto:🏍️ pato:🦆 pelota:⚽ topo tela tapa tía Tito' },
  { l: 'n', frase: 'Los enanos se asolean.', p: 'nube:☁️ naranja:🍊 nido:🪺 nené:👶 nota:🎵 nudo:🪢 maní:🥜 naipe:🃏 piano:🎹 pino:🌲 molino:🌬️ noche:🌃 nave:🚀 mano:✋ mono:🐒 nariz:👃 nieve:❄️ niño:🧒 niña:👧 luna:🌙 lana:🧶 Elena Inés' },
  { l: 'r', frase: 'Rita la ranita salta a la roca.', p: 'raqueta:🎾 río:🏞️ ruleta:🎡 reloj:⏰ rosa:🌹 radio:📻 reno:🦌 rey:🤴 reina:👸 rinoceronte:🦏 ratón:🐭 rana:🐸 rueda:🛞 ropa:👕 risa:😂 rama:🌿 rayo:⚡ robot:🤖 regalo:🎁 loro:🦜 Rita Raúl René rulos' },
  { l: 'b', frase: 'Beto y Bety bailan muy bonito.', p: 'bandera:🚩 bebé:👶 bus:🚌 balón:⚽ botella:🍾 bicicleta:🚲 bota:👢 bate:🏏 baúl:🧳 bote:🛶 ballena:🐋 buzo:🤿 barco:🚢 beso:💋 biberón:🍼 búho:🦉 burro:🫏 banano:🍌 nube:☁️ escoba:🧹 lobo:🐺 abuelo:👴 Beto Bety Belén bola' },
];

const PJ_LECTURAS = [
  { titulo: 'Mi mamá', texto: 'Mamá ama a Memo.\nMami, ámame.\nMi mamá me mima.\nAmo a mi mamá.' },
  { titulo: 'Mi oso', texto: 'Ese oso se asoma.\nEse es mi oso.\nSusi asea su oso.\nMi oso es mío.' },
  { titulo: 'Mi papá', texto: 'Mi papá nos ama.\nPapi me ama.\nPepe usa la pipa.\nPapá pasea a pie.' },
  { titulo: 'La paloma', texto: 'Pamela mima a la paloma.\nPaola limpia la pila.\nLa paloma se posa.\nLulú lame la lima.' },
  { titulo: 'Mi tío', texto: 'Tito tiene siete años.\nMi tío tiene moto.\nLa tía toma té.\nTito toma la pelota.' },
  { titulo: 'La luna', texto: 'Los enanos se asolean.\nLa luna se asoma.\nEl nene mima al mono.\nNené toma la mano de mamá.' },
  { titulo: 'La ranita', texto: 'Rita la ranita salta a la roca.\nLos ratones se están riendo.\nRaúl rema en el río.\nLa rosa es roja.' },
  { titulo: 'El bebé', texto: 'Beto y Bety bailan muy bonito.\nEl bebé toma sopa.\nBeto da un beso a su abuelo.\nLa bota es bonita.' },
  { titulo: 'Las vocales', texto: 'a de abeja.\ne de elefante.\ni de isla.\no de oso.\nu de uvas.' },
];

// ---------------------------------------------------------------------
//  JARDÍN — "Spanish Module Kindergarten" + "Reading Book Kindergarten"
// ---------------------------------------------------------------------
const J_LETRAS = [
  { l: 'a', frase: 'A de araña y de árbol.', p: 'abeja:🐝 araña:🕷️ árbol:🌳 avión:✈️ anillo:💍 águila:🦅 ardilla:🐿️ arcoíris:🌈 agua:💧 ajo:🧄 aguacate:🥑 abuela:👵 arroz:🍚 ancla:⚓' },
  { l: 'e', frase: 'E de elefante y de estrella.', p: 'elefante:🐘 estrella:⭐ erizo:🦔 escoba:🧹 escalera:🪜 esqueleto:💀 espejo:🪞 enfermera:👩‍⚕️ ensalada:🥗 empanada:🥟 escuela:🏫' },
  { l: 'i', frase: 'I de iglú y de imán.', p: 'iglú:🛖 imán:🧲 isla:🏝️ iguana:🦎 iglesia:⛪ insecto:🪲 idea:💡 invierno:☃️' },
  { l: 'o', frase: 'O de oso y de oreja.', p: 'oso:🐻 oveja:🐑 oreja:👂 ojo:👁️ olla:🍲 ola:🌊 oruga:🐛 ocho:8️⃣ ostra:🦪 oro:🪙' },
  { l: 'u', frase: 'U de uvas y de unicornio.', p: 'uvas:🍇 unicornio:🦄 uña:💅 uno:1️⃣ uniforme:🎽 urraca:🐦' },
  { l: 'm', frase: 'Mamá ama a Memo.', p: 'mamá:👩 momia:🧟 mimo:🤡 mesa:🪑 mariposa:🦋 micrófono:🎤 mono:🐒 moto:🏍️ mapa:🗺️ mula:🫏 mago:🧙 manzana:🍎 miel:🍯 mano:✋ maní:🥜 amo mío mima mami Memo Ema Mimí Momi' },
  { l: 's', frase: 'Ese oso se asoma.', p: 'sol:☀️ sapo:🐸 suma:➕ semáforo:🚦 sirena:🧜‍♀️ sala silla:🪑 sofá:🛋️ soldado:💂 seis:6️⃣ mesa:🪑 masa oso:🐻 Susi museo asoma misa' },
  { l: 'p', frase: 'Mi papá nos ama.', p: 'papá:👨 pulpo:🐙 pez:🐟 pocillo:☕ payaso:🤡 pipa pájaro:🐦 perro:🐶 pato:🦆 puma:🐆 mapa:🗺️ papa:🥔 pie:🦶 Pepe pomo apio papi pepa mariposa:🦋 pelota:⚽ paloma:🕊️' },
  { l: 'l', frase: 'Pamela mima a la paloma.', p: 'lupa:🔍 león:🦁 loro:🦜 lámpara:🪔 luna:🌙 paloma:🕊️ palo suelo isla:🏝️ sola miel:🍯 ola:🌊 pila lame Paula loma Lola lila' },
  { l: 't', frase: 'Tito tiene siete años.', p: 'tiburón:🦈 tulipán:🌷 tambor:🥁 toro:🐂 teléfono:📱 televisor:📺 tomate:🍅 pato:🦆 maleta:🧳 lata:🥫 reloj:⏰ paleta:🍭 tapa moto:🏍️ maceta:🪴 pelota:⚽ tapete' },
  { l: 'n', frase: 'Los enanos se asolean.', p: 'nube:☁️ naranja:🍊 nido:🪺 nené:👶 nota:🎵 nudo:🪢 pino:🌲 tina:🛁 luna:🌙 lana:🧶 maní:🥜 peine:🪮 piano:🎹 molino:🌬️ mano:✋ melena noche:🌃 nave:🚀 Manuel Elena' },
  { l: 'r', frase: 'Rita la ranita salta a la roca.', p: 'ratón:🐭 radio:📻 rana:🐸 rosa:🌹 río:🏞️ ruleta:🎡 reloj:⏰ raqueta:🎾 rey:🤴 reina:👸 reno:🦌 rulos rosado ruta Raúl René Ramón ramo:💐 repisa' },
  { l: 'b', frase: 'Beto y Bety bailan muy bonito.', p: 'bebé:👶 bus:🚌 balón:⚽ botella:🍾 bicicleta:🚲 bandera:🚩 bota:👢 bote:🛶 árbol:🌳 nube:☁️ escoba:🧹 abuelo:👴 bate:🏏 baúl:🧳 buzo:🤿 boina Belén' },
  { l: 'c', frase: 'Camila eleva la cometa.', p: 'casa:🏠 corona:👑 copa:🏆 caracol:🐌 cama:🛏️ camisa:👕 cubiertos:🍴 cono:🍦 campana:🔔 caimán:🐊 caramelo:🍬 canela cuna:🛏️ cuento:📖 cáscara correo:📮 carta:✉️ cartero:📬 coco:🥥 cometa:🪁 canguro:🦘 Camila Carlos Catalina' },
  { l: 'ce', titulo: 'ce – ci', frase: 'La pecera tiene cinco peces.', p: 'cerdo:🐷 cinturón cisne:🦢 cebra:🦓 cereza:🍒 cinco:5️⃣ cine:🎬 cinta:🎀 cocina:🍳 cielo:☁️ cena:🍽️ pecera:🐠 ciruela aceite pincel:🖌️ ciudad:🏙️ maceta:🪴 cenicero cerca Cecilia Cenicienta' },
  { l: 'qu', titulo: 'que – qui', frase: 'Enrique quiere comer ponqué.', p: 'queso:🧀 raqueta:🎾 quince:🔢 esqueleto:💀 paquete:📦 bosque:🌲 orquesta:🎻 buque:🚢 mosquito:🦟 máquina:🧰 ponqué:🍰 esquimal Quique Paquita quiero' },
  { l: 'ch', frase: 'Los chichas vivían en chozas.', p: 'chupo:🍼 leche:🥛 chino chocolate:🍫 ducha:🚿 lechuza:🦉 mochila:🎒 chivo:🐐 cachucha:🧢 charco noche:🌃 ocho:8️⃣ lonchera:🍱 chaleco:🦺 techo:🏠 estuche:✏️ lechuga:🥬 salchicha:🌭 cuchara:🥄 chaqueta:🧥 chimenea Pinocho' },
  { l: 'd', frase: 'Daniel le duele el diente.', p: 'dado:🎲 delfín:🐬 doctor:👨‍⚕️ dulce:🍬 diente:🦷 dinosaurio:🦕 diadema dama dedal medusa:🪼 dedo:☝️ dálmata:🐕 nido:🪺 dominó:🁡 moneda:🪙 Diana Daniel Danilo' },
  { l: 'f', frase: 'Somos la familia Fernández Forero.', p: 'foca:🦭 faro:🗼 futbolista:⚽ finca:🏡 foto:📷 fila fuente:⛲ teléfono:📱 estufa:🔥 sofá:🛋️ café:☕ semáforo:🚦 elefante:🐘 delfín:🐬 fósforo:🔥 falda:👗 feria:🎡 Felipe Federico Sofía' },
  { l: 'g', frase: 'El gorila es un animal salvaje.', p: 'gato:🐱 gorila:🦍 guantes:🧤 gotero gusano:🐛 gotas:💧 ganso:🪿 gafas:👓 gol:🥅 gaseosa:🥤 laguna:🏞️ algodón gallo:🐓 gallina:🐔 tortuga:🐢 mago:🧙 regalo:🎁 amigo Gustavo' },
  { l: 'gu', titulo: 'gue – gui', frase: 'Olguita tiene muchos juguetes.', p: 'guitarra:🎸 águila:🦅 juguete:🧸 manguera hormiguero:🐜 guiso:🍲 espaguetis:🍝 guisantes:🫛 guepardo:🐆 guerrero anguila guirnalda Miguel Guillermo' },
  { l: 'ge', titulo: 'ge – gi', frase: 'Germán y Rogelio son gemelos.', p: 'girasol:🌻 gemelos:👯 gelatina:🍮 genio:🧞 gigante:🧌 ángel:👼 gitana general colegio:🏫 página:📄 vigilante ingeniero:👷 mágico Rogelio Eugenia' },
  { l: 'h', frase: 'Hilario cultiva su huerta.', p: 'huevo:🥚 helado:🍦 hilo:🧵 hongos:🍄 humo:💨 hormiga:🐜 hamaca hotel:🏨 hueso:🦴 hoja:🍃 hipopótamo:🦛 herradura:🧲 harina búho:🦉 cohete:🚀 hiena huracán:🌀 hada:🧚 Héctor Helena' },
  { l: 'j', frase: 'Juan cuida su jardín.', p: 'jirafa:🦒 jaula jugo:🧃 jabón:🧼 jardín:🏡 jarra:🫖 jamón:🍖 jeringa:💉 naranja:🍊 ajo:🧄 abeja:🐝 ají:🌶️ ojos:👀 oreja:👂 espejo:🪞 conejo:🐰 tijeras:✂️ hoja:🍃 Juan Julio Jaime' },
  { l: 'k', frase: 'Karen usa un kimono elegante.', p: 'koala:🐨 kimono:👘 kumis:🥛 kiwi:🥝 karate:🥋 karateca:🥋 kilo:⚖️ kiosco:🏪 kilómetro kepis kinder:🏫 Karen Kiko Katia Koki' },
  { l: 'll', frase: 'El carro amarillo está en la calle.', p: 'llave:🔑 llanta:🛞 lluvia:🌧️ anillo:💍 gallina:🐔 calle:🛣️ cuello camello:🐫 collar:📿 olla:🍲 llama:🦙 toalla mantequilla:🧈 cabello cepillo:🪥 sombrilla:⛱️ sello medalla:🏅 pollito:🐥 castillo:🏰 galleta:🍪 silla:🪑' },
  { l: 'ñ', frase: 'La cabaña está en la montaña.', p: 'ñandú:🦤 niño:🧒 niña:👧 piña:🍍 muñeca:🪆 buñuelo meñique araña:🕷️ telaraña:🕸️ uña:💅 cabaña:🛖 montaña:⛰️ año:📅 mañana:🌅 piñata:🪅 leñador:🪓 sueño:😴 baño:🛁 caña pañuelo señor:👨 otoño:🍂' },
  { l: 'rr', frase: 'A mi perro marrón le gusta correr.', p: 'perro:🐶 perrito:🐕 carro:🚗 barril:🛢️ serrucho:🪚 marrano:🐷 carretilla torre:🗼 tierra:🌍 burro:🫏 gorro:🧢 guitarra:🎸 morral:🎒 corral carrusel:🎠 tarro zorro:🦊 arroz:🍚 terremoto' },
  { l: 'v', frase: 'Valentina tiene un vestido verde.', p: 'vaca:🐮 vela:🕯️ vaso:🥛 violín:🎻 volcán:🌋 voleibol:🏐 velero:⛵ vestido:👗 verde:🟢 viento:🌬️ uvas:🍇 pavo:🦃 vaquero:🤠 venado:🦌 verduras:🥕 verano:☀️ vidrio Vicente Víctor Viviana' },
  { l: 'w', frase: 'Waldo escucha música.', p: 'waterpolo:🤽 wafle:🧇 wifi:📶 kiwi:🥝 Wendy William Walter Waldo Wilson' },
  { l: 'x', frase: 'El boxeador ocupó el sexto lugar.', p: 'xilófono:🎼 saxofón:🎷 taxi:🚕 boxeador:🥊 examen:📝 éxito:🏆 taxista:🚕 oxígeno texto:📄 extintor:🧯 México:🇲🇽 Félix Ximena' },
  { l: 'y', frase: 'Yolanda tiene una blusa rayada.', p: 'yoyo:🪀 yegua:🐎 payaso:🤡 yuca:🍠 yate:🛥️ papaya:🥭 rayo:⚡ joya:💍 guayaba:🍐 yema:🍳 yogur:🥣 desayuno:🥞 yeso arroyo:🏞️ Yuly' },
  { l: 'z', frase: 'Zoraida salta el lazo en el parque.', p: 'zanahoria:🥕 zapatos:👞 zorro:🦊 erizo:🦔 lechuza:🦉 zancudo:🦟 taza:☕ tiza:🖍️ arroz:🍚 maíz:🌽 azul:🔵 corazón:❤️ manzana:🍎 pozo cereza:🍒 buzo:🤿 lazo:🎀 azúcar Zoraida' },
  { l: 'br', titulo: 'br · bl', frase: 'Blanca estudia en la biblioteca.', p: 'libro:📖 brazo:💪 sombrero:👒 brújula:🧭 colibrí:🐦 abrigo:🧥 cabra:🐐 octubre abril bruja:🧙‍♀️ blusa:👚 tabla mueble:🛋️ pueblo:🏘️ bloque:🧱 blanco:⚪ Blanca Pablo' },
  { l: 'cr', titulo: 'cr · cl', frase: 'En la clase de música toco el clarinete.', p: 'crema:🧴 cruz:✝️ cráneo:💀 crayola:🖍️ crucero:🛳️ escritorio cristal recreo clavo clavel:🌺 clase:🏫 clip:📎 clínica:🏥 chicle:🍬 tecla clarinete:🎷 bicicleta:🚲 Cristina Clara' },
  { l: 'dr', titulo: 'dr · tr · tl', frase: 'El tren pasa por el puente.', p: 'cocodrilo:🐊 dragón:🐉 piedra:🪨 ladrillo:🧱 cuadro:🖼️ madre padre tren:🚂 tres:3️⃣ trigo:🌾 trofeo:🏆 trompo:🪀 triángulo:🔺 tractor:🚜 estrella:⭐ astronauta:🧑‍🚀 atleta:🏃 atlas:🗺️ Pedro Andrés' },
  { l: 'fr', titulo: 'fr · fl', frase: 'El flamenco tiene patas largas.', p: 'fresa:🍓 frutas:🍎 fríjoles:🫘 frasco:🫙 cofre:🧰 frío:🥶 freno flamenco:🦩 flor:🌸 flores:💐 flauta:🪈 flecha:🏹 flan:🍮 flotador:🛟 Francisco Florida' },
  { l: 'gr', titulo: 'gr · gl', frase: 'Mi tío Pepe tiene una granja.', p: 'granja:🚜 cangrejo:🦀 tigre:🐯 grillo:🦗 grúa:🏗️ negro:⚫ grande gris globo:🎈 globos:🎈 iglú:🛖 iglesia:⛪ regla:📏 jungla:🌴 gladiador Gloria' },
  { l: 'pr', titulo: 'pr · pl', frase: 'Plinio está en la playa.', p: 'princesa:👸 primo prado profesora:👩‍🏫 premio:🏆 primavera:🌸 presidente playa:🏖️ plátano:🍌 pluma:🪶 planta:🪴 plato:🍽️ planeta:🪐 plaza plancha Plinio' },
];

const J_LECTURAS = [
  { titulo: 'Mi mamá', texto: 'Mi mamá. Amo a mamá.\nA mí me ama mamá.\nMami te amo.\nMemo ama a Ema.\nMua, mua, amo a mi mamá.' },
  { titulo: 'Sami la osa', texto: 'Mamá se asoma.\nSusi amasa esa masa.\nMamá asea mi oso.\nSami la osa asea a sus ositos,\nlos ama y los mima.' },
  { titulo: 'Mi papá', texto: 'Pepe es mi papá\ny ama a mi mamá.\nPapá se asoma y usa su pipa,\npasea a Pipo a pie.' },
  { titulo: 'La mula', texto: 'Mi papá usa la pala.\nLa mula se puso mala.\nPepe sale a la loma.\nLuis pasea en la isla.\nLa mula lame la lima.' },
  { titulo: 'La tía Amelia', texto: 'Mi tía Amelia tiene una maleta.\nEn la maleta tiene una lata,\nun pito, una pelota y una piola.\nEn su moto está la maleta.\nLa tía Amelia pasea sola en su moto.' },
  { titulo: 'La mona', texto: 'Mi nene se asoma.\nMi nena es mona.\nMi mamá peina la mona.\nEse león lame su melena.' },
  { titulo: 'La mariposa', texto: 'Esa mariposa morada se paró en mi rosa.\nEl marinero me da un beso.\nEl pan tiene mermelada de mora y pera.\nLa ratona usa rulos.' },
  { titulo: 'El abuelo', texto: 'Siento sus pasos,\nsuena el bastón,\nme asomo al camino,\n¡es mi abuelo!\nÉl me da besos\ny saca de su bolsa un balón.' },
  { titulo: 'Camila', texto: 'Carlos come coco.\nCamila usa una camisa.\nCamilo, pásame la cuna.\nCarlota tiene una copa.\nCatalina asiste a la escuela.' },
  { titulo: 'Cecilia', texto: 'La pecera tiene cinco peces.\nCecilia cocina muy rico.\nCenicienta está en el palacio.' },
  { titulo: 'Quique y su queso', texto: 'Papi quiere a mami.\nPaquita y Quique salen de paseo al bosque.\nQuico quiere comer queso.\nSusana está en el parque.' },
  { titulo: 'El chino', texto: 'El chino come chitos.\nPinocho come de noche.\nEl bebé está en el coche.\nEl techo de la casa es de madera.' },
  { titulo: 'Diana', texto: 'Esa dama viste de seda.\nPapi, dame mi dado.\nDiana limpia sus dientes todos los días\ny usa pasta dental.' },
  { titulo: 'La foca', texto: 'La foca toca la pelota.\nSe rifa una bonita foto.\nSofía usa gafas.\nFederico tiene un delfín.' },
  { titulo: 'Mi amigo Gustavo', texto: 'Mi equipo ganó la copa.\nMi amigo Gustavo me dio un regalo.\nEl domingo viene mi amigo el mago.\nDiego come golosinas.' },
  { titulo: 'Helena', texto: 'Sale humo de la casa.\nEl hijo de mi tío se come un rico helado.\nEl hada juega con el búho.\nHelena come helado de mora.' },
  { titulo: 'Juan', texto: 'Juan toma jugo de naranja todos los días.\nEl conejo se esconde en las cajas de los regalos.\nEl ají es muy picante.' },
  { titulo: 'Kiko el karateca', texto: 'Kiko el karateca va al kiosco\ny pide kumis con galletas.\nInvita a Katia a tomar\nun rico jugo de kiwi.' },
  { titulo: 'Mamá gallina', texto: 'Mamá gallina cuida sus pollitos.\nMi pollito come galletas.\nDame la llave de la cocina.\nLlegan las gotas de lluvia.' },
  { titulo: 'Toño y la piña', texto: 'Toño come piña y no le da a la niña.\nDoña Toña se pinta las uñas.\nYo baño a la muñeca.\nLa arañita se asoma en la leña.' },
  { titulo: 'El marrano', texto: 'Ese marrano lame mi mano.\nDalia me da un morral rojo.\nEl burro y el marrano están en el corral.' },
  { titulo: 'Trabalenguas de la rr', texto: 'Erre con erre, aserrín,\nerre con erre, barril,\nrápido corren los carros\ncargados de turrón,\nrápido corren los carros\na la torre de Turín.' },
  { titulo: 'Viviana', texto: 'Ese pavo está lindo.\nViviana lava las uvas.\nLa vaca come pasto.\nVicente vacuna su vaca.' },
  { titulo: 'Ximena', texto: 'Ximena se va en taxi.\nEl oxígeno nos sirve para respirar.\nMiguel lee un texto sencillo.' },
  { titulo: 'El payaso Yupi', texto: 'El payaso Yupi se fue a la playa\ncon un yate de juguete\ny un vestido de rayas.' },
  { titulo: 'El zorro', texto: 'A ese zorro le regalaron un par de zapatos azules.\nZoraida come zanahoria.\nLas manzanas son de color rojo y verde.' },
  { titulo: 'Adivinanzas', texto: 'En lo alto vive, en lo alto mora,\nen lo alto teje la tejedora.\n¿Quién es? ¡La araña!\nDa sin que tenga manos\ny anda sin que tenga pies.\n¿Qué es? ¡El reloj!' },
];

// ---------------------------------------------------------------------
//  TRANSICIÓN — "Spanish Module Transition"
// ---------------------------------------------------------------------
const T_LETRAS = [
  { l: 'a', frase: 'La abeja vuela sobre el árbol.', p: 'abeja:🐝 araña:🕷️ árbol:🌳 arcoíris:🌈 asno:🫏 avión:✈️ anillo:💍 águila:🦅 ardilla:🐿️ astronauta:🧑‍🚀 ambulancia:🚑 aguacate:🥑 almohada amigo:🧑‍🤝‍🧑' },
  { l: 'e', frase: 'El elefante mira la estrella.', p: 'elefante:🐘 estrella:⭐ edredón:🛏️ enfermera:👩‍⚕️ espantapájaros escalera:🪜 esqueleto:💀 erizo:🦔 escoba:🧹 espejo:🪞 edificio:🏢 ensalada:🥗 escuela:🏫' },
  { l: 'i', frase: 'La iguana vive en la isla.', p: 'iglú:🛖 insectos:🪲 isla:🏝️ íbice:🐐 iguana:🦎 imán:🧲 iglesia:⛪ invierno:☃️ idea:💡 impresora:🖨️ invitación:💌' },
  { l: 'o', frase: 'El oso come con la oveja.', p: 'oso:🐻 oruga:🐛 óvalo:🥚 océano:🌊 oveja:🐑 oreja:👂 ojo:👁️ olla:🍲 ocho:8️⃣ orca:🐋 oro:🪙 otoño:🍂 orquesta:🎻' },
  { l: 'u', frase: 'El unicornio come uvas.', p: 'unicornio:🦄 uno:1️⃣ uvas:🍇 uña:💅 uniforme:🎽 universo:🌌 ukelele:🪕 urraca:🐦' },
  { l: 'm', frase: 'Mamita, mamita, me voy a acostar.', p: 'manzana:🍎 mono:🐒 momia:🧟 murciélago:🦇 medusa:🪼 mamá:👩 molino:🌬️ mico:🐒 mami mano:✋ mimo mono meta Milena Mario moto:🏍️ melena misa maní:🥜 melón:🍈 mueca moco miel:🍯 mina muela:🦷 mesa:🪑 mariposa:🦋 mapa:🗺️' },
  { l: 's', frase: 'El sol quería bañarse.', p: 'sol:☀️ sandía:🍉 serpiente:🐍 sapo:🐸 sobre:✉️ silla:🪑 sombrero:👒 sirena:🧜‍♀️ semáforo:🚦 sofá:🛋️ sopa:🍜 semilla:🌱 sartén:🍳 saltamontes:🦗 Susi solo' },
  { l: 'p', frase: 'La paloma Pepita se ha comido una perita.', p: 'pez:🐟 pingüino:🐧 pulpo:🐙 policía:👮 perro:🐶 papá:👨 pipa pepa pelo popa peso pera:🍐 paloma:🕊️ pato:🦆 pelota:⚽ piña:🍍 pizza:🍕 payaso:🤡 pájaro:🐦 Pepita' },
  { l: 'l', frase: 'La mula limpia su pelo.', p: 'león:🦁 lirio:🌷 liebre:🐇 lobo:🐺 leopardo:🐆 luna:🌙 libro:📖 lápiz:✏️ limón:🍋 loro:🦜 lupa:🔍 leche:🥛 lana:🧶 lomo pelota:⚽ paloma:🕊️ mula:🫏 palo pila' },
  { l: 'n', frase: 'Luna, lunera, cascabelera.', p: 'nido:🪺 narval:🐋 números:🔢 nieve:❄️ nubes:☁️ naranja:🍊 nariz:👃 nota:🎵 niño:🧒 niña:👧 noche:🌃 nave:🚀 nudo:🪢 luna:🌙' },
  { l: 't', frase: 'Tic tac, un ratoncito se sube al reloj.', p: 'tiburón:🦈 tortuga:🐢 tierra:🌍 teléfono:📱 tigre:🐯 tomate:🍅 tambor:🥁 tijeras:✂️ taza:☕ toro:🐂 tren:🚂 trofeo:🏆 tucán:🦜 tulipán:🌷 televisor:📺' },
  { l: 'r', frase: 'Toma este ramo de rosas.', p: 'ratón:🐭 rana:🐸 reno:🦌 rosa:🌹 robot:🤖 pera:🍐 coro loro:🦜 rana:🐸 arete arte corte martes ruta rama:🌿 mirla río:🏞️ risa:😂 ramo:💐 rulos remo revista:📰 rata rincón rey:🤴 reina:👸 reloj:⏰' },
  { l: 'b', frase: 'La bota de Beto se cae del bote.', p: 'ballena:🐋 bombero:🧑‍🚒 buey:🐂 búho:🦉 barco:🚢 bota:👢 bote:🛶 botón:🔘 bonito beso:💋 babosa:🐌 bebé:👶 balón:⚽ bicicleta:🚲 burro:🫏 bandera:🚩 banano:🍌' },
  { l: 'c', frase: 'Caracol, col, col, saca los cuernos al sol.', p: 'cordero:🐑 caracol:🐌 cangrejo:🦀 conejo:🐰 cocodrilo:🐊 cola camisa:👕 cura casa:🏠 cama:🛏️ copa:🏆 corona:👑 cuchara:🥄 cohete:🚀 camello:🐫 caballo:🐴 cometa:🪁 castillo:🏰' },
  { l: 'ce', titulo: 'ce – ci', frase: 'Cepilla tus dientes después de comer.', p: 'circo:🎪 cine:🎬 dulce:🍬 cielo:☁️ cereza:🍒 cebra:🦓 cebolla:🧅 cinco:5️⃣ cisne:🦢 cerdo:🐷 cepillo:🪥 cocina:🍳 Cecilia ciruela' },
  { l: 'ch', frase: 'María Chucena su choza techaba.', p: 'chaqueta:🧥 chile:🌶️ chimpancé:🐒 chinchilla:🐭 chocolate:🍫 chupo:🍼 leche:🥛 noche:🌃 ocho:8️⃣ ducha:🚿 cuchara:🥄 lechuza:🦉 estuche:✏️ choza:🛖 techo:🏠 Pinocho Nacho chitos' },
  { l: 'd', frase: 'Mis deditos gordos, ¿dónde estarán?', p: 'dientes:🦷 dos:2️⃣ delfín:🐬 dinosaurio:🦕 dado:🎲 dedo:☝️ dama doctor:👨‍⚕️ dulce:🍬 dragón:🐉 dona:🍩 diamante:💎 Danilo Camila' },
  { l: 'f', frase: 'En la fiesta de la foca, todos toman café.', p: 'foca:🦭 flores:💐 flamenco:🦩 formas:🔷 frutas:🍎 fiesta:🎉 café:☕ fotos:📷 fresa:🍓 fuego:🔥 fantasma:👻 familia:👨‍👩‍👧 Felipe' },
  { l: 'g', frase: 'En la casa de mi tía, el gato come todo el día.', p: 'ganso:🪿 gallina:🐔 gato:🐱 globo:🎈 granjero:🧑‍🌾 gallo:🐓 gusano:🐛 gorila:🦍 guitarra:🎸 gafas:👓 galleta:🍪 girasol:🌻 gelatina:🍮 tortuga:🐢' },
  { l: 'h', frase: 'Hugo come helado de mora.', p: 'helado:🍦 hogar:🏠 helicóptero:🚁 huevo:🥚 hipopótamo:🦛 hijo Hugo hora Helena hormiga:🐜 hueso:🦴 hospital:🏥 hígado hilo:🧵 cohete:🚀 hoja:🍃 hamaca búho:🦉 hongo:🍄' },
  { l: 'j', frase: 'Juanita tiene un conejo.', p: 'jirafa:🦒 jardín:🏡 jabón:🧼 jugo:🧃 juguetes:🧸 jefe jaula jaguar:🐆 conejo:🐰 oveja:🐑 Juanita Juana Jacinta' },
  { l: 'k', frase: 'Todos quieren ir al kiosco a ver a Kico.', p: 'kayak:🛶 koala:🐨 kimono:👘 karate:🥋 kiwi:🥝 kumis:🥛 kiosco:🏪 kepis karateca:🥋 Kico' },
  { l: 'll', frase: 'La mamá gallina tiene seis pollitos.', p: 'llave:🔑 llama:🦙 lluvia:🌧️ gallina:🐔 pollitos:🐥 silla:🪑 anillo:💍 caballo:🐴 calle:🛣️ olla:🍲 galleta:🍪 cepillo:🪥 castillo:🏰' },
  { l: 'ñ', frase: 'Un día en una piñata un lindo muñeco vi.', p: 'ñame:🍠 ñandú:🦤 ñu:🐃 caña niño:🧒 moña:🎀 sueño:😴 niña:👧 piña:🍍 mañana:🌅 muñeca:🪆 piñata:🪅 araña:🕷️ montaña:⛰️ Ñoño' },
  { l: 'qu', titulo: 'que – qui', frase: 'Aquellos hermosos buques que navegan por los mares.', p: 'queso:🧀 raqueta:🎾 quetzal:🦜 buque:🚢 máquina:🧰 mantequilla:🧈 chaqueta:🧥 esquimal paquete:📦 mosquito:🦟 Raquel querer' },
  { l: 'rr', frase: 'Tengo una marrana puelipuerquita.', p: 'perro:🐶 carro:🚗 tarro marrano:🐷 perrera correa carreta:🛒 corral morral:🎒 zorro:🦊 carrusel:🎠 tierra:🌍 burro:🫏 guitarra:🎸 gorro:🧢' },
  { l: 'v', frase: 'La vaca Violeta en la fiesta bailó.', p: 'vaquero:🤠 violín:🎻 vegetales:🥕 volcán:🌋 vaca:🐮 vaso:🥛 vela:🕯️ velero:⛵ vestido:👗 venado:🦌 avispa:🐝 pavo:🦃 Violeta' },
  { l: 'w', frase: 'Wilson y William juegan waterpolo.', p: 'wapití:🦌 waterpolo:🤽 windsurf:🏄 wafle:🧇 kiwi:🥝 Wilson William Edwin' },
  { l: 'x', frase: 'Todos en un taxi vamos a ver a Félix boxear.', p: 'xilófono:🎼 taxi:🚕 boxeo:🥊 saxofón:🎷 rayos_x:🩻 examen:📝 éxito:🏆 extintor:🧯 Félix' },
  { l: 'y', frase: 'Un rayo cayó y la yegua del susto lloró.', p: 'yate:🛥️ yak:🐂 yoyo:🪀 yegua:🐎 rayo:⚡ yuca:🍠 payaso:🤡 cocuyo rey:🤴 papaya:🥭 yema:🍳 Yiyo' },
  { l: 'z', frase: 'Un zancudo un zapato se comió.', p: 'zorrillo:🦨 zorro:🦊 zapatos:👞 zoológico:🦁 zancudo:🦟 zanahoria:🥕 cabeza:🙆 cereza:🍒 zorra taza:☕ lápiz:✏️ arroz:🍚 maíz:🌽' },
  { l: 'br', titulo: 'br · bl', frase: 'La bruja lleva un sombrero negro.', p: 'bruja:🧙‍♀️ brillo:✨ calambre brebaje:🧪 brusca libreta:📓 breva cabra:🐐 libre libro:📖 sombrero:👒 brazo:💪 blanco:⚪ doble hablar posible noble doblar blando tabla mueble:🛋️ blusa:👚' },
  { l: 'cr', titulo: 'cr · cl', frase: 'Las claras campanas dan su clara voz: tintán.', p: 'cría cuna:🛏️ crimen camisa:👕 cristal crear croar crayola:🖍️ correo:📮 cruz:✝️ cráneo:💀 crema:🧴 cocodrilo:🐊 clavo clavel:🌺 clase:🏫 campana:🔔 clarinete:🎷 bicicleta:🚲' },
  { l: 'dr', titulo: 'dr · tr · tl', frase: 'Sergio ganó el trofeo.', p: 'dragón:🐉 padre madrugón droga madre madrina dromedario:🐪 ladrillo:🧱 padrino ladrón Pedro vidrio piedra:🪨 trenza triste trono trueno:⛈️ trofeo:🏆 tren:🚂 tres:3️⃣ trineo:🛷 atleta:🏃 Atlántico:🌊' },
  { l: 'fr', titulo: 'fr · fl', frase: 'Florencia lleva flores frescas.', p: 'frío:🥶 frasco:🫙 frondoso fríjol:🫘 frutas:🍎 frutero franela frenos fresa:🍓 flores:💐 flaco flamenco:🦩 flauta:🪈 flecha:🏹 Florencia' },
  { l: 'gr', titulo: 'gr · gl', frase: 'El glotón tigre duerme en la jungla.', p: 'grillo:🦗 tigre:🐯 grito mugre grúa:🏗️ glotón jungla:🌴 negras grulla arregla globo:🎈 regla:📏 iglesia:⛪ cangrejo:🦀 granja:🚜' },
  { l: 'pr', titulo: 'pr · pl', frase: 'El soldado Cataplún se ha comido una ciruela.', p: 'prado profesor:👨‍🏫 capricho probar prudente prueba exprimir comprar presa apretar expresa prisa premio:🏆 primo empresa pluma:🪶 plato:🍽️ planta:🪴 playa:🏖️ plátano:🍌 planeta:🪐 Cataplún' },
];

const T_LECTURAS = [
  { titulo: 'Mamita', texto: 'Mamita, mamita,\nme voy a acostar\ny en un sueño mío\nte voy a encontrar.' },
  { titulo: 'La paloma Pepita', texto: 'La paloma Pepita\nse ha comido una perita,\nen la perita había un gusanito\ny se escondió en la orejita de Pepita.' },
  { titulo: 'La mula y la paloma', texto: 'La mula limpia su pelo,\nla paloma se posa en su lomo.\nLa paloma se pasa a su palo\ny deja la mula sola.' },
  { titulo: 'El sol y la luna', texto: 'El sol se quiere casar,\ncasar con la luna,\nla luna dijo que sí,\nel sol se puso feliz.' },
  { titulo: 'Luna lunera', texto: 'Luna, lunera,\ncascabelera,\nojos azules,\nboca morena.\nLuna, lunera,\ncascabelera,\ntoma dos pesitos\npara canela.' },
  { titulo: 'El ratoncito', texto: 'Tic tac, tic tac,\nun ratoncito se sube,\nsube que sube al reloj.\nTic tac, tic tac,\ndan las dos y el ratoncito,\ndel susto al piso, paf, se cayó.' },
  { titulo: 'El ramo de rosas', texto: 'Toma este ramo de rosas,\nes mi regalo de amor;\nsi me regalas tu risa,\nte regalo mi candor.' },
  { titulo: 'Trabalenguas del río', texto: 'En el río se baña el rebaño\ny yo me río del baño\ndel rebaño en el río.' },
  { titulo: 'La bota de Beto', texto: 'La bota de Beto\nse cae del bote\ny una babosa\nen la bota se subió.' },
  { titulo: 'Caracol', texto: 'Caracol, col, col,\nsaca los cuernos al sol,\nque tu papá y tu mamá\ntambién los sacó.' },
  { titulo: 'María Chucena', texto: 'María Chucena su choza techaba.\nUn techador que por allí pasaba le dijo:\nMaría Chucena, ¿techas tu choza o techas la ajena?\nNo techo mi choza ni techo la ajena,\ntecho la choza de María Chucena.' },
  { titulo: 'Mis deditos', texto: 'Mis deditos gordos,\n¿dónde estarán?\n¿Con quién se habrán ido?\n¿Con quién estarán?\nAquí estamos, aquí estamos,\ncuando se saludan\ndándose la mano.' },
  { titulo: 'La fiesta de la foca', texto: 'En la fiesta de la foca,\ntodos toman café.\nFelipe el mono\ntomó fotos y finos confetis rifó.' },
  { titulo: 'El gato de mi tía', texto: 'En la casa de mi tía,\nel gato come todo el día,\nel gallo canta\ny el gusano se levanta.' },
  { titulo: 'Juanita y su conejo', texto: 'Juanita tiene un conejo,\nes el conejo Julio.\nJuana teje un saco de lana para su conejo,\npues la oveja Jacinta le regaló la lana.' },
  { titulo: 'El elefante', texto: 'Es un animal muy grande,\ntiene una nariz muy larga llamada trompa.\nCon su trompa lanza agua\ny derriba muchas ramas para comerlas.' },
  { titulo: 'Los monos', texto: 'Viven en las copas de los árboles,\nson excelentes trepadores.\nUsan sus fuertes brazos\npara balancearse de rama en rama\ny comen frutas.' },
  { titulo: 'La gallina y sus pollitos', texto: 'La mamá gallina\ntiene seis pollitos,\na todos los llama\ncoco, co, co, coco,\ny ellos le contestan\npío, pío, pí.' },
  { titulo: 'La piñata', texto: 'Un día en una piñata\nun lindo muñeco vi,\nlo levanté con cariño\ny a una niña se lo di.' },
  { titulo: 'La marrana', texto: 'Tengo una marrana puelipuerquita\nque tiene hijos puelipuerquitos.\n¿Cómo serán los hijitos puelipuerquitos\nde mi marrana puelipuerquita?' },
  { titulo: 'La vaca alborotada', texto: 'Mi papá tenía una vaca\nque era muy alborotada,\nse bañaba y se peinaba\ny su boquita se pintaba.' },
  { titulo: 'Félix el boxeador', texto: 'Todos en un taxi\nvamos a ver a Félix boxear,\nun xilófono llevamos,\npues como a Félix le gusta,\nasí boxeará mejor.' },
  { titulo: 'El zancudo', texto: 'Un zancudo un zapato se comió,\ncabezón, cabezón le decía la zorra,\ny el zancudo en la cabeza\nun palo de cereza le partió.' },
  { titulo: 'Las campanas', texto: 'Las claras campanas,\nen claras mañanas,\nsu clara voz dan:\ntintán y tintán.' },
  { titulo: 'El león y el ratón', texto: 'Un león dormía y un ratoncito corrió sobre él.\nEl león lo atrapó, pero el ratón le pidió perdón.\nEl león lo dejó ir.\nUn día el león cayó en una red\ny el ratoncito la rompió con sus dientes.\nLos amigos pequeños también ayudan.' },
  { titulo: 'La liebre y la tortuga', texto: 'La liebre decía que era la más rápida.\nLa tortuga la invitó a una carrera.\nLa liebre se durmió debajo de un árbol.\nLa tortuga caminó despacio, sin parar,\ny llegó primero a la meta.' },
  { titulo: 'Chistes', texto: '¿Cuál es el ratón que tiene más dientes?\n¡El ratón Pérez!\n¿Cuál es la fruta más divertida?\n¡La naranja ja ja ja!' },
];

// ---------------------------------------------------------------------
//  Construcción de mazos
// ---------------------------------------------------------------------
// Palabras del banco general que no se usan como extra (abstractas o poco claras para bits)
const NO_EXTRA = new Set('oxígeno oración eclipse energía emoción enojado enseñar examen éxito órgano oficina urna inodoro alien ajedrez estadio espacio estatua equipo amor idea ingeniero impresora indígena emergencia esqueleto ovni mamut mueca moco vampiro fantasma ogro bruja escudo espada'.split(' '));

const sinTilde = (t) => t.toLowerCase().replace(/ñ/g, '\u0001').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\u0001/g, 'ñ');

// Patrones para sílabas especiales y combinaciones (trabadas)
const PATRON = {
  ce: /c[ei]/, qu: /qu[ei]/, gu: /gu[ei]|gü/, ge: /g[ei]/, ch: /ch/, ll: /ll/, rr: /rr/,
  br: /b[rl]/, cr: /c[rl]/, dr: /dr|tr|tl/, fr: /f[rl]/, gr: /g[rl]/, pr: /p[rl]/,
};

// Banco general de lectura: módulos (sin imagen) + vocabulario con y sin imagen
const BANCO = (() => {
  const out = [];
  const vistos = new Set();
  const add = (texto, emoji, fuente) => {
    const k = texto.toLowerCase();
    if (vistos.has(k) || texto.includes(' ') || NO_EXTRA.has(k)) return;
    vistos.add(k);
    out.push({ texto, emoji: emoji || EMOJI[k] || null, fuente, nombre: /^[A-ZÁÉÍÓÚÑ]/.test(texto) });
  };
  for (const w of parse(BANCO_EXTRA)) add(w.texto, null, 'modulo');
  for (const w of PALABRAS_CON_IMAGEN) add(w.texto, w.emoji, 'imagen');
  for (const w of TODAS_LAS_PALABRAS) add(w.texto, w.emoji, 'banco');
  return out;
})();

// Letras que ya conocen en Pre-Jardín (para escoger palabras que pueden leer)
const PJ_LEIBLE = /^[aeioumsplntrbáéíóúü]+$/i;

function encaja(texto, l) {
  const t = sinTilde(texto);
  if (PATRON[l]) return PATRON[l].test(t);
  return t.includes(l);
}
const empieza = (texto, l) => (l.length === 1 ? sinTilde(texto)[0] === l : PATRON[l]?.test(sinTilde(texto).slice(0, 3)));

function mazo(def, i, cfg) {
  const vistos = new Set();
  const palabras = [];
  const push = (w, libro) => {
    const k = w.texto.toLowerCase();
    if (vistos.has(k)) return;
    vistos.add(k);
    palabras.push({ texto: w.texto, emoji: w.emoji || EMOJI[k] || null, letra: def.l.length === 1 ? def.l : null, libro });
  };
  for (const w of parse(def.p)) push(w, true);

  const apta = (w) => w.texto.length <= cfg.maxLen && (!cfg.leible || PJ_LEIBLE.test(w.texto) || w.emoji) && (!w.nombre || w.fuente === 'modulo');
  const fases = [
    (w) => w.fuente === 'modulo' && empieza(w.texto, def.l),
    (w) => w.emoji && empieza(w.texto, def.l),
    (w) => w.fuente === 'modulo' && encaja(w.texto, def.l),
    (w) => empieza(w.texto, def.l),
    (w) => w.emoji && encaja(w.texto, def.l),
    (w) => encaja(w.texto, def.l),
  ];
  for (const f of fases) {
    for (const w of BANCO) {
      if (palabras.length >= cfg.meta) break;
      if (!vistos.has(w.texto.toLowerCase()) && apta(w) && f(w)) push(w, false);
    }
  }
  return {
    letra: def.l,
    titulo: def.titulo || null,
    frase: def.frase,
    tipo: 'aeiou'.includes(def.l) ? 'vocal' : def.titulo?.includes('·') ? 'combinacion' : def.titulo ? 'silaba' : 'consonante',
    color: COLORES[i % COLORES.length],
    palabras,
  };
}

function lecturas(lista) {
  return lista.map((x, i) => ({ id: `lb${i}`, ...x, libro: true }));
}

export const GRADOS = {
  pj: {
    id: 'pj',
    nombre: 'Pre-Jardín',
    corto: 'PJ',
    ingles: 'PreKindergarten',
    edad: '3 a 4 años',
    color: '#E8412C',
    color2: '#FF8A6B',
    icono: '🐣',
    mascota: 'Pollito',
    letras: PJ_LETRAS.map((d, i) => mazo(d, i, { maxLen: 7, meta: 120, leible: true })),
    lecturas: lecturas(PJ_LECTURAS),
    numeros: {
      max: 50,
      puntos: 20,
      ops: ['l5', 'l10'],
      tablas: [],
      bonds: 10,
      temas: 'Números del 0 al 50 · decena · sumas y restas hasta 10 · reloj',
    },
  },
  j: {
    id: 'j',
    nombre: 'Jardín',
    corto: 'J',
    ingles: 'Kindergarten',
    edad: '4 a 5 años',
    color: '#F2A20C',
    color2: '#FFD25E',
    icono: '🦁',
    mascota: 'Leoncito',
    letras: J_LETRAS.map((d, i) => mazo(d, i, { maxLen: 10, meta: 200 })),
    lecturas: lecturas(J_LECTURAS),
    numeros: {
      max: 200,
      puntos: 20,
      ops: ['l10', 'l20', 'l100', 'l2c'],
      tablas: [1, 2, 3],
      bonds: 20,
      temas: 'Números del 0 al 200 · centena · mayor, menor, igual · series de 2 y 5 · tablas del 1 al 3',
    },
  },
  t: {
    id: 't',
    nombre: 'Transición',
    corto: 'T',
    ingles: 'Transition',
    edad: '5 a 6 años',
    color: '#2F8FD8',
    color2: '#7CCBF2',
    icono: '🚀',
    mascota: 'Cohete',
    letras: T_LETRAS.map((d, i) => mazo(d, i, { maxLen: 13, meta: 300 })),
    lecturas: lecturas(T_LECTURAS),
    numeros: {
      max: 10000,
      puntos: 20,
      ops: ['l20', 'l2c', 'lll', 'lpr', 'l1000', 'l10000'],
      tablas: [1, 2, 3, 4, 5, 6],
      bonds: 20,
      temas: 'Números del 0 al 10.000 · sumas llevando · restas prestando · tablas del 1 al 6 · dinero',
    },
  },
};

export const LISTA_GRADOS = [GRADOS.pj, GRADOS.j, GRADOS.t];

// Palabras con imagen de un grado (para juegos de lectura)
const cache = {};
export function vocabGrado(id) {
  if (cache[id]) return cache[id];
  const g = GRADOS[id];
  const vistos = new Set();
  const out = [];
  for (const l of g.letras) {
    for (const p of l.palabras) {
      if (!p.emoji || vistos.has(p.texto) || /[A-Z]/.test(p.texto[0])) continue;
      vistos.add(p.texto);
      out.push({ ...p, letra: l.letra.length === 1 ? l.letra : baseLetter(p.texto[0]) });
    }
  }
  cache[id] = out;
  return out;
}

export function letrasSimples(id) {
  return GRADOS[id].letras.filter((l) => l.letra.length === 1).map((l) => l.letra);
}
