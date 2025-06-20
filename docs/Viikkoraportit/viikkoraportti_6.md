# Viikkoraportti 6 (16-22.6.2025)

Käytetyt tunnit: 12h

1. Mitä olen tehnyt tällä viikolla?
Käyttöliittymän refaktorointi jossa tarpeettomat valinnat poistettiin ja kaikkien reunojen painot lisättiin näkyville. Myös pieniä muutoksia siihen mitä renderöidään missäkin järjestyksessä. Runsaasti aikaa meni erilaisien testausideoiden "testaamiseen" ja implementoimiseen. A* algoritmin testaukseen olen jokseenkin tyytyväinen ja siellä on mielestäni ihan edustaviakin testejä. Aloin myös miettimään triangulaation optimointia. Nyt sen toteutus on aika naiivi versio siitä mitä se voisi olla, joten aloin tutkimaan vaihtoehtoja aikavaativuuden kehittämiselle. 

2. Miten ohjelma on edistynyt?
Ohjelma on edistynyt hyvin, mutta alkuperäiseen määrittelydokumenttiin verrattuna en ehkä lähde kehittämään 3D luolastoa jossa voisi kulkea. Se ei ole tämän ohjelman ydintä, joten keskityn hyvään testaukseen ja triangulaation optimointiin tässä kurssin loppuvaiheilla.

3. Mitä opin tällä viikolla / tänään?
Opin että A* algoritmin heuristiikka funktiot ovat mainio tapa tuoda käyttäjälle valintoja sen suhteen miten halutaan reitittää luolastoa. Tällä hetkellä minulla on L muotoiset reitit (mahdollisimman suorat), manhattan reititys (ei suorin, mutta ei käytä diagonaalisia reittejä) ja viimeisenä diagonaaliset reitit jotka ovat lähimpänä MST reunoja reitiltään. 

Opin myös useamman tavan jolla voisi optimoida Bowyer-Watson algoritmin naiivia versiota jonka olen implementoinut wikipediasta. Yksi tapa on käyttää jotain puurakennetta kuten quad tree, kolmioiden ja pisteiden tehokkaaampaan vertailuun. Toinen tapa olisi luoda adjacency matriisi kolmioista ja kulkea sitä läpi kun tutkitaan josko piste on kolmion sisällä. Yksi toinen tärkeä asia olisi järjestää trianguloitavat pisteet esimerkiksi Hilbert curvella tai Morton codella jotta triangulaatiossa syntyviä turhia kolmioita ei syntyisi niin paljoa. 

4. Mikä jäi epäselväksi tai tuottanut vaikeuksia?
Ei probleemia.

5. Mitä teen seuraavaksi?
Hion testejä, hion testejä, hion testejä. Ja aion vielä hieman kehittää minun Bowyer-Watson algoritmin toteutusta. Nyt algoritmin aikavaatimus on O(n²) mutta yritän saada sitä kohti O(n log n) aikavaatimusta. Tätä varten aion lisätä algoritmin kulussa syntyvät kolmiot adjacency matrix rakenteeseen ja hyödyntää sitä triangulaation nopeuttamiseksi.