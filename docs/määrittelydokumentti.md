# Määrittelydokumentti – Dynaaminen luolaston generointi

## Opinto-ohjelma: Tietojenkäsittelytieteen kandidaatti (TKT)

## 1. Käytettävä ohjelmointikieli

Projektissa käytetään **TypeScriptiä**. Visualisointi toteutetaan web-selaimessa **Three.js**-kirjaston avulla, sivuston muut komponentit **Reactilla**. 

---

## 2. Algoritmit ja tietorakenteet

### Algoritmit:
- **Satunnaisten huoneiden sijoittelu ilman päällekkäisyyksiä**  
- **Delaunay-triangulaatio (Bowyer–Watsonin algoritmi)**  
- **Minimum Spanning Tree (Kruskalin tai Primin algoritmi)**  
- **Käytävien rakentaminen ruudukkoon (esim. A\*-algoritmi)**  

### Tietorakenteet:
- 2D-koordinaatisto (matriisi tai lista huoneista ja käytävistä)
- Graafi huoneiden välisistä yhteyksistä (solmut = huoneet, kaaret = yhteydet)
- Kolmiot (Delaunay) ja reunat (MST)

---

## 3. Ratkaistava ongelma

Ohjelma ratkaisee **luolaston generoinnin ongelman**:

Kuinka luoda satunnainen, yhtenäinen, pelaajan liikkumisen mahdollistava luolasto, joka on rakenteeltaan looginen?

---

## 4. Syötteet ja niiden käyttö

### Käyttäjän syötteet (UI:n kautta):
- Huoneiden määrä ja kokohaarukka?
- Käytettävä algoritmi käytävien rakentamiseen (A* tai suorin yhdistäminen huoneiden välillä?)?
- Seed-arvo (valinnainen, toistettavuutta varten)?
- Mahdollinen "pelaajan liikkuminen" -tila (generointi liikkeen mukana)?

### Käyttö:
Syötteet ohjaavat luolaston generoinnin eri vaiheita ja vaikuttavat luolaston kokoon ja muotoon.

---

## 5. Tavoitteena olevat aika- ja tilavaativuudet

| Osa-alue | Algoritmi | Aikavaativuus | Tilavaativuus |
|----------|-----------|---------------|----------------|
| Huoneiden generointi | Satunnainen + tarkistus | O(n²) (pahimmillaan) | O(n) |
| Delaunay-triangulaatio | Bowyer–Watson | O(n log n) | O(n) |
| MST (Kruskal/Prim) | O(n log n) | O(n) |
| Käytävien rakentaminen | A* tai suora yhdistäminen | O(n) | O(n) |

---

## 6. Lähteet

### Algoritmeihin liittyvät lähteet:
- [Bowyer–Watson (Delaunay triangulaatio)](https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm)
- [Kruskalin algoritmi](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm)
- [Primin algoritmi](https://en.wikipedia.org/wiki/Prim%27s_algorithm)
- [A\* hakualgoritmi](https://en.wikipedia.org/wiki/A*_search_algorithm)

### Yleisiä resursseja:
- [Red Blob Games – Dungeon generation](https://www.redblobgames.com/)
- [Three.js dokumentaatio](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [The Coding Train – Delaunay + Voronoi visualizations](https://www.youtube.com/user/shiffman)

---

## 7. Muut ohjelmointikielet mitä hallitsen
- Python
- Javascript
- C# 
- C++
