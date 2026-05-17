import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as NGL from 'ngl';

// Premium Visual Molecular Database
const MOLECULE_DATABASE = {
  Glucose: { 
    category: 'Complex Bio-agents', 
    sub: 'Simple Monosaccharide Sugar', 
    formula: 'C6H12O6', 
    weight: '180.16 g/mol', 
    type: 'Hexose Carbohydrate Core', 
    source: 'Plant Photosynthesis', 
    cid: '5793', 
    description: 'The primary sub-atomic energy vehicle utilized by biological life, metabolized downstream during cellular respiration loops.',
    useCases: [
      { area: 'Clinical Hydration', detail: 'Injected as an intravenous dextrose solution to rapidly restabilize critically hypoglycemic patients.' },
      { area: 'Food Tech', detail: 'Primary crystallization stabilizer and sweetener agent utilized across modern commercial baking operations.' }
    ]
  },
  Caffeine: { 
    category: 'Neurochemistry', 
    sub: 'Central Nervous System Stimulant', 
    formula: 'C8H10N4O2', 
    weight: '194.19 g/mol', 
    type: 'Purine Alkaloid System', 
    source: 'Coffee Beans / Tea Leaves', 
    cid: '2519', 
    description: 'The world\'s most widely consumed psychoactive substance. It blocks central adenosine receptors to systematically delay the onset of physiological fatigue.',
    useCases: [
      { area: 'Pharmacology', detail: 'Primary agent in over-the-counter alertness medications and performance boosters.' },
      { area: 'Therapeutics', detail: 'Co-analgesic compound combined with paracetamol or aspirin to accelerate headache relief.' }
    ]
  },
  Dopamine: { 
    category: 'Neurochemistry', 
    sub: 'Reward & Motivation Neuromodulator', 
    formula: 'C8H11NO2', 
    weight: '153.18 g/mol', 
    type: 'Catecholamine System', 
    source: 'Substantia Nigra Synthesis', 
    cid: '681', 
    description: 'A critical monoamine neurotransmitter that drives reward pathways, motivational salience, motor control, and reinforcement learning paradigms.',
    useCases: [
      { area: 'Emergency Medicine', detail: 'Intravenous injection acting as a vasopressor to combat severe hypotension and cardiogenic shock.' },
      { area: 'Neurology Research', detail: 'Core marker in researching Parkinson\'s disease treatments and reward-deficiency syndromes.' }
    ]
  },
  Serotonin: { 
    category: 'Neurochemistry', 
    sub: 'Mood & Sleep Cycle Regulator', 
    formula: 'C10H12N2O', 
    weight: '176.22 g/mol', 
    type: 'Indoleamine Derivative', 
    source: 'Gastrointestinal & CNS Pathways', 
    cid: '5202', 
    description: 'A key biochemical modulator responsible for regulating emotional stability, mood states, sleep cycles, anxiety thresholds, and systemic homeostasis.',
    useCases: [
      { area: 'Antidepressants', detail: 'Primary mechanism target for SSRIs to alleviate major depressive disorders.' },
      { area: 'Gastrointestinal', detail: 'Regulates local gut motility and peristaltic reflex systems within the enteric nervous system.' }
    ]
  },
  Aspirin: {
    category: 'Pharmaceuticals',
    sub: 'Nonsteroidal Anti-inflammatory Drug',
    formula: 'C9H8O4',
    weight: '180.16 g/mol',
    type: 'Salicylate Ester Matrix',
    source: 'Synthetic Salicylate Modification',
    cid: '2190',
    description: 'A foundational analgesic used globally to reduce inflammation, mitigate acute somatic pain, and break systemic fever responses.',
    useCases: [
      { area: 'Cardiology', detail: 'Administered in low daily doses as an antiplatelet agent to prevent secondary myocardial infarctions.' },
      { area: 'Pain Management', detail: 'Commonly deployed to disrupt COX-1 and COX-2 enzyme pathways.' }
    ]
  },
  Penicillin: { 
    category: 'Complex Bio-agents', 
    sub: 'Beta-Lactam Antibiotic Core', 
    formula: 'C16H18N2O4S', 
    weight: '334.40 g/mol', 
    type: 'Thiazolidine-Azetidinone Core', 
    source: 'Penicillium Fungi', 
    cid: '5904', 
    description: 'Historically revolutionary antibiotic framework featuring a highly strained four-membered beta-lactam ring that permanently deactivates bacterial transpeptidase walls.',
    useCases: [
      { area: 'Infection Control', detail: 'Frontline intervention strategy targeting Gram-positive bacterial pathogens.' },
      { area: 'Biomedical History', detail: 'The foundation of modern industrial mass-production pipelines for fermentation biotechnology.' }
    ]
  },
  Capsaicin: { 
    category: 'Complex Bio-agents', 
    sub: 'TRPV1 Thermal Receptor Agonist', 
    formula: 'C18H27NO3', 
    weight: '305.41 g/mol', 
    type: 'Vanilloid Lipophilic Organic', 
    source: 'Capsicum Chili Peppers', 
    cid: '1548943', 
    description: 'An active chemical irritant that binds selectively to thermal receptor pathways, inducing a false metabolic sensation of scorching heat across nerve fibers.',
    useCases: [
      { area: 'Topical Analgesics', detail: 'Formulated into skin creams to deplete local Substance P reserves.' },
      { area: 'Defense Industry', detail: 'The active lacrimator chemical component packed inside tactical pepper sprays.' }
    ]
  },
  Ethanol: {
    category: 'Chemical Solvents',
    sub: 'Primary Hydroxyl Alcohol Structure',
    formula: 'C2H6O',
    weight: '46.07 g/mol',
    type: 'Alkyl Alcohol System',
    source: 'Yeast Sugar Fermentation',
    cid: '702',
    description: 'A clear, colorless chemical matrix that functions globally as a clean burning fuel, industrial extraction solvent, and recreational intoxicant.',
    useCases: [
      { area: 'Sanitization', detail: 'Deployed at 70% concentration as an antiseptic to destroy lipid-bound viral and bacterial outer shells.' },
      { area: 'Automotive Fuel', detail: 'Blended with traditional gasoline feedstock to increase total octane combustion efficiency.' }
    ]
  },
  Acetone: {
    category: 'Chemical Solvents',
    sub: 'Simplest Aliphatic Ketone Matrix',
    formula: 'C3H6O',
    weight: '58.08 g/mol',
    type: 'Dimethyl Ketone Framework',
    source: 'Cumene Process Oxidation',
    cid: '180',
    description: 'A volatile, flammable organic solvent capable of rapidly dissolving synthetic polymers, resins, and heavy industrial adhesives.',
    useCases: [
      { area: 'Lab Protocols', detail: 'Standard glassware rinse agent chosen for its supreme miscibility with water and rapid evaporation rate.' },
      { area: 'Cosmetic Labs', detail: 'The active primary base solvent formula needed for dissolving cosmetic acrylics.' }
    ]
  },
  Nanotube: { 
    category: 'Nanotech', 
    sub: 'Cylindrical Carbon Fullerene Structure', 
    formula: 'C_n (Allotrope)', 
    weight: 'Variable Scale', 
    type: 'Carbon Allotrope Lattice', 
    source: 'Arc Discharge Synthesis', 
    cid: '15530722', 
    description: 'A cylindrical carbon lattice demonstrating extraordinary tensile strengths, high electrical conductivity, and specialized thermal transport architectures.',
    useCases: [
      { area: 'Material Science', detail: 'Woven into structural carbon sheets to create lightweight hulls for aerospace frames.' },
      { area: 'Energy Storage', detail: 'Integrated into lithium-ion battery anode meshes to significantly raise capacity.' }
    ]
  },
  Buckminsterfullerene: { 
    category: 'Nanotech', 
    sub: 'Truncated Icosahedron Cage', 
    formula: 'C60', 
    weight: '720.64 g/mol', 
    type: 'Closed Cage Pure Carbon', 
    source: 'Laser Ablation of Graphite', 
    cid: '123591', 
    description: 'A pure carbon spherical configuration shaped like a soccer ball composed of 20 hexagons and 12 pentagons, displaying supreme structural symmetries.',
    useCases: [
      { area: 'Drug Delivery', detail: 'Engineered as a molecular structural hollow cage to safely guide therapeutic chemicals past cell boundaries.' },
      { area: 'Optics Technology', detail: 'Utilized in high-powered defensive laser protective optics due to non-linear light absorption.' }
    ]
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedMol, setSelectedMol] = useState('Glucose');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicDetails, setDynamicDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [renderStyle, setRenderStyle] = useState('ball+stick');
  const [hoveredAtom, setHoveredAtom] = useState(null);

  // Distance Tool States
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [distanceInterpretation, setDistanceInterpretation] = useState('');
  const [realWorldAnalogy, setRealWorldAnalogy] = useState('');

  const stageRef = useRef(null);
  const componentRef = useRef(null);
  const distanceRepRef = useRef(null);

  const isSpinningRef = useRef(isSpinning);
  useEffect(() => { isSpinningRef.current = isSpinning; }, [isSpinning]);

  useEffect(() => {
    const handleWindowResize = () => { if (stageRef.current) stageRef.current.handleResize(); };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const currentDetails = dynamicDetails || MOLECULE_DATABASE[selectedMol] || {
    category: 'Live Registry Feed',
    sub: 'Queried Structure Profile',
    formula: 'Resolving Data...',
    weight: 'Calculating...',
    type: 'External Matrix Compound',
    source: 'PubChem Global Infrastructure',
    description: 'Structure successfully resolved from global cloud molecular schemas.',
    useCases: [{ area: 'Dynamic Target Analysis', detail: 'Property metrics mapped out in real-time from API database vectors.' }]
  };

  const renderComponent = useCallback((component) => {
    componentRef.current = component;
    component.addRepresentation(renderStyle, { 
      radiusScale: renderStyle === 'spacefill' ? 0.8 : 1.3, 
      aspectRatio: 1.5,
      multipleBond: "symmetric",
      colorScheme: "element", 
      quality: "low"
    });
    
    stageRef.current.handleResize();
    stageRef.current.autoView();
    
    setTimeout(() => {
      if (stageRef.current) { stageRef.current.handleResize(); stageRef.current.autoView(); }
    }, 60);

    setIsLoading(false);
    if (isSpinningRef.current) stageRef.current.setSpin([0, 1, 0], 0.005);
  }, [renderStyle]);

  const loadStructure = useCallback(async () => {
    if (!stageRef.current) return;
    setIsLoading(true);
    try {
      if (distanceRepRef.current) distanceRepRef.current = null;
      stageRef.current.removeAllComponents();
      setSelectedAtoms([]);
      setCalculatedDistance(null);
      setDistanceInterpretation('');
      setRealWorldAnalogy('');
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
          if (!checkText || checkText.trim() === "" || checkText.includes("Status: Status_NoData") || checkText.includes("Fault")) {
            throw new Error("No 3D asset hosted");
          }
          const blob = new Blob([checkText], { type: 'text/plain' });
          stageRef.current.loadFile(blob, { ext: "sdf" }).then((component) => renderComponent(component));
        } catch (fallbackError) {
          const twoDUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${targetCid}/record/SDF/?record_type=2d`;
          stageRef.current.loadFile(twoDUrl, { ext: "sdf" })
            .then((component) => renderComponent(component))
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
      stageRef.current = new NGL.Stage(element, { backgroundColor: '#0a0d12', sampleLevel: 0, impostor: false });
      stageRef.current.setParameters({ lightIntensity: 1.0, ambientIntensity: 0.6, clipNear: 0, clipFar: 100 });
      stageRef.current.handleResize();

      stageRef.current.signals.clicked.add((pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {
          const atom = pickingProxy.atom;
          setSelectedAtoms((prev) => {
            const updated = [...prev, atom];
            if (updated.length > 2) return [updated[1], updated[2]];
            return updated;
          });
        }
      });

      stageRef.current.signals.hovered.add((pickingProxy) => {
        if (pickingProxy && pickingProxy.atom) {
          const atom = pickingProxy.atom;
          setHoveredAtom({ element: atom.element, index: atom.index, x: atom.x.toFixed(2), y: atom.y.toFixed(2), z: atom.z.toFixed(2) });
        } else {
          setHoveredAtom(null);
        }
      });
      
      setTimeout(() => { loadStructure(); }, 50);
    }
  };

  // Distance Calculation Engine
  useEffect(() => {
    if (distanceRepRef.current && componentRef.current) {
      try { componentRef.current.removeRepresentation(distanceRepRef.current); distanceRepRef.current = null; } catch (e) {}
    }

    if (selectedAtoms.length === 2) {
      const a1 = selectedAtoms[0];
      const a2 = selectedAtoms[1];
      const dx = a1.x - a2.x, dy = a1.y - a2.y, dz = a1.z - a2.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      setCalculatedDistance(dist.toFixed(3));
      
      if (dist < 1.3) {
        setDistanceInterpretation(`⚡ Highly Strained Covalent Node (${a1.element}—${a2.element})`);
        setRealWorldAnalogy(`This distance is roughly 1/500,000th the width of a single grain of fine beach sand.`);
      } else if (dist >= 1.3 && dist <= 1.6) {
        setDistanceInterpretation(`🤝 Standard Stable Covalent Bond (${a1.element}—${a2.element})`);
        setRealWorldAnalogy(`This is the fundamental structural distance that holds the DNA double-helix and organic life together! It is over a million times smaller than a single red blood cell.`);
      } else if (dist > 1.6 && dist <= 2.5) {
        setDistanceInterpretation(`💫 Steric Contact / Van der Waals Closeness`);
        setRealWorldAnalogy(`At this scale, the electronic clouds of the atoms are actively pressing against each other without making a formal chemical bond link.`);
      } else if (dist > 2.5 && dist <= 3.5) {
        setDistanceInterpretation(`💧 Hydrogen Bonding / Electrostatic Bridge`);
        setRealWorldAnalogy(`This is the precise attraction distance that allows water molecules to stick to one another, driving surface tension and cell fluidity.`);
      } else {
        setDistanceInterpretation(`🌌 Wide Trans-Spatial Gap Horizon`);
        setRealWorldAnalogy(`This separation space matches the ultra-short quantum wavelengths of hard X-ray beams used to image crystal lattices.`);
      }

      if (componentRef.current) {
        distanceRepRef.current = componentRef.current.addRepresentation("distance", {
          atomPair: [[ a1.index, a2.index ]],
          labelColor: "#00ffcc", labelSize: 2.2, labelFont: "sans-serif", labelVisible: true, lineColor: "#ff2a6d", lineWidth: 4.0
        });
      }
    } else {
      setCalculatedDistance(null);
      setDistanceInterpretation('');
      setRealWorldAnalogy('');
    }
  }, [selectedAtoms]);

  useEffect(() => { loadStructure(); }, [loadStructure]);

  useEffect(() => {
    if (!stageRef.current) return;
    if (isSpinning) stageRef.current.setSpin([0, 1, 0], 0.005);
    else stageRef.current.setSpin(null);
  }, [isSpinning]);

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      const name = searchQuery.trim();
      setDynamicDetails(null);
      setSelectedMol(name.charAt(0).toUpperCase() + name.slice(1));
      try {
        const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight/JSON`);
        const data = await res.json();
        if (data.PropertyTable?.Properties[0]) {
          const prop = data.PropertyTable.Properties[0];
          setDynamicDetails({
            category: 'Live PubChem Sync', sub: 'API Instantiated Asset', formula: prop.MolecularFormula, weight: `${prop.MolecularWeight} g/mol`, type: 'Organic Compound', source: 'PubChem Global Registry', description: `Successfully mapped structure vectors for ${name} over live cloud records.`, useCases: [{ area: 'Bio-Somatic Chemistry', detail: 'Dynamic profile cataloged for downstream analysis.' }]
          });
        }
      } catch (err) {}
    }
  };

  const triggerCamera = (action) => {
    if (!stageRef.current) return;
    if (action === 'in') stageRef.current.viewerControls.zoom(0.15);
    if (action === 'out') stageRef.current.viewerControls.zoom(-0.15);
    if (action === 'reset') { stageRef.current.autoView(); stageRef.current.handleResize(); }
  };

  const filteredMolecules = Object.keys(MOLECULE_DATABASE).filter(name => {
    if (activeTab === 'All') return true;
    return MOLECULE_DATABASE[name].category === activeTab;
  });

  return (
    <div style={styles.appContainer}>
      
      {/* 50% Top Section: WebGL Molecular Canvas Layout */}
      <section style={styles.canvasContainer}>
        <div style={styles.canvasMetaBlock}>
          <span style={styles.categoryBadge}> {currentDetails.category.toUpperCase()} </span>
          <h2 style={styles.mainTitle}>{selectedMol.toUpperCase()}</h2>
          <p style={styles.subTitle}>{currentDetails.sub}</p>
        </div>

        {hoveredAtom && (
          <div style={styles.hoverTooltip}>
            <strong>ATOM: {hoveredAtom.element}</strong> (Idx: {hoveredAtom.index})<br/>
            <span style={{fontFamily:'monospace', color:'#00ff96'}}>X:{hoveredAtom.x} Y:{hoveredAtom.y} Z:{hoveredAtom.z}</span>
          </div>
        )}

        {isLoading && <div style={styles.loader}><div style={styles.spinner}></div></div>}
        
        <div ref={initCanvasRef} style={styles.canvasViewport}></div>

        {/* Floating Viewport Actions Docks */}
        <div style={styles.floatingControlsDock}>
          <div style={styles.toggleGroup}>
            <button onClick={() => setRenderStyle('ball+stick')} style={renderStyle === 'ball+stick' ? styles.activeToggle : styles.inactiveToggle}>B&S</button>
            <button onClick={() => setRenderStyle('spacefill')} style={renderStyle === 'spacefill' ? styles.activeToggle : styles.inactiveToggle}>SF</button>
          </div>
          <button onClick={() => triggerCamera('in')} style={styles.actionBtn}>＋</button>
          <button onClick={() => triggerCamera('out')} style={styles.actionBtn}>－</button>
          <button onClick={() => triggerCamera('reset')} style={styles.actionBtn}>🪐</button>
          <button onClick={() => setIsSpinning(!isSpinning)} style={{...styles.actionBtn, background: isSpinning ? '#ff0055' : 'rgba(255,255,255,0.05)', color: '#fff', width: '45px', fontWeight: 'bold'}}>
            {isSpinning ? 'STOP' : 'SPIN'}
          </button>
        </div>
      </section>

      {/* 50% Bottom Section: Features & Controls */}
      <section style={styles.controlDashboard}>
        
        {/* Dynamic Measurement Multi-Tool Card */}
        <div style={styles.featureCard}>
          <div style={styles.sectionHeading}>📐 REAL-TIME DISTANCE MULTI-TOOL</div>
          {calculatedDistance ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <div style={styles.distanceDisplayRow}>
                <div>
                  <div style={styles.distanceVal}>{calculatedDistance} <span style={{fontSize: '12px', color: '#58a6ff'}}>Å</span></div>
                  <div style={styles.distanceInterpretationText}>{distanceInterpretation}</div>
                </div>
                <button onClick={() => setSelectedAtoms([])} style={styles.clearBtn}>RESET</button>
              </div>
              
              {/* Real World Analogy Intuitive Box */}
              <div style={styles.realWorldBox}>
                <div style={styles.realWorldTitle}>🌍 REAL WORLD COMPARISON</div>
                <p style={styles.realWorldText}>{realWorldAnalogy}</p>
              </div>
            </div>
          ) : (
            <div style={styles.placeholderText}>Tap any 2 atoms inside the canvas above to compute exact structural distance vector and load analogies...</div>
          )}
        </div>

        {/* Integrated PubChem Cloud Search Engine */}
        <div style={{padding: '0 2px'}}>
          <input 
            type="text" 
            placeholder="🔍 Search PubChem Index (e.g. Aspirin, Nicotine)..." 
            style={styles.searchBarInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        {/* Category Sorting Navigation Ribbon */}
        <div style={styles.filterRibbon}>
          {['All', 'Neurochemistry', 'Complex Bio-agents', 'Chemical Solvents', 'Nanotech'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.activeTabPill : styles.inactiveTabPill}>
              {tab.replace('Neurochemistry', 'Neuro').replace('Complex Bio-agents', 'Bio-agents').replace('Chemical Solvents', 'Solvents')}
            </button>
          ))}
        </div>

        {/* Database List Cards */}
        <div style={styles.horizontalCardScroller}>
          {filteredMolecules.map(name => (
            <div key={name} onClick={() => { setDynamicDetails(null); setSelectedMol(name); }} style={selectedMol === name && !dynamicDetails ? styles.activeCard : styles.inactiveCard}>
              <div style={styles.cardTitle}>{name}</div>
              <div style={styles.cardFormula}>{MOLECULE_DATABASE[name]?.formula || 'Live Array'}</div>
            </div>
          ))}
        </div>

        {/* Analytics Property Tables */}
        <div style={styles.featureCard}>
          <div style={styles.sectionHeading}>📝 LATTICE PROPERTY MATRIX</div>
          <table style={styles.dataTable}>
            <tbody>
              <tr><td style={styles.tableLabel}>Molecular Formula</td><td style={{...styles.tableVal, color: '#00fff5'}}>{currentDetails.formula}</td></tr>
              <tr><td style={styles.tableLabel}>Molecular Weight / Mass</td><td style={styles.tableVal}>{currentDetails.weight}</td></tr>
              <tr><td style={styles.tableLabel}>Matrix Core System</td><td style={styles.tableVal}>{currentDetails.type || 'Custom Asset'}</td></tr>
              <tr><td style={styles.tableLabel}>Primary Origin Source</td><td style={styles.tableVal}>{currentDetails.source || 'Cloud Synthesis'}</td></tr>
            </tbody>
          </table>
          
          <div style={{marginTop: '10px', borderTop: '1px solid #1f242c', paddingTop: '8px'}}>
            <div style={{fontSize: '9px', fontWeight: 'bold', color: '#8b949e', textTransform: 'uppercase'}}>Structural Breakdown</div>
            <p style={styles.descriptionText}>{currentDetails.description}</p>
          </div>
        </div>

        {/* Operational Use Cases */}
        <div style={styles.featureCard}>
          <div style={styles.sectionHeading}>🚀 APPLICATION / FUNCTIONAL USE-CASES</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px'}}>
            {currentDetails.useCases.map((uc, i) => (
              <div key={i} style={styles.useCaseItem}>
                <div style={styles.useCaseArea}>{uc.area}</div>
                <div style={styles.useCaseDetail}>{uc.detail}</div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

// Seamless Mobile Ergonomic Theme Stylesheet
/* eslint-disable no-dupe-keys */
const styles = {
  appContainer: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#07090e', color: '#c9d1d9', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', overflow: 'hidden' },
  
  // Upper Layout Setup
  canvasContainer: { height: '48%', position: 'relative', background: '#0a0d12', borderBottom: '1px solid #1f242c' },
  canvasViewport: { width: '100%', height: '100%' },
  canvasMetaBlock: { position: 'absolute', top: '12px', left: '12px', zIndex: 10, pointerEvents: 'none' },
  categoryBadge: { fontSize: '7.5px', fontWeight: 'bold', background: 'rgba(0,255,245,0.08)', color: '#00fff5', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.3px' },
  mainTitle: { margin: '4px 0 0 0', fontSize: '18px', fontWeight: '900', color: '#fff', letterSpacing: '0.2px' },
  subTitle: { margin: 0, fontSize: '9px', color: '#8b949e', marginTop: '1px' },
  hoverTooltip: { position: 'absolute', bottom: '55px', left: '12px', zIndex: 15, background: 'rgba(7, 9, 14, 0.92)', border: '1px solid #00fff5', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' },
  loader: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 },
  spinner: { width: '18px', height: '18px', border: '2px solid rgba(0,255,245,0.1)', borderTop: '2px solid #00fff5', borderRadius: '50%' },

  // Control Docks
  floatingControlsDock: { position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', zIndex: 12, display: 'flex', gap: '5px', background: 'rgba(13, 17, 23, 0.85)', backdropFilter: 'blur(10px)', padding: '4px 6px', borderRadius: '8px', border: '1px solid #21262d' },
  toggleGroup: { display: 'flex', background: '#07090e', padding: '1px', borderRadius: '5px', border: '1px solid #21262d' },
  activeToggle: { border: 'none', background: '#21262d', color: '#00fff5', fontSize: '9px', fontWeight: 'bold', padding: '0 8px', borderRadius: '4px', height: '22px' },
  inactiveToggle: { border: 'none', background: 'transparent', color: '#8b949e', fontSize: '9px', padding: '0 8px', height: '22px' },
  actionBtn: { width: '22px', height: '22px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#c9d1d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' },

  // Lower Layout Setup
  controlDashboard: { height: '52%', overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#07090e', boxSizing: 'border-box' },
  featureCard: { background: '#0d1117', border: '1px solid #1f242c', borderRadius: '8px', padding: '10px' },
  sectionHeading: { fontSize: '8.5px', fontWeight: '800', color: '#00fff5', letterSpacing: '0.6px', marginBottom: '6px' },
  placeholderText: { fontSize: '10px', color: '#556275', fontStyle: 'italic', lineHeight: '1.4' },
  
  // Distance Controls layout
  distanceDisplayRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  distanceVal: { fontSize: '22px', fontWeight: '900', color: '#00ff96', lineHeight: '1' },
  distanceInterpretationText: { fontSize: '10px', color: '#acbac7', marginTop: '3px' },
  clearBtn: { background: 'rgba(255,0,85,0.08)', border: '1px solid #ff0055', color: '#ff0055', fontSize: '9px', fontWeight: 'bold', padding: '5px 12px', borderRadius: '5px' },

  // Real World Analogies Box UI Styling
  realWorldBox: { marginTop: '8px', padding: '8px', background: '#07090e', borderRadius: '6px', borderLeft: '3px solid #ff2a6d' },
  realWorldTitle: { fontSize: '8px', fontWeight: 'bold', color: '#ff2a6d', letterSpacing: '0.5px', marginBottom: '2px' },
  realWorldText: { margin: 0, fontSize: '10.5px', color: '#acbac7', lineHeight: '1.4' },

  // Search Input
  searchBarInput: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #21262d', background: '#0d1117', fontSize: '12px', color: '#fff', boxSizing: 'border-box', outline: 'none' },

  // Carousel Systems
  filterRibbon: { display: 'flex', gap: '6px', overflowX: 'auto', width: '100%', paddingBottom: '2px', WebkitOverflowScrolling: 'touch' },
  inactiveTabPill: { border: 'none', background: '#0d1117', color: '#8b949e', padding: '6px 12px', borderRadius: '16px', fontSize: '10.5px', whiteSpace: 'nowrap' },
  activeTabPill: { border: 'none', background: 'rgba(0,255,245,0.08)', border: '1px solid #00fff5', color: '#00fff5', padding: '5px 12px', borderRadius: '16px', fontSize: '10.5px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  horizontalCardScroller: { display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' },
  inactiveCard: { minWidth: '100px', maxWidth: '100px', background: '#0d1117', border: '1px solid #1f242c', borderRadius: '8px', padding: '8px 10px', boxSizing: 'border-box' },
  activeCard: { minWidth: '100px', maxWidth: '100px', background: '#161b22', border: '1px solid #00fff5', color: '#00fff5', borderRadius: '8px', padding: '8px 10px', boxSizing: 'border-box' },
  cardTitle: { fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardFormula: { fontSize: '9px', color: '#6e7681', marginTop: '2px' },

  // Specification Tables
  dataTable: { width: '100%', borderCollapse: 'collapse' },
  tableLabel: { padding: '4px 0', fontSize: '10.5px', color: '#8b949e', borderBottom: '1px solid #1f242c' },
  tableVal: { padding: '4px 0', fontSize: '10.5px', color: '#f0f6fc', fontWeight: '600', textAlign: 'right', borderBottom: '1px solid #1f242c' },
  descriptionText: { margin: '4px 0 0 0', fontSize: '10.5px', color: '#acbac7', lineHeight: '1.4' },

  // Use Case Cards
  useCaseItem: { background: '#07090e', borderLeft: '2.5px solid #00fff5', padding: '6px 8px', borderRadius: '0 4px 4px 0' },
  useCaseArea: { fontSize: '8.5px', fontWeight: 'bold', color: '#58a6ff', textTransform: 'uppercase' },
  useCaseDetail: { fontSize: '10px', color: '#c9d1d9', marginTop: '2px', lineHeight: '1.3' }
};
/* eslint-enable no-dupe-keys */

export default App;