# Design Package: Khabir Diagnostic Auto Pro (خبير داياغنوستيك أوتو برو)

Tier 1, single journey. Real business, generated imagery, real photos to be swapped in later (no AI disclosure).
Languages: FR (default), AR (RTL), EN, with a switch. French copy below is the master; AR and EN are authored translations in the build's dictionary, same meaning, same rhythm.

## 1. Brand premise

**Diagnose, don't guess.** "Khabir" means the expert. Owners of German cars arrive after paying for guesses: parts swapped, codes cleared, the warning light back a week later. Khabir connects the right tool, tests each system, proves the fault, and only then repairs. Every section teaches and sells that one idea: the real fault, found and proven.

## 2. Palette (user brand orange leads)

```css
:root{
  --canvas:#0E1518;        /* graphite-petrol, the workshop at night */
  --panel:#162126;         /* steel panels, cards */
  --panel-2:#1C2A30;
  --accent:#FF6B00;        /* Khabir orange: CTAs, scan line, key highlights, interactive */
  --accent-hover:#FF8A33;
  --accent-muted:rgba(255,107,0,.22);
  --fault:#FF3B30;         /* ONLY the detected fault */
  --ok:#5FD49A;            /* system-pass ticks, whisper only */
  --text-secondary:#9DADB3;
  --text-primary:#ECF1F2;
}
```
Final values re-sampled from the approved footage after the video gate.
Note: dark canvas + orange is the user's own brand identity (explicit brief), not a default reach. Kept clear of the cliché by the petrol tint, a condensed technical sans (no serif), and the instrument-cluster signature.

## 3. Type

- Display (Latin): **Saira Condensed** 600, 700
- Display (Arabic): **Alexandria** 600, 700
- Body (AR + Latin): **Readex Pro** 300, 400, 500
- Mono (codes, readouts): **IBM Plex Mono** 400, 500

## 4. Band map (hero ~480vh; ranges are starting points for the flick test)

| Band | Range | Footage moment | Copy (verbatim, FR) | Entrance |
|---|---|---|---|---|
| 1 Problem | 0.00 to 0.22 | Dark sedan at rest, orange line glowing above the roof | Kicker: "Diagnostic électronique · voitures allemandes" / H: "Le voyant revient. Encore." / Sub: "Pièces changées, code effacé. La panne, elle, est toujours là." | Dashboard flicker-on: characters light up in seeded steps like warning lamps (load ramp on band 1) |
| 2 Scan | 0.25 to 0.47 | Line descends over roof and pillars, wiring glows briefly under the body | H: "Ici, on ne devine pas." / Sub: "On branche. On scanne. On lit ce que la voiture dit vraiment." | Drift-down, word by word, following the descending line |
| 3 Analysis | 0.50 to 0.73 | Line crosses doors, engine bay, then the underbody exhaust line; modules and sensors glint | H: "Chaque système. Testé un par un." + HUD chip (signature): MOTEUR ✓ · TRANSMISSION ✓ · AIRBAG ✓ · ABS / ESP ✓ · ADBLUE / SCR … (isolating: Dosage AdBlue ✓ · Capteur NOx amont ✓ · Capteur NOx aval ✗) | Grid snap-align in reading order; HUD rows tick in as progress passes them |
| 4 Fault found (settle) | 0.76 to 1.00 | Line reaches the floor; one red point pulses under the car at the SCR catalyst (underbody, between the wheels, slightly rear of center); scene at rest | Pulse ring + chip over the fault: "P20EE · Efficacité catalyseur SCR (NOx) insuffisante" / small mono line: "NOx aval 412 ppm · seuil 120 ppm" / H: "La vraie panne. Trouvée." / Sub: "Mercedes, BMW, Audi, Volkswagen, Porsche. Diagnostic spécialisé à Beni Mellal." / CTA: "Diagnostiquer ma voiture" (WhatsApp) | Word-punch with overshoot on "Trouvée.", then staged settle: sub, then CTA row |

System labels, pulse ring, and fault code are HTML/SVG overlays scrubbed by scroll, never in the footage (no-text law). Overlay anchor is set from the approved ending frame's real fault-glow position.

## 5. Static hero (phones, reduced motion)

Over the ending frame: chip "P20EE · Efficacité catalyseur SCR (NOx) insuffisante", H: "La vraie panne. Trouvée.", Sub: "Diagnostic électronique spécialisé pour voitures allemandes, à Beni Mellal. On teste, on prouve, puis on répare.", CTA: "Diagnostiquer ma voiture".

## 6. Below the fold (all funnels to #rdv, WhatsApp)

