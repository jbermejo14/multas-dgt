import https from "node:https";

https.get("https://nap.dgt.es/datex2/dgt/PredefinedLocationsPublication/radares/content.xml", (res) => {
  let xml = "";
  res.on("data", (chunk) => {
    xml += chunk;
  });
  res.on("end", () => {
    const pubTime = xml.match(/<[\w:]*publicationTime>([^<]+)/)?.[1];
    console.log("Publication Time:", pubTime);

    // Let's inspect location sets
    const sets = [];
    const setRegex = /<[\w:]*predefinedLocationSet\s+id="([^"]+)">([\s\S]*?)<\/.*?:predefinedLocationSet>/g;
    let sMatch;
    while ((sMatch = setRegex.exec(xml)) !== null) {
      sets.push({
        id: sMatch[1],
        len: sMatch[2].length
      });
    }
    console.log("Sets found:", sets);

    // Parse items
    const locRegex = /<[\w:]*predefinedLocation\s+id="([^"]+)"[\s\S]*?<\/[\w:]*predefinedLocation>/g;
    let match;
    const items = [];
    while ((match = locRegex.exec(xml)) !== null && items.length < 5) {
      const block = match[0];
      const id = match[1];
      const roadName = block.match(/<[\w:]*roadNumber>([^<]+)/)?.[1] || block.match(/<[\w:]*roadName>[\s\S]*?<[\w:]*value[^>]*>([^<]+)/)?.[1];
      const province = block.match(/<[\w:]*administrativeArea>[\s\S]*?<[\w:]*value[^>]*>([^<]+)/)?.[1];
      const lat = block.match(/<[\w:]*latitude>([^<]+)/)?.[1];
      const lon = block.match(/<[\w:]*longitude>([^<]+)/)?.[1];
      const pk = block.match(/<[\w:]*referencePointDistance>([^<]+)/)?.[1];
      const direction = block.match(/<[\w:]*directionNamed>([^<]+)/)?.[1] || block.match(/<[\w:]*directionRelative>([^<]+)/)?.[1];
      items.push({ id, roadName, province, lat, lon, pk: pk ? (parseFloat(pk)/1000).toFixed(3) : null, direction });
    }
    console.log("Sample items:", items);
  });
});
