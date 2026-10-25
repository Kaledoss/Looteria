
'use strict';
// V8.8: GitHub Pages version.json polling (no forced reload, no local-save key changes).
const LOOTERIA_VERSION='11.4';
let looteriaUpdatePending=false;
function looteriaVersionParts(v){return String(v).split('.').map(x=>Number(x)||0)}
function looteriaNewer(remote,local){const a=looteriaVersionParts(remote),b=looteriaVersionParts(local);for(let i=0;i<Math.max(a.length,b.length);i++){if((a[i]||0)!==(b[i]||0))return (a[i]||0)>(b[i]||0)}return false}
async function looteriaCheckUpdate(){
 if(!navigator.onLine||looteriaUpdatePending)return;
 try{const url=new URL('version.json',location.href);url.search='?check='+Date.now();const response=await fetch(url.href,{cache:'no-store'});if(!response.ok)return;const info=await response.json();if(!info||typeof info.version!=='string'||!looteriaNewer(info.version,LOOTERIA_VERSION))return;
 looteriaUpdatePending=true;const banner=document.getElementById('looteria-update-banner');document.getElementById('looteria-update-title').textContent='🔔 Neue Version '+info.version+' verfügbar!';if(banner)banner.hidden=false;
 }catch(e){console.debug('Looteria: Updateprüfung momentan nicht möglich',e)}
}
function looteriaApplyUpdate(){
 try{save()}catch(e){console.error('Spielstand konnte nicht gespeichert werden',e);alert('Spielstand konnte nicht gespeichert werden. Bitte zuerst manuell speichern.');return}
 const url=new URL(location.href);url.searchParams.set('v',Date.now().toString());location.assign(url.href);
}
setTimeout(looteriaCheckUpdate,4000);setInterval(()=>{if(!document.hidden)looteriaCheckUpdate()},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)looteriaCheckUpdate()});
window.addEventListener('online',looteriaCheckUpdate);

const KEY='idle-realms-v01-save';
const R={oak:['🌳','Eichenholz'],birch:['🌿','Birkenholz'],spruce:['🌲','Fichtenholz'],darkoak:['🌳','Schwarzeichenholz'],acacia:['🌴','Akazienholz'],jungle:['🌴','Tropenholz'],mangrove:['🌱','Mangrovenholz'],cherry:['🌸','Kirschholz'],stone:['🪨','Stein'],coal:['⚫','Kohle'],copper:['🟠','Kupfererz'],iron:['⛓️','Eisenerz'],oakplank:['🟤','Eichenbretter'],birchplank:['🤍','Birkenbretter'],spruceplank:['🟫','Fichtenbretter'],cherryplank:['🌸','Kirschbretter'],brick:['🧱','Steinziegel'],copperbar:['🔶','Kupferbarren'],ironbar:['🔩','Eisenbarren'],gear:['⚙️','Zahnräder'],crystal:['🔮','Kristalle'],wheat:['🌾','Weizen'],carrot:['🥕','Karotten'],potato:['🥔','Kartoffeln'],beetroot:['🫜','Rote Bete'],pumpkin:['🎃','Kürbisse'],melon:['🍉','Melonen'],sugarcane:['🎋','Zuckerrohr'],netherwart:['🍄','Netherwarzen'],sweetberry:['🫐','Süßbeeren'],bread:['🍞','Brot'],sugar:['🍬','Zucker'],bakedpotato:['🥔','Ofenkartoffel'],beef:['🥩','Rindfleisch'],pork:['🍖','Schweinefleisch'],chicken:['🍗','Hühnerfleisch'],mutton:['🥩','Hammelfleisch'],leather:['🟤','Leder'],wool:['🧶','Wolle'],feather:['🪶','Federn']};
const woodRarities={oak:'common',birch:'common',spruce:'uncommon',darkoak:'rare',acacia:'rare',jungle:'epic',mangrove:'legendary',cherry:'mythic'};
const woodBonusChance={common:60,uncommon:40,rare:25,epic:12,legendary:6,mythic:2};
const woodRarityNames={common:'Gewöhnlich',uncommon:'Ungewöhnlich',rare:'Selten',epic:'Episch',legendary:'Legendär',mythic:'Mythisch'};
function woodRarityLabel(id){const rarity=woodRarities[id];return rarity?`<span class="wood-rarity rarity-${rarity}">✦ ${woodRarityNames[rarity]}</span>`:''}
const gathers=[{id:'oak',name:'Eichen fällen',icon:'🌳',base:1},{id:'birch',name:'Birken fällen',icon:'🌿',base:1,lv:5},{id:'spruce',name:'Fichten fällen',icon:'🌲',base:1,lv:12},{id:'darkoak',name:'Schwarzeichen fällen',icon:'🌳',base:1,lv:20,tech:'forestry'},{id:'acacia',name:'Akazien fällen',icon:'🌴',base:1,lv:30,tech:'forestry'},{id:'jungle',name:'Tropenbäume fällen',icon:'🌴',base:1,lv:42,tech:'forestry'},{id:'mangrove',name:'Mangroven fällen',icon:'🌱',base:1,lv:55,tech:'forestry'},{id:'cherry',name:'Kirschbäume fällen',icon:'🌸',base:1,lv:70,tech:'forestry'},{id:'stone',name:'Stein abbauen',icon:'⛏️',base:1},{id:'coal',name:'Kohle fördern',icon:'⚫',base:1,lv:8},{id:'copper',name:'Kupfer abbauen',icon:'🟠',base:1,lv:18},{id:'iron',name:'Eisen abbauen',icon:'⛓️',base:1,lv:32},{id:'crystal',name:'Kristalle suchen',icon:'🔮',base:1,lv:50}];
// Freischaltungen: Nur Eichenholz und Stein sind im Startgebiet direkt verfügbar.
const gatherGates={birch:{tech:'forestry'},spruce:{region:'hills'},darkoak:{region:'hills',tech:'forestry'},acacia:{region:'cavern',tech:'forestry'},jungle:{region:'cavern',tech:'forestry'},mangrove:{region:'ether',tech:'forestry'},cherry:{region:'ether',tech:'forestry'},coal:{region:'hills'},copper:{region:'cavern'},iron:{region:'cavern'},crystal:{region:'cavern'}};

// V9.5: Dauerhafte Rohstoff-Meilensteine. Ausschließlich selbst gesammelt / produziert.
const resourceProgression=[
 ['birch','oak',5000],['spruce','birch',15000],['darkoak','spruce',40000],['acacia','darkoak',100000],['jungle','acacia',250000],['mangrove','jungle',600000],['cherry','mangrove',1500000],
 ['coal','stone',10000],['copper','coal',35000],['iron','copper',100000],['crystal','iron',300000]
];
const fieldProgression=[
 ['carrotfarm','wheatfarm','wheat',3,3,5000],['potatofarm','carrotfarm','carrot',4,4,15000],['beetfarm','potatofarm','potato',5,5,40000],['pumpkinfarm','beetfarm','beetroot',6,6,100000],['melonfarm','pumpkinfarm','pumpkin',7,7,250000],['canefarm','melonfarm','melon',8,8,600000],['wartfarm','canefarm','sugarcane',9,9,1500000]
];
const livestockProgression=[['pigpen','cowpasture',2,3],['chickencoop','pigpen',3,4],['sheepfold','chickencoop',4,5]];
function producedTotal(id){return Math.max(0,(s.stats?.['manual_'+id]||0)+(s.stats?.['auto_'+id]||0))}
function buildingTierCount(id,tier){return (s.buildingTiers?.[id]||[]).filter(n=>n>=tier).length}
function progressionMissingResource(id){const r=resourceProgression.find(x=>x[0]===id);return r&&producedTotal(r[1])<r[2]?[`${R[r[1]][1]} selbst gesammelt/produziert: ${fmt(producedTotal(r[1]))} / ${fmt(r[2])}`]:[]}
function progressionMissingBuilding(id){const f=fieldProgression.find(x=>x[0]===id);if(f){const missing=[];if(buildingTierCount(f[1],f[4])<f[3])missing.push(`${f[3]} × ${buildings.find(b=>b.id===f[1])?.name||f[1]} auf Stufe ${f[4]} (${buildingTierCount(f[1],f[4])}/${f[3]})`);if(producedTotal(f[2])<f[5])missing.push(`${R[f[2]][1]} produziert: ${fmt(producedTotal(f[2]))}/${fmt(f[5])}`);return missing}const a=livestockProgression.find(x=>x[0]===id);return a&&buildingTierCount(a[1],a[3])<a[2]?[`${a[2]} × ${buildings.find(b=>b.id===a[1])?.name||a[1]} auf Stufe ${a[3]} (${buildingTierCount(a[1],a[3])}/${a[2]})`]:[]}
function progressUnlocked(id){s.progressUnlocked??=[];if(s.progressUnlocked.includes(id))return true;const missing=buildings.some(b=>b.id===id)?progressionMissingBuilding(id):progressionMissingResource(id);if(!missing.length){s.progressUnlocked.push(id);return true}return false}
function progressionRequirements(id){if(progressUnlocked(id))return [];return buildings.some(b=>b.id===id)?progressionMissingBuilding(id):progressionMissingResource(id)}
function progressCard(id,kind){const b=kind==='building'?buildings.find(x=>x.id===id):null;const r=kind==='resource'?resourceProgression.find(x=>x[0]===id):null;const f=fieldProgression.find(x=>x[0]===id);const a=livestockProgression.find(x=>x[0]===id);const name=b?.name||R[id]?.[1]||id;const requirements=progressionRequirements(id);let rows=[];if(r)rows=[[R[r[1]][1],producedTotal(r[1]),r[2]]];if(f)rows=[[`${buildings.find(x=>x.id===f[1])?.name} Stufe ${f[4]}`,buildingTierCount(f[1],f[4]),f[3]],[R[f[2]][1]+' produziert',producedTotal(f[2]),f[5]]];if(a)rows=[[`${buildings.find(x=>x.id===a[1])?.name} Stufe ${a[3]}`,buildingTierCount(a[1],a[3]),a[2]]];return `<div class="item"><h3>${progressUnlocked(id)?'✅':'🔒'} ${escapeHtml(name)}</h3>${rows.map(([label,current,target])=>`<p class="small">${escapeHtml(label)}: <b>${fmt(Math.min(current,target))} / ${fmt(target)}</b></p><div class="progress"><div class="bar" style="width:${Math.min(100,100*current/target)}%"></div></div>`).join('')}<p class="small">${requirements.length?requirements.map(escapeHtml).join(' · '):'Meilenstein dauerhaft erreicht ✓'}${!progressUnlocked(id)&&kind==='resource'?' · Zusätzlich gelten Level, Forschung und Gebiet.':''}</p></div>`}
function progressionPanel(){return `<section class="card"><h2>🔓 Rohstoff-Freischaltungen</h2><p>Manuelles Sammeln und automatische Produktion zählen zusammen. Verbrauch und Handel reduzieren den Fortschritt nicht. Bereits erreichte Freischaltungen bleiben erhalten. Zusätzliche Level-, Forschungs- und Gebietsbedingungen gelten weiterhin.</p></section><h3>🌳 Holz & ⛏️ Bergbau</h3><div class="grid">${resourceProgression.map(r=>progressCard(r[0],'resource')).join('')}</div><h3>🌾 Landwirtschaft</h3><div class="grid">${fieldProgression.map(r=>progressCard(r[0],'building')).join('')}</div><h3>🐄 Tierzucht</h3><div class="grid">${livestockProgression.map(r=>progressCard(r[0],'building')).join('')}</div>`}

