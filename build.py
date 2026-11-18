# Buduje index.html z src.html: znak Wylinki (oficjalny fragment) + karty produktow.
# Ceny i dostepnosc z aquaholm.pl (WooCommerce Store API), sprawdzone 18.11.2026.
import html as H
s = open('src.html', encoding='utf-8').read()
s = s.replace('{{BADGE_STYLE}}', open('badge_style.part', encoding='utf-8').read().replace('<style>', '').replace('</style>', ''))
s = s.replace('{{BADGE_LINK}}', open('badge_link.part', encoding='utf-8').read().strip())

ZAM = ('zam', 'Na zamówienie, realizacja 30 dni')
JEST = ('jest', 'Dostępna')
BRAK = ('brak', 'Brak w magazynie')

WANNY = [
    ('w8008', 4, 'Wanna A9008 Premium Line', '180 x 120 x 58 cm, dysze obrotowe, podgrzewacz wody, wodospad, Bluetooth, pilot', '7 490', '11 900', ZAM, 'Biała prostokątna wanna z hydromasażem A9008 z podświetleniem LED'),
    ('w8008c', 4, 'Czarna wanna A9008C Premium Line', '180 x 120 x 59 cm, dysze obrotowe, podgrzewacz wody, wodospad, Bluetooth, pilot', '7 490', '11 900', ZAM, 'Czarna prostokątna wanna z hydromasażem A9008C z podświetleniem LED'),
    ('w9011', 3, 'Wanna narożna A9011 Premium Line', '150 x 150 x 58 cm, Bluetooth, podgrzewacz wody, USB, pilot', '7 490', '11 900', JEST, 'Narożna wanna z hydromasażem A9011 z zielonym podświetleniem'),
    ('w9001', 4, 'Wanna A9001 Premium Line', '170 x 78 x 60 cm, dysze obrotowe, podgrzewacz wody, wodospad, Bluetooth, pilot', '6 990', '11 250', ZAM, 'Prostokątna wanna z hydromasażem A9001 z kolorowym podświetleniem'),
    ('w9014', 4, 'Wanna A9014 Premium Line', '170 x 80 x 58 cm, dysze obrotowe, podgrzewacz wody, wodospad, Bluetooth, pilot', '6 990', '10 900', JEST, 'Wanna z hydromasażem A9014 z przeszkloną ścianką i niebieskim podświetleniem'),
]
BIEZNIE = [
    ('b8000', 2, 'Bieżnia APV8000 Futura Prestige', 'silnik 6 KM (10 KM szczytowo), pas 145 x 58 cm, ekran Android 15,6", do 180 kg', '4 990', '7 290', ZAM, 'Bieżnia elektryczna APVsport APV8000 z dużym ekranem'),
    ('b8000k', 2, 'Bieżnia APV8000 Futura Prestige, wersja komercyjna', 'silnik 6 KM, pas biegowy 145 x 58 cm', '5 590', '8 990', ZAM, 'Bieżnia elektryczna APVsport APV8000 w wersji komercyjnej'),
    ('b6000', 3, 'Bieżnia APV6000 z wyposażeniem', 'ekran Android 10,1", pas 135 x 48 cm, masażer, hantle, brzuszki, mata', '6 490', None, BRAK, 'Bieżnia elektryczna APVsport APV6000'),
    ('b900', 3, 'Bieżnia APV900 S', 'ekran LCD, pas biegowy 130 x 38 cm', '3 985', None, BRAK, 'Bieżnia elektryczna APVsport APV900 S'),
    ('pas', 1, 'Pas piersiowy telemetryczny', 'pomiar tętna, wynik na ekranie bieżni APV8000', '125', '139', JEST, 'Pas piersiowy do pomiaru tętna'),
]

def karta(k, n, nazwa, opis, cena, stara, dost, alt, duzy):
    w1, w2 = (600, 1200) if duzy else (600, 1000)
    zd = []
    for i in range(1, n + 1):
        lazy = 'loading="lazy" decoding="async"'
        zd.append(f'<button class="zd" type="button" data-lb="img/{k}-{i}-{w2}.webp" aria-label="Powiększ zdjęcie {i} z {n}">'
                  f'<img {"src" if i == 1 else "data-src"}="img/{k}-{i}-{w1}.webp" width="600" height="450" {lazy} alt="{H.escape(alt)}{"" if i == 1 else f", zdjęcie {i}"}"></button>')
    kropki = ''.join(f'<i{" class=on" if i == 0 else ""}></i>' for i in range(n)) if n > 1 else ''
    strz = '<span class="gs"><button type="button" class="gp" aria-label="Poprzednie zdjęcie"></button><button type="button" class="gn" aria-label="Następne zdjęcie"></button></span>' if n > 1 else ''
    st = f'<s>{stara} zł</s>' if stara else ''
    kup = '<button type="button" class="dok" data-kosz>Dodaj do koszyka</button>' if dost[0] != 'brak' else '<a class="dok pyt" href="#kontakt">Zapytaj o termin</a>'
    return (f'<article class="prod">\n  <div class="gal" data-grupa><div class="gt">{"".join(zd)}</div>{strz}<div class="kr" aria-hidden="true">{kropki}</div></div>\n'
            f'  <div class="pin"><h3>{H.escape(nazwa)}</h3><p class="po">{H.escape(opis)}</p>\n'
            f'  <p class="dost {dost[0]}"><span class="b" aria-hidden="true"></span>{dost[1]}</p>\n'
            f'  <p class="cena"><b>{cena} zł</b>{st}</p>{kup}</div>\n</article>')

s = s.replace('{{WANNY}}', '\n'.join(karta(*x, True) for x in WANNY))
s = s.replace('{{BIEZNIE}}', '\n'.join(karta(*x, False) for x in BIEZNIE))
assert '{{' not in s
open('index.html', 'w', encoding='utf-8').write(s)
print('ok', len(s))
