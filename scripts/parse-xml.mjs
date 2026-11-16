import fs from "node:fs";

const xml = fs.readFileSync("scripts/sample.xml", "utf-8");

console.log("Total bytes:", xml.length);
const pubTimeMatch = xml.match(/<_0:publicationTime>([^<]+)/);
console.log("Publication Time:", pubTimeMatch ? pubTimeMatch[1] : null);

// Match all predefinedLocation blocks
// In this XML, closing tag is </_0:predefinedLocation>
const locRegex = /<_0:predefinedLocation\s+id="([^"]+)"[\s\S]*?<\/_0:predefinedLocation>/g;

const locations = [];
let match;
while ((match = locRegex.exec(xml)) !== null) {
  const block = match[0];
  const id = match[1];

  const isTramo = id.includes("CVM") || block.includes("Linear");
  const road = block.match(/<_0:roadNumber>([^<]+)/)?.[1] ||
               block.match(/<_0:roadName>[\s\S]*?<_0:value[^>]*>([^<]+)/)?.[1] ||
               block.match(/<_0:descriptor>[\s\S]*?<_0:value>([^<]+)/)?.[1];
  
  const province = block.match(/<_0:administrativeArea>[\s\S]*?<_0:value>([^<]+)/)?.[1];
  const lat = block.match(/<_0:latitude>([^<]+)/)?.[1];
  const lon = block.match(/<_0:longitude>([^<]+)/)?.[1];
  const pk = block.match(/<_0:referencePointDistance>([^<]+)/)?.[1];
  const direction = block.match(/<_0:directionNamed>([^<]+)/)?.[1] ||
                    block.match(/<_0:directionRelative>([^<]+)/)?.[1];
  const singularity = block.match(/<_0:singularity>([^<]+)/)?.[1];

  locations.push({
    id,
    road: road ? road.trim() : null,
    province: province ? province.trim() : null,
    lat: lat ? parseFloat(lat) : null,
    lon: lon ? parseFloat(lon) : null,
    pk: pk ? (parseFloat(pk) / 1000).toFixed(3) : null,
    direction: direction ? direction.trim() : null,
    tipo: isTramo ? "Tramo" : "Fijo",
    singularity: singularity ? singularity.trim() : null,
  });
}

console.log("Total parsed locations:", locations.length);
console.log("Sample 3 items:", locations.slice(0, 3));

// Check province count
const provinces = new Set(locations.map(l => l.province).filter(Boolean));
console.log("Unique provinces count:", provinces.size);
console.log("Provinces:", Array.from(provinces).sort().join(", "));

// Check roads count
const roads = new Set(locations.map(l => l.road).filter(Boolean));
console.log("Unique roads count:", roads.size);