function gateMissing(x){const missing=[];if(level()<(x.lv||1))missing.push('Spielerlevel '+x.lv);const gate=gatherGates[x.id]||{};const tech=x.tech||gate.tech;if(tech&&!s.upgrades.includes(tech))missing.push('Forschung: '+(allTechs.find(t=>t.id===tech)?.name||tech));if(gate.region&&!s.regions.includes(gate.region))missing.push('Gebiet: '+(regions.find(r=>r.id===gate.region)?.name||gate.region));return [...missing,...progressionRequirements(x.id)]}
function resourceGateMissing(id){return gateMissing(gathers.find(g=>g.id===id)||{id})}
const recipes=[{id:'oakplank',name:'Eichenbretter sägen',out:3,cost:{oak:2}},{id:'birchplank',name:'Birkenbretter sägen',out:3,cost:{birch:2},lv:5},{id:'spruceplank',name:'Fichtenbretter sägen',out:3,cost:{spruce:2},lv:12},{id:'cherryplank',name:'Kirschbretter sägen',out:3,cost:{cherry:2},lv:70},{id:'brick',name:'Ziegel fertigen',out:2,cost:{stone:3}},{id:'copperbar',name:'Kupfer schmelzen',out:1,cost:{copper:3,coal:1},lv:18},{id:'ironbar',name:'Eisen schmelzen',out:1,cost:{iron:3,coal:2},lv:32},{id:'gear',name:'Zahnräder fertigen',out:1,cost:{ironbar:2,copperbar:1},lv:32}];
const blueprintDefs=[
{id:'ancient_sawmill',name:'Bauplan: Uraltes Sägewerk',region:'hills',building:'ancient_sawmill'},
{id:'magma_forge',name:'Bauplan: Magmaschmiede',region:'cavern',building:'magma_forge'},
{id:'ether_collector',name:'Bauplan: Ätherkollektor',region:'ether',building:'ether_collector'}
];
function hasBlueprint(id){return (s.blueprints||[]).includes(id)}
// Bevölkerung und Reichsfläche: Häuser schaffen Wohnraum, Land begrenzt Bauplätze.
function houseTier(i){return Math.max(0,Math.min(5,Number(s.houseUpgrades?.[i])||0))}
function houseUpgradePrice(i){return Math.ceil(3*65*Math.pow(1.85,houseTier(i))*Math.pow(1.06,Math.max(0,Number(i)||0)))}
function houseUpgrade(i){i=Number(i);if(!Number.isInteger(i)||i<0||i>=(s.houses||1)||houseTier(i)>=5)return;const price=houseUpgradePrice(i);if(s.tradeCoins<price)return;s.tradeCoins-=price;s.houseUpgrades??=[];s.houseUpgrades[i]=houseTier(i)+1;updateTalerDisplay();log('🏠 Wohnhaus '+(i+1)+' verbessert: Stufe '+houseTier(i)+'/5 · +1 Einwohner');save();render()}
function residents(){return Math.max(2,(s.houses||1)*2)+(s.houseUpgrades||[]).slice(0,s.houses||1).reduce((n,_,i)=>n+houseTier(i),0)}
const animalBuildingIds=['cowpasture','pigpen','chickencoop','sheepfold'];
function animalCount(){return animalBuildingIds.reduce((n,id)=>n+2*Math.max(0,Number(s.buildings?.[id])||0),0)}
function animalWorkers(){return Math.ceil(animalCount()/5)}
function buildingWorkers(){return Object.entries(s.buildings||{}).reduce((a,[id,n])=>a+(animalBuildingIds.includes(id)?0:Math.max(0,Number(n)||0)),0)+animalWorkers()+Object.values(s.buildingTiers||{}).reduce((a,arr)=>a+arr.reduce((z,n)=>z+Math.floor(n/5),0),0)}
function workersNeededForBuild(b){return animalBuildingIds.includes(b.id)?Math.ceil((animalCount()+2)/5)-animalWorkers():1}
function researchWorkers(){return (s.researches||[]).length}
function expeditionWorkers(){return s.expedition?5:0}
function tavernOrders(){if(!Array.isArray(s.tavernOrders))s.tavernOrders=s.tavernOrder?[s.tavernOrder]:[];return s.tavernOrders}
function tavernCapacity(){return Math.max(0,(s.buildings.tavern||0)*2)}
function tavernWorkers(){return tavernOrders().length}
function constructionWorkers(){return (s.constructions||[]).length}
function occupiedResidents(){return buildingWorkers()+researchWorkers()+expeditionWorkers()+tavernWorkers()+constructionWorkers()}
function freeResidents(){return Math.max(0,residents()-occupiedResidents())}
function usedPlots(){return Object.values(s.buildings||{}).reduce((a,n)=>a+(Number(n)||0),0)+(s.houses||1)+(s.constructions||[]).length}
function plotLimit(){return 8+(s.realmLevel||0)*5}
function housePrice(){return Math.ceil(120*Math.pow(1.65,Math.max(0,(s.houses||1)-1)))}
function expansionPrice(){return Math.ceil(300*Math.pow(1.8,s.realmLevel||0))}
function updateTalerDisplay(){const el=document.getElementById('trade-coins');if(el)el.textContent='💰 '+fmt(s.tradeCoins??250)+' Looterianische Taler'}
function buyHouse(){const price=housePrice();if(usedPlots()>=plotLimit()||s.tradeCoins<price)return;s.tradeCoins-=price;updateTalerDisplay();s.houses=(s.houses||1)+1;s.houseUpgrades??=[];log('🏠 Wohnhaus gekauft · Einwohner '+residents());save();render()}
// Reichstitel sind an Reichserweiterungen gebunden; jede Stufe besitzt einen eigenen Namen.
const realmRankNames=['Siedlung','Weiler','Dorf','Großdorf','Marktflecken','Kleinstadt','Stadt','Handelsstadt','Festungsstadt','Freie Stadt','Grafschaft','Markgrafschaft','Fürstentum','Herzogtum','Großherzogtum','Königreich','Großkönigreich','Kaiserreich','Imperium','Weltreich','Legendäres Reich','Mythisches Reich'];
function realmRankName(stage=s.realmLevel||0){stage=Math.max(0,Math.floor(Number(stage)||0));return realmRankNames[stage]||('Ewiges Reich · Rang '+(stage-realmRankNames.length+2))}
function realmName(){return typeof s.realmName==='string'&&s.realmName.trim()?s.realmName.trim():'Looteria'}
function renameRealm(){const proposed=prompt('Wie soll dein Reich heißen? (2–28 Zeichen)',realmName());if(proposed===null)return;const name=proposed.trim().replace(/\s+/g,' ');if(name.length<2||name.length>28||/[<>\x00-\x1f]/.test(name)){notify('❌ Reichsname: 2–28 Zeichen, keine Sonderzeichen < oder >.');return}s.realmName=name;save();render();notify('🏰 Dein Reich heißt jetzt '+name)}
function updateRealmHeader(){const name=document.getElementById('realm-display-name'),rank=document.getElementById('realm-display-title');if(name)name.textContent=realmName();if(rank)rank.textContent='('+realmRankName()+')'}
function realmExpansionAchievement(){const stage=Math.max(0,Math.floor(s.realmLevel||0)),next=stage+1;return `<section class="card realm-achievement"><h3>🏰 Reichserweiterungen · Herrschertitel</h3><p>Dein Reich: <b>${escapeHtml(realmName())}</b> <span class="rarity-label rarity-${milestoneRarity(stage)}">(${escapeHtml(realmRankName(stage))})</span></p><span class="badge earned">Stufe ${stage}</span> <span class="small rarity-label rarity-${milestoneRarity(stage)}">${rarityNames[milestoneRarity(stage)]}</span><p class="small">Jede Reichserweiterung schaltet einen neuen, einzigartigen Titel frei. Bereits erreichte Titel bleiben in der Chronik erhalten.</p><div class="progress"><div class="bar" style="width:100%"></div></div><div class="milestone-reward">🎁 Je Erweiterung: <b>+10 Ruhmpunkte</b>, XP und ein neuer Reichstitel.<br>✨ Nächste Erweiterung: <b>+${fmt(xpForRealm(next))} XP</b><br>🏅 Nächster Titel (Stufe ${next}): <b>${escapeHtml(realmRankName(next))}</b><br>💰 Nächste Erweiterung: ${fmt(expansionPrice())} Taler · +5 Bauplätze</div><details><summary>📜 Bisher erreichte Reichstitel</summary><p class="small">${Array.from({length:Math.min(stage+1,200)},(_,i)=>`${i===stage?'👑':'✓'} Stufe ${i}: ${escapeHtml(realmRankName(i))}`).join('<br>')}${stage>=200?'<br>… weitere Titel erreicht':''}</p></details></section>`}
function expandRealm(){const price=expansionPrice();if(s.tradeCoins<price)return;s.tradeCoins-=price;updateTalerDisplay();s.realmLevel=(s.realmLevel||0)+1;s.coins+=10;log('🏆 Reichserweiterung Stufe '+s.realmLevel+': '+realmRankName()+' (+10 Ruhmpunkte)');notify('🏆 Neuer Reichstitel: '+realmRankName()+' · +10 Ruhmpunkte');syncAchievementXp();save();render()}
const MAX_BUILDING_TIER=10;
function syncBuildingTiers(){s.buildingTiers??={};for(const [id,count] of Object.entries(s.buildings||{})){let arr=s.buildingTiers[id];if(!Array.isArray(arr)){arr=Array(Math.max(0,count)).fill(0);if(arr.length)arr[0]=Math.min(MAX_BUILDING_TIER,Math.max(0,Number(s.buildingUpgrades?.[id])||0));s.buildingTiers[id]=arr;}while(arr.length<count)arr.push(0);if(arr.length>count)arr.length=count;}}
function buildingTier(id,i){syncBuildingTiers();return s.buildingTiers[id]?.[i]||0}
function buildingUpgradeCost(b,i=0){const tier=buildingTier(b.id,i);return Math.ceil(80*Math.pow(2.2,tier)*(1+(b.lv||1)/12)*Math.pow(1.06,Math.max(0,Number(i)||0)))}
function buildingUpgradeMissing(b,i=0){const tier=buildingTier(b.id,i);if(tier>=MAX_BUILDING_TIER)return ['Maximalstufe erreicht'];return (tier+1)%5===0&&freeResidents()<1?['1 freier Einwohner für jede 5. Upgrade-Stufe benötigt']:[]}
function upgradeBuilding(id,i=0){const b=buildings.find(x=>x.id===id);if(!b||i<0||i>=(s.buildings[id]||0))return;const price=buildingUpgradeCost(b,i);if(buildingUpgradeMissing(b,i).length||s.tradeCoins<price)return;s.tradeCoins-=price;s.buildingTiers[id][i]++;s.buildingUpgrades[id]=Math.max(...s.buildingTiers[id]);log('⬆️ '+b.name+' #'+(i+1)+' verbessert auf Stufe '+s.buildingTiers[id][i]);save();render()}
function buildingInstancesPanel(b){syncBuildingTiers();return Array.from({length:s.buildings[b.id]||0},(_,i)=>{const tier=buildingTier(b.id,i),max=tier>=MAX_BUILDING_TIER,price=buildingUpgradeCost(b,i),missing=buildingUpgradeMissing(b,i);return `<div class="building-instance"><b class="${max?'map-max-upgrade':missing.length||s.tradeCoins<price?'map-no-upgrade':''}">${b.icon} ${b.name} #${i+1}</b><span>Stufe ${tier}/${MAX_BUILDING_TIER} · +${tier*10}% Ertrag</span>${max?'<strong class="map-max-upgrade">✓ Vollständig ausgebaut</strong>':`<span>💰 ${fmt(price)} Taler${missing.length?' · '+missing.join(', '):''}</span><button type="button" onclick="upgradeBuilding('${b.id}',${i})" ${missing.length||s.tradeCoins<price?'disabled':''}>⬆️ Dieses Gebäude verbessern</button>`}</div>`}).join('')}
function researchTalerCost(u){return Math.ceil(20+(u.lv||1)*15+u.duration/15)}
function canFinanceResearch(u){return (s.tradeCoins||0)>=researchTalerCost(u)}
function realmPanel(showHouseUpgrades=true){return `<section class="card"><h2>🏰 Reich & Bevölkerung</h2><div class="row"><span>👥 Einwohner: <b>${residents()}</b></span><span>👷 Belegt: <b>${occupiedResidents()}</b></span><span>🟢 Frei: <b>${freeResidents()}</b></span><span>🧪 Forschung: <b>${researchWorkers()}</b></span><span>🧭 Expedition: <b>${expeditionWorkers()}</b></span><span>🍻 Tavernenauftrag: <b>${tavernWorkers()}</b></span><span>🏗️ Baustellen: <b>${constructionWorkers()}</b></span><span>🏠 Wohnhäuser: <b>${s.houses||1}</b></span></div><div class="row"><span>🗺️ Belegte Bauplätze</span><b>${usedPlots()} / ${plotLimit()}</b></div><div class="progress"><div class="bar" style="width:${Math.min(100,usedPlots()/plotLimit()*100)}%"></div></div><p class="small">Ein Wohnhaus bietet zunächst Platz für 2 Einwohner. Mit 5 Wohnhaus-Upgrades schafft jedes Haus bis zu 7 Plätze (+1 pro Stufe). Jedes Haus belegt 1 Bauplatz. Jedes Feld und normale Produktionsgebäude beschäftigen 1 Einwohner. In der Tierzucht versorgt 1 Einwohner bis zu 5 Tiere; jedes Tiergebäude beherbergt 2 Tiere. Alle 5 Produktivitäts-Upgrades wird 1 zusätzlicher Einwohner benötigt. Weitere Gebäude desselben Typs kosten jeweils 65 % mehr Materialien; auch spätere Gebäude-Upgrades werden teurer. Gebäude haben eine Bauzeit. Jede Baustelle benötigt vorübergehend 1 Einwohner und 1 Bauplatz. Weitere parallele Baustellen schaltest du durch Bauforschung frei.</p><div class="row"><span>🏠 Neues Wohnhaus · 💰 ${fmt(housePrice())} Looterianische Taler</span>${button('Haus kaufen','buyHouse()',usedPlots()>=plotLimit()||s.tradeCoins<housePrice())}</div>${showHouseUpgrades?`<h3>🏠 Wohnhäuser ausbauen</h3><p class="small">Jedes Wohnhaus besitzt 5 Ausbaustufen. Pro Upgrade erhältst du dauerhaft Platz für 1 zusätzlichen Einwohner. Maximal 7 Einwohner pro Haus.</p><div class="grid">${Array.from({length:s.houses||1},(_,i)=>`<div class="item"><b>🏠 Wohnhaus ${i+1}</b><div class="small">Stufe ${houseTier(i)}/5 · 👥 ${2+houseTier(i)}/7 Einwohner</div>${houseTier(i)<5?`<div class="small">⬆️ Nächste Stufe: 💰 ${fmt(houseUpgradePrice(i))} Taler</div>${button('Haus verbessern',`houseUpgrade(${i})`,s.tradeCoins<houseUpgradePrice(i))}`:'<div class="small" style="color:#8fe2a9">✓ Vollständig ausgebaut</div>'}</div>`).join('')}</div>`:''}<div class="row"><span>🗺️ +5 Bauplätze · 💰 ${fmt(expansionPrice())} Looterianische Taler</span>${button('Reich erweitern','expandRealm()',s.tradeCoins<expansionPrice())}</div></section>`}
function buildingMissing(b){return [...((s.constructions||[]).length>=constructionSlots()?["Alle Bauplätze für gleichzeitige Bauaufträge belegt"]:[]),...(b.tech&&!s.upgrades.includes(b.tech)?['Forschung: '+(allTechs.find(x=>x.id===b.tech)?.name||b.tech)]:[]),...(freeResidents()<workersNeededForBuild(b)?[workersNeededForBuild(b)+' freie Einwohner benötigt']:[]),...(b.blueprint&&!hasBlueprint(b.blueprint)?['Bauplan: '+(blueprintDefs.find(x=>x.id===b.blueprint)?.name||b.blueprint)]:[]),...(level()<(b.lv||1)?['Level '+b.lv]:[]),...Object.keys(b.prod).flatMap(id=>resourceGateMissing(id)),...progressionRequirements(b.id)]}
const buildings=[{id:'oakgrove',name:'Eichenforst',icon:'🌳',desc:'Produziert Eichenholz.',prod:{oak:.28},cost:{oak:18,stone:8},lv:2},{id:'birchgrove',name:'Birkenforst',icon:'🌿',desc:'Produziert Birkenholz.',prod:{birch:.23},cost:{birch:24,stone:14},lv:5},{id:'sprucegrove',name:'Fichtenforst',icon:'🌲',desc:'Produziert Fichtenholz.',prod:{spruce:.22},cost:{spruce:28,stone:18},lv:12},{id:'quarry',name:'Steinbruch',icon:'🏔️',desc:'Fördert Stein.',prod:{stone:.4},cost:{oak:20,stone:18},lv:2},{id:'coalMine',name:'Kohlemine',icon:'⚫',desc:'Fördert Kohle.',prod:{coal:.25},cost:{oak:35,stone:35,oakplank:8},lv:8},{id:'copperMine',name:'Kupfermine',icon:'🟠',desc:'Fördert Kupfererz.',prod:{copper:.18},cost:{stone:70,oakplank:18,brick:8},lv:18},{id:'ironMine',name:'Eisenmine',icon:'⛓️',desc:'Fördert Eisenerz.',prod:{iron:.14},cost:{stone:100,oakplank:28,copperbar:8},lv:32},{id:'ancient_sawmill',name:'Uraltes Sägewerk',icon:'📜',desc:'Spezialgebäude aus einem Expeditionsbauplan. Produziert Eichen- und Birkenbretter.',prod:{oakplank:.25,birchplank:.12},cost:{oakplank:90,birchplank:35,brick:45},lv:12,blueprint:'ancient_sawmill'},{id:'magma_forge',name:'Magmaschmiede',icon:'🔥',desc:'Spezialgebäude aus einem Expeditionsbauplan. Schmilzt Metallbarren.',prod:{copperbar:.12,ironbar:.06},cost:{spruceplank:65,brick:120,ironbar:18},lv:32,blueprint:'magma_forge'},{id:'ether_collector',name:'Ätherkollektor',icon:'🌌',desc:'Spezialgebäude aus einem Expeditionsbauplan. Sammelt Kristalle.',prod:{crystal:.08},cost:{cherryplank:20,gear:22,ironbar:80},lv:70,blueprint:'ether_collector'},{id:'wheatfarm',name:'Weizenfeld',icon:'🌾',desc:'Erntet Weizen automatisch.',prod:{wheat:.35},cost:{oak:25,stone:12},lv:2,tech:'agriculture'},
{id:'carrotfarm',name:'Karottenfeld',icon:'🥕',desc:'Erntet Karotten.',prod:{carrot:.26},cost:{oak:40,stone:22,wheat:30},lv:5,tech:'rootcrops'},
{id:'potatofarm',name:'Kartoffelfeld',icon:'🥔',desc:'Erntet Kartoffeln.',prod:{potato:.26},cost:{oak:40,stone:22,wheat:30},lv:5,tech:'rootcrops'},
{id:'beetfarm',name:'Rote-Bete-Feld',icon:'🫜',desc:'Erntet Rote Bete.',prod:{beetroot:.22},cost:{oak:55,stone:35,carrot:20},lv:8,tech:'advancedfarming'},
{id:'pumpkinfarm',name:'Kürbisfeld',icon:'🎃',desc:'Erntet Kürbisse.',prod:{pumpkin:.16},cost:{oak:70,stone:40,potato:35},lv:10,tech:'advancedfarming'},
{id:'melonfarm',name:'Melonenfeld',icon:'🍉',desc:'Erntet Melonen.',prod:{melon:.18},cost:{oak:85,stone:45,carrot:40},lv:12,tech:'advancedfarming'},
{id:'canefarm',name:'Zuckerrohrplantage',icon:'🎋',desc:'Erntet Zuckerrohr.',prod:{sugarcane:.2},cost:{oak:95,stone:60,melon:20},lv:14,tech:'sugarfarming'},
{id:'berryfarm',name:'Süßbeerenhecke',icon:'🫐',desc:'Erntet Süßbeeren.',prod:{sweetberry:.3},cost:{oak:60,stone:30},lv:8,tech:'advancedfarming'},
{id:'wartfarm',name:'Netherwarzenbeet',icon:'🍄',desc:'Züchtet Netherwarzen.',prod:{netherwart:.11},cost:{stone:180,brick:100,crystal:12},lv:32,tech:'netherfarming'},
{id:'cowpasture',name:'Kuhweide',icon:'🐄',desc:'Züchtet Kühe: Fleisch und Leder.',prod:{beef:.08,leather:.035},cost:{oak:65,stone:35,wheat:45},lv:5,tech:'animalhusbandry'},
{id:'pigpen',name:'Schweinestall',icon:'🐖',desc:'Züchtet Schweine für Fleisch.',prod:{pork:.1},cost:{oak:80,stone:40,carrot:35},lv:7,tech:'animalhusbandry'},
{id:'chickencoop',name:'Hühnerstall',icon:'🐔',desc:'Züchtet Hühner für Fleisch und Federn.',prod:{chicken:.075,feather:.07},cost:{oak:75,stone:40,wheat:45},lv:6,tech:'animalhusbandry'},
{id:'sheepfold',name:'Schafweide',icon:'🐑',desc:'Züchtet Schafe: Hammelfleisch und Wolle.',prod:{mutton:.075,wool:.055},cost:{oak:95,stone:45,wheat:65},lv:9,tech:'animalhusbandry'},
{id:'tavern',name:'Taverne',icon:'🍻',desc:'Verkauft zubereitete Speisen und Tränke für Looterianische Taler. Beschäftigt 1 Einwohner.',prod:{},cost:{oakplank:65,stone:80,brick:30,wheat:50},lv:5,tech:'tavernkeeping'},
{id:'arcane',name:'Kristallbohrer',icon:'✨',desc:'Sammelt seltene Kristalle.',prod:{crystal:.035},cost:{gear:10,ironbar:25,brick:70},lv:50}];
const farmTechs=[
{id:'agriculture',name:'Grundlagen des Ackerbaus',branch:'Landwirtschaft',desc:'Schaltet Weizenfelder frei.',cost:{oak:35,stone:25},lv:2,duration:70},
{id:'rootcrops',name:'Wurzelgemüse-Anbau',branch:'Landwirtschaft',desc:'Karotten und Kartoffeln anbauen.',cost:{wheat:50,oak:40},lv:5,duration:150,requires:['agriculture']},
{id:'advancedfarming',name:'Vielfältige Feldfrüchte',branch:'Landwirtschaft',desc:'Rote Bete, Kürbisse, Melonen und Süßbeeren.',cost:{carrot:35,potato:35,stone:50},lv:8,duration:280,requires:['rootcrops']},
{id:'sugarfarming',name:'Zuckerrohranbau',branch:'Landwirtschaft',desc:'Schaltet Zuckerrohrplantagen frei.',cost:{melon:40,wheat:100},lv:14,duration:420,requires:['advancedfarming']},
{id:'netherfarming',name:'Nethergewächse',branch:'Landwirtschaft',desc:'Netherwarzen für seltene Braurezepte.',cost:{crystal:15,brick:100},lv:32,duration:900,requires:['sugarfarming']},
{id:'tavernkeeping',name:'Tavernenwirtschaft',branch:'Gastronomie',desc:'Taverne bauen und Speisen verkaufen.',cost:{wheat:80,oakplank:35,stone:45},lv:5,duration:200,requires:['agriculture']},
{id:'cooking',name:'Kochkunst',branch:'Gastronomie',desc:'Schaltet zusätzliche Gerichte frei.',cost:{potato:50,carrot:50,wheat:100},lv:8,duration:350,requires:['tavernkeeping','rootcrops']},
{id:'brewing',name:'Braukunst',branch:'Gastronomie',desc:'Schaltet Getränke und Tränke frei.',cost:{sugarcane:60,melon:40,brick:60},lv:14,duration:600,requires:['tavernkeeping','sugarfarming']}
];
const upgrades=[{id:'axe',name:'Stärkere Werkzeuge',desc:'+1 pro manuellem Sammeln.',cost:{oak:30,stone:25},lv:2,duration:45},{id:'tools2',name:'Verstärkte Werkzeuge',desc:'+2 pro manuellem Sammeln.',cost:{ironbar:12,oakplank:30},lv:5,requires:'axe',duration:180},{id:'engines',name:'Verbesserte Antriebe',desc:'+50 % automatische Produktion.',cost:{coal:45,brick:25,oakplank:20},lv:4,duration:120},{id:'automation',name:'Automationskern',desc:'Verdoppelt automatische Produktion.',cost:{gear:15,crystal:5},lv:8,requires:'engines',duration:480}];
const techs=[
{id:'science',name:'Wissenschaftliche Grundlagen',branch:'Wissenschaft',desc:'Erschließt Forschungslabore.',cost:{oak:45,stone:40},duration:90,lv:2},
{id:'lab1',name:'Forschungslabor I',branch:'Wissenschaft',desc:'Schaltet den zweiten Forschungsplatz frei.',cost:{oakplank:35,brick:25},duration:300,lv:3,requires:['science'],slots:2},
{id:'lab2',name:'Forschungslabor II',branch:'Wissenschaft',desc:'Schaltet den dritten Forschungsplatz frei.',cost:{copperbar:25,ironbar:15,gear:5},duration:1800,lv:6,requires:['lab1','engines'],slots:3,skill:{research:8}},
{id:'lab3',name:'Forschungszentrum',branch:'Wissenschaft',desc:'Schaltet den vierten Forschungsplatz frei.',cost:{gear:40,ironbar:70,crystal:15},duration:14400,lv:9,requires:['lab2','automation'],slots:4,skill:{research:20}},
{id:'lab4',name:'Wissenschaftsakademie',branch:'Wissenschaft',desc:'Schaltet den fünften Forschungsplatz frei.',cost:{gear:160,ironbar:250,crystal:100},duration:86400,lv:12,requires:['lab3','deep'],slots:5,skill:{research:35}},
{id:'construction2',name:'Parallele Bauplanung I',branch:'Bauwesen',desc:'Erlaubt 2 gleichzeitige Baustellen.',cost:{oakplank:35,stone:65},duration:300,lv:4,requires:['science'],constructionSlots:2},
{id:'construction3',name:'Parallele Bauplanung II',branch:'Bauwesen',desc:'Erlaubt 3 gleichzeitige Baustellen.',cost:{brick:90,copperbar:20},duration:1200,lv:10,requires:['construction2'],constructionSlots:3},
{id:'construction4',name:'Königliche Bauverwaltung',branch:'Bauwesen',desc:'Erlaubt 4 gleichzeitige Baustellen.',cost:{ironbar:55,gear:20},duration:3600,lv:20,requires:['construction3'],constructionSlots:4},
{id:'mining1',name:'Geologie',branch:'Bergbau',desc:'Grundlage für tiefere Lagerstätten.',cost:{stone:65,coal:15},duration:180,lv:3},
{id:'mining2',name:'Tiefenbergbau',branch:'Bergbau',desc:'Neue Methoden für tiefe Erzlager.',cost:{ironbar:20,brick:50},duration:3600,lv:6,requires:['mining1','tools2'],skill:{mining:12}},
{id:'deep',name:'Dimensionsbergbau',branch:'Bergbau',desc:'Bereitet den Abbau jenseits der bekannten Welt vor.',cost:{crystal:65,gear:70},duration:604800,lv:10,requires:['mining2','automation'],skill:{mining:35}},
{id:'forestry',name:'Nachhaltige Forstwirtschaft',branch:'Natur',desc:'Spezialisierung auf Holzgewinnung.',cost:{oak:90,oakplank:15},duration:600,lv:3,skill:{forestry:5}},
{id:'arcana',name:'Kristallkunde',branch:'Magie',desc:'Grundlagen arkaner Materialien.',cost:{crystal:12,ironbar:8},duration:7200,lv:8,requires:['mining1']}
];
for(const u of upgrades){u.branch=u.id==='engines'||u.id==='automation'?'Industrie':'Handwerk';if(u.requires)u.requires=[u.requires];u.skill=u.id==='tools2'?{mining:5}:undefined}
const animalTechs=[{id:'animalhusbandry',name:'Grundlagen der Tierzucht',branch:'Tierzucht',desc:'Schaltet Weiden und Ställe für Nutztiere frei.',cost:{wheat:60,oak:70,stone:45},duration:240,lv:5,requires:['agriculture']},{id:'butchery',name:'Fleischverarbeitung',branch:'Gastronomie',desc:'Neue Fleischgerichte für die Taverne.',cost:{beef:15,pork:15,coal:25},duration:480,lv:8,requires:['animalhusbandry','cooking']},{id:'leatherworking',name:'Gerberei & Wollverarbeitung',branch:'Handwerk',desc:'Verarbeitung tierischer Nebenprodukte.',cost:{leather:18,wool:15,oakplank:25},duration:600,lv:10,requires:['animalhusbandry']}];
const decorTechs=[
{id:'decor1',name:'Wege & Gärten',branch:'Stadtgestaltung',desc:'Schaltet Pflasterwege, Blumenbeete und Laternen auf der Reichskarte frei.',cost:{oak:55,stone:75},duration:240,lv:4,requires:['science']},
{id:'decor2',name:'Wasserbau',branch:'Stadtgestaltung',desc:'Schaltet Teiche, Flussstücke und Brücken frei.',cost:{stone:140,oakplank:70,brick:35},duration:720,lv:9,requires:['decor1']},
{id:'decor3',name:'Stadtbefestigung',branch:'Stadtgestaltung',desc:'Schaltet Stadtmauern, Türme und Stadttore frei.',cost:{brick:160,stone:220,ironbar:20},duration:1800,lv:15,requires:['decor2']},
{id:'decor4',name:'Königliche Baukunst',branch:'Stadtgestaltung',desc:'Schaltet Schloss, Brunnen und Statuen frei.',cost:{brick:350,ironbar:75,crystal:15},duration:5400,lv:25,requires:['decor3']}
];
const mapDecorations=[
{id:'path',name:'Pflasterweg',icon:'🟫',tech:'decor1',cost:{stone:2}},
{id:'flowers',name:'Blumenbeet',icon:'🌷',tech:'decor1',cost:{oak:2}},
{id:'lantern',name:'Laterne',icon:'🏮',tech:'decor1',cost:{oakplank:2,coal:1}},
{id:'pond',name:'Teich',icon:'💧',tech:'decor2',cost:{stone:5}},
{id:'river',name:'Fluss',icon:'🌊',tech:'decor2',cost:{stone:4}},
{id:'bridge',name:'Brücke',icon:'🌉',tech:'decor2',cost:{oakplank:7,stone:3}},
{id:'wall',name:'Stadtmauer',icon:'🧱',tech:'decor3',cost:{brick:6}},
{id:'tower',name:'Wachturm',icon:'🗼',tech:'decor3',cost:{brick:12,ironbar:2}},
{id:'gate',name:'Stadttor',icon:'⛩️',tech:'decor3',cost:{brick:15,oakplank:10}},
{id:'castle',name:'Schloss',icon:'🏰',tech:'decor4',cost:{brick:100,ironbar:25,crystal:5}},
{id:'fountain',name:'Brunnen',icon:'⛲',tech:'decor4',cost:{stone:25,ironbar:3}},
{id:'statue',name:'Königsstatue',icon:'🗿',tech:'decor4',cost:{stone:40,ironbar:5}}
];
const allTechs=[...upgrades,...techs,...farmTechs,...animalTechs,...decorTechs];
function skillLevel(k){return Math.floor(Math.sqrt((s.skillXp?.[k]||0)/12))+1}
function addSkill(k,n){s.skillXp??={};s.skillXp[k]=(s.skillXp[k]||0)+n;checkMilestones()}
function constructionSlots(){return Math.max(1,...allTechs.filter(u=>s.upgrades.includes(u.id)).map(u=>u.constructionSlots||1))}
function slots(){return Math.max(1,...allTechs.filter(u=>s.upgrades.includes(u.id)).map(u=>u.slots||1))}
function researchMissing(u){let a=[];if(level()<(u.lv||1))a.push('Spielerlevel '+u.lv);for(const id of u.requires||[])if(!s.upgrades.includes(id))a.push('Forschung: '+(allTechs.find(x=>x.id===id)?.name||id));for(const [k,v] of Object.entries(u.skill||{}))if(skillLevel(k)<v)a.push('Skill '+({research:'Wissenschaft',mining:'Bergbau',forestry:'Forstwirtschaft'}[k]||k)+' '+v);return a}
function researchQueueAvailable(){return s.upgrades.includes('lab2')}
function startQueued(){if(!researchQueueAvailable())return;let changed=false;while(s.researches.length<slots()&&s.queue.length){const id=s.queue[0],u=allTechs.find(x=>x.id===id);if(!u||s.upgrades.includes(id)||s.researches.some(x=>x.id===id)){s.queue.shift();changed=true;continue}if(researchMissing(u).length||!canPay(u.cost)||!canFinanceResearch(u)||freeResidents()<1)break;s.queue.shift();pay(u.cost);s.tradeCoins-=researchTalerCost(u);const now=Date.now();s.researches.push({id,started:now,ends:now+Math.max(10,Math.round(u.duration*(1-achievementBonus('research'))))*1000});completePinnedTarget('research',id);log('🧪 Warteschlange gestartet: '+u.name);changed=true}if(changed)save()}
function queueResearch(id){const u=allTechs.find(x=>x.id===id);if(!researchQueueAvailable()||!u||s.queue.includes(id)||s.researches.some(x=>x.id===id)||s.upgrades.includes(id)||s.queue.length>=8)return;s.queue.push(id);save();render()}
function unqueue(id){s.queue=s.queue.filter(x=>x!==id);save();render()}
const progressionAchievements=[...resourceProgression.map(([id,prev,n])=>['unlock_'+id,'Rohstoffmeister: '+R[id][1],'Produziere '+n.toLocaleString('de-DE')+' '+R[prev][1]+'.',id]),...fieldProgression.map(([id])=>['unlock_'+id,'Feldmeister: '+(buildings.find(b=>b.id===id)?.name||id),'Erfülle die Feldvoraussetzungen.',id]),...livestockProgression.map(([id])=>['unlock_'+id,'Viehzuchtmeister: '+(buildings.find(b=>b.id===id)?.name||id),'Erfülle die Tierzuchtvoraussetzungen.',id])];
const achievements=[['first','Erste Schritte','Sammle deine erste Ressource.'],['builder','Baumeister','Errichte ein Gebäude.'],['crafter','Handwerker','Stelle etwas her.'],['hundred','Sammler','Besitze insgesamt 100 Ressourcen.'],['factory','Industriepionier','Besitze 10 Gebäude.'],['explorer','Entdecker','Entdecke drei Gebiete.'],['scholar','Forscher','Erforsche zwei Verbesserungen.'],['livestock','Viehwirt','Errichte einen Tierstall.'],['tavernkeeper','Gastwirt','Empfange 10 Besucher.'],['gourmet','Gourmet','Verdiene 1.000 Taler in der Taverne.'],['merchant','Sonderhändler','Nutze den wandernden Händler.'],['taskmaster','Aufgabenmeister','Schließe 5 Tages- oder Wochenaufgaben ab.'],['farmer','Ackerbauer','Errichte ein Feld.'],['homeowner','Siedler','Besitze 5 Wohnhäuser.'],['expeditions','Abenteurer','Schließe eine Expedition ab.'],['blueprinter','Bauplansammler','Finde einen Bauplan.'],['upgrader','Optimierer','Kaufe ein Produktivitäts-Upgrade.'],['marketman','Kaufmann','Verkaufe 100 Ressourcen.'],['chef','Küchenmeister','Bereite 5 Tavernengerichte zu.'],['playtime','Zeitreisender','Spiele insgesamt 60 Minuten aktiv.']].concat(progressionAchievements.map(([id,name,desc])=>[id,name,desc]));
const regions=[
{id:'forest',name:'Grünwald',icon:'🌳',desc:'Uralte Wälder und sanfte Hügel.',lv:1},
{id:'hills',name:'Steinmark',icon:'⛰️',desc:'Reiche Gesteinsschichten und Kohleflöze.',lv:2,duration:120,cost:{oak:50,stone:60},chance:95,requires:['science']},
{id:'cavern',name:'Glutgrotten',icon:'🌋',desc:'Kupfer, Eisen und vulkanische Tiefen.',lv:5,duration:600,cost:{oakplank:25,brick:30,coal:20},chance:78,requires:['mining1','engines'],skill:{mining:5}},
{id:'ether',name:'Ätherklippen',icon:'🌌',desc:'Geheimnisvolle Kristalle und uralte Magie.',lv:9,duration:3600,cost:{ironbar:25,gear:5,brick:80},chance:60,requires:['arcana','mining2'],skill:{exploration:3}}
];
function expeditionMissing(r){const missing=[];if(level()<(r.lv||1))missing.push('Spielerlevel '+r.lv);for(const id of r.requires||[])if(!s.upgrades.includes(id))missing.push('Forschung: '+(allTechs.find(x=>x.id===id)?.name||id));for(const [key,lv] of Object.entries(r.skill||{}))if(skillLevel(key)<lv)missing.push('Skill '+(skillDefs.find(x=>x[0]===key)?.[2]||key)+' '+lv);return missing}
function expeditionChance(r){const base=r.chance??100;const bonus=Math.min(15,Math.floor((skillLevel('exploration')-1)/3)*2);const streak=(s.expeditionFails?.[r.id]||0);return Math.min(98,base+bonus+Math.min(35,streak*10))}
function expeditionBlueprint(r){const b=blueprintDefs.find(x=>x.region===r.id);if(!b)return null;s.blueprints??=[];if(!s.blueprints.includes(b.id)){s.blueprints.push(b.id);record('blueprints',1);return b.name}return null}

function initial(){return {version:1,res:Object.fromEntries(Object.keys(R).map(k=>[k,0])),xp:0,coins:0,tradeCoins:250,houses:1,houseUpgrades:[],realmLevel:0,realmName:"Looteria",buildingUpgrades:{},buildingTiers:{},tradeStats:{bought:0,sold:0,earned:0,spent:0},buildings:{},upgrades:[],regions:['forest'],blueprints:[],expedition:null,constructions:[],tavernOrder:null,tavernOrders:[],tavernSales:0,tavernStock:{},tavernVisitors:0,tavernClock:0,animalCrafted:0,taskClaims:{},taskProgress:{},merchantLastSlot:-1,merchantDeals:0,expeditionHistory:[],expeditionFails:{},achievements:[],crafted:0,gathered:0,research:null,researches:[],queue:[],skillXp:{},stats:{},milestones:{},achievementXpPaid:{normal:{},milestones:{},realm:0},pinnedMaterials:[],pinnedTargets:[],logs:['Willkommen in Story of Looteria! Fälle verschiedene Baumarten und baue dein Reich auf.'],last:Date.now(),activeSeconds:0,dailyDrops:{date:"",seconds:0,claimed:0,history:[]}}}
let s=initial(),tab='Sammeln',toastTimer;
function level(){return Math.floor(Math.sqrt(s.xp/30))+1}function fmt(n){return new Intl.NumberFormat('de-DE',{maximumFractionDigits:n<10?2:1}).format(n)}
function costText(cost,source='Materialbedarf'){return Object.entries(cost).map(([k,v])=>{const have=s.res[k]||0;const enough=have+1e-8>=v;return `<span class="cost-resource ${enough?'cost-available':'cost-missing-static'}" title="Vorhanden: ${fmt(have)} / Benötigt: ${fmt(v)}">${R[k][0]} ${fmt(v)} ${R[k][1]}</span>`}).join(' ')}
function targetDef(type,id){return type==='building'?buildings.find(x=>x.id===id):type==='recipe'?recipes.find(x=>x.id===id):type==='research'?allTechs.find(x=>x.id===id):type==='expedition'?regions.find(x=>x.id===id):null}
function targetCost(type,id,count){const d=targetDef(type,id);if(!d)return {};if(type==='building'){const out={};const owned=(s.buildings[id]||0)+(s.constructions||[]).filter(x=>x.id===id).length;for(let i=0;i<count;i++)for(const [k,v] of Object.entries(d.cost||{}))out[k]=(out[k]||0)+Math.ceil(v*Math.pow(1.65,owned+i));return out}const out={};for(const [k,v] of Object.entries(d.cost||{}))out[k]=v*(type==='recipe'?count:1);return out}
function pinTarget(type,id){if(!targetDef(type,id)||(type==='research'&&s.upgrades.includes(id)))return;s.pinnedTargets??=[];if(s.pinnedTargets.some(x=>x.type===type&&x.id===id))return;s.pinnedTargets.push({type,id,count:1});save();render()}
function completePinnedTarget(type,id,amount=1){if(type==='research'){s.pinnedTargets=(s.pinnedTargets||[]).filter(x=>!(x.type==='research'&&x.id===id));return}const x=(s.pinnedTargets||[]).find(x=>x.type===type&&x.id===id);if(!x)return;x.count-=amount;if(x.count<=0)s.pinnedTargets=s.pinnedTargets.filter(t=>t!==x)}
function changeTarget(index,delta){const x=s.pinnedTargets?.[index];if(!x)return;x.count=Math.max(1,Math.min(9999,x.count+delta));save();render()}
function unpinTarget(index){s.pinnedTargets.splice(index,1);save();render()}
function targetPinButton(type,id){const pinned=(s.pinnedTargets||[]).some(x=>x.type===type&&x.id===id);return `<button type="button" class="target-pin-btn" onclick="pinTarget('${type}','${id}')" ${pinned?'disabled':''}>${pinned?'📌 Angepinnt':'📌 Als Ziel anpinnen'}</button>`}
function jumpTarget(type,id){tab=({building:'Gebäude',recipe:'Crafting',research:'Forschung',expedition:'Weltkarte'})[type]||'Sammeln';render();const el=document.getElementById(({building:'building-',recipe:'recipe-',research:'research-',expedition:'region-'})[type]+id);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('material-focus');setTimeout(()=>el.classList.remove('material-focus'),2500)}}
function unpinMaterial(index){s.pinnedMaterials.splice(index,1);save();render()}
function goToMaterial(id){
 const recipe=recipes.find(r=>r.id===id&&level()>=(r.lv||1));
 const gatherer=gathers.find(g=>g.id===id&&gateMissing(g).length===0);
 const building=buildings.find(b=>Object.hasOwn(b.prod,id)&&level()>=(b.lv||1));
 const lockedRecipe=recipes.find(r=>r.id===id);
 const lockedGather=gathers.find(g=>g.id===id);
 let targetId, destination;
 if(recipe){destination='Crafting';targetId='recipe-'+recipe.id}
 else if(gatherer){destination='Sammeln';targetId='gather-'+gatherer.id}
 else if(building){destination='Gebäude';targetId='building-'+building.id}
 else if(lockedRecipe){destination='Crafting';targetId='recipe-'+lockedRecipe.id}
 else if(lockedGather){destination='Sammeln';targetId='gather-'+lockedGather.id}
 else {notify('Für '+R[id][1]+' gibt es noch keine direkte Herstellungsstelle.');return}
 tab=destination;render();
 requestAnimationFrame(()=>{let el=document.getElementById(targetId);if(!el){notify('Die Herstellung ist noch gesperrt. Prüfe die Voraussetzungen.');return}el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('material-focus');setTimeout(()=>el.classList.remove('material-focus'),2400)});
}
function materialUnlockInfo(id){
 const sources=[];
 for(const g of gathers.filter(x=>x.id===id)){
  const missing=[];
  missing.push(...gateMissing(g));
  sources.push({name:'⛏️ Sammeln',missing});
 }
 for(const r of recipes.filter(x=>x.id===id)){
  const missing=[];
  if(level()<(r.lv||1))missing.push('Spielerlevel '+r.lv);
  if(r.tech&&!s.upgrades.includes(r.tech))missing.push('Forschung: '+(allTechs.find(u=>u.id===r.tech)?.name||r.tech));
  sources.push({name:'🔨 Crafting',missing});
 }
 for(const b of buildings.filter(x=>Object.hasOwn(x.prod,id))){
  const missing=[];
  if(level()<(b.lv||1))missing.push('Spielerlevel '+b.lv);
  if(b.tech&&!s.upgrades.includes(b.tech))missing.push('Forschung: '+(allTechs.find(u=>u.id===b.tech)?.name||b.tech));
  sources.push({name:'🏗️ '+b.name,missing});
 }
 if(!sources.length)return '<div class="pin-unlock">ℹ️ Noch keine direkte Herstellungs- oder Sammelmöglichkeit verfügbar.</div>';
 if(sources.some(x=>!x.missing.length))return '';
 const best=sources.sort((a,b)=>a.missing.length-b.missing.length)[0];
 return '<div class="pin-unlock">🔒 '+escapeHtml(best.name)+' – Fehlt: '+best.missing.map(escapeHtml).join(' · ')+'</div>';
}
function renderMaterialPins(){s.pinnedTargets??=[];s.pinnedTargets=s.pinnedTargets.filter(x=>!(x.type==='research'&&(s.upgrades.includes(x.id)||s.researches.some(r=>r.id===x.id))));const box=document.getElementById('material-pins');if(!box)return;if(!s.pinnedTargets.length){box.innerHTML='';box.style.display='none';return}box.style.display='block';box.innerHTML='<h3>📌 Angepinnte Ziele</h3><p class="small">Gebäude, Rezepte und Forschungen verfolgen. Mengen mit + / − ändern.</p>'+s.pinnedTargets.map((x,i)=>{const d=targetDef(x.type,x.id);if(!d)return '';const qty=x.type==='building'||x.type==='recipe'?x.count:1;const cost=targetCost(x.type,x.id,qty);const missing=Object.entries(cost).filter(([k,v])=>(s.res[k]||0)<v);const typeName={building:'🏗️ Gebäude',recipe:'🔨 Crafting',research:'🧪 Forschung',expedition:'🧭 Expedition'}[x.type]||'';const completed=x.type==='research'&&s.upgrades.includes(x.id);const requirements=x.type==='research'?researchMissing(d):x.type==='building'?buildingMissing(d):x.type==='recipe'?(level()<(d.lv||1)?['Spielerlevel '+d.lv]:[]):x.type==='expedition'?expeditionMissing(d):[];return `<div class="pin-entry"><div class="pin-head"><button class="material-jump" type="button" onclick="jumpTarget('${x.type}','${x.id}')">${escapeHtml(typeName)} · ${escapeHtml(d.name)} ↗</button><button type="button" onclick="unpinTarget(${i})" aria-label="Ziel entfernen">×</button></div>${x.type==='building'||x.type==='recipe'?`<div class="target-quantity"><span>Menge: <b>${qty}</b></span><button type="button" onclick="changeTarget(${i},-1)" ${qty<=1?'disabled':''}>−</button><button type="button" onclick="changeTarget(${i},1)">+</button></div>`:''}<div class="small">${completed?'✅ Bereits erforscht':missing.length?'🔴 Noch '+missing.length+' Materialarten fehlen':'🟢 Alle Materialien vorhanden'}</div>${Object.entries(cost).map(([k,v])=>{const have=s.res[k]||0,short=Math.max(0,v-have),pct=v?Math.min(100,100*have/v):100,rate=production()[k]||0;return `<div class="target-resource"><button type="button" class="material-jump" onclick="goToMaterial('${k}')">${R[k][0]} ${R[k][1]} ↗</button><span class="${short?'target-short':'target-ready'}">${fmt(have)} / ${fmt(v)}${short?' · Fehlen '+fmt(short)+(rate>0?' · +'+fmt(rate)+'/Sek.':' · +0/Sek.'):' ✓'}</span><div class="progress"><div class="bar" style="width:${pct}%"></div></div>${short?materialUnlockInfo(k):''}</div>`}).join('')}${requirements.length?`<div class="pin-unlock">🔒 ${requirements.map(escapeHtml).join(' · ')}</div>`:''}</div>`}).join('')}

