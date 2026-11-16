import fs from "node:fs";
import path from "node:path";

const xmlPath = path.resolve("scripts/sample.xml");
const xml = fs.readFileSync(xmlPath, "utf-8");

const pubTimeMatch = xml.match(/<_0:publicationTime>([^<]+)/);
const publicationDate = pubTimeMatch ? pubTimeMatch[1].split("T")[0] : "2025-12-18";

function normalizeProvince(raw) {
  if (!raw) return { name: "Desconocida", slug: "desconocida" };
  const trimmed = raw.trim();
  
  const map = {
    "ALBACETE": "Albacete",
    "ALICANTE/ALACANT": "Alicante",
    "ALMERÍA": "Almería",
    "ASTURIAS": "Asturias",
    "BADAJOZ": "Badajoz",
    "BALEARS, ILLES": "Illes Balears",
    "BURGOS": "Burgos",
    "CANTABRIA": "Cantabria",
    "CASTELLÓN/CASTELLÓ": "Castellón",
    "CIUDAD REAL": "Ciudad Real",
    "CORUÑA, A": "A Coruña",
    "CUENCA": "Cuenca",
    "CÁCERES": "Cáceres",
    "CÁDIZ": "Cádiz",
    "CÓRDOBA": "Córdoba",
    "GRANADA": "Granada",
    "GUADALAJARA": "Guadalajara",
    "HUELVA": "Huelva",
    "HUESCA": "Huesca",
    "JAÉN": "Jaén",
    "LEÓN": "León",
    "LUGO": "Lugo",
    "MADRID": "Madrid",
    "MURCIA": "Murcia",
    "MÁLAGA": "Málaga",
    "NAVARRA": "Navarra",
    "OURENSE": "Ourense",
    "PALENCIA": "Palencia",
    "PALMAS, LAS": "Las Palmas",
    "PONTEVEDRA": "Pontevedra",
    "RIOJA, LA": "La Rioja",
    "SALAMANCA": "Salamanca",
    "SANTA CRUZ DE TENERIFE": "Santa Cruz de Tenerife",
    "SEGOVIA": "Segovia",
    "SEVILLA": "Sevilla",
    "SORIA": "Soria",
    "TERUEL": "Teruel",
    "TOLEDO": "Toledo",
    "VALENCIA/VALÈNCIA": "Valencia",
    "VALLADOLID": "Valladolid",
    "ZAMORA": "Zamora",
    "ZARAGOZA": "Zaragoza",
    "ÁVILA": "Ávila"
  };

  const name = map[trimmed] || trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return { name, slug };
}

function normalizeRoad(raw) {
  if (!raw) return { name: "Desconocida", slug: "desconocida" };
  const clean = raw.trim().toUpperCase().replace(/\s+/g, " ");
  const slug = clean
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { name: clean, slug };
}

function normalizeDirection(raw) {
  if (!raw) return "No especificado";
  const tr = raw.trim();
  if (tr === "positive" || tr.toLowerCase() === "creciente") return "Creciente";
  if (tr === "negative" || tr.toLowerCase() === "decreciente") return "Decreciente";
  if (tr === "both" || tr.toLowerCase() === "ambos") return "Ambos sentidos";
  return tr;
}

const locRegex = /<_0:predefinedLocation\s+id="([^"]+)"[\s\S]*?<\/_0:predefinedLocation>/g;

const radars = [];
let match;
let counter = 1;

while ((match = locRegex.exec(xml)) !== null) {
  const block = match[0];
  const rawId = match[1];

  const isTramo = rawId.includes("CVM") || block.includes("Linear");
  const roadRaw = block.match(/<_0:roadNumber>([^<]+)/)?.[1] ||
                  block.match(/<_0:roadName>[\s\S]*?<_0:value[^>]*>([^<]+)/)?.[1] ||
                  block.match(/<_0:descriptor>[\s\S]*?<_0:value>([^<]+)/)?.[1];
  
  const provinceRaw = block.match(/<_0:administrativeArea>[\s\S]*?<_0:value>([^<]+)/)?.[1];
  const latRaw = block.match(/<_0:latitude>([^<]+)/)?.[1];
  const lonRaw = block.match(/<_0:longitude>([^<]+)/)?.[1];
  const pkRaw = block.match(/<_0:referencePointDistance>([^<]+)/)?.[1];
  const directionRaw = block.match(/<_0:directionNamed>([^<]+)/)?.[1] ||
                       block.match(/<_0:directionRelative>([^<]+)/)?.[1];
  const singularityRaw = block.match(/<_0:singularity>([^<]+)/)?.[1];

  if (!latRaw || !lonRaw) continue;

  const lat = parseFloat(latRaw);
  const lng = parseFloat(lonRaw);
  if (isNaN(lat) || isNaN(lng)) continue;

  const { name: provincia, slug: provinciaSlug } = normalizeProvince(provinceRaw);
  const { name: carretera, slug: carreteraSlug } = normalizeRoad(roadRaw);
  const sentido = normalizeDirection(directionRaw);
  
  let pkFormatted = "0.0";
  if (pkRaw) {
    const pkNum = parseFloat(pkRaw) / 1000;
    pkFormatted = pkNum % 1 === 0 ? pkNum.toString() : pkNum.toFixed(1).replace(/\.0$/, "");
  }

  // Clean ID: use deterministic ID
  const cleanId = `dgt-${rawId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;

  // Singularity and estimated limit
  const singularity = singularityRaw ? singularityRaw.trim() : null;
  let velocidadEstimada = null;
  if (singularity && singularity.toUpperCase().includes("AUTOPISTA")) {
    velocidadEstimada = 120;
  } else if (singularity && (singularity.toUpperCase().includes("CONVENCIONAL") || singularity.toUpperCase().includes("CARRETERA"))) {
    velocidadEstimada = 90;
  }

  radars.push({
    id: cleanId,
    dgtLocationId: rawId,
    provincia,
    provinciaSlug,
    carretera,
    carreteraSlug,
    pk: pkFormatted,
    sentido,
    tipo: isTramo ? "Tramo" : "Fijo",
    lat,
    lng,
    singularity: singularity || "Vía interurbana",
    velocidadEstimada,
    fuente: "DGT - Punto de Acceso Nacional (NAP)",
    fechaPublicacion: publicationDate,
  });
}

console.log(`Parsed ${radars.length} valid radars.`);

// Write to src/data/dgt-radars.json
const outputPath = path.resolve("src/data/dgt-radars.json");
fs.writeFileSync(outputPath, JSON.stringify(radars, null, 2), "utf-8");
console.log(`Saved to ${outputPath}`);
