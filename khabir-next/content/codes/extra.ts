import type { Locale } from "@/i18n/config";
import type { CodeId } from "./meta";

/** Brand notes shown on a code page. Display names live in the page (VW/Audi, Mercedes-Benz, Renault/Dacia, Peugeot). */
export type BrandKey = "vw" | "mercedes" | "renault" | "peugeot";

export interface CodeExtra {
  /** Ordered checks, cheapest and most telling first. */
  steps: string[];
  /** What is typical on each brand family for this code. */
  brands: Record<BrandKey, string>;
}

/**
 * Extra diagnostic detail for the codes that have it (steps + per-brand notes), written by the workshop-tools session.
 * Codes without an entry simply omit those two sections. Generated once from the peer files; edit by hand from now on.
 */
export const extras: Partial<Record<CodeId, Record<Locale, CodeExtra>>> = {
  "P0087": {
    "fr": {
      "steps": [
        "Lire les données figées : à quel régime et à quelle charge la pression décroche.",
        "Commencer par le moins cher : état du filtre, présence d'eau, bulles d'air dans un tuyau transparent posé sur l'arrivée.",
        "Mesurer la pression d'alimentation basse pression et la comparer à la valeur du constructeur.",
        "Comparer à la valise pression demandée et pression mesurée, au ralenti puis en charge. Sur la plupart des diesels common rail, le ralenti se situe vers 250 à 350 bar.",
        "Test de retour des injecteurs : celui qui renvoie beaucoup plus que les autres fuit.",
        "Chercher de la limaille dans le filtre et le régulateur de débit : s'il y en a, la pompe se détruit et tout le circuit doit être nettoyé, pas seulement la pompe."
      ],
      "brands": {
        "vw": "Sur les 2.0 TDI common rail, contrôlez d'abord la pompe dans le réservoir et le filtre. De la limaille dans le boîtier de filtre signifie que la pompe haute pression s'use et que tout le circuit est contaminé.",
        "mercedes": "Sur les CDI, contrôlez le filtre, puis le régulateur de pression sur la rampe et le régulateur de débit sur la pompe. Les retours d'injecteurs trop importants sont fréquents à fort kilométrage.",
        "renault": "Sur les 1.5 dCi à injection Delphi des premières générations, l'usure de la pompe avec limaille est connue. Regardez le filtre avant de remplacer quoi que ce soit.",
        "peugeot": "Sur les HDi, commencez par le filtre et le circuit basse pression (prise d'air au support de filtre), puis le régulateur sur la pompe."
      }
    },
    "ar": {
      "steps": [
        "قرا الدوني فيجي: فشمن ريجيم وشمن شارج كيطيح الضغط.",
        "بدا بالرخيص: الحالة ديال الفيلتر، واش كاين الما، وواش كاينين بولات ديال الهوا فتيّو شفّاف مركّب فالدخلة.",
        "قيّس الضغط ديال الأليمونتاسيون الواطي وقارنو مع القيمة ديال الكونستريكتور.",
        "قارن بالجهاز الضغط المطلوب والضغط المقيوس، فالرالونتي ومن بعد فالشارج. فأغلب الديزيلات كومون راي، الرالونتي كيكون بين 250 و350 بار.",
        "دير تيست ديال الروتور ديال الأنجيكتورات: اللي كيرجّع كثر بزّاف من الآخرين هو اللي كيسرّب.",
        "قلّب على الليماي فالفيلتر وفالريكيلاتور ديال الديبي: إلا لقيتيها، البومب كتاكل راسها وخاص السيركوي كامل يتنقّى، ماشي غير البومب."
      ],
      "brands": {
        "vw": "فالـ 2.0 TDI كومون راي، راقب فالأول البومب اللي فالريزيرفوار والفيلتر. الليماي فالبواتيي ديال الفيلتر معناها البومب ديال الضغط العالي كتهرى والسيركوي كامل موسّخ.",
        "mercedes": "فالـ CDI، راقب الفيلتر، ومن بعد الريكيلاتور ديال الضغط اللي فالرامب والريكيلاتور ديال الديبي اللي فالبومب. الروتور الكثير ديال الأنجيكتورات كيكون بزّاف فالكيلوميتراج الكبير.",
        "renault": "فالـ 1.5 dCi اللي فيهم أنجيكسيون Delphi ديال الجيل الأول، البومب اللي كتهرى وكتخرّج الليماي معروفة. شوف الفيلتر قبل ما تبدّل أي حاجة.",
        "peugeot": "فالـ HDi، بدا بالفيلتر والسيركوي ديال الضغط الواطي (دخول الهوا فالسيبور ديال الفيلتر)، ومن بعد الريكيلاتور اللي فالبومب."
      }
    },
    "en": {
      "steps": [
        "Read the freeze frame: at what engine speed and load the pressure drops.",
        "Start with the cheapest: filter condition, water, air bubbles in a clear pipe fitted on the supply line.",
        "Measure the low-pressure supply and compare it with the manufacturer's figure.",
        "Compare requested and measured rail pressure with the scan tool, at idle and under load. On most common-rail diesels, idle sits around 250 to 350 bar.",
        "Injector return test: the one returning far more than the others is leaking.",
        "Look for metal filings in the filter and the metering valve: if there are any, the pump is destroying itself and the whole circuit must be cleaned, not just the pump."
      ],
      "brands": {
        "vw": "On 2.0 TDI common-rail engines, check the in-tank pump and the filter first. Metal filings in the filter housing mean the high-pressure pump is wearing and the whole circuit is contaminated.",
        "mercedes": "On CDI engines, check the filter, then the pressure regulator on the rail and the metering valve on the pump. Excessive injector return is common at high mileage.",
        "renault": "On early 1.5 dCi engines with Delphi injection, pump wear that sheds metal filings is well known. Look at the filter before replacing anything.",
        "peugeot": "On HDi engines, start with the filter and the low-pressure circuit (air leak at the filter housing), then the regulator on the pump."
      }
    }
  },
  "P0299": {
    "fr": {
      "steps": [
        "Lire les données figées : régime, charge, pression demandée et pression mesurée au moment du défaut.",
        "Contact mis, moteur arrêté : le capteur de suralimentation doit afficher la pression atmosphérique (un peu moins de 1 bar à Beni Mellal). Sinon, le capteur ment.",
        "Mettre le circuit d'admission sous pression ou faire un test de fumée pour trouver la fuite, du turbo jusqu'au collecteur.",
        "Contrôler la commande du turbo : dépression qui arrive à l'actionneur et course de la tige avec une pompe à vide, ou test d'actionneur à la valise s'il est électrique.",
        "Essai sur route en enregistrant pression demandée et pression mesurée : l'endroit où les deux courbes se séparent montre où chercher.",
        "En dernier seulement : jeu de l'axe du turbo et traces d'huile dans les durites."
      ],
      "brands": {
        "vw": "Sur les TDI à turbo commandé par dépression, commencez par l'électrovanne N75 et les petites durites de dépression. La géométrie variable grippée est fréquente sur les voitures qui roulent surtout en ville.",
        "mercedes": "Sur les CDI, contrôlez les durites d'air de suralimentation et leurs joints, puis le convertisseur de pression qui commande le turbo.",
        "renault": "Sur les 1.5 dCi (Clio, Logan, Sandero, Duster, Dokker), la durite entre le turbo et l'échangeur qui se fend ou se déboîte est une cause classique. À regarder avant tout le reste.",
        "peugeot": "Sur les 1.6 HDi, un turbo qui lâche est souvent la conséquence d'une arrivée d'huile bouchée. Si le turbo est remplacé, le tuyau d'huile et sa crépine doivent l'être aussi, sinon le nouveau casse à son tour."
      }
    },
    "ar": {
      "steps": [
        "قرا الدوني فيجي: الريجيم، الشارج، الضغط المطلوب والضغط المقيوس فالوقت اللي تسجّل فيه العطب.",
        "الكونطاكت مشعول والموطور طافي: الكابتور خاصّو يعطي الضغط ديال الجو (شوية قل من 1 بار فبني ملال). إلا عطى شي حاجة أخرى، الكابتور كيكذب.",
        "دير الضغط فسيركوي ديال الأدميسيون ولا دير تيست ديال الدخان باش تلقى التسريب، من التيربو حتى للكوليكتور.",
        "راقب الكوموند ديال التيربو: الديبريسيون اللي واصلة للأكتيواتور والكورس ديال التيج بلابومب ديال الفيد، ولا تيست أكتيواتور بالجهاز إلا كان إلكتريك.",
        "جرّب الطوموبيل فالطريق وسجّل الضغط المطلوب والضغط المقيوس: البلاصة فين كيتفرقو الخطوط هي اللي كتورّيك فين تقلّب.",
        "فالآخر عاد: اللعب ديال محور التيربو وآثار الزيت فالدوريتات."
      ],
      "brands": {
        "vw": "فالـ TDI اللي التيربو ديالهم خدّام بالديبريسيون، بدا بالإلكتروفان N75 والدوريتات الصغار ديال الديبريسيون. الجيوميتري فاريابل المزيّرة كتكون بزّاف فالطوموبيلات اللي كيدورو غير فالمدينة.",
        "mercedes": "فالـ CDI، راقب دوريتات الهوا ديال التيربو والجوانات ديالهم، ومن بعد الكونفيرتيسور ديال الضغط اللي كيكوموندي التيربو.",
        "renault": "فالـ 1.5 dCi (Clio، Logan، Sandero، Duster، Dokker)، الدوريت اللي بين التيربو والأنتركولر كتشقّق ولا كتخلع بزّاف. شوفها قبل أي حاجة أخرى.",
        "peugeot": "فالـ 1.6 HDi، التيربو اللي كيطيح غالباً السبب ديالو هو تيّو ديال الزيت مسدود. إلا تبدّل التيربو، خاص يتبدّل تيّو ديال الزيت والكريبين ديالو، وإلا الجديد غادي يتهرّس حتى هو."
      }
    },
    "en": {
      "steps": [
        "Read the freeze frame: engine speed, load, requested and measured boost when the fault was stored.",
        "Ignition on, engine off: the boost sensor must read atmospheric pressure (a little under 1 bar in Beni Mellal). If it does not, the sensor is lying.",
        "Pressurise the intake or run a smoke test to find the leak, from the turbo to the manifold.",
        "Check the turbo control: vacuum reaching the actuator and rod travel with a hand vacuum pump, or an actuator test with the scan tool if it is electric.",
        "Road test while logging requested and measured boost: the point where the two curves split shows where to look.",
        "Only last: turbo shaft play and oil traces in the hoses."
      ],
      "brands": {
        "vw": "On TDI engines with a vacuum-controlled turbo, start with the N75 solenoid and the small vacuum hoses. Stuck variable-geometry vanes are common on cars driven mostly in town.",
        "mercedes": "On CDI engines, check the charge-air hoses and their seals, then the pressure converter that controls the turbo.",
        "renault": "On the 1.5 dCi (Clio, Logan, Sandero, Duster, Dokker), the hose between turbo and intercooler splitting or coming off is a classic cause. Look there before anything else.",
        "peugeot": "On the 1.6 HDi, a failed turbo is often the result of a blocked oil feed. If the turbo is replaced, the oil pipe and its strainer must be replaced too, or the new one fails in turn."
      }
    }
  },
  "P0401": {
    "fr": {
      "steps": [
        "Lire les données figées et les autres codes : un défaut de débitmètre ou de suralimentation change le diagnostic.",
        "Test d'actionneur à la valise : la position mesurée de la vanne doit suivre la position demandée, sans retard ni blocage.",
        "Moteur chaud au ralenti, commander l'ouverture de l'EGR : la masse d'air mesurée doit baisser nettement. Si elle ne bouge pas, les gaz ne passent pas.",
        "Déposer la vanne et regarder : calamine sur le clapet, dans le tube et à l'entrée du collecteur.",
        "Vérifier le débitmètre : valeur au ralenti et à pleine charge comparées aux valeurs du constructeur.",
        "Après nettoyage ou remplacement : effacer les valeurs apprises et faire l'adaptation de la vanne avec la valise."
      ],
      "brands": {
        "vw": "Sur les TDI, la vanne et le refroidisseur EGR s'encrassent ensemble. Sur certains 2.0 TDI les deux forment un seul bloc : vérifiez la référence avant de commander une pièce.",
        "mercedes": "Sur les CDI, la vanne EGR électrique se bloque par la calamine. Après remplacement, l'adaptation à la valise est nécessaire.",
        "renault": "Sur les 1.5 dCi, la vanne collée par la suie est très fréquente. Un nettoyage suffit souvent si le moteur électrique de la vanne n'est pas usé.",
        "peugeot": "Sur les 1.6 HDi, contrôlez aussi le collecteur d'admission et le refroidisseur EGR : nettoyer la vanne seule ne suffit pas toujours."
      }
    },
    "ar": {
      "steps": [
        "قرا الدوني فيجي والكودات الآخرين: عطب فالديبيميتر ولا فالتيربو كيبدّل الديانيوستيك.",
        "دير تيست أكتيواتور بالجهاز: البوزيسيون المقيوسة ديال الفان خاصها تتبع البوزيسيون المطلوبة، بلا تعطّل وبلا بلوكاج.",
        "الموطور سخون وفالرالونتي، كوموندي الحلّان ديال EGR: الكتلة ديال الهوا المقيوسة خاصها تهبط مزيان. إلا ما تحرّكاتش، الغاز ما كيدوزش.",
        "حيّد الفان وشوف: الكالامين على الكلابي، فالتيوب وفالدخلة ديال الكوليكتور.",
        "راقب الديبيميتر: القيمة فالرالونتي وفالشارج الكاملة وقارنها مع القيم ديال الكونستريكتور.",
        "من بعد النقا ولا التبديل: مسح القيم المحفوظة ودير الأدابتاسيون ديال الفان بالجهاز."
      ],
      "brands": {
        "vw": "فالـ TDI، الفان والروفروديسور ديال EGR كيتوسّخو بجوج. فشي 2.0 TDI هوما بلوك واحد: راقب الريفيرانس قبل ما تكوموندي البياسة.",
        "mercedes": "فالـ CDI، فان EGR الإلكتريك كتوقف بالكالامين. من بعد التبديل خاص الأدابتاسيون بالجهاز.",
        "renault": "فالـ 1.5 dCi، الفان اللاصقة بالكاربون كتكون بزّاف. النقا غالباً كيكفي إلا الموطور الإلكتريك ديال الفان ما مهريش.",
        "peugeot": "فالـ 1.6 HDi، راقب حتى الكوليكتور ديال الأدميسيون والروفروديسور ديال EGR: النقا ديال الفان بوحدها ماشي ديما كيكفي."
      }
    },
    "en": {
      "steps": [
        "Read the freeze frame and the other codes: an air mass meter or boost fault changes the diagnosis.",
        "Run an actuator test with the scan tool: the measured valve position must follow the requested position, with no lag or sticking.",
        "Warm engine at idle, command the EGR open: measured air mass must drop clearly. If it does not move, no gas is flowing.",
        "Remove the valve and look: soot on the valve head, in the pipe and at the manifold inlet.",
        "Check the air mass meter: idle and full-load values against the manufacturer's figures.",
        "After cleaning or replacement: clear the learned values and adapt the valve with the scan tool."
      ],
      "brands": {
        "vw": "On TDI engines, the EGR valve and cooler clog together. On some 2.0 TDI they are one unit: check the part number before ordering.",
        "mercedes": "On CDI engines, the electric EGR valve sticks with soot. After replacement it must be adapted with the scan tool.",
        "renault": "On the 1.5 dCi, a valve stuck with soot is very common. Cleaning is often enough if the valve's electric motor is not worn.",
        "peugeot": "On the 1.6 HDi, check the intake manifold and the EGR cooler too: cleaning the valve alone is not always enough."
      }
    }
  },
  "P0420": {
    "fr": {
      "steps": [
        "Lire les autres codes d'abord : des ratés (P0300 à P0304) ou un défaut de mélange (P0171, P0172) se réparent avant de toucher au catalyseur.",
        "Moteur chaud, régime stable vers 2 000 à 2 500 tr/min : la sonde avant oscille vite, la sonde arrière doit rester presque stable. Si elle copie la sonde avant, le catalyseur ne stocke plus l'oxygène.",
        "Chercher une fuite d'échappement entre les deux sondes : flexible, joints, soudures.",
        "Regarder les corrections de carburant : elles doivent rester proches de zéro. Une grosse correction désigne un autre problème.",
        "Comparer la température à l'entrée et à la sortie du catalyseur, moteur chaud : en général, un catalyseur qui travaille sort plus chaud qu'il n'entre."
      ],
      "brands": {
        "vw": "Sur les moteurs essence du groupe, contrôlez le flexible d'échappement et la sonde arrière avant de condamner le catalyseur.",
        "mercedes": "Les V6 et V8 ont deux bancs : P0420 concerne le banc 1, P0430 le banc 2. Comparer les deux sondes arrière donne tout de suite une référence.",
        "renault": "Sur les essence Renault et Dacia, regardez l'historique des ratés d'allumage : une bobine défaillante envoie de l'essence non brûlée qui abîme le catalyseur.",
        "peugeot": "Sur les essence, mesurez la consommation d'huile avant de remplacer le catalyseur : un moteur qui brûle de l'huile encrassera aussi le neuf."
      }
    },
    "ar": {
      "steps": [
        "قرا الكودات الآخرين هوما الأولين: الراطيات (P0300 حتى P0304) ولا مشكل الميلانج (P0171، P0172) خاصهم يتصلّحو قبل ما تقيس الكاطاليزور.",
        "الموطور سخون والريجيم ثابت بين 2000 و2500 تورة: السوند القدّامية كتطلع وتهبط بالزربة، واللّورانية خاصها تبقى تقريباً ثابتة. إلا كانت كتقلّد القدّامية، الكاطاليزور ما بقاش كيخزّن الأوكسيجين.",
        "قلّب على تسريب فالشكمان بين جوج السوندات: الفليكسيبل، الجوانات، السودورات.",
        "شوف الكوريكسيون ديال الكاربيران: خاصها تبقى قريبة من الزيرو. كوريكسيون كبيرة كتورّي مشكل آخر.",
        "قارن الحرارة فالدخلة وفالخرجة ديال الكاطاليزور والموطور سخون: فالغالب، الكاطاليزور الخدّام كيخرج سخون كثر من ما كيدخل."
      ],
      "brands": {
        "vw": "فالموطورات ليسانس ديال المجموعة، راقب الفليكسيبل ديال الشكمان والسوند اللّورانية قبل ما تحكم على الكاطاليزور.",
        "mercedes": "الـ V6 والـ V8 فيهم جوج بانكات: P0420 ديال البانك 1 وP0430 ديال البانك 2. قارن جوج السوندات اللّورانيين وغادي تلقى المرجع ديالك.",
        "renault": "فـ Renault وDacia ليسانس، شوف الإيستوريك ديال الراطيات: البوبين الخاسرة كتصيفط ليسانس ما محروقش وكيضرّ الكاطاليزور.",
        "peugeot": "فالموطورات ليسانس، قيّس شحال كياكل الموطور ديال الزيت قبل ما تبدّل الكاطاليزور: الموطور اللي كيحرق الزيت غادي يوسّخ حتى الجديد."
      }
    },
    "en": {
      "steps": [
        "Read the other codes first: misfires (P0300 to P0304) or a mixture fault (P0171, P0172) are fixed before touching the converter.",
        "Warm engine, steady 2,000 to 2,500 rpm: the front sensor switches fast, the rear one should stay almost flat. If it copies the front sensor, the converter no longer stores oxygen.",
        "Look for an exhaust leak between the two sensors: flex pipe, gaskets, welds.",
        "Check the fuel trims: they should stay close to zero. A large trim points to another problem.",
        "Compare the temperature at the inlet and outlet of the converter, engine warm: as a rule, a working converter is hotter going out than coming in."
      ],
      "brands": {
        "vw": "On the group's petrol engines, check the exhaust flex pipe and the rear sensor before condemning the converter.",
        "mercedes": "V6 and V8 engines have two banks: P0420 is bank 1, P0430 is bank 2. Comparing the two rear sensors gives you a reference straight away.",
        "renault": "On Renault and Dacia petrol engines, look at the misfire history: a failing coil sends unburnt fuel that damages the converter.",
        "peugeot": "On petrol engines, measure oil consumption before replacing the converter: an engine that burns oil will foul the new one too."
      }
    }
  },
  "P2002": {
    "fr": {
      "steps": [
        "Lire à la valise : charge en suie calculée et mesurée, masse de cendres, distance depuis la dernière régénération.",
        "Contact mis, moteur arrêté : la pression différentielle doit être à zéro. Sinon, le capteur ou ses durites sont en cause.",
        "Inspecter les deux durites du capteur sur toute leur longueur : fissure, pliure, bouchon de suie.",
        "Mesurer la pression différentielle au ralenti puis vers 2 500 à 3 000 tr/min et comparer aux valeurs du constructeur : trop haute, le filtre est chargé ; presque nulle à tous les régimes, le filtre est percé ou le capteur ne mesure pas.",
        "Chercher pourquoi la régénération échoue : sondes de température d'échappement, moteur qui atteint bien sa température, EGR.",
        "Seulement ensuite : régénération forcée à la valise si la charge en suie le permet. Sur un filtre trop chargé, elle peut le fissurer : nettoyage ou remplacement."
      ],
      "brands": {
        "vw": "Sur les TDI, le capteur de pression différentielle (G450) et ses durites sont une cause fréquente. À contrôler avant de parler du filtre.",
        "mercedes": "Sur les CDI, vérifiez les durites du capteur, qui durcissent avec la chaleur, puis les sondes de température avant le filtre.",
        "renault": "Sur les 1.5 dCi utilisés en ville, le filtre se charge parce que la régénération est toujours interrompue. Vérifiez aussi les injecteurs : une mauvaise combustion fabrique de la suie.",
        "peugeot": "Sur les HDi à FAP additivé, contrôlez le niveau d'additif (cérine) : un réservoir vide empêche de régénérer correctement. Après remplissage, le compteur se remet à zéro à la valise."
      }
    },
    "ar": {
      "steps": [
        "قرا بالجهاز: الشارج ديال الكاربون المحسوبة والمقيوسة، الكتلة ديال الرماد، والمسافة من آخر ريجينيراسيون.",
        "الكونطاكت مشعول والموطور طافي: الضغط التفاضلي خاصّو يكون زيرو. إلا ما كانش، المشكل فالكابتور ولا فالدوريتات ديالو.",
        "راقب جوج الدوريتات ديال الكابتور على طولهم: شقّ، طيّة ولا سدّادة ديال الكاربون.",
        "قيّس الضغط التفاضلي فالرالونتي ومن بعد بين 2500 و3000 تورة وقارن مع القيم ديال الكونستريكتور: طالع بزّاف، الفيلتر عامر؛ قريب للزيرو فكل الريجيمات، الفيلتر مثقوب ولا الكابتور ما كيقيّسش.",
        "قلّب علاش الريجينيراسيون ما كتكملش: السوندات ديال حرارة الشكمان، واش الموطور كيوصل للحرارة ديالو، وEGR.",
        "من بعد عاد: ريجينيراسيون فورسي بالجهاز إلا الشارج ديال الكاربون كتسمح. فالفيلتر العامر بزّاف ممكن تشقّقو: نقا ولا تبديل."
      ],
      "brands": {
        "vw": "فالـ TDI، كابتور الضغط التفاضلي (G450) والدوريتات ديالو سبب كيتعاود بزّاف. راقبهم قبل ما تهضر على الفيلتر.",
        "mercedes": "فالـ CDI، راقب الدوريتات ديال الكابتور اللي كيقساحو بالسخونية، ومن بعد السوندات ديال الحرارة اللي قبل الفيلتر.",
        "renault": "فالـ 1.5 dCi اللي كيدورو فالمدينة، الفيلتر كيعمر حيت الريجينيراسيون ديما كتقطع. راقب حتى الأنجيكتورات: الاحتراق الخايب كيصنع الكاربون.",
        "peugeot": "فالـ HDi اللي فيهم FAP بالأديتيف، راقب النيفو ديال الأديتيف (السيرين): الريزيرفوار الخاوي كيمنع الريجينيراسيون. من بعد التعمار، الكونتور كيترجّع للزيرو بالجهاز."
      }
    },
    "en": {
      "steps": [
        "Read with the scan tool: calculated and measured soot load, ash mass, distance since the last regeneration.",
        "Ignition on, engine off: differential pressure must read zero. If not, the sensor or its hoses are at fault.",
        "Inspect both sensor hoses along their full length: cracks, kinks, soot plugs.",
        "Measure differential pressure at idle and then at 2,500 to 3,000 rpm and compare with the manufacturer's figures: too high, the filter is loaded; near zero at every speed, the filter is holed or the sensor is not measuring.",
        "Find out why regeneration fails: exhaust temperature sensors, engine actually reaching temperature, EGR.",
        "Only then: forced regeneration with the scan tool if the soot load allows it. On an overloaded filter it can crack it: clean or replace instead."
      ],
      "brands": {
        "vw": "On TDI engines, the differential pressure sensor (G450) and its hoses are a frequent cause. Check them before talking about the filter.",
        "mercedes": "On CDI engines, check the sensor hoses, which harden with heat, then the temperature sensors ahead of the filter.",
        "renault": "On 1.5 dCi cars used in town, the filter loads up because regeneration is always interrupted. Check the injectors too: poor combustion makes soot.",
        "peugeot": "On HDi engines with an additive-type filter, check the additive level: an empty tank prevents proper regeneration. After refilling, the counter is reset with the scan tool."
      }
    }
  }
};

export function getExtra(locale: Locale, code: string): CodeExtra | undefined {
  return extras[code as CodeId]?.[locale];
}
