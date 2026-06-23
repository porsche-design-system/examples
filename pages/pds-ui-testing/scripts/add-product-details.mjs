/**
 * One-off script: inject structured `details` into products.en.json and products.de.json.
 * Run from pages/pds-ui-testing: node scripts/add-product-details.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogDir = join(__dirname, "../app/data/catalog");

const PROP65_WARNING_EN =
  "Components of some products can expose you to chemicals including Bisphenol A (BPA), Diisononyl Phthalate, Lead and Nickel which are known to the State of California to cause cancer, reproductive harm or birth defects. For more information visit www.P65Warnings.ca.gov";

const PROP65_WARNING_DE =
  "Bestandteile einiger Produkte können Sie Chemikalien einschließlich Bisphenol A (BPA), Diisononylphthalat, Blei und Nickel aussetzen, die im US-Bundesstaat Kalifornien als krebserregend, fortpflanzungsschädigend oder geburtsfehlerverursachend gelten. Weitere Informationen unter www.P65Warnings.ca.gov";

/** @type {Record<string, { en: object; de: object }>} */
const OVERRIDES = {
  "product-kids-t-shirt-essential": {
    en: {
      description: {
        paragraphs: [
          "Minimalism meets elegance: the Essential Collection with a unique design that captures the Porsche spirit in its most refined form. The comfortable T-shirt for kids stands out with Porsche lettering on the lower back, accented by contrasting colours. The highlight of the Tee is the Porsche Crest sewn on the chest. The horn below it adds a playful detail, which is sewn on shirts up to size 122/128.",
        ],
        bullets: [
          "Comfortable T-shirt for kids with Porsche Crest on the chest.",
          "Colour-contrasting lower back with Porsche lettering.",
          "Horn sewn on below the crest, up to size 122/128.",
        ],
      },
      dimensionsAndWeight: {
        dimensions: "320 mm x 235 mm x 20 mm",
        weight: "180 g",
      },
      materialAndCare: {
        material: "100% cotton knitted",
        careInstructions:
          "Machine wash 30°C. Wash with similar colours. Wash inside out. Do not wring. Do not bleach. Do not tumble dry. Warm iron. Do not dry clean.",
      },
      generalCharacteristics: [
        { label: "Size", value: "146/152" },
        { label: "Color", value: "Grey" },
      ],
      warning: PROP65_WARNING_EN,
    },
    de: {
      description: {
        paragraphs: [
          "Minimalismus trifft Eleganz: die Essential Collection mit einem einzigartigen Design, das den Porsche-Geist in seiner raffiniertesten Form einfängt. Das bequeme T-Shirt für Kinder besticht durch Porsche-Schriftzug im unteren Rückenbereich in Kontrastfarben. Das Highlight des Shirts ist das auf die Brust genähte Porsche-Wappen. Das darunter angebrachte Horn ist ein verspieltes Detail, das bei Shirts bis Größe 122/128 angenäht ist.",
        ],
        bullets: [
          "Bequemes T-Shirt für Kinder mit Porsche-Wappen auf der Brust.",
          "Kontrastfarbiger unterer Rücken mit Porsche-Schriftzug.",
          "Horn unter dem Wappen angenäht, bis Größe 122/128.",
        ],
      },
      dimensionsAndWeight: {
        dimensions: "320 mm x 235 mm x 20 mm",
        weight: "180 g",
      },
      materialAndCare: {
        material: "100 % Baumwolle, gestrickt",
        careInstructions:
          "Maschinenwäsche 30 °C. Mit ähnlichen Farben waschen. Auf links waschen. Nicht wringen. Nicht bleichen. Nicht im Trockner trocknen. Warm bügeln. Nicht chemisch reinigen.",
      },
      generalCharacteristics: [
        { label: "Größe", value: "146/152" },
        { label: "Farbe", value: "Grau" },
      ],
      warning: PROP65_WARNING_DE,
    },
  },
};

