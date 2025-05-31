
# Testausdokumentti

## Testausvälineet
Testaukseen käytetään Vitest ohjelmistoa jolla tehdään yksikkötestejä ja tutkitaan testikattavuutta.

## Mitä testataan
Jotta testaaminen olisi mielekästä, olen yrittänyt jakaa ohjelmiston koodin useisiin pieniin funktioihin, joiden toimintaa on helppo testata. Ohjelma yrittää luoda käyttäjän syötteen mukaisen määrän huoneita satunnaisiin sijainteihin "kartalle". Satunnaisuuden poistamiseksi testauksesta käytetään SeedRandom kirjastoa ja sitä kautta syötetään seed arvo testauksessa. 
Tärkein olisi testata kaikkia luotuja algoritmeja ja niiden osioita yksitellen. 

Käyttöliittymän testaus, ei ole vielä mukana suunnitelmissa, mutta Playwright tai Cypress olisi helppo lisätä tähän jotta käyttöliittymää voisi testata. 

## Miten testataan
Ohjelmiston testit voi ajaa komennolla 
**npm run test:run**
Testien kattavuusraportin saa komennolla
**npm run test:coverage**

## Testauskattavuus
[Testauskattavuus](image.png)

