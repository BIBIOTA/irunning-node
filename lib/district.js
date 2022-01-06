import fs from 'fs';
import * as d3 from 'd3';

/* 經緯度位置對應的鄉鎮區json */
const TwGeoJsonPath = process.cwd() + '/twGeoJson.json';
const TwGeoJson = JSON.parse(fs.readFileSync(TwGeoJsonPath, 'utf-8'))

export function district(lng, lat) {

  if (!lng && !lat) {
    return false;
  }

  const point = [lng, lat];
  
  const geoOut = TwGeoJson.features.filter((d) => {return d3.geoContains(d, point)});

  if (geoOut.length === 1) {
    const [geo] = geoOut;
    const { C_Name, T_Name } = geo.properties;
    return {C_Name, T_Name};
  }

  return false;
}