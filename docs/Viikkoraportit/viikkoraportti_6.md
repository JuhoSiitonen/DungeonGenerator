# Viikkoraportti 6 (16-22.6.2025)

Käytetyt tunnit: 10h

1. Mitä olen tehnyt tällä viikolla?
Käyttöliittymän refaktorointi jossa tarpeettomat valinnat poistettiin ja kaikkien reunojen painot lisättiin näkyville. Myös pieniä muutoksia siihen mitä renderöidään missäkin järjestyksessä. Runsaasti aikaa meni erilaisien testausideoiden "testaamiseen" ja implementoimiseen. A* algoritmin testaukseen olen jokseenkin tyytyväinen ja siellä on mielestäni ihan edustaviakin testejä.

2. Miten ohjelma on edistynyt?
Ohjelma on edistynyt hyvin, mutta alkuperäiseen määrittelydokumenttiin verrattuna en ehkä lähde kehittämään 3D luolastoa jossa voisi kulkea. Se ei ole tämän ohjelman ydintä, joten keskityn hyvään testaukseen tässä kurssin loppuvaiheilla ja myös siihen että ohjelman käyttöliittymä tarjoaa mahdollisimman monipuoliset valinnat vaikuttaa luolaston generointiin. 

3. Mitä opin tällä viikolla / tänään?
Opin että A* algoritmin heuristiikka funktiot ovat mainio tapa tuoda käyttäjälle valintoja sen suhteen miten halutaan reitittää luolastoa. Tällä hetkellä minulla on L muotoiset reitit (mahdollisimman suorat), manhattan reititys (ei suorin, mutta ei käytä diagonaalisia reittejä) ja viimeisenä diagonaaliset reitit jotka ovat lähimpänä MST reunoja reitiltään. 

4. Mikä jäi epäselväksi tai tuottanut vaikeuksia?
Ei probleemia. 

5. Mitä teen seuraavaksi?
Hion testejä, hion testejä, hion testejä. Ja keksin vielä jotain joka esittäisi vielä paremmin visuaalisesti sen mitä tässä ohjelmassa oikein tapahtuu, sillä siitä oli vertaisarvioinnissa hieman kommenttia. Toki olen jo tehnyt sen suhteen paljon parannuksia, mutta se voisi olla vielä hieman parempi. 