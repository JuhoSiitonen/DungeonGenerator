
# Testausdokumentti

## Testausvälineet
Testaukseen käytetään Vitest ohjelmistoa jolla tehdään yksikkötestejä ja tutkitaan testikattavuutta.

## Mitä testataan
Jotta testaaminen olisi mielekästä, olen yrittänyt jakaa ohjelmiston koodin useisiin pieniin funktioihin, joiden toimintaa on helppo testata. Ohjelma yrittää luoda käyttäjän syötteen mukaisen määrän huoneita satunnaisiin sijainteihin "kartalle". Satunnaisuuden poistamiseksi testauksesta käytetään SeedRandom kirjastoa ja sitä kautta syötetään seed arvo testauksessa. 
Tärkein olisi testata kaikkia luotuja algoritmeja ja niiden osioita yksitellen. 

Käyttöliittymän testaus, ei ole vielä mukana suunnitelmissa, mutta Playwright tai Cypress olisi helppo lisätä tähän jotta käyttöliittymää voisi testata. Käyttöliittymän React komponentit on rajattu pois testauksesta, mutta kaikki mahdollinen logiikka jonka pystyi irroittamaan käyttöliittymä komponenteista on yksikkötestauksen piirissä. 

### Delaunay triangulaation testaus
Triangulaation testauksessa hyödynsin tunnettua kaavaa triangulaatiossa syntyvien kolmioiden määrän laskemiselle

**Kolmioiden määrä = 2n - 2 - k (jossa n on kaikkien reittipisteiden määrä ja k on konveksisen hilan reunapisteiden määrä)**

Esimerkkinä pisteet jotka muodostavat neliön, näille triangulaatio muodostaisi (2*4 -2 -4 = 2) kaksi kolmioa.
Jos "neliön" sisällä olisi vielä yksi piste, laskukaavan mukaan saataisi kolmioiden määräksi (2*5 -2 -4 = 4) neljä.
Hahmottelin paperille parin eri triangulaation konveksisen hilan pisteet, sekä joitain hilan sisään jääviä pisteitä ja laskin testeihin laskukaavalla oikeat vastaukset. Näihin kuuluu myös selkeä kolmen pisteen muodostaman kolmion triangulaatiossa muodostuva yksi kolmio. 

Triangulaation suhteen testataan myös että kaikki annetut huoneet ovat triangulaation lopputuloksessa mukana eikä lopputulokseen ole päätynyt algoritmin alussa käytettävän superkolmion pisteitä. 

## Miten testataan
Ohjelmiston testit voi ajaa komennolla 

**npm run test:run**

Testien kattavuusraportin saa komennolla

**npm run test:coverage**

Komento luo kansion coverage jonka sisältä src/index saa kattavuusraportin näkyviin.



## Testauskattavuus
[Testauskattavuus](image.png)

