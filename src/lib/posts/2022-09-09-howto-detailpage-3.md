---
slug: 2022-09-09-tutorial-telraam-detailpage-3
title: Hoe werkt telraam, de detailpagina van je straat (deel 3)?
date: 2022-09-09
author: davy
banner: tutorial_detail_3_9.png
excerpt: 'In deze post leggen we uit welke gegevens en grafieken je ziet en hoe je deze moet interpreteren'
tags: ['meten']
---

<script>
  import Image from "$lib/components/Image.svelte";
</script>

In deze post leggen we uit welke gegevens en grafieken je ziet en hoe je deze moet interpreteren. Om dit goed te snappen scrollen we even helemaal onderin de pagina bij het tabblad data (zie vorige post). Daar zie je volgende gegevens:

<Image
  filename="tutorial_detail_3_1.png"
  alt="Weergave Telraam website met detecteerbaarheid voor de geslecteerde straat"
  width=900px
  floatClass=""
/>

We zitten nog steeds in de Mimosastraat. Je ziet hier dat het telraam zowel aan de huiszijde (waar het telraam hangt) als aan de overkant van de straat alles meet. Er staan telkens vinkjes bij auto’s, fietsers en voetgangers. Dit is belangrijke informatie. We vergelijken even met een andere straat:

<Image
  filename="tutorial_detail_3_2.png"
  alt="Weergave Telraam website met detecteerbaarheid voor een strat waarbij voetgangers aan huiszijde niet gemeten worden."
  width=900px
  floatClass=""
/>

Hier zie je een kruisje bij ‘voetgangers huiszijde’. Dat betekent dat de voetgangers die aan de kant van het huis passeren NIET gemeten worden. Een deel van de passages is niet geregistreerd en dit vervormt de resultaten. Het aantal voetgangers in deze straat ligt dus hoger dan wat er gemeten wordt.

Maar terug naar de Mimosastraat en terug naar boven. Het eerste gegegensveld is ‘overzicht per dag’


<Image
  filename="tutorial_detail_3_3.png"
  alt="Grafiek Telraam website met passage per dag voor geselecteerde periode in een stacked barchart."
  width=900px
  floatClass=""
/>

Hier zie je voor de periode die je instelde  in de datumvelden (zie vorige post) de verdeling van de passage per dag. De kleur toont telkens de verhouding tussen voetgangers, fietsers, auto’s en grote voertuigen. Vrij simpel. Zet je je cursor op een balk, dan krijg je de cijfers voor die dag (wel eerst even klikken in de grafiek)

Volgende veld is detailoverzicht:

<Image
  filename="tutorial_detail_3_4.png"
  alt="Grafiek Telraam website met passage per uur voor geselecteerde periode in een gegroepeerde stacked barchart."
  width=900px
  floatClass=""
/>

Hier zie je de balkjes per uur per dag. Soms staan die transparant. Dat betekent dat de data mogelijk verstoord is. In bovenstaand voorbeeld heeft dit heel waarschijnlijk te maken met de weerspiegeling van de zon in het vensterglas. Ook hier kan je na even te klikken in de grafiek per uur de cijfers oproepen wanneer je met je cursor op het balkje gaat staan. Nog even meegeven dat een transparant balkje niet altijd betekent dat de data niet kloppen. In het voorbeeld zie je dat de data niet afwijkend zijn van deze op andere dagen. Dus de meting is zeker aanvaardbaar.

Volgende vak is nog interessanter:

<Image
  filename="tutorial_detail_3_5.png"
  alt="Grafiek Telraam website met passage per uur voor geselecteerde periode en optie om weekend te vergelijken met weekdagen en optie 'alle dagen' actief in een lijnengrafiek."
  width=900px
  floatClass=""
/>

Hier zie je verschillende tabs om je metingen per uur te interpreteren. In de eerste tab zie je dus voor de gekozen periode het gemiddelde over 24 uur (hier dus voor periode 17 juli tem 01 aug). Je ziet de pieken en dalen voor de verschillende verplaatsingstypes.

Je kan dat vervolgens ook doen voor enkel weekdagen of weekenddagen. De laatste optie tonen we hieronder: week vs weekend

<Image
  filename="tutorial_detail_3_6.png"
  alt="Grafiek Telraam website met passage per uur voor geselecteerde periode en optie om weekend te vergelijken met weekdagen en optie 'weekdagen vs weekend' actief in een lijnengrafiek."
  width=900px
  floatClass=""
/>

Een ietwat complexe grafiek, maar je ziet wel duidelijk het verschil week/weekend voor de verschillende verplaatsingstypes en waar de pieken en dalen liggen. Hier in het voorbeeld: tussen 11 en 12 zijn er bijna dubbel zoveel fietsers in de weekends dan op weekdagen.

De grafiek daaronder toont de gemiddelde sneheid voor auto’s in blokken van 10km/uur. Ook hier is dat een gemiddelde genomen over de ingestelde periode in het datumblok bovenin.

<Image
  filename="tutorial_detail_3_7.png"
  alt="Grafiek Telraam website met percentage auto's met bepaalde gemiddelde sneheid in blokken van 10km/uur in een barchart."
  width=900px
  floatClass=""
/>

Er wordt hier wel gemeld dat er een foutenmarge van 10% is. Het loont ook de moeite om op het linkje onder de grafiek te klikken voor meer uitleg. Daar staat netjes uitgelegd hoe je deze data mag lezen. In bovenstaand voorbeeld zien we dat in een straat met snelheidsbeperking 30 km/uur toch een aanzienlijk deel sneller rijdt. In de meetperiode passeerden ongeveer 7000 auto’s. Als je over het balkje van 70+ zou gaan, dan zou je lezen dat er 2,78% meer dan 70 rijdt. Dat zijn toch een bijna 200 auto’s die ferm in overtreding gingen (maar alweer: deze meting is niet exact). 7% rijdt meer dan 40 dat zijn toch 490 auto’s op een totaal van 7000 in een periode van veertien dagen.

Onder deze tabel staat een grafiek waar de V85 snelheid aangegeven is per uur. Nog even herhalen. Dit betekent dat 85% van de bestuurders maximaal die snelheid haalden, 15% reed sneller.

<Image
  filename="tutorial_detail_3_8.png"
  alt="Weergave Telraam website met snelheid die 85% van de bestuurders maximaal haalden in een barchart."
  width=900px
  floatClass=""
/>

De grafiek toont dat er toch gemiddeld pieken zijn die boven de 30 km per uur liggen.

We zijn bijna aan het eind gekomen. De voorlaatste grafiek toont de passage op basis van de rijrichting. Hiervoor verwijzen we nog even naar de bovenkant van de pagina. Daar zie je aan de hand van de cijfers A en B op de kaart hoe je de cijfers moet interpeteren. In het voorbeeld van de Mimosastraat is duidelijk dat er meer wagens richting van Beverenplein rijden dan omgekeerd.

<Image
  filename="tutorial_detail_3_9.png"
  alt="Weergave Telraam website met de passage op basis van de rijrichting in een gestapelde barchart."
  width=900px
  floatClass=""
/>

De allerlaatste grafiek toont de verhouding tussen de verschillende verplaatsingstypes. Voor dit voorbeeld is dit vrij evenwichtig. Licht overwicht voor fietsers en voetgangers tov auto’s en grote voertuigen.

<Image
  filename="tutorial_detail_3_10.png"
  alt="Weergave Telraam website met verhouding tussen de verschillende verplaatsingstypes in een taartdiagram."
  width=400px
  floatClass=""
/>