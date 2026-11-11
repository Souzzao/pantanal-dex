import {filterSpeciesCatalog} from '../shared/catalog';
import {writeFileSync} from 'node:fs';
const items=filterSpeciesCatalog();
writeFileSync('scripts/offline-catalog.json',JSON.stringify(items.map(({id,scientificName,commonName,images})=>({id,scientificName,commonName,images})),null,2));
console.log(JSON.stringify({total:items.length,withImages:items.filter(s=>s.images.length).length,missing:items.filter(s=>!s.images.length).map(s=>[s.id,s.scientificName])}));
