import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as NGL from 'ngl';

// Premium Visual Molecular Database with dedicated Application/Use-Case datasets
const MOLECULE_DATABASE = {
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
      { area: 'Therapeutics', detail: 'Co-analgesic compound combined with paracetamol or aspirin to accelerate headache relief.' },
      { area: 'Global Trade', detail: 'Key economic driver in global beverage agriculture and pre-workout supplement formulations.' }
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
      { area: 'Neurology Research', detail: 'Core marker in researching Parkinson\'s disease treatments and reward-deficiency syndromes.' },
      { area: 'Psychiatry', detail: 'Target pathway for designing modern atypical antipsychotics and ADHD stimulant medications.' }
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
      { area: 'Antidepressants', detail: 'Primary mechanism target for SSRIs (e.g., Fluoxetine) to alleviate major depressive disorders.' },
      { area: 'Gastrointestinal', detail: 'Regulates local gut motility and peristaltic reflex systems within the enteric nervous system.' },
      { area: 'Sleep Science', detail: 'Serves as the direct metabolic biochemical precursor required for melatonin biosynthesis.' }
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
    description: 'An foundational analgesic used globally to reduce inflammation, mitigate acute somatic pain, and break systemic fever responses.',
    useCases: [
      { area: 'Cardiology', detail: 'Administered in low daily doses as an antiplatelet agent to prevent secondary myocardial infarctions.' },
      { area: 'Pain Management', detail: 'Commonly deployed to disrupt COX-1 and COX-2 enzyme pathways, turning off local swelling triggers.' },
      { area: 'First-Aid Protocols', detail: 'Standard frontline emergency protocol compound chewed during acute coronary event onset.' }
    ]
  },
  Penicillin: { 
    category: 'Complex Bio-agents', 
    sub: 'Beta-Lactam Antibiotic Core', 
    formula: 'C16H18N2O4S', 
    weight: '334.40 g/mol', 
    type: 'Thiazolidine-Azetidinone Core', 
    source: 'Penicillium Chrysogenum Fungi', 
    cid: '5904', 
    description: 'Historically revolutionary antibiotic framework featuring a highly strained four-membered beta-lactam ring that permanently deactivates bacterial transpeptidase walls.',
    useCases: [
      { area: 'Infection Control', detail: 'Frontline intervention strategy targeting Gram-positive bacterial pathogens like Streptococcus.' },
      { area: 'Biomedical History', detail: 'The foundation of modern industrial mass-production pipelines for deep strain fermentation biotechnology.' },
      { area: 'Veterinary Care', detail: 'Utilized across agriculture to protect livestock populations from pathogenic cellular collapse.' }
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
      { area: 'Topical Analgesics', detail: 'Formulated into skin creams to deplete local Substance P reserves, mitigating arthritis pain.' },
      { area: 'Defense Industry', detail: 'The active lacrimator chemical component packed inside tactical pepper sprays for riot control.' },
      { area: 'Pest Management', detail: 'Eco-friendly deterrent additive mixed into agricultural grain reserves to ward off invasive mammals.' }
    ]
  },
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
      { area: 'Food Tech', detail: 'Primary crystallization stabilizer and sweetener agent utilized across modern commercial baking operations.' },
      { area: 'Industrial Biofuels', detail: 'The foundational carbohydrate substrate fermented to produce scalable bio-ethanol fuel cells.' }
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
      { area: 'Automotive Fuel', detail: 'Blended with traditional gasoline feedstock (E10/E85) to increase total octane combustion efficiency.' },
      { area: 'Chemical Synthesis', detail: 'Acts as a critical primary manufacturing intermediate block for building esters, halides, and plastics.' }
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
      { area: 'Cosmetic Labs', detail: 'The active primary base solvent formula needed for dissolving cosmetic acrylics and nail lacquers.' },
      { area: 'Textile Manufacturing', detail: 'Employed to spin synthetic acetate fibers and thin down raw industrial nitrocellulose mixtures.' }
    ]
  },
  Nanotube: { 
    category: 'Nanotech', 
    sub: 'Cylindrical Carbon Fullerene Structure', 
    formula: 'C_n (Allotrope)', 
    weight: 'Variable Scale', 
    type: 'Carbon Allotrope Lattice', 
    source: 'Arc Discharge / CVD Synthesis', 
    cid: '15530722', 
    description: 'A cylindrical carbon lattice demonstrating extraordinary tensile strengths, high electrical conductivity, and specialized thermal transport architectures.',
    useCases: [
      { area: 'Material Science', detail: 'Woven into structural carbon sheets to create lightweight hulls for aerospace and racing vehicle frames.' },
      { area: 'Energy Storage', detail: 'Integrated into lithium-ion battery anode meshes to significantly raise current capacity cycles.' },
      { area: 'Micro-electronics', detail: 'Developed as alternative field-effect transistors to bypass quantum scale thresholds in silicon.' }
    ]
  },
  Buckminsterfullerene: { 
    category: 'Nanotech', 
    sub: 'Truncated Icosahedron Cage (Buckyball)', 
    formula: 'C60', 
    weight: '720.64 g/mol', 
    type: 'Closed Cage Pure Carbon', 
    source: 'Laser Ablation of Graphite', 
    cid: '123591', 
    description: 'A pure carbon spherical configuration shaped like a soccer ball composed of 20 hexagons and 12 pentagons, displaying supreme structural structural symmetries.',
    useCases: [
      { area: 'Drug Delivery', detail: 'Engineered as a molecular structural hollow cage to safely guide therapeutic chemicals past cell boundaries.' },
      { area: 'Optics Technology', detail: 'Utilized in high-powered defensive laser protective optics due to non-linear light absorption indexes.' },
      { area: 'Superconductors', detail: 'Doped with alkali earth metals to generate structural lattices exhibiting zero electrical resistance states.' }
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

  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [distanceInterpretation, setDistanceInterpretation] = useState('');

  const stageRef = useRef(null);
  const componentRef = useRef(null);
  const distanceRepRef = useRef(null);

  const isSpinningRef = useRef(isSpinning);
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (stageRef.current) {
        stageRef.current.handleResize();
      }
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const currentDetails = dynamicDetails || MOLECULE_DATABASE[selectedMol] || {
    category: 'Live Registry',
    sub: 'Analyzed Custom Compound',
    formula: 'Processing...',
    weight: 'Dynamic Calculations',
    type: 'External Structure Matrix',
    source: 'PubChem Live Registry',
    description: 'Structure successfully resolved from global cloud molecular schemas.',
    useCases: [
      { area: 'Dynamic Analysis', detail: 'Usecase vectors are currently mapping from real-time asset property fields.' }
    ]
  };

  const renderComponent = useCallback((component) => {
    componentRef.current = component;
    component.addRepresentation(renderStyle, { 
      radiusScale: renderStyle === 'spacefill' ? 0.8 : 1.3, 
      aspectRatio: 1.5,
      multipleBond: "symmetric",
      colorScheme: "element", 
      quality: "low" // Optimized universally for mobile computing limits
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
      stageRef.current.setSpin([0, 1, 0], 0.005);
    }
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
      stageRef.current = new NGL.Stage(element, { 
        backgroundColor: '#0a0d12', 
        sampleLevel: 0, 
        impostor: false 
      });
      
      stageRef.current.setParameters({
        lightColor: '#ffffff',
        lightIntensity: 1.0,
        ambientColor: '#2b3442',
        ambientIntensity: 0.6,
        clipNear: 0,
        clipFar: 100
      });

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
          setHoveredAtom({
            element: atom.element,
            index: atom.index,
            x: atom.x.toFixed(2),
            y: atom.y.toFixed(2),
            z: atom.z.toFixed(2)
          });
        } else {
          setHoveredAtom(null);
        }
      });
      
      setTimeout(() => {
        loadStructure();
      }, 50);
    }
  };

  useEffect(() => {
    if (distanceRepRef.current && componentRef.current) {
      try {
        componentRef.current.removeRepresentation(distanceRepRef.current);
        distanceRepRef.current = null;
      } catch (err) {
        console.warn("NGL Layer reference refresh bypass.");
      }
    }

    if (selectedAtoms.length === 2) {
      const a1 = selectedAtoms[0];
      const a2 = selectedAtoms[1];
      
      const dx = a1.x - a2.x;
      const dy = a1.y - a2.y;
      const dz = a1.z - a2.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      setCalculatedDistance(dist.toFixed(3));

      const numDist = parseFloat(dist);
      let interpretation = "";

      if (numDist >= 1.0 && numDist <= 1.6) {
        interpretation = "👉 Covalent Bond";
      } else if (numDist > 1.6 && numDist <= 2.5) {
        interpretation = "👉 Steric Repulsion Zone";
      } else if (numDist > 2.5 && numDist <= 3.5) {
        interpretation = "👉 Hydrogen Bonding Interaction";
      } else {
        interpretation = "👉 Spatial Span Width";
      }
      setDistanceInterpretation(interpretation);

      if (componentRef.current) {
        const targetPair = [[ a1.index, a2.index ]];

        const newRep = componentRef.current.addRepresentation("distance", {
          atomPair: targetPair,
          labelColor: "#00ffcc",   
          labelSize: 2.0,
          labelFont: "sans-serif",
          labelVisible: true,
          lineColor: "#ff2a6d",    
          lineWidth: 3.0,
          name: "distance-layer"   
        });
        
        distanceRepRef.current = newRep;
      }
    } else {
      setCalculatedDistance(null);
      setDistanceInterpretation('');
    }
  }, [selectedAtoms]);

  useEffect(() => {
    loadStructure();
  }, [loadStructure]);

  useEffect(() => {
    if (!stageRef.current) return;
    if (isSpinning) {
      stageRef.current.setSpin([0, 1, 0], 0.005);
    } else {
      stageRef.current.setSpin(null);
    }
  }, [isSpinning]);

  const fetchPubChemData = async (name) => {
    try {
      const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight/JSON`);
      const data = await res.json();
      if (data.PropertyTable?.Properties[0]) {
        const prop = data.PropertyTable.Properties[0];
        setDynamicDetails({
          category: 'Live API Lookup',
          sub: 'Queried Spatial Asset',
          formula: prop.MolecularFormula,
          weight: `${prop.MolecularWeight} g/mol`,
          type: 'Organic Compound Matrix',
          source: 'PubChem Global Registry',
          description: `Successfully instantiated ${name} from chemical cloud indexes. Structural configuration metrics are calculated down to spatial vector schemas.`,
          useCases: [
            { area: 'Chemical Formulation', detail: 'Utilized across active scientific academic models for evaluating component valence distributions.' },
            { area: 'Live Analytics', detail: 'Referenced in industrial registration tracking databases under current index listings.' }
          ]
        });
      }
    } catch (e) {
      setDynamicDetails(null);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      const formattedName = searchQuery.trim();
      setDynamicDetails(null);
      setSelectedMol(formattedName.charAt(0).toUpperCase() + formattedName.slice(1));
      fetchPubChemData(formattedName);
    }
  };

  const triggerCameraAction = (action) => {
    if (!stageRef.current) return;
    if (action === 'zoomIn') stageRef.current.viewerControls.zoom(0.15);
    if (action === 'zoomOut') stageRef.current.viewerControls.zoom(-0.15);
    if (action === 'reset') {
      stageRef.current.autoView();
      stageRef.current.handleResize();
    }
    if (action === 'spin') setIsSpinning(!isSpinning);
  };

  const filteredMolecules = Object.keys(MOLECULE_DATABASE).filter(name => {
    if (activeTab === 'All') return true;
    return MOLECULE_DATABASE[name].category === activeTab;
  });

  return (
    <div style={styles.appContainer}>
      <header style={styles.topHeader}>
        <div style={styles.brandGroup}>
          <div style={styles.logoBadge}>⚛️</div>
          <div>
            <h1 style={styles.appTitle}>Chemistry Architecture Studio</h1>
            <p style={styles.appSubtitle}>High-Fidelity Bio-Spatial Analytics</p>
          </div>
        </div>
      </header>

      {/* Forced Row Workspace for Desktop Layout Aspect */}
      <div style={styles.workspace}>
        {/* Left Sidebar - Extremely Compact */}
        <aside style={styles.leftSidebar}>
          <input 
            type="text" 
            placeholder="Search..." 
            style={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          
          <div style={styles.tabGroup}>
            {['All', 'Neuro', 'Bio-agents', 'Solvents', 'Nanotech'].map(tab => {
              const fullCategoryMap = { 'Neuro': 'Neurochemistry', 'Bio-agents': 'Complex Bio-agents', 'Solvents': 'Chemical Solvents' };
              const analyticalTarget = fullCategoryMap[tab] || tab;
              return (
                <button key={tab} onClick={() => setActiveTab(analyticalTarget)} style={activeTab === analyticalTarget ? styles.activeTab : styles.inactiveTab}>
                  {tab}
                </button>
              );
            })}
          </div>

          <div style={styles.itemScrollList}>
            {filteredMolecules.map(name => (
              <div key={name} onClick={() => { setDynamicDetails(null); setSelectedMol(name); }} style={selectedMol === name && !dynamicDetails ? styles.activeCard : styles.inactiveCard}>
                <div style={styles.cardTitle}>{name}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main WebGL Viewport Wrapper */}
        <main style={styles.viewportWrapper}>
          <div style={styles.canvasMetaBlock}>
            <span style={styles.categoryTag}>{currentDetails.category.toUpperCase()}</span>
            <h2 style={styles.mainCanvasTitle}>{selectedMol.toUpperCase()}</h2>
          </div>

          {hoveredAtom && (
            <div style={styles.hoverTooltip}>
              <div style={{color: '#00fff5', fontWeight: 'bold'}}>NODE: {hoveredAtom.element}</div>
              <div style={styles.coordinatesRow}>X: {hoveredAtom.x} | Y: {hoveredAtom.y}</div>
            </div>
          )}

          {isLoading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>
            </div>
          )}

          <div ref={initCanvasRef} style={styles.canvasTarget}></div>

          <div style={styles.floatingControlsDock}>
            <div style={styles.renderToggleGroup}>
              <button onClick={() => setRenderStyle('ball+stick')} style={renderStyle === 'ball+stick' ? styles.activeToggleBtn : styles.inactiveToggleBtn}>B&S</button>
              <button onClick={() => setRenderStyle('spacefill')} style={renderStyle === 'spacefill' ? styles.activeToggleBtn : styles.inactiveToggleBtn}>SF</button>
            </div>
            <button onClick={() => triggerCameraAction('reset')} style={styles.dockBtn}>🪐</button>
            <button onClick={() => triggerCameraAction('spin')} style={{...styles.dockBtn, background: isSpinning ? '#ff0055' : 'rgba(255,255,255,0.04)', fontSize: '9px', fontWeight: 'bold', width: '40px'}}>
              {isSpinning ? 'STOP' : 'SPIN'}
            </button>
          </div>
        </main>

        {/* Right Sidebar - Dynamic Analytical Metric Console */}
        <aside style={styles.rightSidebar}>
          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Metrics Array</div>
            <div style={styles.metricResultContainer}>
              {calculatedDistance ? (
                <div>
                  <div style={styles.metricValue}>{calculatedDistance} <span style={{fontSize: '12px', color: '#58a6ff'}}>Å</span></div>
                  <div style={{fontSize:'9px', color: '#acbac7', marginTop:'4px'}}>{distanceInterpretation}</div>
                  <button onClick={() => setSelectedAtoms([])} style={styles.clearBtn}>RESET</button>
                </div>
              ) : (
                <div style={styles.placeholderText}>Tap atoms to calculate...</div>
              )}
            </div>
          </div>

          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Specifications</div>
            <table style={styles.detailsTable}>
              <tbody>
                <tr><td style={styles.tdLabel}>Formula</td><td style={{...styles.tdValue, color: '#00fff5'}}>{currentDetails.formula}</td></tr>
                <tr><td style={styles.tdLabel}>Mass</td><td style={styles.tdValue}>{currentDetails.weight}</td></tr>
              </tbody>
            </table>
          </div>

          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Application Target</div>
            <div style={styles.useCaseContainer}>
              {currentDetails.useCases ? (
                <div style={styles.useCaseCard}>
                  <div style={styles.useCaseLabel}>{currentDetails.useCases[0].area}</div>
                  <div style={styles.useCaseBody}>{currentDetails.useCases[0].detail}</div>
                </div>
              ) : (
                <div style={styles.placeholderText}>Parsing asset function...</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Desktop-in-Mobile Structural Stylesheet Configuration
const styles = {
  appContainer: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#07090e', color: '#c9d1d9', fontFamily: '"Segoe UI", Roboto, sans-serif', overflow: 'hidden' },
  topHeader: { height: '45px', background: '#0d1117', borderBottom: '1px solid #1f242c', display: 'flex', alignItems: 'center', padding: '0 12px' },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoBadge: { fontSize: '14px', background: '#111827', padding: '2px 4px', borderRadius: '4px', border: '1px solid #2d3748' },
  appTitle: { margin: 0, fontSize: '11px', fontWeight: '700', color: '#f0f6fc', letterSpacing: '0.5px', textTransform: 'uppercase' },
  appSubtitle: { margin: 0, fontSize: '8px', color: '#6e7681' },
  workspace: { flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', width: '100vw' },
  
  // Left Sidebar Adjustments
  leftSidebar: { width: '115px', background: '#0b0e14', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #1f242c' },
  sidebarLabel: { fontSize: '8px', fontWeight: '800', color: '#00fff5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' },
  searchBar: { width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #21262d', background: '#07090e', fontSize: '10px', color: '#f0f6fc', boxSizing: 'border-box', outline: 'none' },
  tabGroup: { display: 'flex', flexDirection: 'column', background: '#07090e', padding: '2px', borderRadius: '4px', gap: '2px', border: '1px solid #1f242c' },
  activeTab: { border: 'none', background: '#161b22', padding: '4px 6px', borderRadius: '3px', fontSize: '8px', fontWeight: 'bold', color: '#00fff5', textLeft: 'left', textAlign: 'left' },
  inactiveTab: { border: 'none', background: 'transparent', padding: '4px 6px', fontSize: '8px', color: '#8b949e', textAlign: 'left' },
  itemScrollList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' },
  inactiveCard: { padding: '6px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.01)', border: '1px solid transparent' },
  activeCard: { padding: '6px 8px', borderRadius: '4px', background: '#161b22', border: '1px solid #00fff5' },
  cardTitle: { fontSize: '10px', fontWeight: '600', color: '#f0f6fc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  
  // Viewport Container Adjustments
  viewportWrapper: { flex: 1, position: 'relative', backgroundColor: '#07090e', minWidth: 0 },
  canvasMetaBlock: { position: 'absolute', top: '10px', left: '10px', zIndex: 10, pointerEvents: 'none' },
  categoryTag: { fontSize: '7px', fontWeight: 'bold', background: 'rgba(0,255,245,0.08)', color: '#00fff5', border: '1px solid rgba(0,255,245,0.2)', padding: '1px 4px', borderRadius: '2px' },
  mainCanvasTitle: { margin: '2px 0 0 0', fontSize: '14px', fontWeight: '900', color: '#f0f6fc' },
  canvasTarget: { width: '100%', height: '100%', backgroundColor: '#0a0d12' },
  hoverTooltip: { position: 'absolute', bottom: '50px', left: '10px', zIndex: 15, background: 'rgba(7, 9, 14, 0.9)', border: '1px solid #00fff5', padding: '6px 10px', borderRadius: '6px', fontSize: '9px' },
  coordinatesRow: { fontSize: '8px', fontFamily: 'monospace', color: '#00ff96', marginTop: '2px' },
  loadingBox: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 },
  spinner: { width: '16px', height: '16px', border: '2px solid rgba(0,255,245,0.1)', borderTop: '2px solid #00fff5', borderRadius: '50%' },
  
  // Controls Bar
  floatingControlsDock: { position: 'absolute', zIndex: 10, display: 'flex', gap: '4px', background: 'rgba(13, 17, 23, 0.85)', padding: '4px 6px', borderRadius: '8px', border: '1px solid #21262d', bottom: '10px', left: '50%', transform: 'translateX(-50%)' },
  renderToggleGroup: { display: 'flex', background: '#07090e', padding: '1px', borderRadius: '4px', border: '1px solid #21262d' },
  activeToggleBtn: { border: 'none', background: '#1f242c', color: '#00fff5', fontSize: '8px', fontWeight: 'bold', padding: '0 6px', borderRadius: '3px', height: '20px' },
  inactiveToggleBtn: { border: 'none', background: 'transparent', color: '#8b949e', fontSize: '8px', padding: '0 6px', height: '20px' },
  dockBtn: { width: '20px', height: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.03)', color: '#c9d1d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' },
  
  // Right Sidebar Adjustments
  rightSidebar: { width: '115px', background: '#0b0e14', padding: '8px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '1px solid #1f242c' },
  propertyWidget: { display: 'flex', flexDirection: 'column' },
  metricResultContainer: { border: '1px dashed #2d3748', borderRadius: '6px', padding: '6px', marginTop: '4px', textAlign: 'center', background: '#07090e' },
  metricValue: { fontSize: '14px', fontWeight: '800', color: '#00ff96' },
  placeholderText: { fontSize: '8px', color: '#556275', fontStyle: 'italic' },
  clearBtn: { marginTop: '4px', width: '100%', padding: '2px', background: 'rgba(255,0,85,0.06)', border: '1px solid #ff0055', color: '#ff0055', borderRadius: '3px', fontSize: '7px', fontWeight: 'bold' },
  useCaseContainer: { display: 'flex', flexDirection: 'column', marginTop: '4px' },
  useCaseCard: { background: '#12161f', borderLeft: '2px solid #00fff5', padding: '4px 6px' },
  useCaseLabel: { fontSize: '7px', fontWeight: 'bold', color: '#58a6ff', textTransform: 'uppercase' },
  useCaseBody: { fontSize: '8px', color: '#c9d1d9', lineHeight: '1.2', marginTop: '1px' },
  detailsTable: { width: '100%', borderCollapse: 'collapse', marginTop: '4px' },
  tdLabel: { padding: '3px 0', fontSize: '9px', color: '#8b949e', borderBottom: '1px solid #1f242c' },
  tdValue: { padding: '3px 0', fontSize: '9px', color: '#f0f6fc', fontWeight: '600', textAlign: 'right', borderBottom: '1px solid #1f242c' }
};

export default App;