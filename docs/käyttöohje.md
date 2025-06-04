# Käyttöohje

Mikäli sinulla ei ole Node.js ohjelmaa asennettuna, mene sivulle https://nodejs.org/en ja lataa viimeisin LTS versio.

Seuraavaksi kloonaa repositorio koneellesi, navigoi dungeon-generator kansioon ja syötä seuraavat komennot:

**npm install**

**npm run dev**

Edellinen komento käynnistää ohjelmiston kehitysversion, "tuotantoversion" voi käynnistää komennolla:

**npm run prod**

Jonka jälkeen voit testata ohjelmaa selaimessa (todennäköisesti http://localhost:5173/ mutta saat terminaaliisi linkin varsinaiseen porttiin kun käynnistät ohjelman).

Ohjelmiston testit voi ajaa komennolla 

**npm run test:run**

Testien kattavuusraportin saa komennolla

**npm run test:coverage**