# Toteutusdokumentti

## Yleisrakenne

Ohjelmointikielenä toimii Typescript ja ohjelmisto käyttää React frameworkkiä renderöimään HTML komponentteja selaimeen. Vite toimii serverinä joka kasaa Typescriptistä localhostissa jaettavan frontend ohjelmiston. 

dungeon-generator/src/components kansiossa on ylimmällä tasolla käyttöliittymään liittyvät React componentit jotka tunnistaa .tsx päätteestä.

src/components/algorithms kansiossa on eri algoritmeille omat .ts päätteiset tiedostot ja samannimiset .test.ts tiedostot joissa on Vitest ohjelmaa hyödyntävät yksikkötestit kullekkin algoritmille sekä apufunktioille jotka ovat helpers.ts tiedostossa.

Koska Typescript on vahvasti tyypitetty kieli on /components ja sen alakansioissa pari types.ts tiedostoa josta löytyy eri objektien tyypitykset. 

---

## Puutteet ja parannusehdotukset

Tällä hetkellä jos jotkin kolme pistettä muodostavat suoran linjan ohjelma nostaa siitä virheilmoituksen. 

Triangulaation testaamiseen tulisi vielä kehittää lisää ja monipuolisempia testejä. Olen jo luonut sitä varten manuaalisen testausympäristön, jonka avulla voisin kehittää uusia trianguloitavia pistejoukkoja.

Huoneiden keskipisteiden visualisointi ei ole oikeasti keskellä huoneita, tämä johtuu siitä että minulla on 80*60 kartta jota skaalataan tileSize arvolla, joka on tällä hetkellä 10. 

Sivuston visuaalinen ilme on vielä aivan kesken (toki hieman toissijainen asia, mutta harmittaa minua). Sivusto ei ole internetin kautta saatavilla (myös täysin toissijainen asia, mutta mahdollisesti saan tämän nettiinkin testattavaksi).

Kartan koko käyttäjän syötteenä? Kartan skaalaus (tileSize) käyttäjältä? 

MST visualisoinnissa reunojen painot voisi helpottaa MST:n toteamisessa.

---

## Saavutetut aika- ja tilavaativuudet



---

## Lähteet

https://en.wikipedia.org/wiki/Delaunay_triangulation

https://gwlucastrig.github.io/TinfourDocs/DelaunayIntro/index.html

https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm

https://en.wikipedia.org/wiki/Prim%27s_algorithm

https://en.wikipedia.org/wiki/Breadth-first_search

https://en.wikipedia.org/wiki/Circumcircle

https://en.wikipedia.org/wiki/A*_search_algorithm

https://www.redblobgames.com/pathfinding/a-star/introduction.html

https://en.wikipedia.org/wiki/Taxicab_geometry

---

## Tekoälyn käyttö

### Ohjelmiston tekemisessä tekoälyä on käytetty seuraavasti

- ChatGPT GPT-4o mallia hyödynnettiin Delaunay triangulaation ymmärtämisessä. Miksi sitä tarvitaan, mitä se tekee, miksi se on hyvä tässä asiassa.