function canPay(cost){return Object.entries(cost).every(([k,v])=>(s.res[k]||0)+1e-8>=v)}
function pay(cost){if(!canPay(cost))return false;for(const [k,v] of Object.entries(cost))s.res[k]-=v;return true}
function gain(k,n){s.res[k]=(s.res[k]||0)+n}
function renderRealmSidebar(){
 const box=document.getElementById('realm-sidebar-content');if(!box)return;
 const occupied=usedPlots(),max=plotLimit();
 box.innerHTML=`<div class="realm-stat"><span>👥 Einwohner</span><b>${fmt(residents())}</b></div><div class="realm-stat"><span>👷 Einwohner belegt</span><b>${fmt(occupiedResidents())}</b></div><div class="realm-stat"><span>🟢 Einwohner frei</span><b>${fmt(freeResidents())}</b></div><div class="realm-stat"><span>🧪 Forschung</span><b>${researchWorkers()}</b></div><div class="realm-stat"><span>🧭 Expedition</span><b>${expeditionWorkers()}</b></div><div class="realm-stat"><span>🏠 Wohnhäuser</span><b>${fmt(s.houses||1)}</b></div><div class="realm-stat"><span>🗺️ Bauplätze</span><b>${fmt(occupied)} / ${fmt(max)}</b></div><div class="progress"><div class="bar" style="width:${Math.min(100,100*occupied/Math.max(1,max))}%"></div></div><p class="small">${fmt(Math.max(0,max-occupied))} freie Bauplätze · Nächste Erweiterung: ${fmt(expansionPrice())} Looterianische Taler</p><p class="small">🏠 Nächstes Wohnhaus: ${fmt(housePrice())} Looterianische Taler</p>`;
}
function log(t){
 // Direkt aufeinanderfolgende Verkäufe derselben Ressource zusammenfassen.
 const sale=/^🏪 Verkauft: ([\d.,]+) × (.+) \(\+?([\d.,]+) Looterianische Taler\)$/.exec(t);
 if(sale&&s.logs.length){
  const previous=/^🏪 Verkauft: ([\d.,]+) × (.+) \(\+?([\d.,]+) Looterianische Taler\)$/.exec(s.logs[0]);
  if(previous&&previous[2]===sale[2]){
   const num=x=>Number(x.replace(/\./g,'').replace(',','.'));
   const totalQty=num(previous[1])+num(sale[1]);
   const totalCoins=num(previous[3])+num(sale[3]);
   s.logs[0]='🏪 Verkauft: '+fmt(totalQty)+' × '+sale[2]+' ('+fmt(totalCoins)+' Looterianische Taler)';
   return;
  }
 }
 // Gleichartige, direkt aufeinanderfolgende Gebäudebauten als ein Ereignis zählen.
 const match=/^🏗️ (.+) errichtet$/.exec(t);
 if(match&&s.logs.length){
  const previous=/^🏗️ (.+) errichtet(?: × (\d+))?$/.exec(s.logs[0]);
  if(previous&&previous[1]===match[1]){
   s.logs[0]='🏗️ '+match[1]+' errichtet × '+(Number(previous[2]||1)+1);
   return;
  }
 }
 s.logs.unshift(t);s.logs=s.logs.slice(0,14)
}
function notify(t){const area=document.getElementById('toast-area');if(!area)return;const e=document.createElement('div');e.className='toast'+(t.startsWith('🏆')?' achievement-toast':'');e.textContent=t;area.appendChild(e);while(area.children.length>3)area.firstElementChild.remove();setTimeout(()=>e.remove(),4200)}
// V9.1: Achievement-XP werden einmalig und auch rückwirkend gutgeschrieben.
const achievementXpByRarity={common:25,uncommon:75,rare:200,epic:500,legendary:1250,mythic:3000};
function xpForAchievement(id){return achievementXpByRarity[achievementRarities[id]||'common']||25}
function xpForMilestone(stage){return achievementXpByRarity[milestoneRarity(stage)]||25}
function xpForRealm(stage){return Math.min(3000,25+stage*25)}
function syncAchievementXp(announce=false){
 s.achievementXpPaid??={normal:{},milestones:{},realm:0};
 const paid=s.achievementXpPaid;paid.normal??={};paid.milestones??={};paid.realm=Math.max(0,Number(paid.realm)||0);
 let gained=0;
 for(const id of s.achievements||[]){if(!paid.normal[id]){gained+=xpForAchievement(id);paid.normal[id]=true}}
 for(const [key,value] of Object.entries(s.milestones||{})){
  const count=Math.max(0,Math.min(1000,Math.floor(Number(value)||0)));
  let previous=Math.max(0,Math.floor(Number(paid.milestones[key])||0));
  for(let stage=previous+1;stage<=count;stage++)gained+=xpForMilestone(stage);
  paid.milestones[key]=Math.max(previous,count);
 }
 const realm=Math.max(0,Math.floor(Number(s.realmLevel)||0));
 for(let stage=paid.realm+1;stage<=realm;stage++)gained+=xpForRealm(stage);
 paid.realm=Math.max(paid.realm,realm);
 if(gained){s.xp+=gained;log('✨ Achievement-Erfahrung: +'+fmt(gained)+' XP'+(announce?' (inklusive rückwirkender Belohnungen)':''));if(announce)notify('🏆 Achievement-XP gutgeschrieben: +'+fmt(gained)+' XP')}
 return gained;
}
function checkAchievements(){const tests={first:s.gathered>0,builder:Object.values(s.buildings).reduce((a,b)=>a+b,0)>=1,crafter:s.crafted>0,hundred:Object.values(s.res).reduce((a,b)=>a+b,0)>=100,factory:Object.values(s.buildings).reduce((a,b)=>a+b,0)>=10,explorer:s.regions.length>=3,scholar:s.upgrades.length>=2,livestock:['cowpasture','pigpen','chickencoop','sheepfold'].some(k=>(s.buildings[k]||0)>0),tavernkeeper:(s.tavernVisitors||0)>=10,gourmet:(s.tavernSales||0)>=1000,merchant:(s.merchantDeals||0)>=1,taskmaster:(s.tasksDone||0)>=5,farmer:Object.keys(s.buildings).some(k=>k.endsWith('farm')&&(s.buildings[k]||0)>0),homeowner:(s.houses||1)>=5,expeditions:(s.expeditionHistory||[]).length>=1,blueprinter:(s.blueprints||[]).length>=1,upgrader:Object.values(s.buildingUpgrades||{}).some(n=>n>0),marketman:(s.tradeStats?.sold||0)>=100,chef:(s.tavernPrepared||0)>=5,playtime:(s.activeSeconds||0)>=3600};for(const [id,,,target] of progressionAchievements)tests[id]=progressUnlocked(target);for(const [id,name] of achievements){if(tests[id]&&!s.achievements.includes(id)){s.achievements.push(id);s.coins+=25;log('🏆 Achievement: '+name+' (+25 Ruhmpunkte)');notify('🏆 Achievement freigeschaltet: '+name)}}syncAchievementXp()}
function gatherXp(id){const g=gathers.find(x=>x.id===id);const rarityBonus={common:0,uncommon:1,rare:2,epic:3,legendary:5,mythic:7}[woodRarities[id]]||0;return Math.min(14,3+rarityBonus+Math.floor(Math.max(0,(g?.lv||1)-1)/5))}
const manualClickTimes=[];const lastManualByResource={};let blockedClickNoticeAt=0;
function allowManualGather(id){const now=performance.now();while(manualClickTimes.length&&now-manualClickTimes[0]>1000)manualClickTimes.shift();if(now-(lastManualByResource[id]??-Infinity)<90||manualClickTimes.length>=14){if(now-blockedClickNoticeAt>4500){blockedClickNoticeAt=now;notify('🛡️ Klickschutz: Zu viele Sammelaktionen in kurzer Zeit.')}return false}lastManualByResource[id]=now;manualClickTimes.push(now);return true}
function gather(id){let g=gathers.find(x=>x.id===id);if(!g||gateMissing(g).length||!allowManualGather(id))return;const amount=1+(s.upgrades.includes('axe')?1:0)+(s.upgrades.includes('tools2')?2:0);const rarity=woodRarities[id];const bonus=rarity&&Math.random()*100<woodBonusChance[rarity]?1:0;const yieldExtra=Math.random()<achievementBonus('yield')?1:0;gain(id,amount+bonus+yieldExtra);s.gathered+=amount+bonus+yieldExtra;record('clicks',1);record('manual_'+id,amount+bonus+yieldExtra);if(['oak','birch','spruce','darkoak','acacia','jungle','mangrove','cherry'].includes(id))record('manual_wood',amount);s.xp+=gatherXp(id);addSkill(['oak','birch','spruce','darkoak','acacia','jungle','mangrove','cherry'].includes(id)?'forestry':'mining',3);checkAchievements();render()}
function scaledCraftCost(cost,amount){return Object.fromEntries(Object.entries(cost).map(([k,v])=>[k,v*amount]))}
function craft(id,amount=1){const r=recipes.find(x=>x.id===id);amount=Number(amount);if(![1,5,10].includes(amount)||!r||level()<(r.lv||1)||resourceGateMissing(r.id).length||!pay(scaledCraftCost(r.cost,amount)))return;gain(id,r.out*amount);s.crafted+=amount;record('crafts',amount);record('crafted_'+id,r.out*amount);s.xp+=Math.min(24,8+Math.floor(Math.max(0,(r.lv||1)-1)*0.8))*amount;addSkill('crafting',5*amount);checkAchievements();save();render()}
function buildingCost(b){const owned=(s.buildings[b.id]||0)+(s.constructions||[]).filter(x=>x.id===b.id).length;return Object.fromEntries(Object.entries(b.cost).map(([k,v])=>[k,Math.ceil(v*Math.pow(1.65,owned))]))}
const achievementRewardMap={production:['factory','upgrader','farmer','livestock'],yield:['first','hundred','explorer'],build:['builder','homeowner'],research:['scholar','blueprinter'],cooking:['chef','tavernkeeper','gourmet']};
const achievementRewardLabels={production:'🏭 Automatische Produktion +2,5 %',yield:'⛏️ Chance auf Extra-Sammelertrag +2,5 %',build:'🏗️ Bauzeit −2,5 %',research:'🧪 Forschungszeit −2,5 %',cooking:'🍳 Chance auf Extra-Gericht +2,5 %'};
function achievementRewardText(id){const rewards=Object.entries(achievementRewardMap).filter(([,ids])=>ids.includes(id)).map(([type])=>achievementRewardLabels[type]);return rewards.length?rewards.join(' · '):'Kein direkter Produktionsbonus (25 Ruhmpunkte)'}
// Each long-term achievement grants a small, visible, permanent bonus.
const milestoneBonusTypes={production:['auto_wood','auto_stone','auto_coal','auto_copper','auto_iron','auto_crystal'],yield:['clicks','manual_wood','manual_stone','manual_coal','manual_copper','manual_iron','manual_crystal'],build:['buildings'],research:['researches'],cooking:['crafts','daily_drops'],};
const milestoneBonusNames={production:'🏭 Automatische Produktion +0,2 %',yield:'⛏️ Extra-Sammelertrag +0,2 %',build:'🏗️ Bauzeit −0,2 %',research:'🧪 Forschungszeit −0,2 %',cooking:'🍳 Extra-Gericht-Chance +0,2 %'};
function milestoneBonusType(key){return Object.keys(milestoneBonusTypes).find(type=>milestoneBonusTypes[type].includes(key))||'production'}
function achievementBonus(type){
 const count=(s.achievements||[]).filter(id=>(achievementRewardMap[type]||[]).includes(id)).length;
 const milestones=Object.entries(s.milestones||{}).filter(([key])=>(milestoneBonusTypes[type]||[]).includes(key)).reduce((n,[,v])=>n+v,0);
 return Math.min(type==='cooking'?.25:.20,count*.025+milestones*.002);
}
// Dekorative Reichskarte: Positionen sind frei wählbar, Produktionswerte bleiben unverändert.
let mapSelection='';
let decorSelection='';
let mapInspect=-1;
function mapOwned(){const counts={house:Math.max(1,s.houses||1)};for(const [id,n] of Object.entries(s.buildings||{}))if(n>0)counts[id]=Math.floor(n);return counts}
function mapSync(){
 if(!Array.isArray(s.realmMap))s.realmMap=[];
 if(!Array.isArray(s.realmDecor))s.realmDecor=[];
 s.realmDecor=s.realmDecor.filter((x,i,a)=>x&&Number.isInteger(x.pos)&&x.pos>=0&&x.pos<plotLimit()&&mapDecorations.some(d=>d.id===x.id)&&a.findIndex(y=>y.pos===x.pos)===i&&!s.realmMap.some(y=>y.pos===x.pos));
 const owned=mapOwned(),used={};
 s.realmMap=s.realmMap.filter(x=>{if(!x||!x.id||!Number.isInteger(x.pos)||x.pos<0||x.pos>=plotLimit()||used[x.pos])return false;const count=s.realmMap.filter(y=>y?.id===x.id).length;if(!owned[x.id]||count>owned[x.id])return false;used[x.pos]=true;return true});
 // Bereits platzierte Gebäude bleiben erhalten, neue landen im Platzierungsinventar.
}
function mapAvailable(){mapSync();const counts=mapOwned();for(const x of s.realmMap)counts[x.id]=(counts[x.id]||0)-1;return Object.entries(counts).filter(([,n])=>n>0)}
function decorChoose(id){decorSelection=id;mapSelection='';mapInspect=-1;render()}
function decorPlace(pos){
 const d=mapDecorations.find(x=>x.id===decorSelection);
 if(!d||!s.upgrades.includes(d.tech)||pos<0||pos>=plotLimit()||s.realmMap.some(x=>x.pos===pos))return;
 s.realmDecor??=[];
 const old=s.realmDecor.find(x=>x.pos===pos);
 if(old){notify('🌿 Feld ist bereits dekoriert. Erst entfernen.');return}
 if(!canPay(d.cost)){notify('❌ Nicht genug Material für '+d.name);return}
 pay(d.cost);s.realmDecor.push({id:d.id,pos});save();render();
}
function decorRemove(pos){s.realmDecor=(s.realmDecor||[]).filter(x=>x.pos!==pos);mapInspect=-1;save();render()}
function mapPlace(pos){
 mapSync();if(!Number.isInteger(pos)||pos<0||pos>=plotLimit())return;
 const existing=s.realmMap.find(x=>x.pos===pos);
 if(existing){mapInspect=pos;mapSelection='';decorSelection='';render();return}
 if(decorSelection){decorPlace(pos);return}
 if((s.realmDecor||[]).some(x=>x.pos===pos)){mapInspect=pos;render();return}
 if(!mapSelection||!(mapAvailable().find(([id])=>id===mapSelection)))return;
 s.realmMap.push({id:mapSelection,pos});mapInspect=pos;save();render();
}
function mapRemove(pos){mapSync();const x=s.realmMap.find(x=>x.pos===pos);if(!x)return;s.realmMap=s.realmMap.filter(y=>y!==x);mapSelection=x.id;mapInspect=-1;save();render()}
function mapClear(){
 const buildingsCount=(s.realmMap||[]).length,decorCount=(s.realmDecor||[]).length;
 if(!buildingsCount&&!decorCount){notify('🗺️ Die Karte ist bereits leer.');return}
 if(!confirm('Reichskarte neu gestalten?\n\n'+buildingsCount+' Gebäude werden in den Platzierungsvorrat zurückgelegt. '+decorCount+' Dekorationen werden von der Karte entfernt (Materialkosten werden NICHT erstattet).\n\nGebäude, Produktion und Upgrades bleiben erhalten.'))return;
 s.realmMap=[];s.realmDecor=[];mapSelection='';decorSelection='';mapInspect=-1;save();render();notify('🗺️ Reichskarte geleert – Gebäude können neu verteilt werden.');
}
function mapCanUpgrade(id,i=0){if(id==='house')return houseTier(i)<5&&s.tradeCoins>=houseUpgradePrice(i);const b=buildings.find(x=>x.id===id);return !!b&&buildingUpgradeMissing(b,i).length===0&&(s.tradeCoins||0)>=buildingUpgradeCost(b,i)}
function mapInstanceIndex(x){return (s.realmMap||[]).filter(y=>y.id===x.id).indexOf(x)}
function mapChoose(id){mapSelection=id;decorSelection='';mapInspect=-1;render()}
function mapUpgrade(id,i){upgradeBuilding(id,i);mapInspect=s.realmMap.find(x=>x.pos===mapInspect)?.id===id?mapInspect:-1;render()}
function mapPanel(){mapSync();const available=mapAvailable(),limit=plotLimit(),placed=s.realmMap.length;
 const columns=24,total=Math.max(288,Math.ceil((limit+96)/columns)*columns);
 const mapSpriteClass=id=>id==='house'?'house':/farm|field|wheat|carrot|potato|beet|pumpkin|melon|cane|wart/i.test(id)?'field':/grove|forest|wood|tree/i.test(id)?'forest':/mine|quarry|stone|ore/i.test(id)?'mine':/cow|pig|chicken|sheep|animal|stable|pen/i.test(id)?'animal':/forge|collector|ancient|magma|ether/i.test(id)?'special':'workshop';
 const mapSpriteTier=(x)=>{const i=(s.realmMap||[]).filter(y=>y.id===x.id).indexOf(x);return x.id==='house'?houseTier(i):buildingTier(x.id,i)};
 const mapSprite=x=>{
  const tier=mapSpriteTier(x), id=x.id, kind=mapSpriteClass(id);
  const seed=[...id].reduce((a,c)=>a+c.charCodeAt(0),0);
  const grad=tier>=10?'#f5ce72':tier>=7?'#c5b6f1':tier>=3?'#a5d6c1':'#cba77a';
  const common=`<ellipse cx="48" cy="75" rx="42" ry="12" fill="#101e1b" opacity=".27"/><path d="M8 65 48 43 88 65 48 86Z" fill="#6b7751" stroke="#344735" stroke-width="2"/>`;
  const house=()=>`<path d="M20 43 47 28 76 43 76 68 48 83 20 68Z" fill="#bc9469" stroke="#493b35" stroke-width="2"/><path d="M20 43 47 12 77 42 48 57Z" fill="#8f3543" stroke="#512d3a" stroke-width="2"/><path d="M48 57 77 42 77 52 48 68Z" fill="#662d39"/><path d="M33 67 33 51 44 45 44 72Z" fill="#49342e" stroke="#d8b680" stroke-width="2"/><path d="M58 58 68 53 68 62 58 67Z" fill="#f9d487" stroke="#523b36" stroke-width="2"/><path d="M60 25 60 10 69 8 69 31Z" fill="#746a69"/><path d="M64 6q-9-7-3-13" stroke="#d9d9cc" stroke-width="3" opacity=".6" fill="none" class="sprite-smoke"/>`;
  const field=()=>{const colors=/carrot/i.test(id)?['#e7792d','#3e9c45']:/potato/i.test(id)?['#bb915a','#588b40']:/beet/i.test(id)?['#ab3862','#5d9b48']:/pumpkin/i.test(id)?['#ef8d24','#4d8744']:/melon/i.test(id)?['#509552','#a9d75d']:/cane/i.test(id)?['#8bd55a','#3f9b60']:/wart/i.test(id)?['#ba4351','#6e3342']:['#e6c65c','#b5a94a'];let out='<path d="M12 59 47 40 85 61 48 82Z" fill="#7e5738" stroke="#473929" stroke-width="2"/>';for(let row=0;row<3;row++)for(let col=0;col<5;col++){const cx=24+col*11+row*4,cy=56+row*6-col*3;out+=`<path d="M${cx} ${cy+5}v-12" stroke="${colors[1]}" stroke-width="2"/><ellipse cx="${cx}" cy="${cy-8}" rx="${/cane/i.test(id)?2:5}" ry="${/cane/i.test(id)?11:4}" fill="${colors[0]}"/>`;}return out};
  const forest=()=>{const birch=/birch/i.test(id),spruce=/spruce/i.test(id), cherry=/cherry/i.test(id),dark=/dark/i.test(id);const leaf=cherry?'#e4a0bc':spruce?'#326c62':dark?'#285448':birch?'#a7c877':'#548c58';let out='';for(const [cx,cy,sc] of [[29,48,.78],[59,38,1.12],[74,56,.66]])out+=`<g transform="translate(${cx} ${cy}) scale(${sc})"><path d="M-4 4V-23H4V4Z" fill="${birch?'#e2dfcf':'#77533c'}" stroke="#4b4635" stroke-width="1.5"/><path d="M0-63 -23-25 -14-25 -27-9 27-9 14-25 23-25Z" fill="${leaf}" stroke="#294c3a" stroke-width="2"/><path d="M0-63 -23-25 -3-32Z" fill="#ffffff" opacity=".14"/></g>`;return out};
  const mine=()=>`<path d="M9 67 25 39 39 45 51 17 65 35 76 31 91 68 50 87Z" fill="#6d7880" stroke="#3b4851" stroke-width="2"/><path d="M51 17 65 35 58 33 50 29 43 38Z" fill="#c0c9c6"/><path d="M35 74 35 55 49 42 64 56 64 77Z" fill="#302e34" stroke="#bd9b66" stroke-width="4"/><path d="M35 57 49 42 64 57" fill="none" stroke="#7a5137" stroke-width="4"/><path d="M25 78 42 69 60 78" fill="none" stroke="#665342" stroke-width="3"/><path d="M22 78 68 78" stroke="#d1a36b" stroke-width="2"/><circle cx="70" cy="56" r="5" fill="${/copper/i.test(id)?'#c87c4b':/iron/i.test(id)?'#b9c7d0':/coal/i.test(id)?'#303238':'#d1c7a5'}"/>`;
  const animal=()=>`<path d="M13 62 47 43 85 62 49 83Z" fill="#9b9a62"/><path d="M15 65 47 47 83 65" fill="none" stroke="#b98754" stroke-width="4" stroke-dasharray="8 4"/><path d="M20 69 20 53M78 69 78 53M47 83 47 68" stroke="#654a31" stroke-width="5"/><ellipse cx="49" cy="61" rx="15" ry="10" fill="${/pig/i.test(id)?'#eaa0a4':/sheep/i.test(id)?'#f3efdd':/chicken/i.test(id)?'#fff1c6':'#e8dfc8'}" stroke="#68584d" stroke-width="2"/><circle cx="59" cy="55" r="6" fill="${/pig/i.test(id)?'#efafb0':'#f2e9db'}"/><circle cx="61" cy="54" r="1.5" fill="#302e2a"/><path d="M40 69v8M54 69v8" stroke="#665248" stroke-width="3"/>`;
  const workshop=()=>`<path d="M18 45 46 29 78 46 78 68 47 84 18 68Z" fill="#a98c6b" stroke="#4b4239" stroke-width="2"/><path d="M15 45 46 18 82 46 48 62Z" fill="${kind==='special'?'#65528a':'#587c91'}" stroke="#3b414c" stroke-width="3"/><path d="M32 71V54L44 48V77Z" fill="#39383c"/><path d="M58 62 72 55" stroke="#f0c97c" stroke-width="5"/><path d="M80 62 88 55 90 70 81 74Z" fill="#726c69"/><circle cx="86" cy="61" r="3" fill="${/magma|forge/i.test(id)?'#ff8943':'#c8e8ec'}"/>`;
  const body=kind==='house'?house():kind==='field'?field():kind==='forest'?forest():kind==='mine'?mine():kind==='animal'?animal():workshop();
  const detailing=kind==='house'?`<path d="M21 50 47 35 75 50" stroke="#f4d6a0" stroke-width="1.4" opacity=".7" fill="none"/><path d="M22 58 47 73 75 57M22 65 47 80 75 65" stroke="#6b4b39" stroke-width="1.5" opacity=".6" fill="none"/><path d="M27 35 48 17 70 35" stroke="#db9a86" stroke-width="2" fill="none"/><path d="M59 58v7m6-10v7" stroke="#6b4a36" stroke-width="1.5"/>`:
    kind==='mine'?`<path d="M20 62 31 47 37 52M59 32 65 40 74 37M64 68 76 65" stroke="#d9d8c0" stroke-width="2" opacity=".65" fill="none"/><path d="M28 83 48 75 69 84" stroke="#c49b60" stroke-width="2.2" fill="none"/><circle cx="72" cy="57" r="2" fill="#f6e9c4"/>`:
    kind==='field'?`<path d="M15 62 47 45 81 63M20 70 48 53 77 70" fill="none" stroke="#d6ae6e" stroke-width="1.5" opacity=".65"/>`:
    kind==='forest'?`<path d="M15 72 26 66 34 72 26 77Z M58 76 70 69 82 75 71 80Z" fill="#946d45" stroke="#4e4b37" stroke-width="1.3"/><path d="M20 70 30 74 M64 73 76 76" stroke="#d4ac76" stroke-width="1.4"/>`:
    kind==='animal'?`<path d="M20 54 48 38 78 54" stroke="#dfbc83" stroke-width="2" fill="none"/><path d="M25 65 25 58M33 61 33 54M65 61 65 54M74 65 74 58" stroke="#6c5038" stroke-width="2"/>`:
    `<path d="M23 50 46 36 74 50M25 62 25 69M70 62 70 69" stroke="#e3c18a" stroke-width="1.6" opacity=".8" fill="none"/><path d="M39 31 46 26 53 31" stroke="#d7d5bf" stroke-width="1.5" fill="none"/>`;
  const scenery=`<g opacity=".82"><path d="M8 75l-3-5m3 5 2-7M88 76l-2-8m2 8 4-6" stroke="#b3cb7d" stroke-width="1.8"/><circle cx="16" cy="77" r="1.7" fill="#e8c66d"/><circle cx="83" cy="81" r="1.4" fill="#e6b6c7"/></g>`;
  // V10.8: individually illustrated architectural accents, scaled by upgrade tier.
  const detailLevel=tier>=7?3:tier>=3?2:1;
  const advanced=kind==='house'?`<g stroke-linejoin="round"><path d="M24 46 47 32 72 46" stroke="#f0c28b" stroke-width="1.5" fill="none"/><path d="M24 54 47 69 73 54M24 61 47 76 73 61" stroke="#704a34" stroke-width="1.2" fill="none"/><path d="M29 40 29 64M37 35 37 57M61 35 61 57M69 40 69 63" stroke="#dfb78c" stroke-width="1.3" opacity=".8"/><path d="M28 28 47 17 68 29" stroke="#f6c5a0" stroke-width="1.5" fill="none"/><path d="M56 54 69 48 69 62 56 68Z" fill="#6a4937" stroke="#d6b47d" stroke-width="1"/><path d="M59 55v9m6-12v9" stroke="#f8d897" stroke-width="1"/></g>`:
    kind==='mine'?`<g><path d="M26 82 46 72 68 82M31 83 48 74 65 83" stroke="#b29c76" stroke-width="2" fill="none"/><path d="M28 83 49 72 70 83" stroke="#3d3833" stroke-width="1.1" fill="none"/><path d="M28 60 49 41 69 61" stroke="#d1ad7b" stroke-width="2.3" fill="none"/><path d="M35 55v22m29-21v21" stroke="#866747" stroke-width="2.5"/><path d="M15 65 25 48 31 51M69 43 75 36 85 56" stroke="#c5d1cc" stroke-width="1.8" fill="none"/><circle cx="70" cy="53" r="2.5" fill="#e7c36c"/></g>`:
    kind==='field'?`<g><path d="M13 63 48 44 84 63M19 71 49 54 78 71M29 76 55 61" stroke="#e1bd80" stroke-width="1.1" opacity=".75" fill="none"/><path d="M17 58v10m63-10v10" stroke="#9c784a" stroke-width="2"/><path d="M14 58 47 40 84 59" stroke="#d9b88c" stroke-width="1.7" fill="none"/></g>`:
    kind==='forest'?`<g><path d="M14 73 28 65 42 72 28 80Z" fill="#a37b4d" stroke="#5d5136" stroke-width="1.2"/><path d="M57 76 71 68 85 75 71 83Z" fill="#a37b4d" stroke="#5d5136" stroke-width="1.2"/><path d="M19 72 30 76m34-2 12 3" stroke="#edc99b" stroke-width="1.5"/><path d="M23 60v-11m6 10V46" stroke="#755038" stroke-width="2"/></g>`:
    kind==='animal'?`<g><path d="M16 65 48 48 82 65M18 70 48 54 80 70" stroke="#e0bd83" stroke-width="1.3" fill="none"/><path d="M24 62v10m11-16v11m30-11v11m10-5v10" stroke="#6b4a2f" stroke-width="2"/><circle cx="52" cy="58" r="2" fill="#5c3f32"/></g>`:
    `<g><path d="M22 50 46 35 75 50" stroke="#e2c494" stroke-width="1.6" fill="none"/><path d="M23 56 46 70 75 55M23 63 46 78 75 63" stroke="#6d5a48" stroke-width="1.2" fill="none"/><path d="M52 55 70 47 70 63 52 72Z" fill="#715f55" stroke="#dbcba4" stroke-width="1.3"/><path d="M55 57v12m7-15v12" stroke="#f2cf87" stroke-width="1.1"/></g>`;
  const tierStructure=detailLevel>=2?`<g><path d="M10 74 18 69 25 73 18 79Z M72 77 82 71 91 76 81 82Z" fill="#8c9b6b" stroke="#526e53" stroke-width="1"/><path d="M11 71v-8m78 10v-8" stroke="#bca475" stroke-width="2"/><path d="M9 63 16 59 23 63M81 65 88 61 95 65" stroke="#dfc67d" stroke-width="1.5" fill="none"/></g>`:'';
  const grandStructure=detailLevel>=3?`<g><path d="M8 59 8 46 17 42 17 63M79 62 79 42 88 46 88 59" stroke="#d9b978" stroke-width="2.6" fill="none"/><path d="M6 46 12 39 19 45M77 43 84 37 91 44" fill="#9d4250" stroke="#4c393c" stroke-width="1.3"/><path d="M47 14v-11" stroke="#dec389" stroke-width="1.5"/><path d="M47 3 57 7 47 11Z" fill="#e5b85b"/></g>`:'';
  const elite=tier>=7?`<path d="M47 10 51 18 59 19 53 25 55 33 47 29 40 33 42 25 36 19 44 18Z" fill="#e6ca72" stroke="#76542c" stroke-width="1"/>`:'';
  const banner=tier>=7?`<path d="M74 30V3" stroke="#51442f" stroke-width="2"/><path d="M75 3 91 9 75 16Z" fill="${grad}"/>`:'';
  const upgrade=tier>=3?`<circle cx="12" cy="22" r="6" fill="${grad}" stroke="#59452d" stroke-width="1.5"/>`:'';
  return `<span class="map-sprite-v106 sprite-asset sprite-asset-${kind} ${tier>=7?'asset-elite':tier>=3?'asset-upgraded':''}" aria-hidden="true"><img src="looteria-assets/${kind}.svg" alt="" draggable="false" loading="lazy"/><span class="asset-flag"></span></span>`;
 };
 const label=id=>id==='house'?['🏠','Wohnhaus']:(()=>{const b=buildings.find(x=>x.id===id);return [b?.icon||'🏗️',b?.name||id]})();
 const inspected=s.realmMap.find(x=>x.pos===mapInspect);
 const decorInspected=(s.realmDecor||[]).find(x=>x.pos===mapInspect);
 let details='';
 if(inspected){const b=buildings.find(x=>x.id===inspected.id),[ico,name]=label(inspected.id);
 const instance=mapInstanceIndex(inspected);const tier=b?buildingTier(b.id,instance):0;
 const price=b?buildingUpgradeCost(b,instance):0;
 const reasons=b?buildingUpgradeMissing(b,instance):[];const houseIndex=inspected.id==='house'?instance:-1;
 details=`<div class="map-inspector"><h3 >${ico} ${escapeHtml(name)} · Feld ${mapInspect+1}</h3>${b?`<p>⚙️ Gebäude #${instance+1} · Produktionsstufe: <b>${tier}/${MAX_BUILDING_TIER}</b> · +${tier*10}% Ertrag</p>${tier>=MAX_BUILDING_TIER?'<p class="map-max-upgrade">✓ Vollständig ausgebaut</p>':`<p>⬆️ Nächstes Upgrade: <b>${fmt(price)} Looterianische Taler</b></p>`}${reasons.length?`<p class="small" style="color:#ff9b91">${reasons.join(' · ')}</p>`:''}<button type="button" onclick="mapUpgrade('${b.id}',${instance})" ${tier>=MAX_BUILDING_TIER||s.tradeCoins<price||reasons.length?'disabled':''}>⬆️ Gebäude verbessern</button>`:`<p>🏠 Wohnhaus ${houseIndex+1} · Ausbaustufe ${houseTier(houseIndex)}/5 · 👥 ${2+houseTier(houseIndex)} Einwohner</p>${houseTier(houseIndex)<5?`<p>⬆️ Nächstes Upgrade: 💰 ${fmt(houseUpgradePrice(houseIndex))} Taler · +1 Einwohner</p><button type="button" onclick="houseUpgrade(${houseIndex})" ${s.tradeCoins<houseUpgradePrice(houseIndex)?'disabled':''}>⬆️ Wohnhaus verbessern</button>`:'<p>✓ Vollständig ausgebaut</p>'}`} <button type="button" onclick="mapRemove(${mapInspect})">↔️ Gebäude umplatzieren</button> <button type="button" onclick="mapInspect=-1;render()">Schließen</button></div>`;
 }
 if(decorInspected){const d=mapDecorations.find(x=>x.id===decorInspected.id);details=`<div class="map-inspector"><h3>${d?.icon||'🌿'} ${d?.name||'Dekoration'} · Feld ${mapInspect+1}</h3><p>Diese Dekoration ist rein optisch und benötigt keinen Arbeiter.</p><button type="button" onclick="decorRemove(${mapInspect})">🗑️ Dekoration entfernen</button> <button type="button" onclick="mapInspect=-1;render()">Schließen</button></div>`}
 const decorPalette=mapDecorations.map(d=>{const unlocked=s.upgrades.includes(d.tech);return `<button type="button" class="${decorSelection===d.id?'map-selected':''}" onclick="decorChoose('${d.id}')" ${unlocked?'':'disabled'} title="${unlocked?d.name+' · '+costText(d.cost):'Benötigt Forschung: '+(allTechs.find(t=>t.id===d.tech)?.name||d.tech)}">${d.icon} ${d.name}${unlocked?'':' 🔒'}</button>`}).join('');
 return `<section class="card map-realm"><h2>🗺️ ${escapeHtml(realmName())} (${escapeHtml(realmRankName())})</h2><p class="small">Alle Königreiche besitzen dieselbe feste, hochauflösende Fantasy-Landschaft mit Flüssen, Bergen, Wäldern und Blumenwiesen. Die Bauplätze sind für alle identisch. Freie Bauplätze sind in der Landschaft verborgen und werden erst im Baumodus oder beim Darüberfahren sichtbar. Klicke auf ein Gebäude, um es zu verbessern oder zu versetzen.</p><div class="map-summary">🏡 ${placed} Gebäude platziert <span>🏞️ ${limit} Bauflächen freigeschaltet</span> <span>📦 ${available.reduce((a,[,n])=>a+n,0)} Gebäude im Vorrat</span></div><div class="map-palette"><button type="button" class="map-clear-action" onclick="mapClear()">🧹 Karte leeren & neu verteilen</button><span class="small">Gebäude bleiben erhalten. Dekorationen werden ohne Materialerstattung entfernt.</span></div><h3>🏘️ Gebäude auswählen</h3><div class="map-palette">${available.length?available.map(([id,n])=>{const [ico,name]=label(id);return `<button type="button" class="${mapSelection===id?'map-selected':''}" onclick="mapChoose('${id}')">${ico} ${escapeHtml(name)} ×${n}</button>`}).join(''):'<span class="small">Alle vorhandenen Gebäude sind platziert.</span>'}</div><h3>🌿 Stadtgestaltung · Dekorationen</h3><p class="small">Schalte im neuen Forschungszweig „Stadtgestaltung“ neue Dekorationen frei. Dekorationen kosten Materialien, aber keine Einwohner und keine zusätzlichen Bauplätze. Wähle eine Dekoration und klicke auf ein freies Feld. Mit „Auswahl aufheben“ kannst du Dekorationen anklicken und entfernen.</p><div class="map-palette">${decorPalette}<button type="button" onclick="mapSelection='';decorSelection='';mapInspect=-1;render()">✖ Auswahl aufheben</button></div><div class="map-inspector map-inspector-fixed" aria-live="polite">${details?details.replace(/^<div class="map-inspector">/,'').replace(/<\/div>$/,''):'<h3>🏰 Gebäudeübersicht</h3><p class="small">Wähle ein platziertes Gebäude oder eine Dekoration aus, um hier die Details zu sehen. Dieser Bereich bleibt dauerhaft sichtbar, damit die Karte beim Auswählen nicht verrutscht.</p>'}</div><div class="map-view-toolbar" role="toolbar" aria-label="Kartensteuerung"><button type="button" onclick="mapZoomBy(-0.15)" aria-label="Karte verkleinern">➖</button><span class="map-zoom-readout" id="map-zoom-label">100 %</span><button type="button" onclick="mapZoomBy(0.15)" aria-label="Karte vergrößern">➕</button><button type="button" onclick="mapCenter()" title="Zur Kartenmitte springen">🎯 Zentrieren</button><button type="button" onclick="mapTogglePerspective()" id="map-perspective-button" title="Perspektive wechseln">🔷 Isometrisch</button><button type="button" onclick="mapToggleBuildMode()" id="map-buildmode-button" title="Freie Bauplätze hervorheben" aria-pressed="false">🔨 Baumodus: Aus</button><span class="map-help">🖱️ Karte ziehen · Mausrad = Zoom · 📱 Ziehen und mit zwei Fingern zoomen</span></div><div class="realm-map-scene map-isometric" id="looteria-map-scene"><div class="realm-map-grid" id="looteria-map-grid"><canvas id="looteria-terrain-canvas" aria-hidden="true"></canvas>${Array.from({length:total},(_,pos)=>{const x=s.realmMap.find(x=>x.pos===pos),d=(s.realmDecor||[]).find(y=>y.pos===pos),deco=mapDecorations.find(z=>z.id===d?.id),unlocked=pos<limit,[ico,name]=x?label(x.id):['',''];const scenery=['🌲','🌳','🌿','🌼','🪨','🌾','🌸','🍄','🌻','🦋','🌷','🍀'];const row=Math.floor(pos/columns),col=pos%columns;const river=(Math.abs(col-(9+Math.round(2*Math.sin(row*.45))))<=0&&row>=1&&row<=11)||(row>=8&&row<=11&&col===11);const pond=(row>=8&&row<=10&&col>=3&&col<=5);const ridge=(row>=1&&row<=5&&col<=3)||(row>=11&&col>=13);const grove=(row>=5&&row<=9&&col>=1&&col<=5);const terrain=river||pond?'map-water':ridge?'map-mountain':grove?'map-grove':(pos*13+row*7)%11===0?'map-meadow':'map-grass';const decor=river||pond?'🌊':ridge?(pos%3===0?'⛰️':'🪨'):grove?(pos%2?'🌲':'🌳'):scenery[(pos*17+row*11)%scenery.length];return `<button type="button" class="realm-map-tile ${x||d?'map-occupied':''} ${!unlocked?'map-locked':''} ${terrain} ${!x&&!d&&unlocked?'map-free':''} ${!x&&!d?'map-natural':''} ${river||pond?'map-shore':''} ${mapInspect===pos?'map-inspected':''} ${x?(x.id==='house'?(houseTier(mapInstanceIndex(x))>=5?'map-status-done':houseTier(mapInstanceIndex(x))>0?'map-status-pending':'map-status-ready'):(buildingTier(x.id,mapInstanceIndex(x))>=MAX_BUILDING_TIER?'map-status-done':buildingTier(x.id,mapInstanceIndex(x))>0?'map-status-pending':'map-status-ready')):''}" ${unlocked?`onclick="mapPlace(${pos})"`:'disabled'} title="${unlocked?(x?escapeHtml(name)+' – anklicken für Upgrades':'Freier Bauplatz'):'Noch nicht erschlossen'}" aria-label="${unlocked?(x?escapeHtml(name):'Freier Bauplatz'):'Nicht erschlossen'}, Feld ${pos+1}">${x?mapSprite(x):deco?`<span class="map-real-decor">${deco.icon}</span>`:`<span class="map-nature" aria-hidden="true">${decor}</span>`}${x?`<small>${escapeHtml(name)}</small>`:deco?`<small>${deco.name}</small>`:''}</button>`}).join('')}</div></div><p class="small">💡 Gebäude im Vorrat auswählen und auf einen freien Bauplatz setzen. Bereits platzierte Gebäude anklicken, um sie zu verbessern. Der optionale Baumodus hebt freie Plätze hervor. Gebäude kannst du weiterhin direkt anklicken. Die Karte ist dekorativ; Baukosten und Produktion bleiben unverändert.</p></section>`;
}
function buildingDuration(b){return Math.max(10,Math.round((45+Math.max(0,(b.lv||1)-1)*12+Object.values(b.cost).reduce((a,n)=>a+n,0)*0.6)*(1-achievementBonus('build'))))}
function build(id){
 const b=buildings.find(x=>x.id===id);
 if(!b||usedPlots()>=plotLimit()||(s.constructions||[]).length>=constructionSlots()||freeResidents()<Math.max(1,workersNeededForBuild(b))||buildingMissing(b).length||!canPay(buildingCost(b)))return;
 const cost=buildingCost(b);if(!pay(cost))return;
 const now=Date.now();s.constructions??=[];s.constructions.push({id,started:now,ends:now+buildingDuration(b)*1000});
 log('🏗️ Bau begonnen: '+b.name);save();render();
}
function finishConstructions(){
 if(!Array.isArray(s.constructions))s.constructions=[];
 let changed=false;
 for(const c of [...s.constructions]){
  if(Date.now()<c.ends)continue;
  s.constructions.splice(s.constructions.indexOf(c),1);
  const b=buildings.find(x=>x.id===c.id);if(!b)continue;
  s.buildings[c.id]=(s.buildings[c.id]||0)+1;syncBuildingTiers();
  completePinnedTarget('building',c.id);record('buildings',1);s.xp+=15;
  log('🏗️ '+b.name+' fertiggestellt');notify('🏗️ '+b.name+' fertiggestellt!');changed=true;
 }
 if(changed){checkAchievements();save();}
}
function upgrade(id){const u=allTechs.find(x=>x.id===id);if(!u||s.upgrades.includes(id)||s.researches.some(x=>x.id===id)||s.queue.includes(id)||s.researches.length>=slots()||freeResidents()<1||researchMissing(u).length||!canFinanceResearch(u)||!pay(u.cost))return;s.tradeCoins-=researchTalerCost(u);const now=Date.now();s.researches.push({id,started:now,ends:now+Math.max(10,Math.round(u.duration*(1-achievementBonus('research'))))*1000});completePinnedTarget('research',id);log('🧪 Forschung gestartet: '+u.name);save();render()}
function finishResearch(){let changed=false;for(const r of [...s.researches]){if(Date.now()<r.ends)continue;s.researches=s.researches.filter(x=>x!==r);const u=allTechs.find(x=>x.id===r.id);if(u&&!s.upgrades.includes(u.id)){s.upgrades.push(u.id);s.xp+=25;addSkill('research',12);record('researches',1);s.pinnedTargets=(s.pinnedTargets||[]).filter(x=>!(x.type==='research'&&x.id===u.id));log('🧪 Forschung abgeschlossen: '+u.name);notify('🧪 '+u.name+' abgeschlossen!');changed=true}}if(changed){checkAchievements();save()}startQueued()}
function timeLeft(seconds){seconds=Math.max(0,Math.ceil(seconds));return seconds>=3600?`${Math.floor(seconds/3600)} Std. ${Math.floor(seconds%3600/60)} Min.`:seconds>=60?`${Math.floor(seconds/60)} Min. ${seconds%60} Sek.`:`${seconds} Sek.`}
function explore(id){
 const r=regions.find(x=>x.id===id);
 if(!r||s.expedition||s.regions.includes(id)||expeditionMissing(r).length||freeResidents()<5||!canPay(r.cost||{}))return;
 pay(r.cost||{});
 const now=Date.now();s.expedition={id,started:now,ends:now+(r.duration||60)*1000,chance:expeditionChance(r)};
 log('🧭 Expedition nach '+r.name+' gestartet ('+s.expedition.chance+' % Erfolgschance).');save();render();
}
function finishExpedition(){
 const e=s.expedition;if(!e||Date.now()<e.ends)return;
 s.expedition=null;
 const r=regions.find(x=>x.id===e.id);if(!r){save();return}
 const success=Math.random()*100<(Number.isFinite(e.chance)?e.chance:expeditionChance(r));
 s.expeditionFails??={};s.expeditionFails[r.id]=success?0:(s.expeditionFails[r.id]||0)+1;
 record('expeditions',1);addSkill('exploration',success?24:12);
 let loot=[];
 if(success){
  if(!s.regions.includes(r.id)){s.regions.push(r.id);record('regions',1)}
  const plan=expeditionBlueprint(r);if(plan)loot.push('📜 '+plan);for(const bp of rareRecipePlans.filter(x=>x.region===r.id)){if(!hasBlueprint(bp.id)){s.blueprints??=[];s.blueprints.push(bp.id);loot.push('📜 '+bp.name);record('blueprints',1)}}s.xp+=60;s.coins+=100;record('expedition_success',1);
  log('🗺️ Expedition erfolgreich: '+r.name+(loot.length?' · Gefunden: '+loot.join(', '):'')+' (+100 Ruhmpunkte)');
  notify('🧭 Expedition erfolgreich: '+r.name);checkAchievements();
 }else{
  record('expedition_fail',1);log('⚠️ Expedition nach '+r.name+' gescheitert. Gebiet bleibt gesperrt; erneuter Versuch möglich.');
  notify('⚠️ Expedition gescheitert: '+r.name);
 }
 s.expeditionHistory??=[];s.expeditionHistory.unshift({id:r.id,success,at:Date.now(),loot});s.expeditionHistory=s.expeditionHistory.slice(0,12);
 save();
}
const tavernRecipes=[
{id:'steakmeal',name:'Gebratenes Steak',icon:'🥩',kind:'Kochen',tech:'butchery',cost:{beef:8,coal:2},taler:155,duration:55},
{id:'porkmeal',name:'Schweinebraten',icon:'🍖',kind:'Kochen',tech:'butchery',cost:{pork:10,potato:6,coal:2},taler:210,duration:80},
{id:'chickenmeal',name:'Hühnersuppe',icon:'🍲',kind:'Kochen',tech:'butchery',cost:{chicken:8,carrot:7,potato:7},taler:190,duration:70},
{id:'muttonmeal',name:'Hammelragout',icon:'🥘',kind:'Kochen',tech:'butchery',cost:{mutton:9,beetroot:6,coal:2},taler:225,duration:90},
{id:'breadmeal',name:'Frisches Brot',icon:'🍞',kind:'Kochen',tech:'tavernkeeping',cost:{wheat:12},taler:28,duration:20},
{id:'potatomeal',name:'Ofenkartoffeln',icon:'🥔',kind:'Kochen',tech:'cooking',cost:{potato:14,coal:2},taler:58,duration:35},
{id:'veggiestew',name:'Gemüseeintopf',icon:'🥣',kind:'Kochen',tech:'cooking',cost:{carrot:12,potato:12,beetroot:8},taler:115,duration:60},
{id:'pumpkinpie',name:'Kürbiskuchen',icon:'🥧',kind:'Kochen',tech:'cooking',cost:{pumpkin:8,wheat:16,sugarcane:8},taler:150,duration:70},
{id:'berrydrink',name:'Süßbeerensaft',icon:'🧃',kind:'Brauen',tech:'brewing',cost:{sweetberry:18,sugarcane:10},taler:125,duration:55},
{id:'melonbrew',name:'Melonenelixier',icon:'🍹',kind:'Brauen',tech:'brewing',cost:{melon:15,sugarcane:12},taler:180,duration:85},
{id:'royalfeast',name:'Königliches Festmahl',icon:'👑',kind:'Kochen',tech:'cooking',blueprint:'recipe_royalfeast',cost:{pumpkin:20,melon:20,carrot:25,potato:25,wheat:45},taler:950,duration:240},
{id:'netherpotion',name:'Nethertrank',icon:'🧪',kind:'Brauen',tech:'brewing',blueprint:'recipe_netherpotion',cost:{netherwart:25,crystal:4,sugarcane:30},taler:1400,duration:300},
{id:'dragonbanquet',name:'Drachenbankett',icon:'🐉',kind:'Kochen',tech:'cooking',blueprint:'recipe_dragonbanquet',cost:{netherwart:20,melon:50,pumpkin:50,sweetberry:50},taler:2500,duration:480}
];
const rareRecipePlans=[{id:'recipe_royalfeast',name:'Seltenes Rezept: Königliches Festmahl',region:'hills',chance:.35},{id:'recipe_netherpotion',name:'Seltenes Rezept: Nethertrank',region:'cavern',chance:.25},{id:'recipe_dragonbanquet',name:'Legendäres Rezept: Drachenbankett',region:'ether',chance:.12}];
// Ein Kochplatz bearbeitet eine Sorte in einer frei wählbaren Stückzahl.
function tavernStart(id){
 const r=tavernRecipes.find(x=>x.id===id),input=document.getElementById('tavern-qty-'+id);
 const qty=Number(input?.value);
 if(!r||!Number.isSafeInteger(qty)||qty<1||qty>100000){notify('Bitte eine gültige Stückzahl eingeben (1–100.000).');return}
 const costs=Object.fromEntries(Object.entries(r.cost).map(([k,n])=>[k,n*qty]));
 if(!(s.buildings.tavern>0)||tavernOrders().length>=tavernCapacity()||freeResidents()<1||!s.upgrades.includes(r.tech)||(r.blueprint&&!hasBlueprint(r.blueprint))||!canPay(costs)){
  notify('Zubereitung nicht möglich: Zutaten, Kochplatz oder Einwohner fehlen.');return
 }
 pay(costs);const now=Date.now();s.tavernOrders.push({id,qty,produced:0,started:now,ends:now+r.duration*qty*1000});s.tavernOrder=null;
 log('🍻 '+qty+' × '+r.name+' in Zubereitung (1 Koch)');save();render()
}
function finishTavernOrder(){
 const orders=tavernOrders(),now=Date.now();let changed=false;
 for(const o of [...orders]){
  const r=tavernRecipes.find(x=>x.id===o.id);if(!r)continue;
  const qty=Number.isSafeInteger(o.qty)&&o.qty>0?o.qty:1;
  const duration=Math.max(1000,r.duration*1000);
  const started=Number.isFinite(o.started)?o.started:o.ends-duration*qty;
  // Portionen nach jedem Rezeptintervall ins Lager geben – auch nach Offline-Zeit.
  const made=Math.min(qty,Math.max(0,Math.floor((now-started)/duration)));
  const credited=Math.min(qty,Math.max(0,Math.floor(Number(o.produced)||0)));
  if(made>credited){const delta=made-credited;s.tavernStock??={};let extra=0;for(let i=0;i<delta;i++)if(Math.random()<achievementBonus('cooking'))extra++;s.tavernStock[r.id]=(s.tavernStock[r.id]||0)+delta+extra;s.tavernPrepared=(s.tavernPrepared||0)+delta+extra;o.produced=made;changed=true;if(extra)log('🍳 Glücksproduktion: +'+extra+' × '+r.name+' zusätzlich!');}
  if(made>=qty||now>=o.ends){s.tavernOrders=s.tavernOrders.filter(x=>x!==o);changed=true;log('🍳 Fertig: '+qty+' × '+r.name+' · im Tavernenlager');}
 }
 if(changed){checkAchievements();save()}
}
function serveTavernVisitors(dt){
 if(!(s.buildings.tavern>0))return;
 s.tavernStock??={};s.tavernClock=(s.tavernClock||0)+dt;
 const interval=Math.max(10,35-5*Math.min(4,s.buildings.tavern-1));
 const rounds=Math.min(500,Math.floor(s.tavernClock/interval));
 if(!rounds)return;
 s.tavernClock%=interval;
 let visitors=0,served=0,earned=0;
 for(let i=0;i<rounds;i++){
  // Jedes Tavernen-Produktionsupgrade erhöht die durchschnittliche Gästezahl leicht.
  // Der Bonus ist gedeckelt, damit die Wirtschaft nicht explodiert.
  const upgrades=Math.max(0,...(s.buildingTiers?.tavern||[0]));
  const base=Math.max(1,Math.min(5,s.buildings.tavern||1));
  const extraChance=Math.min(.75,upgrades*.045);
  const arrivals=base+(Math.random()<extraChance?1:0);visitors+=arrivals;
  for(let v=0;v<arrivals;v++){
   const available=tavernRecipes.filter(r=>(s.tavernStock[r.id]||0)>0);
   if(!available.length)continue;
   const r=available[Math.floor(Math.random()*available.length)];
   s.tavernStock[r.id]--;served++;earned+=r.taler;
  }
 }
 s.tavernVisitors=(s.tavernVisitors||0)+visitors;
 if(earned){s.tradeCoins=(s.tradeCoins??250)+earned;s.tavernSales=(s.tavernSales||0)+earned;log('🍻 '+served+' Gäste bewirtet · +'+fmt(earned)+' Taler');}
}