1. **Le problème** (split layout, big quote lines)
   Kicker "Ça vous parle ?" / H: "Vous avez déjà payé pour deviner."
   - "On a changé le capteur. Puis le faisceau. Le voyant est revenu."
   - "Le garage a effacé le code. Trois jours plus tard, rebelote."
   - "Personne n'a pu me dire ce qui ne va pas, vraiment."
   Close: "Une voiture allemande parle. Il faut juste le bon outil pour l'écouter."
2. **La méthode** (3 steps, 3 images, horizontal timeline)
   H: "Tester. Prouver. Réparer."
   01 Brancher: "On se connecte à tous les calculateurs avec des outils de diagnostic dédiés aux marques allemandes, pas une simple valise générique."
   02 Mesurer: "Codes défaut, données en direct, tests de circuits. On vérifie le signal, pas seulement le message."
   03 Prouver: "On vous montre le défaut et la cause. Devis écrit avant toute réparation."
3. **Interactive moment** (instrument panel)
   H: "Essayez. Lancez le diagnostic." / hint: "Maintenez le bouton appuyé" / button "Maintenir pour scanner"
   Modules tick: Moteur, Transmission, ABS / ESP, Airbag, Climatisation, Direction, then AdBlue / SCR → isolates Dosage ✓, NOx amont ✓, NOx aval ✗ → lands on P20EE. Result line: "Défaut isolé : capteur NOx aval. Pas un catalyseur changé au hasard."
4. **Ce qu'on diagnostique** (asymmetric grid of 6)
   H: "Toute l'électronique de votre voiture."
   Moteur & calculateur, Boîte automatique (DSG, 7G-Tronic, ZF), ABS · ESP · freinage, Airbag & sécurité, Électricité & réseau CAN, Codage & programmation (remplacement de calculateur, adaptation).
   Brand strip (text only): Mercedes-Benz · BMW · Audi · Volkswagen · Porsche · Mini · Skoda · Seat
5. **Nos engagements** (4 promises, numbered)
   H: "Effacer n'est pas réparer."
   "Vous voyez les codes." / "Devis écrit avant travaux." / "Aucune pièce sans preuve." / "On vous explique, simplement."
6. **FAQ**
   - "Le garage a déjà changé des pièces. Vous pouvez trouver ?" Oui. C'est notre cas le plus fréquent. On repart de zéro, avec des mesures, pas des suppositions.
   - "Combien coûte un diagnostic ?" Le prix est annoncé avant le branchement. Écrivez-nous sur WhatsApp avec le modèle et le souci, on vous répond avec un tarif clair.
   - "Vous avez les bons logiciels pour ma marque ?" On travaille avec des outils de diagnostic dédiés aux marques allemandes, capables de lire tous les calculateurs et de coder les pièces remplacées.
   - "Ça prend combien de temps ?" Un diagnostic complet prend en général moins d'une heure. Les pannes intermittentes peuvent demander un essai routier.
   - "Mon voyant s'est éteint tout seul. Je dois venir ?" Oui, le défaut reste en mémoire. Mieux vaut le lire avant qu'il ne revienne au mauvais moment.
7. **Final CTA** (#rdv)
   H: "Votre voiture a quelque chose à dire."
   Sub: "Envoyez le modèle et le symptôme sur WhatsApp. On vous répond avec un créneau et un prix."
   CTA "Diagnostiquer ma voiture" (wa.me link, prefilled: "Bonjour Khabir, j'ai une [modèle] avec le problème suivant : ")
   Info: address Beni Mellal, hours, phone (to confirm with owner).
8. **Footer**: name FR + AR, city, WhatsApp, © year. No disclosure line (owner will swap in real photos).

Form handling: no form. WhatsApp deep link is the single CTA (a real lead channel).

## 7. Vector layer

- Fixed background: slow-drifting faint circuit-trace grid + grain, 90s cycle.
- Self-drawing orange trace lines that connect section to section (a "wire" running down the page, drawing on scroll).
- Section dividers: oscilloscope waveform SVG, drawn on entrance.
- Whisper particles: dust in workshop light in the CTA section.
- Living element per section: waveform pulse, HUD caret blink, step-number glow, promise ticks.
All reduced-motion aware: final states shown, drives stopped.

## 8. Engineering list

Blob fetch with loading ring (streamed if >8MB), dt-normalized lerp, gated seeks, delta-gated DOM writes, band pacing + flick test, four-layer legibility system (base scrim, per-band scrim, text-shadow token, chip scrim), five static-hero gates live with change listeners, complete-without-video, quality floor, RTL for Arabic, whole-site-animated standard.

## 9. Copy gate

Every viewer-facing line above ships verbatim. The built page must pass the Phase 9 grep gate (zero em dashes, zero stock words) and the body-copy AI-tell sweep. Designed devices ("Tester. Prouver. Réparer.", "Effacer n'est pas réparer.") are deliberate and stay.
