import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as NGL from 'ngl';

const MOLECULE_DATABASE = {
  Glucose: { category: 'Bio-agents', formula: 'C6H12O6', weight: '180.2 g/mol', cid: '5793', useCase: 'Cellular Fuel' },
  Caffeine: { category: 'Neuro', formula: 'C8H10N4O2', weight: '194.2 g/mol', cid: '2519', useCase: 'CNS Stimulant' },
  Dopamine: { category: 'Neuro', formula: 'C8H11NO2', weight: '153.2 g/mol', cid: '681', useCase: 'Motivation Link' },
  Serotonin: { category: 'Neuro', formula: 'C10H12N2O', weight: '176.2 g/mol', cid: '5202', useCase: 'Mood Regulation' },
  Aspirin: { category: 'Pharma', formula: 'C9H8O4', weight: '180.2 g/mol', cid: '2190', useCase: 'Pain Intercept' },
  Penicillin: { category: 'Bio-agents', formula: 'C16H18N2O4S', weight: '334.4 g/mol', cid: '5904', useCase: 'Beta-Lactam Core' },
  Capsaicin: { category: 'Bio-agents', formula: 'C18H27NO3', weight: '305.4 g/mol', cid: '1548943', useCase: 'Thermal Agonist' },
  Ethanol: { category: 'Solvents', formula: 'C2H6O', weight: '46.1 g/mol', cid: '702', useCase: 'Antiseptic base' },
  Acetone: { category: 'Solvents', formula: 'C3H6O', weight: '58.1 g/mol', cid: '180', useCase: 'Polymer Solvent' },
  Nanotube: { category: 'Nanotech', formula: 'C_n', weight: 'Variable', cid: '15530722', useCase: 'Tensile Fiber' },
  Buckminster: { category: 'Nanotech', formula: 'C60', weight: '720.6 g/mol', cid: '123591', useCase: 'Symmetric Cage' }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMol, setSelectedMol] = useState('Glucose');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicDetails, setDynamicDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [renderStyle, setRenderStyle] = useState('ball+stick');

  // Unified measurement states
  const [distanceDisplay, setDistanceDisplay] = useState(null);
  const [atomPairInfo, setAtomPairInfo] = useState('');

  const stageRef = useRef(null);
  const componentRef = useRef(null);
  const distanceRepRef = useRef(null);
  const selectedAtomsRef = useRef([]);

  const isSpinningRef = useRef(isSpinning);
  useEffect(() => { isSpinningRef.current = isSpinning; }, [isSpinning]);

  const currentDetails = dynamicDetails || MOLECULE_DATABASE[selectedMol] || {
    category: 'Live Node', formula: 'Syncing', weight: 'Resolving', useCase: 'External Query'
  };

  const renderComponent = useCallback((component) => {
    componentRef.current = component;
    component.addRepresentation(renderStyle, { 
      radiusScale: renderStyle === 'spacefill' ? 0.8 : 1.2, 
      aspectRatio: 1.4,
      multipleBond: "symmetric",
      colorScheme: "element", 
      quality: "low" // Kept lean to handle mobile GPU throttling smoothly
    });
    
    stageRef.current.handleResize();
    stageRef.current.autoView();
    
    setTimeout(() => {
      if (stageRef.current) {
        stageRef.current.handleResize();
        stageRef.current.autoView();
      }
    }, 60);

    setIsLoading(false);
    if (isSpinningRef.current) {
      stageRef.current.setSpin([0, 1, 0], 0.006);
    }
  }, [renderStyle]);

  const loadStructure = useCallback(async () => {
    if (!stageRef.current) return;
    setIsLoading(true);
    try {
      if (distanceRepRef.current) distanceRepRef.current = null;
      stageRef.current.removeAllComponents();
      
      selectedAtomsRef.current = [];
      setDistanceDisplay(null);
      setAtomPairInfo('');
      componentRef.current = null;
      
      let targetCid = MOLECULE_DATABASE[selectedMol]?.cid;
      if (!targetCid) {
        const searchRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(selectedMol)}/property/Title/JSON`);
        const searchData = await searchRes.json();
        if (searchData.PropertyTable?.Properties[0]) {
          targetCid = searchData.PropertyTable.Properties[0].CID;
        }
      }

      if (targetCid) {
        const threeDUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${targetCid}/record/SDF/?record_type=3d`;
        try {
          const checkResponse = await fetch(threeDUrl);
          const checkText = await checkResponse.text();
          if (!checkText || checkText.trim() === "" || checkText.includes("Status: Status_NoData")) {
            throw new Error("2D fallback routing");
          }
          const blob = new Blob([checkText], { type: 'text/plain' });
          stageRef.current.loadFile(blob, { ext: "sdf" }).then((comp) => renderComponent(comp));
        } catch (fb) {
          const twoDUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${targetCid}/record/SDF/?record_type=2d`;
          stageRef.current.loadFile(twoDUrl, { ext: "sdf" })
            .then((comp) => renderComponent(comp))
            .catch(() => setIsLoading(false));
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  }, [selectedMol, renderComponent]);

  const initCanvasRef = (element) => {
    if (element && !stageRef.current) {
      stageRef.current = new NGL.Stage(element, { 
        backgroundColor: '#0a0d12', 
        sampleLevel: 0, 
        impostor: false 
      });
      
      stageRef.current.setParameters({ lightIntensity: 1.1, ambientIntensity: 0.6 });
      stageRef.current.handleResize();

      // MOBILE TOUCH-SAFE ATOM PICKER: Bypasses desktop mouse events explicitly
      stageRef.current.signals.clicked.add((pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {
          const atom = pickingProxy.atom;
          let currentList = [...selectedAtomsRef.current];
          
          currentList.push(atom);
          if (currentList.length > 2) {
            currentList = [currentList[1], currentList[2]];
          }
          
          selectedAtomsRef.current = currentList;
          
          // Execute calculation loop
          if (selectedAtomsRef.current.length === 2) {
            const a1 = selectedAtomsRef.current[0];
            const a2 = selectedAtomsRef.current[1];
            const dX = a1.x - a2.x;
            const dY = a1.y - a2.y;
            const dZ = a1.z - a2.z;
            const computedDist = Math.sqrt(dX*dX + dY*dY + dZ*dZ);
            
            setDistanceDisplay(computedDist.toFixed(3));
            setAtomPairInfo(`Atom Matrix Point: ${a1.element} ⟷ ${a2.element}`);

            if (componentRef.current) {
              if (distanceRepRef.current) componentRef.current.removeRepresentation(distanceRepRef.current);
              distanceRepRef.current = componentRef.current.addRepresentation("distance", {
                atomPair: [[ a1.index, a2.index ]],
                labelColor: "#00fff5",   
                labelSize: 2.8,
                lineColor: "#ff0055",    
                lineWidth: 5.0
              });
            }
          }
        }
      });
      
      setTimeout(() => { loadStructure(); }, 50);
    }
  };

  useEffect(() => { loadStructure(); }, [loadStructure]);

  useEffect(() => {
    if (!stageRef.current) return;
    if (isSpinning) stageRef.current.setSpin([0, 1, 0], 0.006);
    else stageRef.current.setSpin(null);
  }, [isSpinning]);

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      const formatted = searchQuery.trim();
      setDynamicDetails(null);
      setSelectedMol(formatted.charAt(0).toUpperCase() + formatted.slice(1));
      try {
        const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(formatted)}/property/MolecularFormula,MolecularWeight/JSON`);
        const data = await res.json();
        if (data.PropertyTable?.Properties[0]) {
          const prop = data.PropertyTable.Properties[0];
          setDynamicDetails({
            category: 'API Feed', formula: prop.MolecularFormula, weight: `${parseFloat(prop.MolecularWeight).toFixed(1)} g/mol`, useCase: 'Dynamic Asset Matrix'
          });
        }
      } catch (err) {}
    }
  };

  const filteredMolecules = Object.keys(MOLECULE_DATABASE).filter(name => {
    if (activeTab === 'All') return true;
    return MOLECULE_DATABASE[name].category === activeTab || MOLECULE_DATABASE[name].category.includes(activeTab);
  });

  return (
    <div style={styles.appContainer}>
      {/* 1. Sticky Viewport Segment pinned to the upper portion of the thumb reach */}
      <section style={styles.upperViewportContainer}>
        <div style={styles.canvasMetaBlock}>
          <span style={styles.mobileBadge}>{currentDetails.category}</span>
          <h1 style={styles.titleText}>{selectedMol}</h1>
        </div>

        {isLoading && <div style={styles.loaderPill}><div style={styles.miniSpinner}></div> LOAD</div>}
        
        <div ref={initCanvasRef} style={styles.canvasTarget}></div>

        {/* Action Toggle Dock Bar */}
        <div style={styles.actionDock}>
          <button onClick={() => setRenderStyle(renderStyle === 'ball+stick' ? 'spacefill' : 'ball+stick')} style={styles.dockButton}>
            {renderStyle === 'ball+stick' ? '🚨 Spacefill' : '🕸️ Ball/Stick'}
          </button>
          <button onClick={() => { if(stageRef.current){ stageRef.current.autoView(); stageRef.current.handleResize(); } }} style={styles.iconButton}>🪐</button>
          <button onClick={() => setIsSpinning(!isSpinning)} style={{...styles.dockButton, background: isSpinning ? '#ff0055' : '#1f242c', color: '#fff'}}>
            {isSpinning ? '🛑 STOP' : '🔄 SPIN'}
          </button>
        </div>
      </section>

      {/* 2. Scrollable Info Dash Layer positioned below for natural ergonomics */}
      <section style={styles.lowerControlContainer}>
        
        {/* Distance Layer HUD Feedback Row */}
        <div style={styles.touchHUDCard}>
          <div style={styles.hudLabel}>📐 MEASUREMENT ARRAY UNIT</div>
          {distanceDisplay ? (
            <div style={styles.hudRow}>
              <div>
                <span style={styles.hudValue}>{distanceDisplay}</span> <span style={{color: '#58a6ff', fontSize:'12px'}}>Å</span>
                <div style={styles.hudSub}>{atomPairInfo}</div>
              </div>
              <button onClick={() => { selectedAtomsRef.current = []; setDistanceDisplay(null); setAtomPairInfo(''); if(componentRef.current && distanceRepRef.current) componentRef.current.removeRepresentation(distanceRepRef.current); }} style={styles.resetPill}>RESET</button>
            </div>
          ) : (
            <div style={styles.hudPlaceholder}>👉 Tap any 2 atoms on the container canvas layout above to draw a connecting spatial line and check distance calculations.</div>
          )}
        </div>

        {/* Horizontal Navigation Registry Switcher */}
        <div style={{padding: '0 4px'}}>
          <input 
            type="text" 
            placeholder="🔍 Search compounds (e.g. Caffeine)..." 
            style={styles.searchBox}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        <div style={styles.horizontalTabRibbon}>
          {['All', 'Neuro', 'Bio-agents', 'Solvents', 'Nanotech'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.activeTabPill : styles.inactiveTabPill}>
              {tab}
            </button>
          ))}
        </div>

        {/* Horizontal Card Swiping Container */}
        <div style={styles.horizontalItemScroller}>
          {filteredMolecules.map(name => (
            <div key={name} onClick={() => { setDynamicDetails(null); setSelectedMol(name); }} style={selectedMol === name && !dynamicDetails ? styles.activeItemCard : styles.inactiveItemCard}>
              <div style={{fontSize: '13px', fontWeight: 'bold'}}>{name}</div>
              <div style={{fontSize: '10px', color: '#6e7681', marginTop: '2px'}}>{MOLECULE_DATABASE[name]?.formula || 'SDF'}</div>
            </div>
          ))}
        </div>

        {/* Chemical Specifications Data Deck */}
        <div style={styles.telemetryCard}>
          <div style={styles.hudLabel}>📝 LATTICE SPECIFICATIONS</div>
          <div style={styles.gridStats}>
            <div style={styles.statBox}><div style={styles.statLabel}>Formula</div><div style={styles.statVal}>{currentDetails.formula}</div></div>
            <div style={styles.statBox}><div style={styles.statLabel}>Mass Weight</div><div style={styles.statVal}>{currentDetails.weight}</div></div>
            <div style={{...styles.statBox, gridColumn: 'span 2'}}><div style={styles.statLabel}>Target Use-Case Vector</div><div style={{...styles.statVal, color: '#00ff96'}}>{currentDetails.useCase}</div></div>
          </div>
        </div>

      </section>
    </div>
  );
};

