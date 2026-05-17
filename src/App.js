import React, { useState, useEffect, useRef } from 'react';
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
  const [selectedMol, setSelectedMol] = useState('Caffeine');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicDetails, setDynamicDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [renderStyle, setRenderStyle] = useState('ball+stick');
  const [hoveredAtom, setHoveredAtom] = useState(null);

  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [distanceInterpretation, setDistanceInterpretation] = useState('');

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const componentRef = useRef(null);
  const distanceRepRef = useRef(null);

  const isSpinningRef = useRef(isSpinning);
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      if (stageRef.current) {
        stageRef.current.handleResize();
        stageRef.current.autoView();
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

  // 1. Core WebGL Lifecycle Mount Container
  useEffect(() => {
    if (containerRef.current && !stageRef.current) {
      stageRef.current = new NGL.Stage(containerRef.current, { 
        backgroundColor: '#0a0d12', 
        sampleLevel: window.innerWidth < 768 ? 1 : 4, // Reduce sampling anti-aliasing load on mobile GPUs            
        impostor: true              
      });
      
      stageRef.current.setParameters({
        lightColor: '#ffffff',
        lightIntensity: 1.1,
        ambientColor: '#2b3442',
        ambientIntensity: 0.5,
        clipNear: 0,
        clipFar: 100,
        fogNear: 55,
        fogFar: 100
      });

      // Sequential triggering loops to stabilize canvas mapping bounds
      setTimeout(() => {
        if (stageRef.current) {
          stageRef.current.handleResize();
          stageRef.current.autoView();
        }
      }, 150);

      // Click Signal Engine
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

      // Interactive HUD Hover Signal Engine
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
    }
  }, []);

  // 2. Clear & Redraw Metric Measurement Layers
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
        interpretation = "👉 Covalent Bond Detected: This is a direct atomic link. Used by chemists to analyze primary structural stability and molecular formula frameworks.";
      } else if (numDist > 1.6 && numDist <= 2.5) {
        interpretation = "👉 Steric Hindrance / Repulsion Zone: These atoms are packed tightly together. Used in drug design to check if a molecule will experience inner strain and change its shape.";
      } else if (numDist > 2.5 && numDist <= 3.5) {
        interpretation = "👉 Hydrogen Bonding Interaction: A crucial non-bonded attraction. This is exactly WHERE and HOW a drug molecule clings tightly to human cell receptors and dissolves in water.";
      } else {
        interpretation = "👉 Macro-Spatial Width / Conformation Span: This measures the total size threshold across distant branches. Used to verify if the drug molecule can physically fit into a receptor target pocket.";
      }
      setDistanceInterpretation(interpretation);

      if (componentRef.current) {
        const targetPair = [[ a1.index, a2.index ]];

        const newRep = componentRef.current.addRepresentation("distance", {
          atomPair: targetPair,
          labelColor: "#00ffcc",   
          labelSize: 2.5,
          labelFont: "sans-serif",
          labelVisible: true,
          lineColor: "#ff2a6d",    
          lineWidth: 4.0,
          name: "distance-layer"   
        });
        
        distanceRepRef.current = newRep;
      }
    } else {
      setCalculatedDistance(null);
      setDistanceInterpretation('');
    }
  }, [selectedAtoms]);

  // 3. Asynchronous Data Ingestion Engine & Structure Drawing
  useEffect(() => {
    if (!stageRef.current) return;

    const loadStructure = async () => {
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
              throw new Error("No 3D asset hosted for this element profile");
            }

            const blob = new Blob([checkText], { type: 'text/plain' });
            stageRef.current.loadFile(blob, { ext: "sdf" })
              .then((component) => renderComponent(component));

          } catch (fallbackError) {
            console.warn(`3D source layout unavailable for ${selectedMol}. Engaging automated 2D coordinates conversion fallback...`);
            
            const twoDUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${targetCid}/record/SDF/?record_type=2d`;
            stageRef.current.loadFile(twoDUrl, { ext: "sdf" })
              .then((component) => renderComponent(component))
              .catch((err) => {
                console.error("Critical rendering exception across all files pipelines:", err);
                setIsLoading(false);
              });
          }
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Pipeline breakdown:", err);
        setIsLoading(false);
      }
    };

    const renderComponent = (component) => {
      componentRef.current = component;
      component.addRepresentation(renderStyle, { 
        radiusScale: renderStyle === 'spacefill' ? 0.8 : 1.3, // Scaled down slightly to prevent clipping on narrow touchscreens
        aspectRatio: 1.5,
        multipleBond: "symmetric",
        colorScheme: "element", 
        quality: window.innerWidth < 768 ? "low" : "high" // Optimize geometry vertices performance for mobile processors
      });
      
      // Critical Force Patch: Sequentially recalibrate container visibility and camera viewport focus
      stageRef.current.handleResize();
      stageRef.current.autoView();
      
      // Secondary execution block to verify render dimensions are locked down securely
      setTimeout(() => {
        if (stageRef.current) {
          stageRef.current.handleResize();
          stageRef.current.autoView();
        }
      }, 50);

      setIsLoading(false);
      if (isSpinningRef.current) {
        stageRef.current.setSpin([0, 1, 0], 0.005);
      }
    };

    loadStructure();
    
  }, [selectedMol, renderStyle]); 

  // 4. Global Animation Toggle Controller Loop
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
          type: 'Organic/Inorganic Compound Matrix',
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

  const isMobile = windowWidth < 1024;

  return (
    <div style={{...styles.appContainer, height: isMobile ? 'auto' : '100vh', overflowY: isMobile ? 'auto' : 'hidden'}}>
      <header style={styles.topHeader}>
        <div style={styles.brandGroup}>
          <div style={styles.logoBadge}>⚛️</div>
          <div>
            <h1 style={styles.appTitle}>Chemistry Architecture Studio</h1>
            <p style={styles.appSubtitle}>High-Fidelity Bio-Spatial Analytics & Lattice Mapping</p>
          </div>
        </div>
        {!isMobile && (
          <div style={styles.headerRightMenu}>
            <div style={styles.statusPill}><span style={styles.pulseDot}></span>SYSTEM ENGINE ONLINE</div>
          </div>
        )}
      </header>

      <div style={{...styles.workspace, flexDirection: isMobile ? 'column' : 'row', overflow: isMobile ? 'visible' : 'hidden'}}>
        {/* Left Side Sidebar Panel */}
        <aside style={{...styles.leftSidebar, width: isMobile ? '100%' : '310px', boxSizing: 'border-box', borderRight: isMobile ? 'none' : '1px solid #1f242c', borderBottom: isMobile ? '1px solid #1f242c' : 'none'}}>
          <div style={styles.sidebarLabel}>Compound Lookup Matrix</div>
          <input 
            type="text" 
            placeholder="Search compounds (e.g., Ethanol)..." 
            style={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          
          <div style={styles.tabGroup}>
            {['All', 'Neurochemistry', 'Complex Bio-agents', 'Chemical Solvents', 'Nanotech'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? styles.activeTab : styles.inactiveTab}>
                {tab}
              </button>
            ))}
          </div>

          <div style={styles.sidebarLabel}>Lattice Asset Registry ({filteredMolecules.length})</div>
          <div style={{...styles.itemScrollList, maxHeight: isMobile ? '180px' : 'none'}}>
            {filteredMolecules.map(name => (
              <div key={name} onClick={() => { setDynamicDetails(null); setSelectedMol(name); }} style={selectedMol === name && !dynamicDetails ? styles.activeCard : styles.inactiveCard}>
                <div style={styles.cardIcon}>⚡</div>
                <div>
                  <div style={styles.cardTitle}>{name}</div>
                  <div style={styles.cardSubtitle}>{MOLECULE_DATABASE[name].sub}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main WebGL Viewport Wrapper */}
        <main style={{...styles.viewportWrapper, height: isMobile ? '400px' : 'auto', minHeight: isMobile ? '400px' : 'none'}}>
          <div style={styles.canvasMetaBlock}>
            <span style={styles.categoryTag}>{currentDetails.category.toUpperCase()}</span>
            <h2 style={styles.mainCanvasTitle}>{selectedMol.toUpperCase()}</h2>
            <p style={styles.mainCanvasSubtitle}>{currentDetails.sub}</p>
          </div>

          {!isMobile && (
            <div style={styles.floatingHelpBadge}>
              ⚙️ OPERATIONAL: Left-click + drag mouse array to rotate lattice space. Choose any 2 atoms sequentially to render distance metrics.
            </div>
          )}

          {/* Real-Time Element Node Hover Tooltip HUD */}
          {hoveredAtom && (
            <div style={styles.hoverTooltip}>
              <div style={{color: '#00fff5', fontWeight: 'bold', letterSpacing: '0.5px'}}>NODE TARGET: {hoveredAtom.element}</div>
              <div style={{fontSize: '10px', color: '#6e7681', marginTop: '3px'}}>Index Vector Reference: #{hoveredAtom.index}</div>
              <div style={styles.coordinatesRow}>
                X: {hoveredAtom.x} | Y: {hoveredAtom.y} | Z: {hoveredAtom.z}
              </div>
            </div>
          )}

          {isLoading && (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>
              <span style={{fontSize: '11px', color: '#00fff5', fontWeight: 'bold', letterSpacing: '1px'}}>RESOLVING CLOUD GEOMETRIES...</span>
            </div>
          )}

          <div ref={containerRef} style={styles.canvasTarget}></div>

          {/* Action Control Overlays & Dynamic Render Engine Switcher Dock */}
          <div style={{...styles.floatingControlsDock, width: isMobile ? '92%' : 'auto', boxSizing: 'border-box', justifyContent: 'center', bottom: '15px'}}>
            <div style={styles.renderToggleGroup}>
              <button onClick={() => setRenderStyle('ball+stick')} style={renderStyle === 'ball+stick' ? styles.activeToggleBtn : styles.inactiveToggleBtn}>Ball & Stick</button>
              <button onClick={() => setRenderStyle('spacefill')} style={renderStyle === 'spacefill' ? styles.activeToggleBtn : styles.inactiveToggleBtn}>Spacefill</button>
            </div>
            <div style={{width: '1px', background: '#21262d', margin: '0 4px'}} />
            <button onClick={() => triggerCameraAction('reset')} style={styles.dockBtn} title="Reset Viewport">🪐</button>
            <button onClick={() => triggerCameraAction('spin')} style={{...styles.dockBtn, background: isSpinning ? 'linear-gradient(135deg, #ff0055, #990033)' : 'rgba(255,255,255,0.04)', width: 'auto', padding: '0 14px', borderRadius: '12px', border: isSpinning ? '1px solid #ff0055' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '10px', fontWeight: 'bold'}}>
              {isSpinning ? 'SPINNING' : 'SPIN'}
            </button>
          </div>
        </main>

        {/* Right Side Metrics and Applications Custom Console Panel */}
        <aside style={{...styles.rightSidebar, width: isMobile ? '100%' : '340px', boxSizing: 'border-box', borderLeft: isMobile ? 'none' : '1px solid #1f242c', borderTop: isMobile ? '1px solid #1f242c' : 'none'}}>
          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Spatial Metrics Layer</div>
            <div style={styles.metricResultContainer}>
              {calculatedDistance ? (
                <div>
                  <div style={styles.metricValue}>{calculatedDistance} <span style={{fontSize: '16px', color: '#58a6ff'}}>Å</span></div>
                  <div style={styles.metricDetails}>
                    Vector Node 1: <span style={{color:'#ff0055', fontFamily: 'monospace'}}>[{selectedAtoms[0]?.element || '?'}]</span> | Vector Node 2: <span style={{color:'#ff0055', fontFamily: 'monospace'}}>[{selectedAtoms[1]?.element || '?'}]</span>
                  </div>

                  <div style={styles.interpretationCard}>
                    <span style={{ color: '#00ff96', fontWeight: 'bold', fontSize: '10px', letterSpacing: '0.5px' }}>REAL-WORLD USE CASE ANALYSIS:</span>
                    <p style={{ margin: '6px 0 0 0', color: '#acbac7', fontSize: '11px', lineHeight: '1.45' }}>{distanceInterpretation}</p>
                  </div>

                  <button onClick={() => setSelectedAtoms([])} style={styles.clearBtn}>RESET VECTOR ARRAY</button>
                </div>
              ) : (
                <div style={styles.placeholderText}>Awaiting viewport coordinate node collection...</div>
              )}
            </div>
          </div>

          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Industrial & Clinical Applications</div>
            <div style={styles.useCaseContainer}>
              {currentDetails.useCases ? (
                currentDetails.useCases.map((uc, idx) => (
                  <div key={idx} style={styles.useCaseCard}>
                    <div style={styles.useCaseLabel}>{uc.area}</div>
                    <div style={styles.useCaseBody}>{uc.detail}</div>
                  </div>
                ))
              ) : (
                <div style={styles.placeholderText}>Parsing asset function data pipelines...</div>
              )}
            </div>
          </div>

          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Telemetry Analysis Breakdown</div>
            <table style={styles.detailsTable}>
              <tbody>
                <tr><td style={styles.tdLabel}>Formula Schema</td><td style={{...styles.tdValue, color: '#00fff5'}}>{currentDetails.formula}</td></tr>
                <tr><td style={styles.tdLabel}>Molecular Mass</td><td style={styles.tdValue}>{currentDetails.weight}</td></tr>
                <tr><td style={styles.tdLabel}>Lattice Class</td><td style={styles.tdValue}>{currentDetails.type}</td></tr>
                <tr><td style={styles.tdLabel}>Primary Source</td><td style={styles.tdValue}>{currentDetails.source}</td></tr>
              </tbody>
            </table>
          </div>

          <div style={styles.propertyWidget}>
            <div style={styles.sidebarLabel}>Abstract Overview</div>
            <p style={styles.descriptionParagraph}>{currentDetails.description}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Layout Stylesheet Configuration
const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', backgroundColor: '#07090e', color: '#c9d1d9', fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif' },
  topHeader: { minHeight: '70px', background: 'linear-gradient(to right, #0d1117, #0b0e14)', borderBottom: '1px solid #1f242c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' },
  brandGroup: { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', padding: '8px 0' },
  logoBadge: { fontSize: '20px', background: 'linear-gradient(135deg, #1f2937, #111827)', padding: '6px 8px', borderRadius: '10px', border: '1px solid #2d3748' },
  appTitle: { margin: 0, fontSize: '14px', fontWeight: '700', color: '#f0f6fc', letterSpacing: '0.8px', textTransform: 'uppercase' },
  appSubtitle: { margin: 0, fontSize: '10px', color: '#6e7681', marginTop: '3px' },
  statusPill: { background: 'rgba(0, 255, 150, 0.06)', border: '1px solid rgba(0,255,150,0.2)', padding: '6px 14px', borderRadius: '6px', fontSize: '10px', color: '#00ff96', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' },
  pulseDot: { width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00ff96' },
  workspace: { flex: 1, display: 'flex' },
  leftSidebar: { background: '#0b0e14', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  sidebarLabel: { fontSize: '10px', fontWeight: '800', color: '#00fff5', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '4px' },
  searchBar: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #21262d', background: '#07090e', fontSize: '13px', color: '#f0f6fc', boxSizing: 'border-box', outline: 'none' },
  tabGroup: { display: 'flex', background: '#07090e', padding: '3px', borderRadius: '8px', gap: '2px', border: '1px solid #1f242c', overflowX: 'auto' },
  activeTab: { flex: 1, border: 'none', background: '#161b22', padding: '8px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', color: '#00fff5', cursor: 'pointer', whiteSpace: 'nowrap' },
  inactiveTab: { flex: 1, border: 'none', background: 'transparent', padding: '8px 10px', fontSize: '10px', color: '#8b949e', cursor: 'pointer', whiteSpace: 'nowrap' },
  itemScrollList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' },
  inactiveCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' },
  activeCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #161b22, #0d1117)', border: '1px solid #00fff5' },
  cardIcon: { fontSize: '12px', background: '#07090e', padding: '6px 8px', borderRadius: '6px', border: '1px solid #21262d', color: '#00fff5' },
  cardTitle: { fontSize: '13px', fontWeight: '600', color: '#f0f6fc' },
  cardSubtitle: { fontSize: '11px', color: '#6e7681', marginTop: '3px' },
  viewportWrapper: { flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #101520 0%, #07090e 100%)', minWidth: 0 },
  canvasMetaBlock: { position: 'absolute', top: '20px', left: '20px', zIndex: 10, pointerEvents: 'none' },
  categoryTag: { fontSize: '9px', fontWeight: 'bold', background: 'rgba(0,255,245,0.08)', color: '#00fff5', border: '1px solid rgba(0,255,245,0.2)', padding: '2px 6px', borderRadius: '4px' },
  mainCanvasTitle: { margin: '6px 0 0 0', fontSize: '24px', fontWeight: '900', color: '#f0f6fc', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' },
  mainCanvasSubtitle: { margin: '2px 0 0 0', fontSize: '12px', color: '#8b949e' },
  floatingHelpBadge: { position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(13, 17, 23, 0.8)', border: '1px solid #21262d', padding: '10px 14px', borderRadius: '12px', fontSize: '11px', maxWidth: '300px', lineHeight: '1.4' },
  hoverTooltip: { position: 'absolute', bottom: '85px', left: '20px', zIndex: 15, background: 'rgba(7, 9, 14, 0.92)', border: '1px solid #00fff5', padding: '10px 14px', borderRadius: '10px', fontSize: '11px' },
  coordinatesRow: { fontSize: '10px', fontFamily: 'monospace', color: '#00ff96', marginTop: '4px' },
  canvasTarget: { width: '100%', height: '100%' },
  loadingBox: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'rgba(7, 9, 14, 0.95)', padding: '20px', borderRadius: '12px', border: '1px solid #00fff5' },
  spinner: { width: '28px', height: '28px', border: '3px solid rgba(0,255,245,0.1)', borderTop: '3px solid #00fff5', borderRadius: '50%' },
  floatingControlsDock: { position: 'absolute', zIndex: 10, display: 'flex', gap: '6px', background: 'rgba(13, 17, 23, 0.85)', backdropFilter: 'blur(10px)', padding: '8px 12px', borderRadius: '14px', border: '1px solid #21262d' },
  renderToggleGroup: { display: 'flex', background: '#07090e', padding: '2px', borderRadius: '8px', border: '1px solid #21262d' },
  activeToggleBtn: { border: 'none', background: '#1f242c', color: '#00fff5', fontSize: '10px', fontWeight: 'bold', padding: '0 10px', borderRadius: '6px', height: '28px' },
  inactiveToggleBtn: { border: 'none', background: 'transparent', color: '#8b949e', fontSize: '10px', padding: '0 10px', borderRadius: '6px', height: '28px' },
  dockBtn: { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.03)', color: '#c9d1d9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' },
  rightSidebar: { background: '#0b0e14', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  propertyWidget: { display: 'flex', flexDirection: 'column' },
  metricResultContainer: { border: '1px dashed #2d3748', borderRadius: '10px', padding: '16px', marginTop: '8px', textAlign: 'center', background: '#07090e' },
  metricValue: { fontSize: '28px', fontWeight: '800', color: '#00ff96' },
  metricDetails: { fontSize: '11px', color: '#8b949e', marginTop: '6px' },
  interpretationCard: { marginTop: '12px', padding: '10px', backgroundColor: '#131722', borderRadius: '8px', borderLeft: '3px solid #00ff96', textAlign: 'left' },
  placeholderText: { fontSize: '11px', color: '#556275', fontStyle: 'italic' },
  clearBtn: { marginTop: '12px', width: '100%', padding: '8px', background: 'rgba(255,0,85,0.06)', border: '1px solid #ff0055', color: '#ff0055', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' },
  useCaseContainer: { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' },
  useCaseCard: { background: '#12161f', borderLeft: '3px solid #00fff5', borderRadius: '0 6px 6px 0', padding: '10px 12px' },
  useCaseLabel: { fontSize: '10px', fontWeight: 'bold', color: '#58a6ff', textTransform: 'uppercase' },
  useCaseBody: { fontSize: '11px', color: '#c9d1d9', lineHeight: '1.4', marginTop: '2px' },
  detailsTable: { width: '100%', borderCollapse: 'collapse', marginTop: '8px' },
  tdLabel: { padding: '8px 0', fontSize: '12px', color: '#8b949e', borderBottom: '1px solid #1f242c' },
  tdValue: { padding: '8px 0', fontSize: '12px', color: '#f0f6fc', fontWeight: '600', textAlign: 'right', borderBottom: '1px solid #1f242c' },
  descriptionParagraph: { fontSize: '12px', color: '#8b949e', lineHeight: '1.5', marginTop: '8px' }
};

export default App;