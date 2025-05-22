# Viikkoraportti 2 (19-25.5.2025)

Käytetyt tunnit: 8h

1. Mitä olen tehnyt tällä viikolla?
Lähdin tutkimaan Watson-Bowyer algoritmia Delaunay triangulaatiolle ja implementoin ensimmäisiä askeleita siitä.
Selvitin miten saisin laskettua kolmion "circumcircle" ympyrän, eli ympyrän jonka kehä koskee kolmion kaikkia kulmia, sillä se on yksi ensimmäisistä vaatimuksista algoritmin toiminnalle. Ongelmia tuottaa HTML Canvas elementin eroavuus karteesisista koordinaateista, joilla laskemiseen suurin osa käyttämistäni lähteistä nojaa. Ympyrän laskeminen ei vielä toimi oikein, mutta huomasin myös toisen Reactin toimintalogiikkaan liittyvän virheen ohjelmistossani, joten yritin korjata sitä jotta se ei aiheuttaisi jatkossa virheitä. Tällä viikolla minulla ei ollut paljoa aikaa tälle projektille töiden ja muiden velvollisuuksien ohella, mutta toivon mukaan ensi viikolla pääsen toden teolla hommiin.

2. Miten ohjelma on edistynyt?
Edistys on vielä aika pientä, mutta kehitysympäristö on valmis ja tiedän askelmerkit mitä tulen tekemään. Delaunay triangulaation toteuttamisessa olen ottanut ensimmäisiä pieniä askelia, ja myös sen visualisoinnissa käyttäjälle HTML Canvas elementillä 2D. 

3. Mitä opin tällä viikolla / tänään?
Opin miten kolmion kulmat kehällään sisältävän ympyrän voi laskea eri tavoin, ja opin myös hieman siitä miten Delaunay triangulaatio toimii. En voi vielä sanoa että täysin ymmärtäisin sitä miksi se toimii, mutta ymmärrän enemmän kuin viime viikolla.

4. Mikä jäi epäselväksi tai tuottanut vaikeuksia?
HTML Canvas koordinaatiston Y-akseli on väärinpäin verrattuna karteesiseen koordinaatistoon, kuten muissa tietokonegrafiikka ohjelmissa. Se hankaloittaa perus geometrisia laskutoimituksia, mutta se ei ole mitenkään ylitsepääsemätön pulma. Projektille annettavan ajan vähyys tällä viikolla on suurempi huolenaihe. 

5. Mitä teen seuraavaksi?
Korjaan ympyrän keskipisteen ja säteen laskevan funktion bugit ja siirryn seuraavaan vaiheeseen algoritmin toteutusta. Toteutan samalla myös joka askeleeelle visualisoinnin ja aloitan myös alkeellisen testauksen. 