const taskDefs=[
{id:'daily_gather',period:'daily',name:'Rohstoffsammler',desc:'Sammle 80 Ressourcen per Hand.',key:'gathered',goal:80,reward:100},
{id:'daily_craft',period:'daily',name:'Fleißiger Handwerker',desc:'Stelle 10 Crafting-Produkte her.',key:'crafted',goal:10,reward:140},
{id:'daily_guests',period:'daily',name:'Gastfreundschaft',desc:'Empfange 8 Tavernenbesucher.',key:'tavernVisitors',goal:8,reward:180},
{id:'weekly_gather',period:'weekly',name:'Große Ernte',desc:'Sammle 700 Ressourcen per Hand.',key:'gathered',goal:700,reward:650},
{id:'weekly_build',period:'weekly',name:'Reichsausbau',desc:'Errichte 4 Gebäude.',key:'buildings',goal:4,reward:800},
{id:'weekly_trade',period:'weekly',name:'Handelswoche',desc:'Verkaufe 250 Ressourcen.',key:'sold',goal:250,reward:900}];
function taskWindow(period){const d=new Date();if(period==='daily')return d.toISOString().slice(0,10);const x=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));x.setUTCDate(x.getUTCDate()+4-(x.getUTCDay()||7));const year=x.getUTCFullYear();const start=new Date(Date.UTC(year,0,1));return year+'-W'+String(Math.ceil((((x-start)/86400000)+1)/7)).padStart(2,'0')}
function taskValue(k){return k==='gathered'?s.gathered||0:k==='crafted'?s.crafted||0:k==='tavernVisitors'?s.tavernVisitors||0:k==='buildings'?s.stats?.buildings||0:k==='sold'?s.tradeStats?.sold||0:0}
function taskState(t){s.taskProgress??={};const key=t.period+':'+taskWindow(t.period)+':'+t.id;if(!(key in s.taskProgress))s.taskProgress[key]=taskValue(t.key);return {key,progress:Math.max(0,taskValue(t.key)-s.taskProgress[key])}}
function claimTask(id){const t=taskDefs.find(x=>x.id===id);if(!t)return;const {key,progress}=taskState(t);if(progress<t.goal||s.taskClaims?.[key])return;s.taskClaims[key]=true;s.tradeCoins+=t.reward;s.tasksDone=(s.tasksDone||0)+1;log('📜 Aufgabe abgeschlossen: '+t.name+' · +'+t.reward+' Taler');checkAchievements();save();render()}
function tasksPanel(){return `<section class="card"><h2>📜 Tägliche & wöchentliche Aufgaben</h2><p class="small">Tägliche Aufgaben wechseln um 00:00 UTC, wöchentliche am Montag. Belohnungen werden einmal pro Zeitraum ausgezahlt.</p>${taskDefs.map(t=>{const q=taskState(t),done=!!s.taskClaims?.[q.key];return `<div class="worker-row"><div><b>${t.period==='daily'?'☀️ Täglich':'🗓️ Wöchentlich'} · ${t.name}</b><p class="small">${t.desc} · 💰 ${fmt(t.reward)} Taler</p><div class="small">${fmt(Math.min(q.progress,t.goal))} / ${fmt(t.goal)}</div></div>${button(done?'✓ Abgeholt':'Belohnung abholen',`claimTask('${t.id}')`,done||q.progress<t.goal)}</div>`}).join('')}</section>`}
function renderTasksSidebar(){
 const el=document.getElementById('tasks-sidebar');if(!el)return;
 const signature=taskDefs.map(t=>{const q=taskState(t);return q.key+':'+Math.min(q.progress,t.goal)+':'+(s.taskClaims?.[q.key]?1:0)}).join('|');
 if(el.dataset.signature===signature)return;
 el.dataset.signature=signature;
 el.innerHTML=`<section class="card task-card"><h3>📜 Aufgaben</h3><p class="small">☀️ Täglich · 🗓️ Wöchentlich</p>${['daily','weekly'].map(period=>`<div class="task-group"><h4>${period==='daily'?'☀️ Daily':'🗓️ Weekly'}</h4>${taskDefs.filter(t=>t.period===period).map(t=>{const q=taskState(t),done=!!s.taskClaims?.[q.key],pct=Math.min(100,100*q.progress/t.goal);return `<div class="task-entry"><b>${escapeHtml(t.name)}</b><p class="small">${escapeHtml(t.desc)}</p><div class="task-progress"><span>${fmt(Math.min(q.progress,t.goal))} / ${fmt(t.goal)}</span><span>💰 ${fmt(t.reward)}</span></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div><span class="task-action ${done?'task-claimed':q.progress<t.goal?'task-pending':'task-ready'}">${button(done?'✓ Abgeholt':q.progress>=t.goal?'💰 Abholbar':'Noch offen',`claimTask('${t.id}')`,done||q.progress<t.goal)}</span></div>`}).join('')}</div>`).join('')}<p class="small">Reset: Daily 00:00 UTC · Weekly Montag</p></section>`;
}
const merchantOffers=[{name:'Seltene Lederlieferung',give:{wheat:100},receive:{leather:25}},{name:'Federn gegen Stein',give:{stone:130},receive:{feather:35}},{name:'Wolle gegen Holz',give:{oak:160},receive:{wool:30}},{name:'Königlicher Talerhandel',give:{ironbar:12},taler:600},{name:'Viehzüchter-Paket',give:{wheat:75,carrot:50},receive:{beef:25,pork:25}}];
function merchantSlot(){return Math.floor(Date.now()/10800000)}
function merchantOffer(){return merchantOffers[merchantSlot()%merchantOffers.length]}
function merchantTrade(){const slot=merchantSlot(),offer=merchantOffer();if(s.merchantLastSlot===slot||!canPay(offer.give))return;pay(offer.give);for(const [k,n] of Object.entries(offer.receive||{}))gain(k,n);s.tradeCoins+=(offer.taler||0);s.merchantLastSlot=slot;s.merchantDeals=(s.merchantDeals||0)+1;log('🧳 Wandernder Händler: '+offer.name);checkAchievements();save();render()}
function merchantPanel(){const offer=merchantOffer(),used=s.merchantLastSlot===merchantSlot(),left=(merchantSlot()+1)*10800000-Date.now();const cost=Object.entries(offer.give).map(([k,n])=>R[k][0]+' '+fmt(n)+' '+R[k][1]).join(', '),reward=Object.entries(offer.receive||{}).map(([k,n])=>R[k][0]+' '+fmt(n)+' '+R[k][1]).join(', ')+(offer.taler?'💰 '+fmt(offer.taler)+' Taler':'');return `<section class="card"><h2>🧳 Wandernder Händler</h2><p>Alle 3 Stunden erscheint ein besonderes, einmaliges Angebot. Der Händler wechselt sein Angebot automatisch.</p><div class="item"><h3>${offer.name}</h3><p>Gib: ${cost}</p><p>Erhalte: <b>${reward}</b></p><p class="small">⏳ Neues Angebot in <span id="merchant-countdown">${timeLeft(left/1000)}</span></p>${button(used?'✓ Bereits gehandelt':'Sonderhandel abschließen','merchantTrade()',used||!canPay(offer.give))}</div></section>`}
function animalsPanel(){const ids=['cowpasture','pigpen','chickencoop','sheepfold'];return `<section class="card"><h2>🐄 Tierzucht</h2><p>Baue Weiden und Ställe. Jedes Tiergebäude belegt einen Bauplatz und beherbergt 2 Tiere. Ein Einwohner versorgt bis zu 5 Tiere (tierartenübergreifend). Fleisch kann in der Taverne verkocht werden; Leder, Wolle und Federn sind als Materialien für spätere Crafting-Rezepte verfügbar.</p></section><div class="grid">${buildings.filter(b=>ids.includes(b.id)).map(b=>{const missing=buildingMissing(b),cost=buildingCost(b);return `<div class="item"><h3>${b.icon} ${b.name} × ${s.buildings[b.id]||0}</h3><p>${b.desc}</p><p class="small">🐾 2 Tiere pro Gebäude · 👷 1 Einwohner während des Baus · ⏱️ ${timeLeft(buildingDuration(b))} · 🗺️ 1 Bauplatz</p><p class="small">${Object.entries(b.prod).map(([k,v])=>R[k][0]+' '+R[k][1]+' +'+fmt(v)+'/Sek.').join(' · ')}</p><p class="small">${costText(cost)}</p>${missing.length?'<p class="small">🔒 '+missing.map(escapeHtml).join(' · ')+'</p>':''}${button('Bau starten',`build('${b.id}')`,missing.length||usedPlots()>=plotLimit()||!canPay(cost))}</div>`}).join('')}</div>`}