function categoryType(categories) {
  if (categories.includes("travel-transport")) return "vehicle";
  if (categories.includes("bags-luggage")) return "bags";
  if (categories.includes("apparel")) return "apparel";
  return "accessories";
}

function buildDetails(product, locale) {
  const override = OVERRIDES[product.id]?.[locale];
  if (override) return override;

  const type = categoryType(product.categories);
  const isDe = locale === "de";
  const name = product.name;

  const templates = {
    apparel: {
      en: {
        description: {
          paragraphs: [
            `${product.description} Crafted with attention to detail, this ${name} reflects the refined Porsche lifestyle aesthetic.`,
          ],
          bullets: [
            `Premium quality ${name.toLowerCase()} from the Porsche collection.`,
            "Designed for comfort and everyday wear.",
            "Subtle Porsche branding details.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "Folded: 300 mm x 250 mm x 30 mm",
          weight: "250 g",
        },
        materialAndCare: {
          material: "Cotton blend",
          careInstructions:
            "Machine wash 30°C. Wash with similar colours. Do not bleach. Do not tumble dry. Iron at low temperature.",
        },
        generalCharacteristics: [
          { label: "Color", value: "As shown" },
          { label: "Fit", value: "Regular" },
        ],
        warning: PROP65_WARNING_EN,
      },
      de: {
        description: {
          paragraphs: [
            `${product.description} Mit Liebe zum Detail gefertigt, spiegelt dieses ${name} die raffinierte Porsche-Lifestyle-Ästhetik wider.`,
          ],
          bullets: [
            `Hochwertiges ${name} aus der Porsche-Kollektion.`,
            "Für Komfort und tägliches Tragen konzipiert.",
            "Dezente Porsche-Branding-Details.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "Gefaltet: 300 mm x 250 mm x 30 mm",
          weight: "250 g",
        },
        materialAndCare: {
          material: "Baumwollmischung",
          careInstructions:
            "Maschinenwäsche 30 °C. Mit ähnlichen Farben waschen. Nicht bleichen. Nicht im Trockner trocknen. Bei niedriger Temperatur bügeln.",
        },
        generalCharacteristics: [
          { label: "Farbe", value: "Wie abgebildet" },
          { label: "Passform", value: "Regular" },
        ],
        warning: PROP65_WARNING_DE,
      },
    },
    bags: {
      en: {
        description: {
          paragraphs: [
            `${product.description} Built for travel and daily use with Porsche quality standards.`,
          ],
          bullets: [
            "Durable construction for frequent use.",
            "Practical compartments and organisation.",
            "Distinctive Porsche design language.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "550 mm x 400 mm x 250 mm",
          weight: "2.8 kg",
        },
        materialAndCare: {
          material: "Aluminium / polycarbonate / nylon (varies by model)",
          careInstructions:
            "Wipe clean with a damp cloth. Do not use abrasive cleaners. Store in a dry place.",
        },
        generalCharacteristics: [
          { label: "Color", value: "As shown" },
          { label: "Capacity", value: "Approx. 35–45 L" },
        ],
      },
      de: {
        description: {
          paragraphs: [
            `${product.description} Für Reisen und den täglichen Gebrauch nach Porsche-Qualitätsstandards gefertigt.`,
          ],
          bullets: [
            "Robuste Konstruktion für häufigen Gebrauch.",
            "Praktische Fächer und Organisation.",
            "Unverwechselbare Porsche-Designsprache.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "550 mm x 400 mm x 250 mm",
          weight: "2,8 kg",
        },
        materialAndCare: {
          material: "Aluminium / Polycarbonat / Nylon (modellabhängig)",
          careInstructions:
            "Mit einem feuchten Tuch abwischen. Keine scheuernden Reiniger verwenden. Trocken lagern.",
        },
        generalCharacteristics: [
          { label: "Farbe", value: "Wie abgebildet" },
          { label: "Volumen", value: "Ca. 35–45 L" },
        ],
      },
    },
    vehicle: {
      en: {
        description: {
          paragraphs: [
            `${product.description} An original Porsche accessory designed for seamless integration with your vehicle.`,
          ],
          bullets: [
            "Genuine Porsche quality and fit.",
            "Designed for practical everyday use.",
            "Easy installation or setup.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "See product packaging for exact dimensions",
          weight: "Varies by configuration",
        },
        materialAndCare: {
          material: "High-quality automotive-grade materials",
          careInstructions:
            "Clean according to included instructions. Avoid harsh chemicals on sensitive surfaces.",
        },
        generalCharacteristics: [
          { label: "Compatibility", value: "Porsche vehicles (see manual)" },
          { label: "Color", value: "As shown" },
        ],
      },
      de: {
        description: {
          paragraphs: [
            `${product.description} Ein originales Porsche-Zubehörteil für die nahtlose Integration in Ihr Fahrzeug.`,
          ],
          bullets: [
            "Echte Porsche-Qualität und Passform.",
            "Für den praktischen Alltagsgebrauch konzipiert.",
            "Einfache Montage oder Einrichtung.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "Genaue Abmessungen siehe Produktverpackung",
          weight: "Je nach Konfiguration",
        },
        materialAndCare: {
          material: "Hochwertige Materialien in Automobilqualität",
          careInstructions:
            "Gemäß beiliegender Anleitung reinigen. Aggressive Chemikalien auf empfindlichen Oberflächen vermeiden.",
        },
        generalCharacteristics: [
          { label: "Kompatibilität", value: "Porsche-Fahrzeuge (siehe Handbuch)" },
          { label: "Farbe", value: "Wie abgebildet" },
        ],
      },
    },
    accessories: {
      en: {
        description: {
          paragraphs: [
            `${product.description} A refined Porsche lifestyle accessory for everyday use.`,
          ],
          bullets: [
            "Quality materials and precise craftsmanship.",
            "Subtle Porsche branding.",
            "Ideal as a gift or personal accessory.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "120 mm x 80 mm x 25 mm",
          weight: "85 g",
        },
        materialAndCare: {
          material: "Leather / metal / synthetic (varies by model)",
          careInstructions:
            "Wipe with a soft, dry cloth. Keep away from moisture and direct sunlight.",
        },
        generalCharacteristics: [
          { label: "Color", value: "As shown" },
          { label: "Collection", value: "Porsche Lifestyle" },
        ],
      },
      de: {
        description: {
          paragraphs: [
            `${product.description} Ein raffiniertes Porsche-Lifestyle-Accessoire für den täglichen Gebrauch.`,
          ],
          bullets: [
            "Hochwertige Materialien und präzise Verarbeitung.",
            "Dezentes Porsche-Branding.",
            "Ideal als Geschenk oder persönliches Accessoire.",
          ],
        },
        dimensionsAndWeight: {
          dimensions: "120 mm x 80 mm x 25 mm",
          weight: "85 g",
        },
        materialAndCare: {
          material: "Leder / Metall / Synthetik (modellabhängig)",
          careInstructions:
            "Mit einem weichen, trockenen Tuch abwischen. Vor Feuchtigkeit und direkter Sonneneinstrahlung schützen.",
        },
        generalCharacteristics: [
          { label: "Farbe", value: "Wie abgebildet" },
          { label: "Kollektion", value: "Porsche Lifestyle" },
        ],
      },
    },
  };

  return templates[type][locale];
}

function processFile(filename, locale) {
  const path = join(catalogDir, filename);
  const catalog = JSON.parse(readFileSync(path, "utf8"));
  catalog.products = catalog.products.map((product) => ({
    ...product,
    details: buildDetails(product, locale),
  }));
  writeFileSync(path, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Updated ${filename} (${catalog.products.length} products)`);
}

processFile("products.en.json", "en");
processFile("products.de.json", "de");
