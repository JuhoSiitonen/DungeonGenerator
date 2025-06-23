# Toteutusdokumentti

## Yleisrakenne

Ohjelmointikielenä toimii Typescript ja ohjelmisto käyttää React frameworkkiä renderöimään HTML komponentteja selaimeen. Vite toimii serverinä joka kasaa Typescriptistä localhostissa jaettavan frontend ohjelmiston. 

dungeon-generator/src/components kansiossa on ylimmällä tasolla käyttöliittymään liittyvät React componentit jotka tunnistaa .tsx päätteestä.

src/components/algorithms kansiossa on eri algoritmeille omat .ts päätteiset tiedostot ja samannimiset .test.ts tiedostot joissa on Vitest ohjelmaa hyödyntävät yksikkötestit kullekkin algoritmille sekä apufunktioille jotka ovat helpers.ts tiedostossa.

Koska Typescript on vahvasti tyypitetty kieli on /components ja sen alakansioissa pari types.ts tiedostoa josta löytyy eri objektien tyypitykset. 

---

## Miten ohjelma toimii?

Käyttäjä voi valita satunnaisesti generoitavien huoneiden määrän käyttöliittymästä tai asettaa huoneet itse kartaan. Jos käyttäjä asettaa huoneet itse on mahdollista ajautua virhetilanteisiin sillä huoneiden manuaalinen syöttö oli alkuun tarkoitettu vain testausta varten. 

Satunnaisessa huoneiden generoinnissa hyödynnetään SeedRandom kirjastoa ja kun ohjelmaa suoritetaan tuotantomoodissa jokainen generointi tulee eri seed arvosta. Development moodissa ohjelma käyttää yhtä staattista seed arvoa. Satunnaisessa generoinnissa ohjelma yrittää max 100 x valittu huoneiden määrä sijoittaa huoneita karttaan, joten se ei voi jäädä loputtomaan silmukkaan, mutta voi myös olla että kaikkia huoneita ei saada sijoitettua karttaan. Generoidut huoneet tallennetaan tietorakenteeseen josta käy ilmi huoneen leveys ja korkeus sekä keskipisteen koordinaatit.

Seuravaaksi ohjelma toteuttaa Delaunay triangulaation Bowyer Watson algoritmilla, josta tallennetaan tietorakenteeseen luodut kolmiot (kolmen pisteen koordinaatit) ja niiden ympyräkehät (keskipiste ja säde) jotka voidaan piirtää käyttöliittymässä Canvas näkymään. 

Triangulaation perusteella luodaan minimum spanning tree, jota varten triangulaatio muutetaan painotettujen reunojen listaksi ([piste, piste] ja etäisyys) ja Primin algoritmilla tehty MST luo tietorakenteen jossa on lista pisteitä ja puun kokonaispaino (kokonaispituus).

MST:tä käyttäen tehdään A* algoritmilla reititys eri huoneiden välillä, tähän voi käyttäjä vaikuttaa käyttöliittymän valinnoilla, kuten "suorat reitit". 

Kun ohjelma on suorittanut nämä algoritmit käyttöliittymä esittää hieman eri vaiheista muuttaen Canvasin checkbox valintoja, tämän voi ottaa pois käytöstä. 

---

## Puutteet ja parannusehdotukset

Triangulaation testaamiseen tulisi vielä kehittää lisää ja monipuolisempia testejä. Olen jo luonut sitä varten manuaalisen testausympäristön, jonka avulla voisin kehittää uusia trianguloitavia pistejoukkoja.

Huoneiden keskipisteiden visualisointi ei ole oikeasti keskellä huoneita, tämä johtuu siitä että minulla on 80*60 kartta jota skaalataan tileSize arvolla, joka on tällä hetkellä 10. 

Yleisesti ohjelma käyttää paljon apufunktioita toiminnassaan ja se itsessään syö resursseja. Monet apufunktioista voisi toteuttaa suoraan algoritmien yhteyteen, mutta mielestäni koodin luettavuus kärsisi ja varsinkin kun en ole vielä ajautunut suorituksen suhteen pullonkaulaan en ole aikeissa muuttaa tätä lähestymistapaa. 

Delaunay triangulaation nopeuttamiseksi tulisi parantaa toisen luupin toteutusta, eli sitä kun käydään kaikki kolmiot läpi ja tutkitaan kuuluuko nyt iteraatiossa käsiteltävä piste niiden kolmioiden ympyräkehän sisälle. Tähän on olemassa tapoja, mutta ne eivät ole täysin triviaaleja. Yksi nopeutus tähän olisi ensin käsitellä pistejoukko ja järjestää ne spatiaalisesti niin lähekkäin olevat pisteet ovat myös järjestyksessä lähekkäin. Tällä tavoin algoritmin kulun aikana ei luotaisi niin paljon kolmioita joita taas tulisi verrata muiden pisteiden sijaintiin.

Toinen olisi se että tulisi järjestää syntyneet kolmiot esimerkiksi quad tree tietorakenteeseen ja sen avulla tutkia kuuluuko piste kolmioiden ympyräkehän sisään, tällä tavoin O(n) aikaa vievän silmukan voisi typistää parhaimmillaan O(log n) silmukaksi. Toinen vaihtoehto tämän optimoinnin toteuttamiseksi on käyttää läheisyysmatriisia (adjacency matrix) jossa kävellään kolmiosta toiseen ja tutkitaan onko piste 

---

## Saavutetut aika- ja tilavaativuudet

Delaunay triangulaation toteuttavan Bowyer-Watson algoritmin toteutunut aikavaativuus on O(n²). Aikavaativuuden pienentäminen vaatisi sitä että niiden kolmioiden joiden ympyräkehään uusi piste kuuluu, tulisi saada jotenkin järkevästi haarukoitua. Tähän voisi käyttää spatiaalista jaottelua quad tree rakenteella syntyneille kolmioille. Toinen tapa olisi käyttää läheisyysmatriisia (adjacency matrix) tietorakennetta jossa kolmiot ja niiden naapurikolmiot olisivat yhteydessä. Molempiin näistä ratkaisuista olisi hyvä yhdistää trianguloitavien pisteiden järjestäminen siten että lähekkäin olevat pisteet käytäisi järjestyksessä läpi algoritmin silmukassa. 

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