function updateTavernQuantity(id){
 const r=tavernRecipes.find(x=>x.id===id),input=document.getElementById('tavern-qty-'+id),box=document.getElementById('tavern-cost-'+id);
 if(!r||!input||!box)return;
 const qty=Number(input.value),valid=Number.isSafeInteger(qty)&&qty>=1&&qty<=100000;
 box.innerHTML=Object.entries(r.cost).map(([k,n])=>{const need=valid?n*qty:0,have=s.res[k]||0;return `<span style="color:${valid&&have>=need?'#85d7a5':'#f08080'}">${R[k][0]} ${R[k][1]} ${fmt(have)}/${valid?fmt(need):'–'}</span>`}).join(' · ')+(valid?'':' · ⚠️ Anzahl 1–100.000');
 const row=input.closest('.tavern-recipe-row'),btn=row?.querySelector('button');
 if(btn){btn.disabled=!valid||!(s.buildings.tavern>0)||!s.upgrades.includes(r.tech)||(r.blueprint&&!hasBlueprint(r.blueprint))||tavernOrders().length>=tavernCapacity()||freeResidents()<1||!canPay(Object.fromEntries(Object.entries(r.cost).map(([k,n])=>[k,n*qty])));}
}
function tavernPanel(){const orders=tavernOrders(),stock=s.tavernStock||{},total=Object.values(stock).reduce((a,n)=>a+(Number(n)||0),0),interval=Math.max(10,35-5*Math.min(4,(s.buildings.tavern||1)-1));return `<section class="card"><h2>🍻 Taverne · Gäste & Küche</h2><p>Kochen und Brauen füllt den <b>Vorrat</b>. Erst wenn Besucher etwas kaufen, erhältst du Looterianische Taler.</p><div class="row"><span>🏠 Tavernen: <b>${s.buildings.tavern||0}</b></span><span>👨‍🍳 Köche: <b>${orders.length}/${tavernCapacity()}</b></span><span>👷 Frei: <b>${freeResidents()}</b></span><span>🍽️ Portionen: <b>${fmt(total)}</b></span><span>🚶 Besucher: <b>${fmt(s.tavernVisitors||0)}</b></span><span>💰 Einnahmen: <b>${fmt(s.tavernSales||0)} T</b></span></div><p class="small">Pro Taverne sind maximal 2 Köche verfügbar. Jeder Koch kann beliebig viele Portionen einer Sorte nacheinander zubereiten und belegt dabei nur 1 Kochplatz und 1 Einwohner. Für unterschiedliche Gerichte nutzt du weitere Kochplätze. Besucher kommen alle ${interval} Sekunden.</p><h3>🍽️ Fertige Speisen & Getränke</h3><div class="row">${tavernRecipes.filter(r=>(stock[r.id]||0)>0).map(r=>`<span>${r.icon} ${r.name}: <b>${fmt(stock[r.id])}</b> · ${fmt(r.taler)} T/Stück</span>`).join('')||'<span class="small">Noch keine fertigen Portionen.</span>'}</div></section><div class="tavern-recipe-list">${tavernRecipes.map(r=>{const locked=!s.upgrades.includes(r.tech)||(r.blueprint&&!hasBlueprint(r.blueprint)),missing=Object.entries(r.cost).filter(([k,n])=>(s.res[k]||0)<n),reasons=[!s.buildings.tavern?'Taverne bauen':null,!s.upgrades.includes(r.tech)?'Forschung fehlt':null,r.blueprint&&!hasBlueprint(r.blueprint)?'Rezeptbauplan fehlt':null,missing.length?'Zutaten fehlen: '+missing.map(([k,n])=>R[k][1]+' '+fmt(Math.max(0,n-(s.res[k]||0)))).join(', '):null,orders.length>=tavernCapacity()?'Alle Kochplätze belegt ('+orders.length+'/'+tavernCapacity()+')':null,freeResidents()<1?'1 freier Einwohner benötigt':null].filter(Boolean);return `<div class="tavern-recipe-row ${locked?'preview-locked':''}"><h3>${r.icon} ${r.name} (${fmt(stock[r.id]||0)})</h3><p>${r.kind} · ⏱️ ${r.duration} Sek. · 💰 <b>${fmt(r.taler)} Taler pro Gast</b></p>${r.blueprint?`<p class="small">📜 ${hasBlueprint(r.blueprint)?'Seltener Rezeptbauplan vorhanden':'Seltener Rezeptbauplan fehlt (Expedition)'}</p>`:''}<p class="small" id="tavern-cost-${r.id}">${Object.entries(r.cost).map(([k,n])=>`<span style="color:${(s.res[k]||0)>=n?'#85d7a5':'#f08080'}">${R[k][0]} ${R[k][1]} ${fmt(s.res[k]||0)}/${fmt(n)}</span>`).join(' · ')}</p>${locked?`<p class="small">🔒 ${!s.upgrades.includes(r.tech)?'Forschung: '+(allTechs.find(t=>t.id===r.tech)?.name||r.tech):'Rezeptbauplan fehlt'}</p>`:''}${reasons.length?`<p class="small" style="color:#f1bb73">⚠️ ${reasons.map(escapeHtml).join(' · ')}</p>`:'<p class="small" style="color:#85d7a5">✓ Bereit zur Zubereitung</p>'}<label class="small" for="tavern-qty-${r.id}">Anzahl Portionen</label> <input oninput="updateTavernQuantity('${r.id}')" id="tavern-qty-${r.id}" type="number" min="1" max="100000" value="1" step="1" style="width:95px;max-width:100%;background:#101a25;color:#f5f5f5;border:1px solid #63718a;border-radius:6px;padding:7px"> ${button('Zubereitung starten',`tavernStart('${r.id}')`,reasons.length>0)}<p class="small">Die eingegebene Anzahl wird nacheinander von einem Koch zubereitet; Zutaten für alle Portionen werden beim Start verbraucht.</p></div>`}).join('')}</div>`}
function farmingPanel(){const farms=buildings.filter(b=>b.id.endsWith('farm'));return `<section class="card"><h2>🌾 Landwirtschaft</h2><p>Baue Minecraft-Feldfrüchte automatisch an. Jedes Feld braucht genau einen Bauplatz und einen Einwohner. Neue Sorten werden über Forschungen freigeschaltet.</p></section><div class="grid">${farms.map(b=>{const missing=buildingMissing(b),cost=buildingCost(b),owned=s.buildings[b.id]||0;const blockers=[...missing,...(usedPlots()>=plotLimit()?['Keine freien Bauplätze im Reich']:[]),...(!canPay(cost)?['Materialien für den nächsten Bau fehlen (steigende Preise beachten)']:[])];return `<div class="item ${blockers.length?'preview-locked':''}"><h3>${b.icon} ${b.name} × ${owned}</h3><p>${b.desc} · +${fmt(Object.values(b.prod)[0])}/Sek. pro Feld</p><p class="small">🏗️ Bauzeit: ${timeLeft(buildingDuration(b))}</p><p class="small">${Object.entries(cost).map(([k,n])=>`${R[k][0]} ${R[k][1]} ${fmt(s.res[k]||0)}/${fmt(n)}`).join(' · ')}</p><p class="small">👥 Freie Einwohner: ${freeResidents()} · 🗺️ Freie Bauplätze: ${Math.max(0,plotLimit()-usedPlots())} · 🏗️ Freie Baustellen: ${Math.max(0,constructionSlots()-(s.constructions||[]).length)}</p>${blockers.length?`<p class="small" style="color:#ff9c9c">🔒 ${blockers.map(escapeHtml).join(' · ')}</p>`:''}${button('Feldbau starten',`build('${b.id}')`,blockers.length>0)}</div>`}).join('')}</div>`}
function production(){const out={};const mult=(s.upgrades.includes('engines')?1.5:1)*(s.upgrades.includes('automation')?2:1)*(1+achievementBonus('production'));syncBuildingTiers();for(const b of buildings)for(const [k,v] of Object.entries(b.prod)){out[k]=(out[k]||0)+v*(s.buildingTiers[b.id]||[]).reduce((sum,tier)=>sum+1+0.1*tier,0)*mult}return out}
// Aktive Spielzeit zählt nur bei geöffnetem Spiel; der tägliche Drop-Zähler beginnt jeden lokalen Kalendertag neu.
function localDayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function dailyDropState(){s.dailyDrops??={date:'',seconds:0,claimed:0};const today=localDayKey();if(s.dailyDrops.date!==today)s.dailyDrops={date:today,seconds:0,claimed:0,history:[]};s.dailyDrops.history??=[];return s.dailyDrops}
// 1, 3, 6, 10, 15, 21 ... Minuten kumulierte Spielzeit pro Tag.
function nextDropAt(claimed){return 60*(claimed+1)*(claimed+2)/2}
function dailyDropPool(){const pool=gathers.filter(g=>!gateMissing(g).length).map(g=>g.id);for(const [id,building] of [['wheat','wheatfarm'],['carrot','carrotfarm'],['potato','potatofarm'],['beetroot','beetrootfarm'],['pumpkin','pumpkinfarm'],['melon','melonfarm'],['sugarcane','sugarcanefarm']])if((s.buildings[building]||0)>0)pool.push(id);return pool.length?pool:['oak','stone']}
function awardDailyDrop(){const pool=dailyDropPool(),id=pool[Math.floor(Math.random()*pool.length)],g=gathers.find(x=>x.id===id);const tier=Math.max(1,g?.lv||1);const cap=Math.min(40,3+Math.floor(level()/5));const qty=Math.max(1,Math.floor((2+Math.random()*5)*(1+Math.min(level(),100)/45)/(1+tier/45)));const amount=Math.min(cap,qty);gain(id,amount);dailyDropState().history.unshift({id,amount,at:Date.now()});dailyDropState().history=dailyDropState().history.slice(0,200);record('daily_drops',1,false);log('🎁 Tagesdrop: '+amount+' × '+(R[id]?.[1]||id));notify('🎁 Tagesdrop: '+amount+' × '+(R[id]?.[1]||id))}
function advanceDailyDrops(dt){if(!Number.isFinite(dt)||dt<=0)return;const d=dailyDropState();d.seconds+=dt;s.activeSeconds=(s.activeSeconds||0)+dt;record('active_time',dt,false);let count=0;while(d.seconds>=nextDropAt(d.claimed)&&count++<12){awardDailyDrop();d.claimed++}}
let dailyDropHistoryOpen=false;function toggleDailyDropHistory(){dailyDropHistoryOpen=!dailyDropHistoryOpen;renderDailyDropSidebar()}
function renderDailyDropSidebar(){const box=document.getElementById('daily-drop-content');if(!box)return;const d=dailyDropState(),left=Math.max(0,nextDropAt(d.claimed)-d.seconds);box.innerHTML=`<p class="small">Nächster zufälliger Materialdrop in <b>${timeLeft(left)}</b></p><div class="progress"><div class="bar" style="width:${Math.min(100,100*(d.seconds-(d.claimed?nextDropAt(d.claimed-1):0))/(nextDropAt(d.claimed)-(d.claimed?nextDropAt(d.claimed-1):0)))}%"></div></div><p class="small">🎁 Heute erhalten: ${d.claimed} · ⏱️ Aktive Spielzeit: ${timeLeft(s.activeSeconds||0)}</p><p class="small">Start nach 1 Minute, danach steigen die Abstände. Täglicher Reset um Mitternacht. Nur bereits freigeschaltete Rohstoffe.</p><button class="drop-toggle" type="button" onclick="toggleDailyDropHistory()" aria-expanded="${dailyDropHistoryOpen}">📜 Heutige Drops ${dailyDropHistoryOpen?'▲ Schließen':'▼ Anzeigen'} (${d.history.length})</button>${dailyDropHistoryOpen?`<div class="drop-history">${d.history.length?d.history.map(x=>`<div class="drop-history-entry">🎁 <b>${fmt(x.amount)} × ${escapeHtml(R[x.id]?.[1]||x.id)}</b><br><span class="small">${new Date(x.at).toLocaleTimeString('de-DE')}</span></div>`).join(''):'<p class="small">Heute noch keine Drops erhalten.</p>'}</div>`:''}` }
function tick(dt,offline=false){finishConstructions();finishResearch();finishExpedition();finishTavernOrder();dt=Math.max(0,Math.min(dt,86400));serveTavernVisitors(dt);if(!offline)advanceDailyDrops(dt);for(const [k,v] of Object.entries(production())){gain(k,v*dt);record('auto_'+k,v*dt,false)}checkMilestones();checkAchievements()}
function migratePlanks(){if(!s.res)return;const n=Number(s.res.plank)||0;if(n)s.res.oakplank=(s.res.oakplank||0)+n;delete s.res.plank;for(const x of s.pinnedTargets||[])if(x.type==='recipe'&&x.id==='plank')x.id='oakplank';s.blueprints??=[];for(const b of blueprintDefs)if(s.regions.includes(b.region)&&!s.blueprints.includes(b.id))s.blueprints.push(b.id)}
function migrateWood(){if(!s.res||typeof s.res!=='object')return; if(Object.prototype.hasOwnProperty.call(s.res,'wood')){s.res.oak=(s.res.oak||0)+(Number(s.res.wood)||0);delete s.res.wood;}if(Array.isArray(s.pinnedMaterials)){for(const pin of s.pinnedMaterials){if(pin.id==='wood')pin.id='oak';}}}
function migrateResearch(){if(!Array.isArray(s.researches))s.researches=[];if(s.research&&!s.researches.some(x=>x.id===s.research.id))s.researches.push(s.research);s.research=null;if(!Array.isArray(s.queue))s.queue=[];if(!s.skillXp||typeof s.skillXp!=='object')s.skillXp={};if(!s.stats||typeof s.stats!=='object')s.stats={};if(!s.expedition||typeof s.expedition!=='object'||!regions.some(r=>r.id===s.expedition.id)||!Number.isFinite(s.expedition.ends))s.expedition=null;if(!s.milestones||typeof s.milestones!=='object')s.milestones={};if(!Array.isArray(s.expeditionHistory))s.expeditionHistory=[]}
let pendingOfflineSummary=null;
function offlineSnapshot(){return {res:{...s.res},xp:s.xp,coins:s.coins,tradeCoins:s.tradeCoins,upgrades:[...s.upgrades],regions:[...s.regions],achievements:[...s.achievements],expeditionHistory:(s.expeditionHistory||[]).length}}
function showOfflineSummary(report){
 const overlay=document.getElementById('offline-overlay'),box=document.getElementById('offline-summary');if(!overlay||!box)return;
 const rows=Object.entries(report.gains).filter(([,n])=>n>0.00001).sort((a,b)=>b[1]-a[1]);
 const resourceHtml=rows.length?rows.map(([id,n])=>`<div class="offline-row"><span>${escapeHtml((R[id]||['📦',id])[0])} ${escapeHtml((R[id]||['📦',id])[1])}</span><b>+${fmt(n)}</b></div>`).join(''):'<p class="small">Keine Ressourcen automatisch produziert.</p>';
 const extras=[];
 if(report.xp>0)extras.push(`⭐ +${fmt(report.xp)} Spieler-XP`);
 if(report.coins>0)extras.push(`🏆 +${fmt(report.coins)} Ruhmpunkte`);
 if(report.tradeCoins>0)extras.push(`💰 +${fmt(report.tradeCoins)} Looterianische Taler`);
 if(report.techs.length)extras.push('🧪 Forschungen abgeschlossen: '+report.techs.map(escapeHtml).join(', '));
 if(report.regions.length)extras.push('🗺️ Gebiete entdeckt: '+report.regions.map(escapeHtml).join(', '));
 if(report.achievements.length)extras.push('🏅 Achievements: '+report.achievements.map(escapeHtml).join(', '));
 if(report.expeditions>0)extras.push('🧭 Abgeschlossene Expeditionen: '+report.expeditions);
 box.innerHTML=`<p>Du warst <strong>${timeLeft(report.elapsed)}</strong> nicht im Spiel.${report.capped?' Die Produktion wurde auf maximal 24 Stunden begrenzt.':''}</p><h3>📦 Automatisch gesammelte Ressourcen</h3>${resourceHtml}${extras.length?'<h3>✨ Weitere Fortschritte</h3>'+extras.map(x=>`<div class="offline-row"><span>${x}</span></div>`).join(''):''}`;
 overlay.hidden=false;document.getElementById('offline-close').focus();
}
function closeOfflineSummary(){document.getElementById('offline-overlay').hidden=true;pendingOfflineSummary=null}
function migrateLumber(){const n=Math.max(0,Number(s.buildings?.lumber)||0);if(n){s.buildings.oakgrove=(Number(s.buildings.oakgrove)||0)+n;delete s.buildings.lumber;s.buildingUpgrades??={};s.buildingUpgrades.oakgrove=Math.max(Number(s.buildingUpgrades.oakgrove)||0,Number(s.buildingUpgrades.lumber)||0);delete s.buildingUpgrades.lumber}}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return;const d=JSON.parse(raw);if(d.version!==1||!d.res||!d.buildings)throw Error('Unbekanntes Speicherformat');s={...initial(),...d,res:{...initial().res,...d.res}};if(!Number.isFinite(s.tradeCoins))s.tradeCoins=250;s.logs=(s.logs||[]).filter(x=>!/^🔨 .* hergestellt$/.test(x));migrateResearch();migrateWood();migratePlanks();if(!Number.isFinite(s.houses)||s.houses<1)s.houses=1;if(!Number.isFinite(s.realmLevel))s.realmLevel=0;s.houseUpgrades=Array.isArray(s.houseUpgrades)?s.houseUpgrades:[];s.buildingUpgrades??={};syncBuildingTiers();s.tavernStock??={};s.expeditionFails??={};s.activeSeconds=Number.isFinite(s.activeSeconds)?Math.max(0,s.activeSeconds):0;s.dailyDrops??={date:"",seconds:0,claimed:0};if(!Array.isArray(d.tavernOrders))s.tavernOrders=d.tavernOrder?[d.tavernOrder]:[];s.tavernOrder=null;s.constructions=Array.isArray(s.constructions)?s.constructions.filter(c=>buildings.some(b=>b.id===c.id)&&Number.isFinite(c.ends)):[];s.taskClaims??={};s.taskProgress??={};migrateLumber();const realElapsed=Math.max(0,(Date.now()-Number(s.last||Date.now()))/1000),elapsed=Math.min(86400,realElapsed);const before=offlineSnapshot();syncAchievementXp(true);tick(elapsed,true);finishResearch();if(elapsed>30){const after=offlineSnapshot();pendingOfflineSummary={elapsed,capped:realElapsed>86400,gains:Object.fromEntries(Object.keys(after.res).map(k=>[k,Math.max(0,(after.res[k]||0)-(before.res[k]||0))])),xp:Math.max(0,after.xp-before.xp),coins:Math.max(0,after.coins-before.coins),tradeCoins:Math.max(0,after.tradeCoins-before.tradeCoins),techs:after.upgrades.filter(id=>!before.upgrades.includes(id)).map(id=>allTechs.find(x=>x.id===id)?.name||id),regions:after.regions.filter(id=>!before.regions.includes(id)).map(id=>regions.find(x=>x.id===id)?.name||id),achievements:after.achievements.filter(id=>!before.achievements.includes(id)).map(id=>achievements.find(x=>x.id===id)?.name||id),expeditions:Math.max(0,after.expeditionHistory-before.expeditionHistory)};log('💤 Offline-Fortschritt für '+fmt(elapsed/60)+' Minuten gutgeschrieben.')}s.last=Date.now()}catch(e){console.error(e);notify('Spielstand konnte nicht geladen werden.')}}
function syncProgression(){for(const [id] of resourceProgression)progressUnlocked(id);for(const [id] of fieldProgression)progressUnlocked(id);for(const [id] of livestockProgression)progressUnlocked(id)}
function save(show=false){syncProgression();s.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(s));if(show)notify('💾 Spiel gespeichert!')}catch(e){notify('Speichern fehlgeschlagen: Browser-Speicher prüfen.')}}
function exportSave(){save();const blob=new Blob([JSON.stringify(s,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='story-of-looteria-spielstand.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
async function importSave(e){const file=e.target.files?.[0];if(!file)return;try{const d=JSON.parse(await file.text());if(d.version!==1||!d.res||!d.buildings||!Array.isArray(d.upgrades)||!Array.isArray(d.regions))throw Error();if(!confirm('Aktuellen Spielstand durch diese Datei ersetzen?'))return;s={...initial(),...d,res:{...initial().res,...d.res},last:Date.now()};if(!Number.isFinite(s.tradeCoins))s.tradeCoins=250;s.logs=(s.logs||[]).filter(x=>!/^🔨 .* hergestellt$/.test(x));migrateResearch();migrateWood();migratePlanks();if(!Number.isFinite(s.houses)||s.houses<1)s.houses=1;if(!Number.isFinite(s.realmLevel))s.realmLevel=0;s.houseUpgrades=Array.isArray(s.houseUpgrades)?s.houseUpgrades:[];s.buildingUpgrades??={};syncBuildingTiers();s.tavernStock??={};s.expeditionFails??={};if(!Array.isArray(d.tavernOrders))s.tavernOrders=d.tavernOrder?[d.tavernOrder]:[];s.tavernOrder=null;migrateLumber();syncAchievementXp(true);save();log('📥 Spielstand importiert');render();notify('Import erfolgreich')}catch(err){notify('Ungültige Spielstand-Datei')}e.target.value=''}
function resetGame(){if(!confirm('Neues Spiel starten? Dein aktueller Fortschritt wird vollständig überschrieben.'))return;if(!confirm('Letzte Bestätigung: Wirklich alle Gebäude, Einwohner, Forschungen und Ressourcen löschen? Dieser Schritt kann nicht rückgängig gemacht werden.'))return;s=initial();tab='Sammeln';save();render();notify('👑 Neues Spiel gestartet')}
const tabs=[['🔓','Freischaltungen'],['⛏️','Sammeln'],['🔨','Crafting'],['🌾','Farming'],['🍻','Taverne'],['🐄','Tierzucht'],['🧳','Wanderhändler'],['🏭','Gebäude'],['🗺️','Reichskarte'],['👷','Arbeitskräfte'],['🧪','Forschung'],['🌍','Weltkarte'],['🏆','Achievements'],['📊','Statistik'],['⭐','Skills'],['🥇','Ranglisten'],['🏪','Handel']];
function button(label,fn,disabled=false,cls=''){return `<button class="${cls}" ${disabled?'disabled':''} onclick="${fn}">${label}</button>`}

const skillDefs=[['mining','⛏️','Bergbau'],['forestry','🌲','Forstwirtschaft'],['crafting','🔨','Handwerk'],['research','🔬','Wissenschaft'],['farming','🌾','Landwirtschaft'],['fishing','🎣','Angeln'],['hunting','🏹','Jagd'],['combat','⚔️','Kampf'],['magic','✨','Magie'],['alchemy','⚗️','Alchemie'],['smithing','🛠️','Schmieden'],['building','🏗️','Bauwesen'],['engineering','⚙️','Maschinenbau'],['automation','🤖','Automatisierung'],['energy','⚡','Energietechnik'],['exploration','🧭','Erkundung'],['trading','💰','Handel'],['logistics','🚚','Logistik'],['cooking','🍲','Kochen'],['enchanting','📖','Verzauberung']];
const statDefs=[['clicks','🖱️','Manuelle Sammelklicks'],['manual_wood','🌲','Holz von Hand'],['manual_stone','🪨','Stein von Hand'],['manual_coal','⚫','Kohle von Hand'],['manual_copper','🟠','Kupfer von Hand'],['manual_iron','⛓️','Eisen von Hand'],['manual_crystal','🔮','Kristalle von Hand'],['crafts','🔨','Crafting-Vorgänge'],['buildings','🏗️','Errichtete Gebäude'],['researches','🔬','Abgeschlossene Forschungen'],['regions','🧭','Entdeckte zusätzliche Gebiete'],['expeditions','🧭','Abgeschlossene Expeditionen'],['expedition_success','✅','Erfolgreiche Expeditionen'],['expedition_fail','⚠️','Gescheiterte Expeditionen'],['auto_wood','🏭','Automatisch produziertes Holz'],['auto_stone','🏭','Automatisch produzierter Stein'],['auto_coal','🏭','Automatisch produzierte Kohle'],['auto_copper','🏭','Automatisch produziertes Kupfer'],['auto_iron','🏭','Automatisch produziertes Eisen'],['auto_crystal','🏭','Automatisch produzierte Kristalle'],['active_time','⌛','Aktive Spielzeit (Sekunden)'],['daily_drops','🎁','Erhaltene Tagesdrops']];
const statNames=Object.fromEntries(statDefs.map(([k,,name])=>[k,name]));
const milestoneSteps=[1,10,50,100,250,500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000];
function threshold(n){return n<milestoneSteps.length?milestoneSteps[n]:1000000*Math.pow(10,Math.floor((n-milestoneSteps.length)/3)+1)*[1,2,5][(n-milestoneSteps.length)%3]}
function record(k,n,check=true){s.stats??={};s.stats[k]=(s.stats[k]||0)+n;if(check)checkMilestones()}
function checkMilestones(){s.milestones??={};for(const [key,,name] of statDefs){let n=s.milestones[key]||0,cur=s.stats?.[key]||0,steps=0;while(n<1000&&cur>=threshold(n)){n++;steps++}if(steps){s.milestones[key]=n;s.coins+=steps*10;log('🏆 '+name+' – Meilenstein '+n+' (+ '+(steps*10)+' Ruhmpunkte)');if(steps<5)notify('🏆 '+name+': Stufe '+n)} }syncAchievementXp()}
const skillLeveling={mining:'Stein, Kohle und Erze manuell sammeln (+3 Skill-XP pro Klick).',forestry:'Holzarten manuell fällen (+3 Skill-XP pro Klick).',crafting:'Gegenstände im Crafting herstellen (+5 Skill-XP pro Herstellung).',research:'Forschungen abschließen (+12 Skill-XP pro Forschung).',exploration:'Expeditionen abschließen (+24 Skill-XP bei Erfolg, +12 bei Fehlschlag).'};
function skillPanel(){return `<section class="card"><h2>⭐ Skills (20)</h2><p class="small">Aktive Skills steigen durch passende Tätigkeiten. Weitere Skills sind für künftige Spielsysteme vorbereitet.</p></section><div class="grid">${skillDefs.map(([k,ico,name])=>{const xp=s.skillXp?.[k]||0,lv=skillLevel(k),base=12*(lv-1)**2,next=12*lv**2;return `<div class="item"><h3>${ico} ${name} · Level ${lv}</h3><div class="progress"><div class="bar" style="width:${100*(xp-base)/(next-base)}%"></div></div><p class="small">${fmt(xp)} XP · nächstes Level bei ${fmt(next)} XP</p><p class="small" style="margin-top:8px"><b>📈 So levelst du:</b> ${skillLeveling[k]||'Noch nicht levelbar – das passende Spielsystem wird später ergänzt.'}</p></div>`}).join('')}</div>`}
function milestonePanel(){const total=Object.values(s.milestones||{}).reduce((a,b)=>a+b,0);return `<section class="card"><h2>🏆 Langzeit-Achievements</h2><p>Erreichte Meilensteine: <b>${total}</b> · Jeder Meilenstein bringt 10 Ruhmpunkte, XP entsprechend seiner Seltenheit und einen dauerhaften Bonus von 0,2 %. Die Boni sind pro Kategorie zusammen mit den normalen Achievement-Boni begrenzt (20 %, Extra-Gerichte 25 %). Mythisch wird erst ab Meilenstein-Stufe 100 erreicht. Die Ziele wachsen ohne feste Endstufe.</p><p class="small">🎁 Aktive Boni: Produktion +${fmt(achievementBonus('production')*100)} % · Extra-Sammelertrag ${fmt(achievementBonus('yield')*100)} % · Bauzeit −${fmt(achievementBonus('build')*100)} % · Forschungszeit −${fmt(achievementBonus('research')*100)} % · Extra-Gerichte ${fmt(achievementBonus('cooking')*100)} % (maximal 25 %).</p></section><div class="grid">${statDefs.map(([k,ico,name])=>{const stage=s.milestones?.[k]||0,val=s.stats?.[k]||0,target=threshold(stage);return `<div class="item achievement-rarity rarity-${milestoneRarity(stage)}"><h3>${ico} ${name}</h3><span class="badge earned">Stufe ${stage}</span> <span class="small rarity-label">${rarityNames[milestoneRarity(stage)]}</span><p>${fmt(val)} / ${fmt(target)}</p><div class="milestone-reward">🎁 Pro Stufe: ${milestoneBonusNames[milestoneBonusType(k)]}<br>✅ Bisher durch dieses Achievement: ${stage?((stage*.2).toLocaleString('de-DE',{maximumFractionDigits:1})):'0'} % · +10 Ruhmpunkte je Stufe<br>✨ Nächste Stufe: +${fmt(xpForMilestone(stage+1))} XP</div><div class="progress"><div class="bar" style="width:${Math.min(100,100*val/target)}%"></div></div></div>`}).join('')}</div>`}
function statsPanel(){return `<section class="card"><h2>📊 Persönliche Statistiken</h2><p class="small">Die Zählung beginnt mit Version 0.4. Ältere Klick- und Produktionszahlen lassen sich nicht zuverlässig nachträglich rekonstruieren.</p><div class="grid">${statDefs.map(([k,ico,name])=>`<div class="item"><h3>${ico} ${name}</h3><b>${fmt(s.stats?.[k]||0)}</b></div>`).join('')}</div></section>`}
// Eigenständige Handelswährung: Ruhmpunkte (s.coins) bleiben unantastbar.
const marketBase={oak:5,birch:12,spruce:26,darkoak:65,acacia:95,jungle:150,mangrove:260,cherry:420,stone:4,coal:25,copper:65,iron:145,crystal:400,oakplank:11,birchplank:26,spruceplank:50,cherryplank:700,brick:16,copperbar:230,ironbar:500,gear:1500};
function marketPrice(id){const base=marketBase[id]||10;const hour=Math.floor(Date.now()/3600000);let seed=0;for(const c of id)seed=(seed*31+c.charCodeAt(0))%100003;const fluctuation=1+0.2*Math.sin(hour*0.73+seed);return Math.max(1,Math.round(base*fluctuation))}
function trade(id,side,amount){amount=Number(amount);if(!R[id]||!marketBase[id]||![1,10,100].includes(amount)||!['buy','sell'].includes(side))return;const unit=marketPrice(id),price=side==='buy'?unit:Math.max(1,Math.floor(unit*0.6)),total=price*amount;s.tradeCoins??=250;s.tradeStats??={bought:0,sold:0,earned:0,spent:0};if(side==='buy'){if(s.tradeCoins<total){notify('Nicht genügend Looterianische Taler!');return}s.tradeCoins-=total;s.res[id]=(s.res[id]||0)+amount;s.tradeStats.bought+=amount;s.tradeStats.spent+=total}else{if((s.res[id]||0)+1e-7<amount){notify('Nicht genügend '+R[id][1]+'!');return}s.res[id]-=amount;s.tradeCoins+=total;s.tradeStats.sold+=amount;s.tradeStats.earned+=total}addSkill('trading',amount);log((side==='buy'?'🏪 Gekauft: ':'🏪 Verkauft: ')+amount+' × '+R[id][1]+' ('+fmt(total)+' Looterianische Taler)');save();render()}
function sellAll(id){if(!R[id]||!marketBase[id])return;const amount=Math.floor(s.res[id]||0);if(amount<1){notify('Keine '+R[id][1]+' zum Verkaufen vorhanden.');return}const total=amount*Math.max(1,Math.floor(marketPrice(id)*.6));s.res[id]-=amount;s.tradeCoins=(s.tradeCoins??250)+total;s.tradeStats??={bought:0,sold:0,earned:0,spent:0};s.tradeStats.sold+=amount;s.tradeStats.earned+=total;addSkill('trading',amount);log('🏪 Verkauft: '+amount+' × '+R[id][1]+' ('+fmt(total)+' Looterianische Taler)');save();render()}
function marketPanel(){s.tradeCoins??=250;return `<section class="card"><h2>🏪 Handelsplatz</h2><p>💰 Handelsguthaben: <b class="trade-value" id="market-balance">${fmt(s.tradeCoins)} Looterianische Taler</b></p><p class="small">Ressourcen verkaufen, um Forschungen, Wohnhäuser und Upgrades zu finanzieren. Die Marktpreise ändern sich stündlich.</p><div class="market-scroll"><table class="market-table"><thead><tr><th>Ressource</th><th>Im Lager</th><th>Kauf / Verkauf</th><th>Kaufen</th><th>Verkaufen</th></tr></thead><tbody>${Object.keys(marketBase).filter(id=>R[id]).map(id=>{const price=marketPrice(id),sell=Math.max(1,Math.floor(price*.6));return `<tr data-market-id="${id}"><td><b>${R[id][0]} ${R[id][1]}</b></td><td class="market-stock" data-stock="${id}">${fmt(s.res[id]||0)}</td><td class="market-prices"><span>⬆ ${fmt(price)} T</span><span>⬇ ${fmt(sell)} T</span></td><td><div class="market-actions">${[1,10,100].map(n=>`<span class="market-action-unit"><button type="button" data-side="buy" data-amount="${n}" onclick="trade('${id}','buy',${n})">+${n}</button><small class="market-action-total buy-total" data-total="buy" data-amount="${n}">${fmt(price*n)} T</small></span>`).join('')}</div></td><td><div class="market-actions">${[1,10,100].map(n=>`<span class="market-action-unit"><button type="button" data-side="sell" data-amount="${n}" onclick="trade('${id}','sell',${n})">−${n}</button><small class="market-action-total" data-total="sell" data-amount="${n}">${fmt(sell*n)} T</small></span>`).join('')}<span class="market-action-unit"><button type="button" data-side="all" onclick="sellAll('${id}')">Alles</button><small class="market-action-total" data-total="all">${fmt(Math.floor(s.res[id]||0)*sell)} T</small></span></div></td></tr>`}).join('')}</tbody></table></div><p class="small">⬆ Kaufpreis · ⬇ Verkaufspreis · T = Looterianische Taler</p></section>`}
function refreshMarket(){if(tab!=='Handel')return;const balance=document.getElementById('market-balance');if(balance)balance.textContent=fmt(s.tradeCoins??250)+' Looterianische Taler';document.querySelectorAll('[data-market-id]').forEach(row=>{const id=row.dataset.marketId,stock=s.res[id]||0,price=marketPrice(id);const count=row.querySelector('.market-stock');if(count)count.textContent=fmt(stock);const prices=row.querySelector('.market-prices');if(prices)prices.innerHTML='<span>⬆ '+fmt(price)+' T</span><span>⬇ '+fmt(Math.max(1,Math.floor(price*.6)))+' T</span>';row.querySelectorAll('[data-total]').forEach(el=>{const n=el.dataset.total==='all'?Math.floor(stock):Number(el.dataset.amount),unit=el.dataset.total==='buy'?price:Math.max(1,Math.floor(price*.6));el.textContent=fmt(n*unit)+' T'});row.querySelectorAll('[data-side]').forEach(btn=>{const side=btn.dataset.side,n=Number(btn.dataset.amount);btn.disabled=side==='buy'?(s.tradeCoins??250)<price*n:side==='all'?stock<1:stock+1e-7<n})})}

const SB_URL='https://bmhpcfqhlatikldamtxk.supabase.co';
const SB_KEY='sb_publishable_rv2Nmo9uOKAyw4jTv2_Lsg_hSjQcVr4';
const MP_SESSION_KEY='looteria-online-session-v1';
let mpSession=null,mpRows=[],mpError='',mpLoading=false,mpSyncing=false,mpLastSync=0,mpSort='fame';
let mpRetryTimer=null;
function multiplayerStatus(){const el=document.getElementById('mp-global-status');if(!el)return;const state=!navigator.onLine||mpError?'offline':mpLoading||(!mpSession&&navigator.onLine)?'connecting':'online';el.className='mp-status mp-'+state;el.textContent=state==='online'?'Online · Rangliste':state==='connecting'?'Verbinde …':'Offline · Rangliste';el.title=mpError|| (state==='online'?'Mit der Online-Rangliste verbunden':state==='connecting'?'Verbindung wird aufgebaut':'Keine Verbindung zur Rangliste');}
function multiplayerScheduleRetry(){if(mpRetryTimer||!navigator.onLine)return;mpRetryTimer=setTimeout(()=>{mpRetryTimer=null;if(!mpSession&&!mpLoading)multiplayerConnect();else if(mpSession&&mpError)multiplayerSync()},15000)}
function multiplayerName(){return (localStorage.getItem('looteria-multiplayer-name')||'').trim()}
function multiplayerSaveName(){const input=document.getElementById('mp-name');if(!input)return;const name=input.value.trim().slice(0,24);if(name.length<3){notify('⚠️ Spielername muss mindestens 3 Zeichen haben.');return}localStorage.setItem('looteria-multiplayer-name',name);notify('👑 Spielername gespeichert: '+name);render();if(mpSession)multiplayerSync();else multiplayerConnect()}
async function mpRequest(path,options={}){
 const headers={'apikey':SB_KEY,'Content-Type':'application/json',...options.headers};
 if(mpSession?.access_token)headers.Authorization='Bearer '+mpSession.access_token;
 const r=await fetch(SB_URL+path,{...options,headers});const body=await r.text();let data;try{data=body?JSON.parse(body):null}catch{data=body}
 if(!r.ok)throw Error((data&&typeof data==='object'&&(data.msg||data.message||data.error_description||data.error))||'HTTP '+r.status);
 return data;
}
async function multiplayerConnect(){if(mpLoading)return;if(!navigator.onLine){mpError='Keine Internetverbindung';multiplayerStatus();return}mpLoading=true;mpError='';multiplayerStatus();try{
 const stored=JSON.parse(localStorage.getItem(MP_SESSION_KEY)||'null');
 if(stored?.refresh_token){try{mpSession=await mpRequest('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:stored.refresh_token})});}catch(e){mpSession=null}}
 if(!mpSession)mpSession=await mpRequest('/auth/v1/signup',{method:'POST',body:JSON.stringify({data:{game:'looteria'}})});
 if(!mpSession?.access_token||!mpSession?.user?.id)throw Error('Anonyme Anmeldung nicht aktiv. In Supabase Authentication → Providers → Anonymous Sign-Ins aktivieren.');
 localStorage.setItem(MP_SESSION_KEY,JSON.stringify(mpSession));
 await multiplayerSync();
 }catch(e){mpError=e.message||String(e);console.error('Looteria Multiplayer',e);multiplayerScheduleRetry()}finally{mpLoading=false;multiplayerStatus();if(tab==='Ranglisten')render()}
}
async function multiplayerSync(){if(!mpSession?.access_token||mpSyncing)return;mpSyncing=true;try{
 const name=multiplayerName();if(name.length>=3){
 const data={player_id:mpSession.user.id,player_name:name,fame:Math.max(0,Math.floor(s.coins||0)),player_level:Math.max(1,level()),taler:Math.max(0,Math.floor(s.tradeCoins||0)),play_seconds:Math.max(0,Math.floor(s.activeSeconds||0)),updated_at:new Date().toISOString()};
 await mpRequest('/rest/v1/looteria_leaderboard?on_conflict=player_id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(data)});
 }
 await multiplayerRefresh();mpLastSync=Date.now();mpError='';
 }catch(e){mpError=e.message||String(e);multiplayerScheduleRetry();if(tab==='Ranglisten')render()}finally{mpSyncing=false;multiplayerStatus()}
}
async function multiplayerRefresh(){try{
 const allowed=['fame','player_level','taler','play_seconds'];if(!allowed.includes(mpSort))mpSort='fame';
 mpRows=await mpRequest('/rest/v1/looteria_leaderboard?select=player_id,player_name,fame,player_level,taler,play_seconds,updated_at&order='+mpSort+'.desc&limit=50');
 mpError='';if(tab==='Ranglisten')render();
 }catch(e){mpError=e.message||String(e);multiplayerScheduleRetry();multiplayerStatus();if(tab==='Ranglisten')render()}
}
function multiplayerSort(sort){mpSort=sort;multiplayerRefresh()}
function leaderboardPanel(){const cols=[['fame','🏆 Ruhmpunkte'],['player_level','⭐ Level'],['taler','💰 Taler'],['play_seconds','⏱️ Spielzeit']];return `<section class="card"><h2>🌐 Online-Ranglisten (Beta)</h2><p class="small">Ohne E-Mail oder Passwort: Die anonyme Spielerkennung wird in diesem Browser gespeichert. Dein eigentlicher Spielstand bleibt lokal.</p><label for="mp-name">Öffentlicher Spielername</label><div class="row"><input id="mp-name" type="text" maxlength="24" minlength="3" value="${escapeHtml(multiplayerName())}" placeholder="z. B. Kaledoss" style="min-width:180px;flex:1;padding:9px;border-radius:8px;background:#142334;color:#fff;border:1px solid #4b6075"><button type="button" onclick="multiplayerSaveName()">💾 Namen speichern</button></div><div class="row" style="margin-top:10px"><span>${mpSession&&!mpError?'🟢 Online':mpLoading?'🟡 Verbinde …':'🔴 Offline'}</span>${button(mpLoading?'Verbinde …':mpSession?'🔄 Jetzt synchronisieren':'🌐 Multiplayer verbinden',mpSession?'multiplayerSync()':'multiplayerConnect()',mpLoading)}</div>${mpError?`<p style="color:#ff9999">⚠️ ${escapeHtml(mpError)}</p>`:''}<p class="small">${mpLastSync?'Zuletzt synchronisiert: '+new Date(mpLastSync).toLocaleTimeString('de-DE'):'Noch nicht synchronisiert.'} · Automatische Synchronisierung alle 30 Sekunden. Für das erste Verbinden muss in Supabase die Datenbank eingerichtet sein.</p><div class="hint">⚠️ Beta: Ranglistenwerte stammen derzeit aus lokalen Spielständen und können manipuliert werden. Noch keine fairen Wettbewerbsranglisten.</div></section><section class="card"><h2>🥇 Globale Top 50</h2><div class="row">${cols.map(([id,label])=>`<button class="${mpSort===id?'active':''}" onclick="multiplayerSort('${id}')">${label}</button>`).join('')}</div>${!mpRows.length?'<p class="small">Noch keine Online-Einträge geladen. Verbinde dich und speichere einen Spielernamen.</p>':`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th>Platz</th><th>Spieler</th><th>Wert</th></tr></thead><tbody>${mpRows.map((p,i)=>`<tr style="border-bottom:1px solid #354254"><td>${i+1}.</td><td>${escapeHtml(p.player_name)}${p.player_id===mpSession?.user?.id?' 👑':''}</td><td>${mpSort==='play_seconds'?timeLeft(p.play_seconds):fmt(p[mpSort]||0)}</td></tr>`).join('')}</tbody></table></div>`}</section>`}

// Online-Rangliste: alle 30 Sekunden senden und aktualisieren, sofern verbunden.
setInterval(()=>{if(document.hidden||!navigator.onLine)return;if(mpSession){if(multiplayerName().length>=3)multiplayerSync();else multiplayerRefresh()}},30000);
// Bestehende anonyme Sitzung nach einem Seiten-Reload automatisch wiederherstellen.
setTimeout(()=>{multiplayerConnect()},1500);
window.addEventListener('online',()=>{mpError='';multiplayerStatus();if(mpSession)multiplayerSync();else multiplayerConnect()});
window.addEventListener('offline',()=>{mpError='Keine Internetverbindung';multiplayerStatus()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine){if(!mpSession&&!mpLoading)multiplayerConnect();else if(mpSession&&mpError)multiplayerSync()}});
multiplayerStatus();
const rarityNames={common:'Gewöhnlich',uncommon:'Ungewöhnlich',rare:'Selten',epic:'Episch',legendary:'Legendär',mythic:'Mythisch'};
function milestoneRarity(stage){return stage>=100?'mythic':stage>=60?'legendary':stage>=35?'epic':stage>=20?'rare':stage>=10?'uncommon':'common'}
const achievementRarities={first:'common',builder:'common',crafter:'common',hundred:'uncommon',factory:'rare',explorer:'rare',scholar:'epic',livestock:'uncommon',tavernkeeper:'uncommon',gourmet:'rare',merchant:'uncommon',taskmaster:'rare',farmer:'common',homeowner:'rare',expeditions:'rare',blueprinter:'epic',upgrader:'uncommon',marketman:'rare',chef:'rare',playtime:'rare'};
function nearAchievements(){
 const candidates=[];
 const normal=[
  ['first','Erste Schritte',s.gathered||0,1],
  ['builder','Baumeister',Object.values(s.buildings).reduce((a,b)=>a+b,0),1],
  ['crafter','Handwerker',s.crafted||0,1],
  ['hundred','Sammler',Object.values(s.res).reduce((a,b)=>a+b,0),100],
  ['factory','Industriepionier',Object.values(s.buildings).reduce((a,b)=>a+b,0),10],
  ['explorer','Entdecker',s.regions.length,3],
  ['scholar','Forscher',s.upgrades.length,2]
 ];
 for(const [id,name,value,target] of normal){if(!s.achievements.includes(id))candidates.push({name,icon:'🏆',value,target,ratio:Math.min(1,value/target),kind:'Einmaliges Achievement',rarity:achievementRarities[id]||'common'})}
 for(const [key,icon,name] of statDefs){const stage=s.milestones?.[key]||0;const value=s.stats?.[key]||0;const target=threshold(stage);if(!Number.isFinite(target)||target<=0)continue;const prev=stage?threshold(stage-1):0;const ratio=Math.max(0,Math.min(1,(value-prev)/(target-prev)));candidates.push({name,icon,value,target,ratio,kind:'Meilenstein '+(stage+1),rarity:milestoneRarity(stage)})}
 candidates.sort((a,b)=>b.ratio-a.ratio||a.target-a.value);
 const top=candidates.slice(0,5);
 return `<section class="card near-card"><h3>🎯 Fast geschafft</h3><p class="small">Deine 5 nächsten Achievements nach Fortschritt</p>${top.map(x=>`<div class="near-entry rarity-${x.rarity}"><strong>${x.icon} ${escapeHtml(x.name)}</strong><span class="small">${escapeHtml(x.kind)} · <span class="rarity-label">${rarityNames[x.rarity]}</span> · ${Math.floor(x.ratio*100)}%</span><div class="progress"><div class="bar" style="width:${x.ratio*100}%"></div></div><span class="small">${fmt(x.value)} / ${fmt(x.target)}</span></div>`).join('')}<button class="near-link" onclick="tab='Achievements';render()">Alle Achievements →</button></section>`;
}
const inventoryGroups=[
 {id:'all',label:'📦 Alle',test:()=>true},
 {id:'wood',label:'🌳 Holzarten',test:k=>!!woodRarities[k]},
 {id:'raw',label:'⛏️ Rohstoffe',test:k=>['stone','coal','copper','iron','crystal'].includes(k)},
 {id:'crops',label:'🌾 Ernte',test:k=>['wheat','carrot','potato','beetroot','pumpkin','melon','sugarcane','netherwart','sweetberry'].includes(k)},
 {id:'processed',label:'🔨 Verarbeitet',test:k=>['oakplank','birchplank','spruceplank','cherryplank','brick','copperbar','ironbar','gear'].includes(k)}
];
let inventoryFilter='all';
try{const savedFilter=localStorage.getItem('idle-realms-inventory-filter');if(inventoryGroups.some(g=>g.id===savedFilter))inventoryFilter=savedFilter}catch(e){}
function setInventoryFilter(id){
 if(!inventoryGroups.some(g=>g.id===id))return;
 inventoryFilter=id;
 try{localStorage.setItem('idle-realms-inventory-filter',id)}catch(e){}
 renderInventoryDock(production());
}
function inventoryUnlockStatus(id){
 const gatherer=gathers.find(g=>g.id===id);
 const gatheringMissing=gatherer?gateMissing(gatherer):[];
 const sources=[];
 if(gatherer)sources.push({source:'Manuell abbauen / sammeln',missing:gatheringMissing});
 for(const r of recipes.filter(r=>r.id===id)){
  const missing=[];
  if(level()<(r.lv||1))missing.push('Spielerlevel '+r.lv);
  if(r.tech&&!s.upgrades.includes(r.tech))missing.push('Forschung: '+(allTechs.find(t=>t.id===r.tech)?.name||r.tech));
  sources.push({source:'Crafting',missing});
 }
 for(const b of buildings.filter(b=>Object.hasOwn(b.prod,id))){
  const missing=[];
  if(level()<(b.lv||1))missing.push('Spielerlevel '+b.lv);
  if(b.tech&&!s.upgrades.includes(b.tech))missing.push('Forschung: '+(allTechs.find(t=>t.id===b.tech)?.name||b.tech));
  if(b.blueprint&&!hasBlueprint(b.blueprint))missing.push('Bauplan: '+(blueprintDefs.find(x=>x.id===b.blueprint)?.name||b.blueprint));
  const owned=(s.buildings[b.id]||0)>0;
  sources.push({source:b.name,missing:owned?[]:missing.length?missing:['Gebäude erst bauen']});
 }
 const available=sources.filter(x=>!x.missing.length);
 const locked=gatherer?gatheringMissing.length>0:available.length===0;
 const notes=[];
 if(gatherer)notes.push(gatheringMissing.length?'Manuell noch gesperrt – benötigt: '+gatheringMissing.join(' · '):'Manuell sammeln: freigeschaltet');
 for(const x of sources.filter(x=>x.source!=='Manuell abbauen / sammeln'))notes.push(x.source+': '+(x.missing.length?'benötigt '+x.missing.join(' · '):'verfügbar'));
 if(!notes.length)notes.push('Keine Bezugsquelle bekannt.');
 if((s.res[id]||0)>0)notes.unshift('Bereits im Lager vorhanden.');
 return {locked,detail:notes.join(' | ')};
}
function renderInventoryDock(prod){
 const filters=document.getElementById('inventory-filters');
 filters.innerHTML=inventoryGroups.map(g=>`<button type="button" class="inventory-filter ${inventoryFilter===g.id?'active':''}" aria-pressed="${inventoryFilter===g.id}" onclick="setInventoryFilter('${g.id}')">${g.label}</button>`).join('');
 const strip=document.getElementById('inventory');
 const selected=inventoryGroups.find(g=>g.id===inventoryFilter)||inventoryGroups[0];
 const items=Object.entries(R).filter(([k])=>selected.test(k));
 strip.innerHTML=items.map(([k,[ico,name]])=>{const access=inventoryUnlockStatus(k);return `<div tabindex="0" class="inventory-chip ${access.locked?'inventory-locked':''} ${woodRarities[k]?'wood-inventory rarity-'+woodRarities[k]:''}" title="${escapeHtml(name)}: ${escapeHtml(access.detail)}"><span class="inventory-chip-name">${ico} ${escapeHtml(name)}</span><span class="inventory-chip-bottom"><b>${fmt(s.res[k]||0)}</b><small>${prod[k]?`+${fmt(prod[k])}/s`:''}</small></span><span class="inventory-tooltip">${access.locked?'🔒 Noch nicht erhältlich: ':'✓ '}${escapeHtml(access.detail)}</span></div>`}).join('');
}

function nextLockedOnly(items,unlocked){let seen=false;return items.filter(x=>{if(unlocked(x))return true;if(!seen){seen=true;return true}return false})}
function lockedPreview(locked,requirements){return locked?`<div class="preview-label">🔒 Nächste Freischaltung · ${escapeHtml(requirements)}</div>`:''}
function render(){updateRealmHeader();document.getElementById('level').textContent='⭐ Level '+level();document.getElementById('coins').textContent='🏆 '+fmt(s.coins)+' Ruhmpunkte';updateTalerDisplay();document.getElementById('nav').innerHTML=tabs.map(([ico,t])=>`<button class="${tab===t?'active':''}" onclick="tab='${t}';render()">${ico} ${t}</button>`).join('');const prod=production();renderInventoryDock(prod);renderTavernSidebar();let html='';if(tab==='Sammeln'){html=`<section class="card"><h2>⛏️ Ressourcen sammeln</h2><div class="hint">Jede Baumart liefert ausschließlich ihre eigene Holzart. Holzarten haben unterschiedliche Seltenheiten (Gewöhnlich bis Mythisch). Jede Fällaktion liefert garantiert Holz; je seltener die Art, desto kleiner die Chance auf 1 Bonus-Holz. Weitere Ressourcen benötigen passende Forschungen oder entdeckte Gebiete.</div><div class="row"><span>Fortschritt bis Level ${level()+1}</span><span class="small">${fmt(s.xp)} XP</span></div><div class="progress"><div class="bar" style="width:${Math.max(0,Math.min(100,100*(s.xp-30*(level()-1)**2)/(30*level()**2-30*(level()-1)**2)))}%"></div></div></section><div class="grid">${nextLockedOnly(gathers,g=>gateMissing(g).length===0).map(g=>`<div id="gather-${g.id}" class="item wood-card rarity-${woodRarities[g.id]} ${gateMissing(g).length>0?'preview-locked':''}"><h3>${g.icon} ${R[g.id][1]} <span class="owned-count">(${fmt(s.res[g.id]||0)})</span></h3>${woodRarityLabel(g.id)}${lockedPreview(gateMissing(g).length>0,gateMissing(g).join(' · '))}<div class="wood-rate">🎲 ${woodBonusChance[woodRarities[g.id]]} % Chance auf +1 Bonus-Holz</div><p>${gateMissing(g).length?'Benötigt: '+gateMissing(g).join(' · '):'Sammle diese Ressource per Klick.'}</p>${button('+'+(1+(s.upgrades.includes('axe')?1:0)+(s.upgrades.includes('tools2')?2:0))+' sammeln',`gather('${g.id}')`,gateMissing(g).length>0,'action')}</div>`).join('')}</div>`}
if(tab==='Freischaltungen')html=progressionPanel();if(tab==='Farming')html=farmingPanel();if(tab==='Taverne')html=tavernPanel();
if(tab==='Crafting')html=`<section class="card"><h2>🔨 Werkbank</h2><p class="small">Verarbeite Rohstoffe zu neuen Materialien. Rezepte werden durch Level freigeschaltet.</p></section><div class="grid">${nextLockedOnly(recipes,r=>level()>=(r.lv||1)&&!resourceGateMissing(r.id).length).map(r=>`<div id="recipe-${r.id}" class="item ${level()<(r.lv||1)||resourceGateMissing(r.id).length?'preview-locked':''}"><h3>${R[r.id][0]} ${r.name} <span class="owned-count">(${fmt(s.res[r.id]||0)})</span></h3>${lockedPreview(level()<(r.lv||1)||resourceGateMissing(r.id).length,[level()<(r.lv||1)?'Level '+r.lv:'',...resourceGateMissing(r.id)].filter(Boolean).join(' · '))}<p>Ergebnis: ${r.out} × ${R[r.id][1]} pro Herstellung</p><div class="price">${costText(r.cost, r.name)} (1×)</div><div class="craft-amount-actions">${[1,5,10].map(n=>button(level()<(r.lv||1)?'🔒 Ab Level '+r.lv:`${n}× herstellen`, `craft('${r.id}',${n})`,level()<(r.lv||1)||resourceGateMissing(r.id).length>0||!canPay(scaledCraftCost(r.cost,n)))).join('')}</div>${targetPinButton('recipe',r.id)}</div>`).join('')}</div>`;
if(tab==='Reichskarte')html=mapPanel();
if(tab==='Gebäude')html=realmPanel(false)+`<section class="card"><h2>🏭 Automatisierung</h2><p class="small">Gebäude werden erst nach Ablauf ihrer Bauzeit produktiv. Pro Baustelle arbeitet 1 Einwohner. Mit der Forschung „Parallele Bauplanung“ sind mehrere Baustellen gleichzeitig möglich. Offline-Fortschritt wird bis zu 24 Stunden nachberechnet.</p></section><div class="grid">${nextLockedOnly(buildings.filter(b=>!['wheatfarm','carrotfarm','potatofarm','beetfarm','pumpkinfarm','melonfarm','canefarm','berryfarm','wartfarm','cowpasture','pigpen','chickencoop','sheepfold'].includes(b.id)),b=>buildingMissing(b).length===0).map(b=>{let c=buildingCost(b),count=s.buildings[b.id]||0;return `<div id="building-${b.id}" class="item ${buildingMissing(b).length>0?'preview-locked':''}"><h3>${b.icon} ${b.name}</h3>${lockedPreview(buildingMissing(b).length>0,buildingMissing(b).join(' · '))}<p>${b.desc}</p><div class="small">Besitz: <b>${count}</b> · ${Object.entries(b.prod).map(([k,v])=>`+${fmt(v)}/s ${R[k][1]}`).join('')}</div><div class="price">${costText(c, b.name)}</div><div class="small">🗺️ Bauplätze: ${usedPlots()}/${plotLimit()} · ⏱️ Bauzeit: ${timeLeft(buildingDuration(b))}</div>${button(level()<(b.lv||1)?'🔒 Ab Level '+b.lv:usedPlots()>=plotLimit()?'🔒 Reich voll':freeResidents()<workersNeededForBuild(b)?'🔒 Einwohner fehlen':'Bau starten',`build('${b.id}')`,buildingMissing(b).length>0||!canPay(c)||usedPlots()>=plotLimit()||freeResidents()<workersNeededForBuild(b),'action')}${targetPinButton('building',b.id)}</div>`}).join('')}</div>`;
if(tab==='Arbeitskräfte'){
const rows=buildings.filter(b=>(s.buildings[b.id]||0)>0||(s.buildingUpgrades?.[b.id]||0)>0);
html=`<section class="card"><h2>👷 Arbeitskräfte & Gebäude</h2><p class="small">Hier siehst du, in welchen Gebäuden deine Einwohner arbeiten. Jedes Feld und normale Produktionsgebäude benötigen 1 Einwohner; Tiergebäude beherbergen jeweils 2 Tiere und 1 Einwohner versorgt 5 Tiere insgesamt. Jeweils 5 Produktivitäts-Upgrades beschäftigen zusätzlich 1 Einwohner.</p><div class="row"><span>👥 Einwohner gesamt: <b>${fmt(residents())}</b></span><span>👷 Beschäftigt: <b>${fmt(occupiedResidents())}</b></span><span>🟢 Frei: <b>${fmt(freeResidents())}</b></span><span>🧪 Forschung: <b>${researchWorkers()}</b></span><span>🧭 Expedition: <b>${expeditionWorkers()}</b></span><span>🍻 Tavernenauftrag: <b>${tavernWorkers()}</b></span><span>🏗️ Baustellen: <b>${constructionWorkers()}</b></span></div><div class="progress"><div class="bar" style="width:${Math.min(100,occupiedResidents()/Math.max(1,residents())*100)}%"></div></div></section><section class="card"><h2>🏭 Belegte Arbeitsplätze</h2>${rows.length?`<div class="worker-list">${rows.map(b=>{const count=Math.max(0,Number(s.buildings[b.id])||0),up=Math.max(0,Number(s.buildingUpgrades?.[b.id])||0),isAnimal=animalBuildingIds.includes(b.id),base=isAnimal?0:count;return `<div class="worker-row"><div><b>${b.icon} ${b.name}</b><div class="small">${fmt(count)} Gebäude${isAnimal?' · '+fmt(count*2)+' Tiere':''} · Produktivität +${up*10}%</div></div><div class="worker-numbers"><span>🏭 ${fmt(base)} Grundplätze${isAnimal?' (Tierpflege gemeinsam: '+fmt(animalWorkers())+' Einwohner)':''}</span><span>⬆️ ${fmt(Math.floor(up/5))} durch Upgrades</span><b>👷 ${fmt(base+Math.floor(up/5))}${isAnimal?' + gemeinsamer Tierpflege-Anteil':''}</b></div></div>`}).join('')}</div>`:'<p class="small">Noch keine Produktionsgebäude vorhanden. Deine Einwohner sind derzeit frei.</p>'}<div class="row"><span>🐾 Tierpflege gesamt: ${fmt(animalCount())} Tiere / ${fmt(animalWorkers())} Einwohner</span></div><div class="row"><b>Gesamt beschäftigt</b><b>👷 ${fmt(occupiedResidents())} / ${fmt(residents())}</b></div></section>`;
}
if(tab==='Forschung'){
const branches=[...new Set(allTechs.map(u=>u.branch))];
html=`<section class="card"><h2>🧪 Technologie- & Skillbaum</h2><div class="hint">${s.researches.length}/${slots()} Forschungsplätze belegt · Maximal 5 Plätze. Forschung läuft auch offline. Neue Plätze durch Wissenschaftsforschungen freischalten.</div><div class="row"><span>⛏️ Bergbau: <b>${skillLevel('mining')}</b></span><span>🌲 Forstwirtschaft: <b>${skillLevel('forestry')}</b></span><span>🔬 Wissenschaft: <b>${skillLevel('research')}</b></span></div><p class="small">Skills steigen durch Aktivitäten und abgeschlossene Forschungen. Forschungslabor II schaltet die Warteschlange frei (max. 8 Einträge). Ressourcen werden erst beim tatsächlichen Start einer Forschung verbraucht.</p>${s.researches.map(r=>{const u=allTechs.find(x=>x.id===r.id);return `<div class="hint research-live" data-research-id="${r.id}"><b>🔬 ${u?.name||r.id}</b><div class="row"><span>Restzeit</span><b class="research-live-time">${timeLeft((r.ends-Date.now())/1000)}</b></div><div class="progress"><div class="bar research-live-bar" style="width:${Math.max(0,Math.min(100,100*(Date.now()-r.started)/(r.ends-r.started)))}%"></div></div></div>`}).join('')}${researchQueueAvailable()?`<h3>📋 Warteschlange (${s.queue.length}/8)</h3>${s.queue.length?s.queue.map((id,i)=>`<div class="row"><span>${i+1}. ${allTechs.find(u=>u.id===id)?.name||id}</span>${button('Entfernen',`unqueue('${id}')`)}</div>`).join(''):'<p class="small">Noch keine Forschungen vorgemerkt.</p>'}`:''}</section>`;
for(const branch of branches){html+=`<section class="card"><h2>🌿 ${branch}</h2><div class="grid">${nextLockedOnly(allTechs.filter(u=>u.branch===branch&&!s.upgrades.includes(u.id)),u=>s.researches.some(x=>x.id===u.id)||s.queue.includes(u.id)||researchMissing(u).length===0).map(u=>{const done=s.upgrades.includes(u.id),running=s.researches.some(x=>x.id===u.id),queued=s.queue.includes(u.id),missing=researchMissing(u),full=s.researches.length>=slots();const label=done?'✓ Erforscht':running?'⏳ Läuft':queued?'📋 Vorgemerkt':missing.length?'🔒 Voraussetzungen fehlen':full?'🔒 Plätze belegt':'Forschung starten';return `<div id="research-${u.id}" class="item ${missing.length&&!done&&!running&&!queued?'preview-locked':''}" style="border-color:${done?'#36794e':running?'#e3b85c':missing.length?'#6c3b46':'#38698a'}"><h3>${done?'🟢':running?'🟡':missing.length?'🔴':'🔵'} ${u.name}</h3>${lockedPreview(missing.length&&!done&&!running&&!queued,missing.join(' · '))}<p>${u.desc}</p><div class="small">⏱️ ${timeLeft(u.duration)}${u.slots?' · 🔬 '+u.slots+' Plätze':''}</div><div class="price">${costText(u.cost, u.name)}</div><div class="small">👷 Benötigt: 1 freier Einwohner (frei: ${freeResidents()})</div><div class="small">💰 Forschungskosten: ${fmt(researchTalerCost(u))} Looterianische Taler ${canFinanceResearch(u)?"🟢":"🔴"}</div><div class="small" style="margin-top:8px">${missing.length?'Benötigt: '+missing.join(' · '):'✓ Voraussetzungen erfüllt'}</div>${button(label,`upgrade('${u.id}')`,done||running||queued||full||freeResidents()<1||!!missing.length||!canPay(u.cost)||!canFinanceResearch(u))}${targetPinButton('research',u.id)}${researchQueueAvailable()&&!done&&!running&&!queued&&s.queue.length<8?button('📋 Vormerken',`queueResearch('${u.id}')`):''}</div>`}).join('')}</div></section>`}
}
if(tab==='Weltkarte'){
 const e=s.expedition;const activeRegion=e&&regions.find(r=>r.id===e.id);
 const pct=e?Math.max(0,Math.min(100,100*(Date.now()-e.started)/Math.max(1,e.ends-e.started))):0;
 html=`<section class="card"><h2>🌍 Weltkarte & Expeditionen</h2><div class="hint">Jede Expedition hat eine Erfolgschance. Bei Fehlschlag bleibt das Gebiet gesperrt und du kannst es erneut versuchen; eingesetzte Ressourcen werden nicht erstattet. Forschung, Level und Skills schalten Gebiete frei. Erkundungs-Skill verbessert deine Chancen (bis +15 %).</div>${e?`<div class="item"><h3>🧭 Unterwegs nach ${escapeHtml(activeRegion?.name||e.id)}</h3><div class="row"><span>⏳ Verbleibend</span><b>${timeLeft((e.ends-Date.now())/1000)}</b></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div><p class="small">${Math.floor(pct)} % abgeschlossen · 🎲 ${e.chance??expeditionChance(activeRegion)} % Erfolgschance</p></div>`:'<p class="small">Keine Expedition aktiv. Wähle unten ein neues Gebiet.</p>'}</section><div class="grid">${nextLockedOnly(regions,r=>s.regions.includes(r.id)||expeditionMissing(r).length===0).map(r=>{const found=s.regions.includes(r.id),running=e?.id===r.id,missing=expeditionMissing(r),chance=expeditionChance(r);return `<div class="item ${missing.length&&!found?'preview-locked':''}"><h3>${r.icon} ${r.name}</h3>${lockedPreview(missing.length&&!found,missing.join(' · '))}<p>${r.desc}</p><div class="small">⏱️ ${found?'Bereits entdeckt':timeLeft(r.duration||0)} · 🎲 ${found?'Entdeckt':chance+' % Erfolgschance'}</div>${blueprintDefs.some(b=>b.region===r.id)?`<p class="small">📜 ${escapeHtml(blueprintDefs.find(b=>b.region===r.id).name)} · ${hasBlueprint(blueprintDefs.find(b=>b.region===r.id).id)?'Bereits gefunden':'Bei Erfolg erhältlich'}</p>`:''}<div class="price">${r.cost?costText(r.cost):'Startgebiet'}</div><div class="small">👷 Benötigt: 5 freie Einwohner (frei: ${freeResidents()})</div><div class="small" style="margin:8px 0">${found?'🟢 Gebiet freigeschaltet':missing.length?'🔒 Voraussetzungen: '+missing.map(escapeHtml).join(' · '):'🟢 Voraussetzungen erfüllt'}</div>${button(found?'✓ Entdeckt':running?'⏳ Expedition läuft':missing.length?'🔒 Voraussetzungen fehlen':e?'🧭 Expedition läuft bereits':'🧭 Expedition starten',`explore('${r.id}')`,found||running||!!missing.length||!!e||freeResidents()<5||!canPay(r.cost||{}))}</div>`}).join('')}</div><section class="card"><h3>📜 Letzte Expeditionen</h3>${(s.expeditionHistory||[]).length?s.expeditionHistory.slice(0,8).map(h=>`<div class="research-entry"><b>${h.success?'✅ Erfolg':'❌ Fehlgeschlagen'}</b> · ${escapeHtml(regions.find(r=>r.id===h.id)?.name||h.id)}<div class="small">${new Date(h.at).toLocaleString('de-DE')}${h.loot?.length?' · '+h.loot.map(escapeHtml).join(', '):''}</div></div>`).join(''):'<p class="small">Noch keine Expeditionen abgeschlossen.</p>'}</section>`;
}
if(tab==='Tierzucht')html=animalsPanel();if(tab==='Wanderhändler')html=merchantPanel();if(tab==='Skills')html=skillPanel();if(tab==='Statistik')html=statsPanel();if(tab==='Ranglisten')html=leaderboardPanel();
if(tab==='Handel')html=marketPanel();if(tab==='Achievements')html=`<section class="card"><h2>🏆 Achievements</h2><p class="small">Jedes Achievement belohnt dich mit 25 Ruhmpunkten und XP entsprechend seiner Seltenheit und kann kleine dauerhafte Boni freischalten. Ruhmpunkte sind dauerhaft und werden nicht beim Handel ausgegeben.</p>${achievements.map(([id,name,desc])=>`<div class="item achievement-rarity rarity-${achievementRarities[id]||'common'}" style="margin:10px 0"><span class="badge ${s.achievements.includes(id)?'earned':''}">${s.achievements.includes(id)?'🏆 Freigeschaltet':'🔒 Offen'}</span> <b>${name}</b> <span class="small rarity-label">${rarityNames[achievementRarities[id]||'common']}</span><p>${desc}</p><p class="small" style="color:#a9e8c5">🎁 ${achievementRewardText(id)} · ✨ +${fmt(xpForAchievement(id))} XP</p></div>`).join('')}</section>`+realmExpansionAchievement()+milestonePanel();
document.getElementById('content').innerHTML=html;renderTasksSidebar();renderDailyDropSidebar();const near=nearAchievements();document.getElementById('near-achievements').innerHTML=near;document.getElementById('mobile-near-achievements').innerHTML=near;renderConstructionSidebar();renderResearchSidebar();renderExpeditionSidebar();renderRealmSidebar();renderMaterialPins();refreshMarket()}
function renderConstructionSidebar(){
 const box=document.getElementById('construction-sidebar-content');if(!box)return;
 const active=s.constructions||[];
 box.innerHTML=`<p class="small">🏗️ ${active.length} / ${constructionSlots()} Baustellen · 👷 ${active.length} Einwohner</p>`+(active.length?active.map(c=>{
 const b=buildings.find(x=>x.id===c.id),total=Math.max(1,c.ends-c.started),pct=Math.max(0,Math.min(100,100*(Date.now()-c.started)/total));
 return `<div class="research-entry"><div class="research-name">${escapeHtml(b?.icon||'🏗️')} ${escapeHtml(b?.name||c.id)}</div><div class="research-time"><span>Restzeit</span><b>${timeLeft((c.ends-Date.now())/1000)}</b></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div></div>`;
 }).join(''):'<p class="small">Keine laufenden Bauarbeiten.</p>');
}
function renderResearchSidebar(){
 const box=document.getElementById('research-sidebar-content');if(!box)return;
 const active=(s.researches||[]).slice().sort((a,b)=>a.ends-b.ends);
 box.innerHTML=`<p class="small">🔬 ${active.length} / ${slots()} Plätze belegt</p>`+(active.length?active.map(r=>{
 const u=allTechs.find(x=>x.id===r.id);const total=Math.max(1,r.ends-r.started);
 const pct=Math.max(0,Math.min(100,100*(Date.now()-r.started)/total));
 return `<div class="research-entry"><div class="research-name">🔬 ${escapeHtml(u?.name||r.id)}</div><div class="research-time"><span>Restzeit</span><b>${timeLeft((r.ends-Date.now())/1000)}</b></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div></div>`;
 }).join(''):'<p class="small">Keine aktive Forschung. Starte eine im Forschungsbaum.</p>');
}
function renderExpeditionSidebar(){
 const box=document.getElementById('expedition-sidebar-content');if(!box)return;
 const e=s.expedition;
 if(!e){box.innerHTML='<p class="small">Keine aktive Expedition.</p>';return;}
 const region=regions.find(r=>r.id===e.id);
 const duration=Math.max(1,e.ends-e.started);
 const pct=Math.max(0,Math.min(100,100*(Date.now()-e.started)/duration));
 box.innerHTML=`<div class="research-entry"><div class="research-name">${escapeHtml(region?.icon||'🧭')} ${escapeHtml(region?.name||e.id)}</div><div class="research-time"><span>Restzeit</span><b>${timeLeft((e.ends-Date.now())/1000)}</b></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div><p class="small">${Math.floor(pct)} % abgeschlossen · 🎲 ${e.chance??expeditionChance(region||{})} % Erfolgschance</p></div>`;
}
function escapeHtml(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
// Laufende Timer aktualisieren, ohne jede Sekunde die anklickbaren Menüs neu aufzubauen.
function renderTavernSidebar(){const box=document.getElementById('tavern-sidebar-content');if(!box)return;const orders=tavernOrders();if(!orders.length){box.innerHTML='<p class="small">Keine laufenden Zubereitungen.</p><p class="small">👨‍🍳 Köche: 0 / '+tavernCapacity()+'</p>';return}box.innerHTML='<p class="small">👨‍🍳 Köche: '+orders.length+' / '+tavernCapacity()+'</p>'+orders.map(o=>{const recipe=tavernRecipes.find(r=>r.id===o.id),total=Math.max(1,o.ends-(o.started||o.ends)),remaining=Math.max(0,o.ends-Date.now()),percent=Math.max(0,Math.min(100,100-remaining/total*100)),qty=Math.max(1,o.qty||1),made=Math.min(qty,Math.max(0,Math.floor(o.produced||0)));return `<div class="research-entry"><strong>${fmt(qty)} × ${escapeHtml(recipe?.name||'Zubereitung')}</strong><p class="small">🍽️ ${fmt(made)} / ${fmt(qty)} Portionen fertig · alle ${recipe?.duration||'?'} Sek. +1</p><p class="small">⏳ <span class="tavern-live-time" data-end="${o.ends}">${timeLeft(remaining/1000)}</span></p><div class="progress"><div class="bar" style="width:${percent}%"></div></div><p class="small">👷 1 Einwohner</p></div>`}).join('')}
function refreshActionAvailability(){
 // Nur dynamische Material-Buttons aktualisieren; keine Eingabefelder verlieren ihren Fokus.
 if(tab==='Crafting')for(const r of recipes){const card=document.getElementById('recipe-'+r.id);if(!card)continue;const btns=card.querySelectorAll('.craft-amount-actions button');[1,5,10].forEach((n,i)=>{if(btns[i])btns[i].disabled=level()<(r.lv||1)||resourceGateMissing(r.id).length>0||!canPay(scaledCraftCost(r.cost,n))})}
 if(tab==='Gebäude')for(const b of buildings){const card=document.getElementById('building-'+b.id);if(!card)continue;const btn=card.querySelector('button');if(btn)btn.disabled=buildingMissing(b).length>0||!canPay(buildingCost(b))||usedPlots()>=plotLimit()||freeResidents()<workersNeededForBuild(b)}
 if(tab==='Forschung')for(const u of allTechs){const card=document.getElementById('research-'+u.id);if(!card)continue;const btn=card.querySelector('button');if(btn)btn.disabled=s.upgrades.includes(u.id)||s.researches.some(x=>x.id===u.id)||s.queue.includes(u.id)||s.researches.length>=slots()||freeResidents()<1||researchMissing(u).length>0||!canPay(u.cost)||!canFinanceResearch(u)}
}
function refreshLiveUI(){
 document.getElementById('level').textContent='⭐ Level '+level();
 document.getElementById('coins').textContent='🏆 '+fmt(s.coins)+' Ruhmpunkte';updateTalerDisplay();
 const prod=production();
 renderInventoryDock(prod);
 renderTasksSidebar();renderDailyDropSidebar();renderConstructionSidebar();renderResearchSidebar();renderExpeditionSidebar();renderRealmSidebar();renderTavernSidebar();renderMaterialPins();refreshMarket();
 refreshActionAvailability();if(tab==='Taverne')tavernRecipes.forEach(r=>updateTavernQuantity(r.id));
 const mc=document.getElementById('merchant-countdown');if(mc){mc.textContent=timeLeft(((merchantSlot()+1)*10800000-Date.now())/1000);if(s.merchantVisibleSlot!==merchantSlot()){s.merchantVisibleSlot=merchantSlot();if(tab==='Wanderhändler')render()}}
 document.querySelectorAll('.tavern-live-time').forEach(el=>{el.textContent=timeLeft((Number(el.dataset.end)-Date.now())/1000)});
 // Laufende Forschungen im offenen Technologiebaum jede Sekunde aktualisieren.
 document.querySelectorAll('.research-live').forEach(el=>{
  const research=s.researches.find(r=>r.id===el.dataset.researchId);
  if(!research)return;
  const remaining=el.querySelector('.research-live-time');
  const bar=el.querySelector('.research-live-bar');
  if(remaining)remaining.textContent=timeLeft((research.ends-Date.now())/1000);
  if(bar){const duration=Math.max(1,research.ends-research.started);bar.style.width=Math.max(0,Math.min(100,100*(Date.now()-research.started)/duration))+'%'}
 });

}
function updateSidebarOffset(){const dock=document.getElementById('top-dock');if(dock)document.documentElement.style.setProperty('--looteria-sidebar-top',(Math.ceil(dock.getBoundingClientRect().height)+12)+'px')}
window.addEventListener('resize',updateSidebarOffset);

// V9.6: Cloud-Speicher. Einrichtung der SQL-Datei in Supabase ist erforderlich.
const CLOUD_CODE_KEY='looteria-cloud-recovery-v1';
const CLOUD_AUTO_KEY='looteria-cloud-auto-v1';
let cloudCode=localStorage.getItem(CLOUD_CODE_KEY)||'',cloudLastSync=0,cloudBusy=false,cloudError='',cloudRemote=null,cloudRevision=0;
function cloudEnabled(){return localStorage.getItem(CLOUD_AUTO_KEY)==='1'}
function cloudGenerateCode(){const bytes=new Uint8Array(32);crypto.getRandomValues(bytes);return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase()}
function cloudSaveCode(code){cloudCode=code;localStorage.setItem(CLOUD_CODE_KEY,code)}
function cloudSetAuto(enabled){localStorage.setItem(CLOUD_AUTO_KEY,enabled?'1':'0');settingsRender();if(enabled)cloudSync(false)}
function openSettings(){document.getElementById('settings-overlay').hidden=false;settingsRender()}
function closeSettings(){document.getElementById('settings-overlay').hidden=true}
function settingsRender(){const box=document.getElementById('settings-content');if(!box)return;box.innerHTML=`<section><h3>☁️ Cloud-Spielstand</h3><p class="small">Ohne Registrierung. Cloud-Speicherung erfordert Internet, anonyme Supabase-Anmeldung und das separate Datenbank-Setup. Der Spielstand bleibt immer auch lokal gespeichert.</p><p>Status: <b>${cloudBusy?'⏳ Synchronisiere …':cloudError?'🔴 '+escapeHtml(cloudError):cloudLastSync?'🟢 Letzte Cloud-Sicherung: '+new Date(cloudLastSync).toLocaleString('de-DE'):'⚪ Noch keine Cloud-Sicherung'}</b></p><label><input type="checkbox" id="cloud-auto" ${cloudEnabled()?'checked':''} onchange="cloudSetAuto(this.checked)"> Automatische Cloud-Sicherung (alle 60 Sekunden)</label><p><button onclick="cloudSync(true)" ${cloudBusy?'disabled':''}>☁️ Jetzt online sichern</button> <button onclick="cloudCheckRemote()" ${cloudBusy?'disabled':''}>🔍 Cloud-Spielstand prüfen</button></p>${cloudRemote?`<p>☁️ Gefundener Cloud-Stand: Level ${escapeHtml(String(cloudRemote.player_level||1))}, ${escapeHtml(String(cloudRemote.taler||0))} Taler, ${escapeHtml(String(Math.floor((cloudRemote.play_seconds||0)/3600)))} Stunden · ${escapeHtml(new Date(cloudRemote.updated_at).toLocaleString('de-DE'))}</p><button onclick="cloudRestore()">📥 Cloud-Spielstand wiederherstellen</button>`:''}<h4>🔑 Wiederherstellungscode</h4><p class="small">Der Code ist wie ein Passwort. Nicht öffentlich teilen! Wer ihn besitzt, kann den Cloud-Spielstand übernehmen.</p><p class="cloud-secret">${cloudCode?escapeHtml(cloudCode):'Noch kein Wiederherstellungscode erstellt.'}</p><button onclick="cloudShowCode()">${cloudCode?'🔑 Code anzeigen / kopieren':'🔑 Code erstellen'}</button> <button onclick="cloudShowQR()" ${cloudCode?'':'disabled'}>📱 QR-Code anzeigen</button><div id="cloud-qr"></div><h4>📲 Auf anderem Gerät fortsetzen</h4><input id="cloud-restore-code" type="text" autocomplete="off" placeholder="Wiederherstellungscode eingeben" style="width:100%"><button onclick="cloudClaimCode()" ${cloudBusy?'disabled':''}>🔓 Spielstand verbinden und prüfen</button><p class="small">Nach dem Verbinden wird der fremde Cloud-Spielstand zunächst nur als Vorschau angezeigt. Eine Übernahme kann die Verbindung auf dem bisherigen Gerät beenden.</p></section><section><h3>🎮 Darstellung</h3><label><input type="checkbox" id="reduce-motion" ${localStorage.getItem('looteria-reduce-motion')==='1'?'checked':''} onchange="document.body.classList.toggle('reduce-motion',this.checked);localStorage.setItem('looteria-reduce-motion',this.checked?'1':'0')"> Animationen reduzieren</label></section><section><h3>💾 Lokaler Spielstand</h3><button onclick="save(true)">💾 Jetzt speichern</button><button onclick="exportSave()">📤 Exportieren</button><button onclick="document.getElementById('importfile').click()">📥 Importieren</button><input hidden type="file" id="importfile" accept=".json,application/json" onchange="importSave(event)"><button class="danger" onclick="resetGame()">🆕 Neues Spiel</button><p class="small">Ein neues Spiel löscht nicht automatisch die Cloud-Sicherung. Vor einem Neustart bitte den alten Spielstand exportieren.</p></section><section><h3>ℹ️ Informationen</h3><p>Story of Looteria · Version ${LOOTERIA_VERSION}</p><p class="small">Cloud-Synchronisation ist optional. Eine Wiederherstellung erfordert den geheimen Code und eine funktionierende Cloud-Datenbank.</p></section>`}
async function cloudAuth(){if(!mpSession?.access_token)await multiplayerConnect();if(!mpSession?.access_token)throw Error(mpError||'Online-Anmeldung nicht verfügbar')}
async function cloudRpc(name,payload){return mpRequest('/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(payload)})}
async function cloudShowCode(){if(!cloudCode){if(!confirm('Neuen Wiederherstellungscode erstellen? Der Code wird erst mit der ersten erfolgreichen Cloud-Sicherung aktiv.'))return;cloudSaveCode(cloudGenerateCode())}settingsRender();try{await navigator.clipboard.writeText(cloudCode);notify('🔑 Wiederherstellungscode kopiert')}catch{notify('🔑 Code markieren und sicher aufbewahren')}}
async function cloudShowQR(){if(!cloudCode)return;const box=document.getElementById('cloud-qr');box.textContent='QR-Code wird geladen …';try{if(!window.QRCode){await new Promise((resolve,reject)=>{const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';sc.onload=resolve;sc.onerror=reject;document.head.appendChild(sc)})}box.textContent='';new QRCode(box,{text:location.origin+location.pathname+'#looteria-recover='+encodeURIComponent(cloudCode),width:220,height:220,correctLevel:QRCode.CorrectLevel.M});notify('📱 QR-Code bereit – geheim halten!')}catch{box.textContent='QR-Code konnte nicht geladen werden (Internet benötigt). Der Wiederherstellungscode funktioniert weiterhin.'}}
async function cloudSync(manual=false){if(cloudBusy||!navigator.onLine)return;if(!manual&&!cloudEnabled())return;cloudBusy=true;cloudError='';if(!cloudCode)cloudSaveCode(cloudGenerateCode());if(!cloudLastSync&&manual)notify('☁️ Cloud-Speicherung wird eingerichtet …');try{await cloudAuth();save();const result=await cloudRpc('looteria_cloud_put',{p_code:cloudCode,p_save:s,p_revision:cloudRevision});if(result?.conflict){cloudError='Cloud-Spielstand ist neuer. Bitte zuerst prüfen und wiederherstellen.';cloudRemote=null}else{cloudRevision=Number(result?.revision||cloudRevision+1);cloudLastSync=Date.now();cloudError='';if(manual)notify('☁️ Cloud-Spielstand gesichert')}}catch(e){cloudError=e.message||String(e);if(manual)notify('⚠️ Cloud-Sicherung fehlgeschlagen')}finally{cloudBusy=false;if(!document.getElementById('settings-overlay').hidden)settingsRender()}}
async function cloudCheckRemote(){if(cloudBusy)return;cloudBusy=true;cloudError='';try{await cloudAuth();const data=await cloudRpc('looteria_cloud_get',{});cloudRemote=data?.save?data:null;if(data?.revision)cloudRevision=Number(data.revision);if(!cloudRemote)notify('Noch kein Cloud-Spielstand vorhanden');else notify('☁️ Cloud-Spielstand gefunden')}catch(e){cloudError=e.message||String(e)}finally{cloudBusy=false;settingsRender()}}
function cloudRestore(){if(!cloudRemote?.save)return;const d=cloudRemote.save;if(d.version!==1||!d.res||!d.buildings||!Array.isArray(d.upgrades)||!Array.isArray(d.regions)){notify('Ungültiges Cloud-Speicherformat');return}const message='Lokaler Spielstand: Level '+level()+', '+fmt(s.tradeCoins||0)+' Taler, '+Math.floor((s.activeSeconds||0)/3600)+' Stunden.\nCloud-Spielstand: Level '+(cloudRemote.player_level||1)+', '+fmt(cloudRemote.taler||0)+' Taler, '+Math.floor((cloudRemote.play_seconds||0)/3600)+' Stunden.\n\nLokalen Spielstand ersetzen? Bitte vorher exportieren!';if(!confirm(message))return;s={...initial(),...d,res:{...initial().res,...d.res},last:Date.now()};cloudRevision=Number(cloudRemote.revision||0);save();closeSettings();render();notify('☁️ Cloud-Spielstand wiederhergestellt')}
async function cloudClaimCode(){if(cloudBusy)return;const code=(document.getElementById('cloud-restore-code')?.value||'').replace(/[^0-9a-f]/gi,'').toUpperCase();if(!/^[0-9A-F]{64}$/.test(code)){notify('⚠️ Ungültiger Wiederherstellungscode');return}if(!confirm('Cloud-Spielstand auf diesem Gerät verbinden? Der Zugriff des bisherigen Geräts kann dadurch enden.'))return;cloudBusy=true;cloudError='';try{await cloudAuth();const result=await cloudRpc('looteria_cloud_claim',{p_code:code});if(!result?.ok)throw Error('Code nicht gefunden oder nicht mehr gültig');cloudSaveCode(code);cloudRevision=Number(result.revision||0);cloudBusy=false;await cloudCheckRemote();notify('🔑 Cloud-Spielstand verbunden – bitte Vorschau prüfen')}catch(e){cloudError=e.message||String(e);cloudBusy=false;settingsRender()}}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('settings-overlay').hidden)closeSettings()});
document.getElementById('settings-overlay').addEventListener('click',e=>{if(e.target.id==='settings-overlay')closeSettings()});
document.body.classList.toggle('reduce-motion',localStorage.getItem('looteria-reduce-motion')==='1');
const cloudFragment=new URLSearchParams(location.hash.slice(1)).get('looteria-recover');if(cloudFragment){history.replaceState(null,'',location.pathname+location.search);setTimeout(()=>{openSettings();const input=document.getElementById('cloud-restore-code');if(input)input.value=cloudFragment;notify('📱 Wiederherstellungscode erkannt. Verbinden bestätigen.')},1200)}
setInterval(()=>cloudSync(false),60000);

load();render();updateSidebarOffset();if(pendingOfflineSummary)showOfflineSummary(pendingOfflineSummary);let previous=performance.now();setInterval(()=>{
 const now=performance.now();const dt=(now-previous)/1000;previous=now;
 const before=[level(),s.upgrades.length,s.regions.length,s.achievements.length,s.researches.length,JSON.stringify(s.milestones),s.expedition?.id||'',tavernOrders().map(o=>o.id+':'+o.ends).join(','),s.tavernVisitors||0].join('|');
 tick(dt);
 const after=[level(),s.upgrades.length,s.regions.length,s.achievements.length,s.researches.length,JSON.stringify(s.milestones),s.expedition?.id||'',tavernOrders().map(o=>o.id+':'+o.ends).join(','),s.tavernVisitors||0].join('|');
 if(before!==after)render();else refreshLiveUI();
},1000);setInterval(()=>save(),10000);window.addEventListener('beforeunload',()=>save());document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});

// V9.9: Kameraeinstellungen pro Gerät dauerhaft speichern; unabhängig vom Cloud-Spielstand.
const LOOTERIA_MAP_PREF_KEY='looteria-map-camera-v99';
function mapPrefsRead(){try{const v=JSON.parse(localStorage.getItem(LOOTERIA_MAP_PREF_KEY)||'{}');return {zoom:Number.isFinite(v.zoom)?Math.max(.55,Math.min(1.75,v.zoom)):1,iso:typeof v.iso==='boolean'?v.iso:true,buildMode:!!v.buildMode,x:Number.isFinite(v.x)?Math.max(0,Math.min(1,v.x)):null,y:Number.isFinite(v.y)?Math.max(0,Math.min(1,v.y)):null}}catch(e){return {zoom:1,iso:true,buildMode:false,x:null,y:null}}}
const looteriaMapView={...mapPrefsRead(),initialized:false};
let mapSaveTimer=null,mapDrag=null,mapPinchDistance=0;
function mapPrefsSave(){try{localStorage.setItem(LOOTERIA_MAP_PREF_KEY,JSON.stringify({zoom:looteriaMapView.zoom,iso:looteriaMapView.iso,buildMode:looteriaMapView.buildMode,x:looteriaMapView.x,y:looteriaMapView.y}))}catch(e){}}
function mapCapturePosition(scene){if(!scene)return;const dx=scene.scrollWidth-scene.clientWidth,dy=scene.scrollHeight-scene.clientHeight;looteriaMapView.x=dx>0?Math.max(0,Math.min(1,scene.scrollLeft/dx)):.5;looteriaMapView.y=dy>0?Math.max(0,Math.min(1,scene.scrollTop/dy)):.5;clearTimeout(mapSaveTimer);mapSaveTimer=setTimeout(mapPrefsSave,180)}
function mapRestorePosition(scene){if(!scene)return;const x=looteriaMapView.x??.5,y=looteriaMapView.y??.5;scene.scrollLeft=x*Math.max(0,scene.scrollWidth-scene.clientWidth);scene.scrollTop=y*Math.max(0,scene.scrollHeight-scene.clientHeight)}
function mapViewApply(){const scene=document.getElementById('looteria-map-scene'),grid=document.getElementById('looteria-map-grid');if(!scene||!grid)return;scene.classList.toggle('map-isometric',looteriaMapView.iso);scene.classList.toggle('map-build-mode',!!looteriaMapView.buildMode);const buildBtn=document.getElementById('map-buildmode-button');if(buildBtn){buildBtn.textContent=looteriaMapView.buildMode?'🔨 Baumodus: An':'🔨 Baumodus: Aus';buildBtn.setAttribute('aria-pressed',String(!!looteriaMapView.buildMode))}grid.style.zoom=String(looteriaMapView.zoom);const label=document.getElementById('map-zoom-label');if(label)label.textContent=Math.round(looteriaMapView.zoom*100)+' %';const b=document.getElementById('map-perspective-button');if(b)b.textContent=looteriaMapView.iso?'🔷 Isometrisch':'🟩 Draufsicht';if(!looteriaMapView.initialized){looteriaMapView.initialized=true;requestAnimationFrame(()=>{if(scene.isConnected)mapRestorePosition(scene)})}}
function mapZoomBy(delta){const scene=document.getElementById('looteria-map-scene');if(scene)mapCapturePosition(scene);looteriaMapView.zoom=Math.max(.55,Math.min(1.75,Math.round((looteriaMapView.zoom+delta)*100)/100));mapPrefsSave();mapViewApply();requestAnimationFrame(()=>{const el=document.getElementById('looteria-map-scene');if(el)mapRestorePosition(el)})}
function mapTogglePerspective(){const scene=document.getElementById('looteria-map-scene');if(scene)mapCapturePosition(scene);looteriaMapView.iso=!looteriaMapView.iso;mapPrefsSave();mapViewApply();requestAnimationFrame(()=>{const el=document.getElementById('looteria-map-scene');if(el)mapRestorePosition(el)})}
function mapToggleBuildMode(){looteriaMapView.buildMode=!looteriaMapView.buildMode;mapPrefsSave();mapViewApply()}
function mapCenter(){const scene=document.getElementById('looteria-map-scene');looteriaMapView.x=.5;looteriaMapView.y=.5;if(scene)mapRestorePosition(scene);mapPrefsSave()}
function mapSceneBind(){const scene=document.getElementById('looteria-map-scene');if(!scene||scene.dataset.mapBound)return;scene.dataset.mapBound='1';mapViewApply();requestAnimationFrame(looteriaTerrainPaint);
 scene.addEventListener('scroll',()=>mapCapturePosition(scene),{passive:true});
 let dragMoved=false;
 scene.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType!=='touch')return;if(e.pointerType==='touch'&&!e.isPrimary)return;dragMoved=false;mapDrag={id:e.pointerId,x:e.clientX,y:e.clientY,left:scene.scrollLeft,top:scene.scrollTop,moved:false};/* Capture starts only after movement: buttons must remain clickable. */},{passive:true});
 scene.addEventListener('pointermove',e=>{if(!mapDrag||mapDrag.id!==e.pointerId)return;const dx=e.clientX-mapDrag.x,dy=e.clientY-mapDrag.y;if(Math.hypot(dx,dy)>9&&!mapDrag.moved){mapDrag.moved=true;scene.classList.add('map-dragging');try{scene.setPointerCapture(e.pointerId)}catch(_){}}if(mapDrag.moved){scene.scrollLeft=mapDrag.left-dx;scene.scrollTop=mapDrag.top-dy;dragMoved=true;}},{passive:true});
 const stopDrag=e=>{if(!mapDrag||mapDrag.id!==e.pointerId)return;dragMoved=mapDrag.moved;mapDrag=null;scene.classList.remove('map-dragging');if(dragMoved)mapCapturePosition(scene);try{if(scene.hasPointerCapture(e.pointerId))scene.releasePointerCapture(e.pointerId)}catch(_){}};
 scene.addEventListener('pointerup',stopDrag);scene.addEventListener('pointercancel',stopDrag);
 scene.addEventListener('click',e=>{if(dragMoved){e.preventDefault();e.stopImmediatePropagation();dragMoved=false;}},true);
 scene.addEventListener('wheel',e=>{e.preventDefault();mapZoomBy(e.deltaY<0?.1:-.1)},{passive:false});
 scene.addEventListener('touchmove',e=>{if(e.touches.length!==2){mapPinchDistance=0;return}const a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);if(mapPinchDistance&&Math.abs(d-mapPinchDistance)>12){e.preventDefault();mapZoomBy(d>mapPinchDistance?.05:-.05);mapPinchDistance=d}else if(!mapPinchDistance)mapPinchDistance=d},{passive:false});
 scene.addEventListener('touchend',()=>mapPinchDistance=0);
}
const mapViewObserver=new MutationObserver(()=>{if(document.getElementById('looteria-map-scene'))mapSceneBind();else looteriaMapView.initialized=false});
window.addEventListener('DOMContentLoaded',()=>{const content=document.getElementById('content');if(content)mapViewObserver.observe(content,{childList:true});mapSceneBind()});
window.addEventListener('pagehide',()=>{const scene=document.getElementById('looteria-map-scene');if(scene)mapCapturePosition(scene);clearTimeout(mapSaveTimer);mapPrefsSave()});

// V11.4: HD-Landschaft als eigenständiges Bildasset, bei Ladefehler bleibt der bisherige Renderer aktiv.
const looteriaHdLandscape=new Image();
looteriaHdLandscape.decoding='async';
looteriaHdLandscape.src='looteria-assets/kingdom-landscape-hd.webp';
looteriaHdLandscape.addEventListener('load',()=>requestAnimationFrame(looteriaTerrainPaint));
// V11.0 – high-resolution procedural terrain on Canvas; tile buttons remain real DOM buttons.
function looteriaTerrainPaint(){
 const canvas=document.getElementById('looteria-terrain-canvas'),grid=document.getElementById('looteria-map-grid');
 if(!canvas||!grid)return;
 const tiles=grid.querySelectorAll('.realm-map-tile');if(!tiles.length)return;
 const w=Math.ceil(grid.scrollWidth),h=Math.ceil(grid.scrollHeight);
 if(w<100||h<100)return;
 const scale=Math.min(1.75,Math.max(.8,2900/Math.max(w,h)));
 canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
 ctx.setTransform(scale,0,0,scale,0,0);
 if(looteriaHdLandscape.complete&&looteriaHdLandscape.naturalWidth){
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
   ctx.drawImage(looteriaHdLandscape,0,0,w,h);
   return;
 }
 let seed=917411;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const x0=tiles[0].offsetLeft,y0=tiles[0].offsetTop,tw=(tiles[1].offsetLeft-x0)||68,th=tiles[0].offsetHeight||68;
 const cols=24,rows=Math.ceil(tiles.length/cols);
 const X=c=>x0+c*tw,Y=r=>y0+r*th;
 const ellipse=(x,y,rx,ry,color,angle=0)=>{ctx.beginPath();ctx.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),angle,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()};
 const stroke=(points,color,width)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length-1;i++){let a=points[i],b=points[i+1];ctx.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2)}ctx.lineTo(...points[points.length-1]);ctx.lineWidth=width;ctx.strokeStyle=color;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()};
 const poly=(points,fill,outline)=>{ctx.beginPath();ctx.moveTo(...points[0]);points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(outline){ctx.lineWidth=1.3;ctx.strokeStyle=outline;ctx.stroke()}};
 // Warm hand-painted terrain with coherent regions, not a repeated grid.
 const ground=ctx.createLinearGradient(0,0,w,h);ground.addColorStop(0,'#8aa16a');ground.addColorStop(.42,'#638b63');ground.addColorStop(1,'#405d53');ctx.fillStyle=ground;ctx.fillRect(0,0,w,h);
 for(let i=0;i<440;i++){let x=rand()*w,y=rand()*h,rx=18+rand()*160;ellipse(x,y,rx,rx*(.24+rand()*.52),['#a6ae7544','#294e4540','#d7ba7a25','#c0d19a20','#4c70512e'][i%5],rand()*Math.PI)}
 // Geological ridges: real multi-face mountains with shadows and snowcaps.
 function mountain(x,y,s){
   ellipse(x+10*s,y+16*s,76*s,23*s,'#1a3a3d55');
   poly([[x-83*s,y+14*s],[x-24*s,y-87*s],[x+11*s,y-135*s],[x+68*s,y-37*s],[x+91*s,y+18*s]],'#62756c','#344f4a');
   poly([[x+11*s,y-135*s],[x+68*s,y-37*s],[x+91*s,y+18*s],[x+5*s,y+9*s]],'#405b60');
   poly([[x-24*s,y-87*s],[x+11*s,y-135*s],[x+35*s,y-92*s],[x+14*s,y-101*s],[x-2*s,y-80*s]],'#e0e2d1');
   poly([[x-58*s,y-20*s],[x-24*s,y-87*s],[x+11*s,y-135*s],[x-15*s,y-72*s],[x-31*s,y-43*s]],'#9fa99b');
   for(let i=0;i<12;i++){const xx=x+(rand()-.5)*130*s,yy=y-rand()*35*s;ellipse(xx,yy,1.2*s+rand()*2*s,1*s,'#b1b7a277')}
 }
 [[1.1,2.3,.8],[2.8,2.7,1.05],[4.5,1.9,.73],[21.1,2.5,.9],[23.2,3.1,1.1],[22.4,5.0,.7],[1.8,rows-1,.85],[4.1,rows-.2,1.1],[20.8,rows-.3,.8]].forEach(([c,r,s])=>mountain(X(c),Y(r),s));
 // River follows a coherent S-curve, banks, shallow water, reflections and a bridge.
 const river=[];for(let r=-3;r<=rows+3;r+=.55)river.push([X(11.2+2.5*Math.sin(r*.31)+.55*Math.cos(r*.85)),Y(r)]);
 stroke(river,'#243e3b77',124);stroke(river,'#b7b48a',110);stroke(river,'#748d7b',98);stroke(river,'#2a6670',87);stroke(river,'#3c8c91',77);stroke(river,'#65aeb1',59);
 for(let i=0;i<350;i++){const r=rand()*rows,c=11.2+2.5*Math.sin(r*.31)+.55*Math.cos(r*.85);const xx=X(c)+(rand()-.5)*66,yy=Y(r);stroke([[xx,yy],[xx+7+rand()*17,yy-1]],'#d3e5c177',.6+rand()*1.7)}
 // Roads run beneath the structures, tapering into natural tracks.
 const road=[[X(-1),Y(7.2)],[X(3),Y(7.1)],[X(7),Y(8.2)],[X(12),Y(7.3)],[X(17),Y(7.8)],[X(24),Y(6.3)]];
 stroke(road,'#354b3a88',39);stroke(road,'#b59c6d',29);stroke(road,'#d6bb85',20);stroke(road,'#f0d9a455',3);
 const branch=[[X(6),Y(8)],[X(7),Y(5)],[X(9),Y(2)]];stroke(branch,'#3c4e3d88',21);stroke(branch,'#c4ab7d',13);
 // Timber bridge with visible planks and rails.
 const brX=X(12.9),brY=Y(7.55);
 ctx.save();ctx.translate(brX,brY);ctx.rotate(-.10);ctx.fillStyle='#44352a';ctx.fillRect(-58,-18,116,40);ctx.fillStyle='#93704b';ctx.fillRect(-55,-17,110,32);
 for(let i=-52;i<53;i+=10){ctx.fillStyle=i%3?'#b99460':'#cfab74';ctx.fillRect(i,-16,8,30);ctx.fillStyle='#503b2c';ctx.fillRect(i+8,-16,1,30)}
 ctx.fillStyle='#49392c';ctx.fillRect(-56,-23,112,5);ctx.fillRect(-56,15,112,5);ctx.restore();
 // Distinct oak, birch and conifer canopies, with trunks and highlights.
 function tree(x,y,s,kind){ellipse(x+6*s,y+8*s,20*s,8*s,'#102d285e');ctx.fillStyle='#70533a';ctx.fillRect(x-3*s,y-22*s,6*s,31*s);
 if(kind===0){for(let j=0;j<3;j++){let yy=y-(24+j*15)*s;poly([[x,yy-29*s],[x-(24-j*3)*s,yy+12*s],[x+(24-j*3)*s,yy+12*s]],['#265c4c','#397a5a','#4c9267'][j],'#245342')}}
 else{ellipse(x-12*s,y-34*s,18*s,19*s,kind===1?'#326b50':'#587b45');ellipse(x+13*s,y-37*s,19*s,20*s,kind===1?'#42835a':'#718e4a');ellipse(x,y-49*s,23*s,21*s,kind===1?'#5b9b6c':'#89a45d');ellipse(x-7*s,y-57*s,8*s,4*s,'#d2dba65e')}
 }
 // Forest clusters with uneven silhouettes and clear meadow openings.
 const forests=[[3,4,2.8],[20,4,2.6],[3,rows-3,2.5],[21,rows-3,2.9],[17,1,1.7],[7,rows-1,1.5]];
 for(const [cx,cy,r] of forests){for(let i=0;i<95;i++){const a=rand()*Math.PI*2,d=Math.sqrt(rand())*r,c=cx+Math.cos(a)*d,rr=cy+Math.sin(a)*d;
 const riverC=11.2+2.5*Math.sin(rr*.31)+.55*Math.cos(rr*.85);if(Math.abs(c-riverC)<1.4||rr>6.3&&rr<8.8&&c>4&&c<19)continue;
 tree(X(c),Y(rr),.45+rand()*.65,Math.floor(rand()*3))}}
 // Agricultural plots form visible cultivated patches near the village.
 for(const [c,r,ww,hh] of [[5.5,4.4,3,1.9],[16.3,3.8,3.4,2.1],[17,rows-4,3.5,2]]){
 const xx=X(c),yy=Y(r),pw=tw*ww,ph=th*hh;
 ctx.save();ctx.translate(xx,yy);ctx.rotate(-.08);ctx.fillStyle='#725b3d';ctx.fillRect(-3,-3,pw+6,ph+6);ctx.fillStyle='#98784d';ctx.fillRect(0,0,pw,ph);
 for(let j=9;j<ph;j+=14){ctx.fillStyle=j%3?'#604c35':'#b18a53';ctx.fillRect(0,j,pw,5);for(let k=10;k<pw;k+=16){ctx.fillStyle='#83a66b';ctx.beginPath();ctx.ellipse(k+(j%2)*3,j-1,3,6,-.4,0,Math.PI*2);ctx.fill()}}
 ctx.restore()}
 // Settled world details: stones, shrubs, mushrooms, flowers and tiny fence lines.
 for(let i=0;i<3200;i++){let x=rand()*w,y=rand()*h,rr=rand();if(rr<.56){stroke([[x,y],[x+rand()*3,y-3-rand()*5]],['#d5d9a47a','#214e3d88','#a4c586aa'][i%3],.65+rand()*.7)}else if(rr<.75){ellipse(x,y,1+rand()*3,.8+rand()*2,'#b8aa8b99')}else if(rr<.91){ellipse(x,y,2+rand()*4,1+rand()*3,'#426e50');ellipse(x+2,y-2,2,2,'#8aaa6a')}else{ellipse(x,y,1.5,1.5,['#f4dfb1','#e9b8b3','#d9d9f2'][i%3]);ellipse(x,y,.6,.6,'#ffe2a3')}}

 // V11.2: illustrated landmarks, connected village and water features. All scenery is
 // painted on the same canvas below the real clickable map buttons.
 function roofHouse(x,y,s,roof='#9b4f40'){
   ctx.save();ctx.translate(x,y);ctx.scale(s,s);
   ellipse(7,9,45,15,'#132d284f');
   poly([[-35,-2],[0,-23],[36,-4],[1,17]],'#c9b28a','#645741');
   poly([[1,17],[36,-4],[36,22],[1,43]],'#8e8068','#514a3f');
   poly([[-35,-2],[1,17],[1,43],[-35,22]],'#e0cba0','#71634c');
   poly([[-42,-5],[-3,-40],[40,-7],[1,19]],roof,'#493d39');
   poly([[-42,-5],[-3,-40],[1,19]],'#bf8064');
   for(let k=0;k<5;k++){stroke([[-35+k*7,-9-k*4],[-2+k*7,11-k*4]],'#ffffff20',1)}
   poly([[-23,17],[-10,10],[-10,34],[-23,41]],'#5d483b','#b89a6b');
   poly([[15,13],[27,7],[27,20],[15,27]],'#e6c36f','#5a5345');
   stroke([[21,10],[21,23]],'#71513d',1.5);
   poly([[13,-31],[13,-48],[23,-51],[23,-27]],'#8d8378','#514b46');
   ellipse(21,-54,8,4,'#f2e9c42c');ctx.restore();
 }
 function watchTower(x,y,s){
   ctx.save();ctx.translate(x,y);ctx.scale(s,s);ellipse(9,12,54,16,'#102d2c80');
   poly([[-31,-2],[-31,-94],[14,-111],[38,-93],[38,4],[0,27]],'#b2b1a0','#505d59');
   poly([[-31,-2],[0,27],[0,-83],[-31,-94]],'#d6d2b7');
   poly([[0,-83],[38,-93],[38,4],[0,27]],'#828d85');
   poly([[-42,-94],[0,-122],[46,-97],[1,-68]],'#5c7282','#344957');
   poly([[-42,-94],[0,-122],[1,-68]],'#8b9a9b');
   for(let i=0;i<4;i++){ctx.fillStyle='#e5d8b0';ctx.fillRect(-25+i*10,-63,4,8)}
   poly([[-10,20],[-10,-6],[4,-17],[16,-8],[16,15],[0,27]],'#403b39','#d1b88d');
   stroke([[1,-118],[1,-148]],'#54473d',2);poly([[2,-147],[28,-141],[2,-134]],'#d4a45b');
   ctx.restore();
 }
 function waterMill(x,y,s){
   roofHouse(x,y,s,'#76534d');ctx.save();ctx.translate(x+36*s,y+12*s);ctx.scale(s,s);
   ctx.strokeStyle='#594331';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,24,0,Math.PI*2);ctx.stroke();
   for(let a=0;a<8;a++){ctx.save();ctx.rotate(a*Math.PI/4);ctx.fillStyle='#ad8654';ctx.fillRect(-4,-31,8,17);ctx.restore()}
   ellipse(0,0,5,5,'#e4b875');ctx.restore();
 }
 // A stone-founded hamlet sits near the main road; structures are landmarks,
 // not new gameplay buildings and cannot intercept map clicks.
 const village=[[6.8,6.45,.83,'#a35443'],[8.2,6.2,.75,'#4e7884'],[6.6,9.15,.73,'#8c6545'],[8.4,9.2,.84,'#a35443'],[15.8,6.25,.79,'#a35443'],[17.4,9.3,.83,'#57747b']];
 for(const [c,r,s,col] of village)roofHouse(X(c),Y(r),s,col);
 watchTower(X(5.2),Y(7.8),.78);
 watchTower(X(19.3),Y(7.6),.62);
 waterMill(X(14.6),Y(9.8),.75);
 // Garden plots, walls and flowering shrubs around the village.
 for(let i=0;i<145;i++){
   const c=5.2+rand()*13.7,r=5.3+rand()*5.3,x=X(c),y=Y(r);
   if(Math.abs(c-(11.2+2.5*Math.sin(r*.31)+.55*Math.cos(r*.85)))<1.2)continue;
   if(i%4===0){ellipse(x+4,y+4,11,4,'#203f3650');ellipse(x,y,8,6,'#3c7856');ellipse(x-3,y-3,4,3,'#7da467')}
   else if(i%3===0){ellipse(x,y,3,2,['#e7b3b1','#f6e2b0','#b9c6ec'][i%3]);ellipse(x,y,.8,.8,'#fff1b5')}
   else{stroke([[x,y],[x+1,y-5]],'#3d714d',1);ellipse(x+1,y-5,2,3,'#b7c67a')}
 }
 // Distinct ripples and foam near river bends, avoiding repeating horizontal bands.
 for(let i=0;i<175;i++){
   const r=rand()*rows,c=11.2+2.5*Math.sin(r*.31)+.55*Math.cos(r*.85),x=X(c)+(rand()-.5)*46,y=Y(r);
   stroke([[x,y],[x+4+rand()*10,y-1]],i%3?'#bce0d27a':'#f2f4d5a3',.6+rand()*.7);
 }

 // V11.4 Phase 2 – fixed, shared fantasy-realism detailing. The seed above is
 // constant for every kingdom: scenery never depends on player state.
 // Subtle terrain contouring gives the hills a layered, hand-painted depth.
 for(let k=0;k<38;k++){
   const side=k%2===0, cx=side?X(.1+rand()*4.7):X(19+rand()*4.7);
   const cy=Y(.7+rand()*Math.max(1,rows-1.5));
   const span=28+rand()*75;
   ctx.beginPath();ctx.ellipse(cx,cy,span,10+rand()*16,-.28,Math.PI*.08,Math.PI*.92);
   ctx.lineWidth=1.2+rand()*1.8;ctx.strokeStyle=k%3===0?'#d6d5a342':'#243f3b39';ctx.stroke();
 }
 // Rounded riverbank stones, reed beds and low waterside vegetation.
 for(let i=0;i<310;i++){
   const r=.2+rand()*(rows-.4);
   const c=11.2+2.5*Math.sin(r*.31)+.55*Math.cos(r*.85);
   const bank=(i%2===0?-1:1)*(1.04+rand()*.54);
   const xx=X(c+bank),yy=Y(r)+(rand()-.5)*th;
   if(i%5===0){
     ellipse(xx+3,yy+3,7,3,'#1d38364c');
     ellipse(xx,yy,3+rand()*5,2+rand()*3,i%2?'#c4bca0':'#899c89');
     ellipse(xx-1,yy-1,2,1,'#e3ddc078');
   }else{
     for(let j=0;j<3;j++){
       const bx=xx+(j-1)*4;
       stroke([[bx,yy],[bx+(rand()-.5)*5,yy-7-rand()*12]],j===1?'#a6aa69':'#476f4c',.9+rand()*.7);
     }
   }
 }
 // Cobbles along the main road, with subdued edge wear and uneven shapes.
 for(let i=0;i<480;i++){
   const c=rand()*24,r=7.2+.55*Math.sin(c*.48)+(rand()-.5)*.24;
   const xx=X(c),yy=Y(r);
   ellipse(xx,yy,1.3+rand()*3,.8+rand()*1.7,i%4?'#ead7a44a':'#75684d65',rand()*.6);
 }
 // Small lanterns, boundary posts and warm glints make the village readable.
 for(const [c,r] of [[5.9,7.3],[7.7,7.45],[9.2,7.7],[16.1,7.55],[18.2,7.3]]){
   const xx=X(c),yy=Y(r);
   ellipse(xx+5,yy+3,10,4,'#1d302e66');
   stroke([[xx,yy],[xx,yy-23]],'#4c3a2e',3);
   poly([[xx-5,yy-23],[xx+5,yy-23],[xx+4,yy-13],[xx-4,yy-13]],'#7b6444','#463e32');
   ellipse(xx,yy-18,2.8,4,'#f8d993');
   ellipse(xx,yy-18,12,13,'#f7d58320');
 }
 // V11.4 – Stronger, shared fantasy-landscape landmarks (visual only).
 // Stone citadel on the northern ridge; it is background scenery, not a gameplay building.
 function citadel(x,y,s){
   ctx.save();ctx.translate(x,y);ctx.scale(s,s);
   ellipse(8,18,132,29,'#142d2c88');
   poly([[-115,8],[-83,-29],[-38,-42],[24,-40],[86,-18],[112,15],[62,32],[-66,30]],'#7d8176','#4a514d');
   poly([[-90,-17],[-90,-86],[-53,-101],[-17,-83],[-17,-8]],'#b6b5a0','#505b56');
   poly([[-17,-83],[0,-96],[0,-6],[-17,-8]],'#677a75');
   poly([[-96,-88],[-54,-124],[-9,-90],[-54,-67]],'#566d7b','#344752');
   poly([[-79,-35],[42,-46],[85,-25],[85,17],[16,32],[-79,13]],'#a4a89a','#52625b');
   poly([[16,32],[85,17],[85,-25],[16,-11]],'#788b82');
   for(let i=0;i<8;i++){ctx.fillStyle='#d9d1b3';ctx.fillRect(-75+i*18,-48,10,10)}
   for(const xx of [-105,80]){
     poly([[xx-17,2],[xx-17,-82],[xx+16,-82],[xx+16,9]],'#b9b8a3','#56635d');
     poly([[xx-24,-84],[xx,-111],[xx+24,-84],[xx,-68]],'#63778b','#344c5d');
     ctx.fillStyle='#4b514d';ctx.fillRect(xx-4,-53,8,18);
   }
   poly([[-16,25],[-16,-6],[2,-22],[20,-8],[20,29]],'#403e39','#d2c7a6');
   stroke([[0,-94],[0,-148]],'#534b3f',3);
   poly([[1,-147],[43,-135],[1,-124]],'#a95b49');
   ctx.restore();
 }
 citadel(X(17.4),Y(2.4),.94);
 // Cliff terraces frame the eastern forest and make the elevation legible.
 for(let k=0;k<5;k++){
   const xx=X(20.5+k*.43),yy=Y(8.7+k*.64);
   poly([[xx-58,yy-20],[xx+30,yy-33],[xx+71,yy-6],[xx+49,yy+27],[xx-45,yy+21]],k%2?'#718477':'#899589','#4d6259');
   poly([[xx-45,yy+21],[xx+49,yy+27],[xx+36,yy+51],[xx-52,yy+39]],'#455e58');
   stroke([[xx-38,yy-8],[xx+28,yy-18],[xx+54,yy-5]],'#d0cfaa77',2);
 }
 // A cascading waterfall connects the upper stream to a rocky pool.
 const fx=X(11.6),fy=Y(3.2);
 ellipse(fx+5,fy+62,77,28,'#174d59aa');
 poly([[fx-31,fy-48],[fx+34,fy-49],[fx+22,fy+49],[fx-20,fy+49]],'#3a8998','#d4ddd0');
 for(let i=0;i<17;i++){
   const xx=fx-24+i*3.2;
   stroke([[xx,fy-38],[xx+(i%3-1)*7,fy+35]],i%4?'#c8e5dc8c':'#f1f4e7b8',1.5+(i%3));
 }
 for(let i=0;i<22;i++)ellipse(fx-40+rand()*85,fy+49+rand()*21,2+rand()*5,1+rand()*2,'#d9f0e1a8');
 // Ancient circular stone plaza, with a glowing fantasy rune at its centre.
 const px=X(7.2),py=Y(10.7);
 ellipse(px+7,py+8,78,30,'#203b3488');
 ellipse(px,py,69,26,'#a7a18b');ellipse(px,py,56,20,'#6b8277');
 ctx.save();ctx.translate(px,py);ctx.scale(1,.38);
 ctx.strokeStyle='#d4c5a2';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,48,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#9bc4b2';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.stroke();
 for(let i=0;i<8;i++){const a=i*Math.PI/4;stroke([[Math.cos(a)*31,Math.sin(a)*31],[Math.cos(a)*43,Math.sin(a)*43]],'#e2d5a7',3)}
 ctx.restore();
 ellipse(px,py-3,15,8,'#9fe1c03b');
 // Hand-drawn winding footpath connects the landmark to the village.
 stroke([[px+44,py+12],[X(9),Y(10.1)],[X(10),Y(9)]],'#3a473b99',18);
 stroke([[px+44,py+12],[X(9),Y(10.1)],[X(10),Y(9)]],'#c7ae7f',11);
 // Thin atmospheric haze between foreground features and the mountain rim.
 const mist=ctx.createLinearGradient(0,0,0,h);
 mist.addColorStop(0,'#d7e2c111');mist.addColorStop(.48,'#e2e6c100');mist.addColorStop(1,'#d3d6b80c');
 ctx.fillStyle=mist;ctx.fillRect(0,0,w,h);
 // Atmospheric daylight: bright settlement and darker corners for depth.
 const sunlight=ctx.createRadialGradient(w*.42,h*.34,10,w*.5,h*.52,Math.max(w,h)*.9);sunlight.addColorStop(0,'#fff4bd24');sunlight.addColorStop(.62,'#f7e7bb06');sunlight.addColorStop(1,'#071f253e');ctx.fillStyle=sunlight;ctx.fillRect(0,0,w,h);
}
const terrainObserver=new MutationObserver(()=>{const c=document.getElementById('looteria-terrain-canvas');if(c&&!c.dataset.ready){c.dataset.ready='1';requestAnimationFrame(looteriaTerrainPaint)}});
window.addEventListener('DOMContentLoaded',()=>{const root=document.getElementById('content');if(root)terrainObserver.observe(root,{childList:true,subtree:false});requestAnimationFrame(looteriaTerrainPaint)});
window.addEventListener('resize',()=>{clearTimeout(window.looteriaTerrainResize);window.looteriaTerrainResize=setTimeout(looteriaTerrainPaint,220)});