// Ergonomic Mobile Native UI Style Blueprint
const styles = {
  appContainer: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#07090e', color: '#c9d1d9', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', overflow: 'hidden' },
  
  // Upper Element: Fixed 50% Top Component Layer
  upperViewportContainer: { height: '48%', position: 'relative', width: '100%', borderBottom: '1px solid #1f242c', background: '#0a0d12' },
  canvasTarget: { width: '100%', height: '100%' },
  canvasMetaBlock: { position: 'absolute', top: '12px', left: '12px', zIndex: 10, pointerEvents: 'none' },
  mobileBadge: { fontSize: '8px', fontWeight: 'bold', background: 'rgba(0,255,245,0.1)', color: '#00fff5', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', border: '1px solid rgba(0,255,245,0.2)' },
  titleText: { margin: '4px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '0.3px' },
  loaderPill: { position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: '#111827', padding: '4px 8px', borderRadius: '6px', fontSize: '9px', color: '#00fff5', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #21262d' },
  miniSpinner: { width: '8px', height: '8px', border: '1px solid rgba(0,255,245,0.2)', borderTop: '1px solid #00fff5', borderRadius: '50%' },
  
  // Mobile Quick Action Overlay Bar
  actionDock: { position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', gap: '6px', background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(8px)', padding: '4px 6px', borderRadius: '10px', border: '1px solid #21262d', width: '90%', justifyContent: 'space-between', boxSizing: 'border-box' },
  dockButton: { flex: 1, border: 'none', background: '#1f242c', color: '#c9d1d9', fontSize: '10px', fontWeight: 'bold', padding: '6px 0', borderRadius: '6px', cursor: 'pointer' },
  iconButton: { width: '28px', background: '#1f242c', border: 'none', borderRadius: '6px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },

  // Lower Element: 52% Core Bottom Panel Controller Loop
  lowerControlContainer: { height: '52%', overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#07090e', boxSizing: 'border-box' },
  
  // Premium Touch Measurement Module UI
  touchHUDCard: { background: '#0d1117', border: '1px dashed #21262d', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  hudLabel: { fontSize: '8px', fontWeight: '800', color: '#00fff5', letterSpacing: '0.8px' },
  hudPlaceholder: { fontSize: '10px', color: '#556275', fontStyle: 'italic', lineHeight: '1.4', padding: '4px 0' },
  hudRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' },
  hudValue: { fontSize: '20px', fontWeight: '900', color: '#00ff96' },
  hudSub: { fontSize: '9px', color: '#8b949e', fontFamily: 'monospace', marginTop: '1px' },
  resetPill: { background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055', color: '#ff0055', fontSize: '8px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer' },

  // Search Engine Framework
  searchBox: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #21262d', background: '#0d1117', fontSize: '12px', color: '#fff', boxSizing: 'border-box', outline: 'none' },

  // Swipeable Ribbon Navigation
  horizontalTabRibbon: { display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 0', width: '100%', WebkitOverflowScrolling: 'touch' },
  inactiveTabPill: { border: 'none', background: '#0d1117', color: '#8b949e', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', whiteSpace: 'nowrap' },
  activeTabPill: { border: 'none', background: 'rgba(0,255,245,0.1)', border: '1px solid #00fff5', color: '#00fff5', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' },

  // Horizontal Card Scroller
  horizontalItemScroller: { display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' },
  inactiveItemCard: { minWidth: '95px', maxWidth: '95px', background: '#0d1117', border: '1px solid #21262d', borderRadius: '8px', padding: '10px', boxSizing: 'border-box' },
  activeItemCard: { minWidth: '95px', maxWidth: '95px', background: 'linear-gradient(135deg, #161b22, #0d1117)', border: '1px solid #00fff5', color: '#00fff5', borderRadius: '8px', padding: '10px', boxSizing: 'border-box' },

  // Telemetry Grid Elements
  telemetryCard: { background: '#0d1117', border: '1px solid #1f242c', borderRadius: '10px', padding: '10px' },
  gridStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' },
  statBox: { background: '#07090e', border: '1px solid #21262d', borderRadius: '6px', padding: '6px 8px' },
  statLabel: { fontSize: '8px', color: '#6e7681', textTransform: 'uppercase' },
  statVal: { fontSize: '11px', fontWeight: 'bold', color: '#f0f6fc', marginTop: '2px' }
};

export default App;