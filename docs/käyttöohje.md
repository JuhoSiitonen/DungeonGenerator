# Käyttöohje

Mikäli sinulla ei ole Node.js ohjelmaa asennettuna, mene sivulle https://nodejs.org/en ja lataa viimeisin LTS versio.

Seuraavaksi kloonaa repositorio koneellesi, navigoi dungeon-generator kansioon ja syötä seuraavat komennot:

**npm install**

**npm run dev**

Viimeisin komento käynnistää ohjelman development version jossa huoneita satunnaisesti luova algoritmi käyttää spesifioitua seed arvoa. Voit sulkea ohjelman painamalla CTRL + C.

Komennolla **npm run prod** voit käynnistää ns tuotantoversion jossa seed arvo ei ole spesifioitu ja luodut luolastot muuttuvat joka iteraatiolla. 

Voit testata ohjelmaa selaimessa (todennäköisesti http://localhost:5173/ mutta saat terminaaliisi linkin varsinaiseen porttiin kun käynnistät ohjelman).

Ohjelmiston testit voi ajaa komennolla 

**npm run test:run**

Testien kattavuusraportin saa komennolla

**npm run test:coverage**