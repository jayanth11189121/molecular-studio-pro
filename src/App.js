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
    description: "The world's most widely consumed psychoactive substance. It blocks central adenosine receptors to systematically delay the onset of physiological fatigue.",
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
    description: 'A pure carbon spherical configuration shaped like a soccer ball composed of 20 hexagons and 12 pentagons, displaying supreme structural symmetries.',
    useCases: [
      { area: 'Drug Delivery', detail: 'Engineered as a molecular structural hollow cage to safely guide therapeutic chemicals past cell boundaries.' },
      { area: 'Optics Technology', detail: 'Utilized in high-powered defensive laser protective optics due to non-linear light absorption indexes.' },
      { area: 'Superconductors', detail: 'Doped with alkali earth metals to generate structural lattices exhibiting zero electrical resistance states.' }
    ]
  }
};

const quizQuestions = [
  {
    question: "Which molecule blocks central adenosine receptors to systematically delay physiological fatigue?",
    options: ["Dopamine", "Caffeine", "Serotonin", "Aspirin"],
    answer: "Caffeine",
    rationale: "Caffeine works as an adenosine receptor antagonist, temporarily fending off fatigue signals."
  },
  {
    question: "What is the primary mechanism target of SSRIs like Fluoxetine to alleviate depressive disorders?",
    options: ["Dopamine Pathways", "Acetylcholine Lattices", "Serotonin Systems", "Epinephrine Triggers"],
    answer: "Serotonin Systems",
    rationale: "Selective Serotonin Reuptake Inhibitors (SSRIs) prevent the reabsorption of serotonin, structurally stabilizing mood states."
  },
  {
    question: "What core structural feature allows Penicillin to permanently deactivate bacterial cell wall synthesis?",
    options: ["A highly strained four-membered beta-lactam ring", "A flexible vanilloid lipophilic organic chain", "A pure carbon spherical fullerene cage", "An aliphatic ketone matrix"],
    answer: "A highly strained four-membered beta-lactam ring",
    rationale: "The intense geometric ring strain allows Penicillin to covalently bind to and permanently disable bacterial transpeptidase enzymes."
  },
  {
    question: "Which chemical solvent is deployed at a 70% concentration threshold to destroy viral lipid envelopes?",
    options: ["Acetone", "Caffeine", "Ethanol", "Capsaicin"],
    answer: "Ethanol",
    rationale: "A 70% ethanol concentration provides the optimal balance of water content to delay evaporation and fully denature pathogen proteins."
  },
  {
    question: "Buckminsterfullerene (C60) exhibits a structural shape reminiscent of what macro item?",
    options: ["A double helix spiral", "A soccer ball (truncated icosahedron)", "A perfect geometric cube", "A cylindrical carbon sheet tube"],
    answer: "A soccer ball (truncated icosahedron)",
    rationale: "C60 is comprised of 20 hexagons and 12 pentagons arranged into a remarkably symmetrical hollow cage."
  },
  {
    question: "Which neural chemical acts as a critical monoamine reward driver and is used intravenously as a vasopressor for cardiogenic shock?",
    options: ["Serotonin", "Caffeine", "Dopamine", "Glucose"],
    answer: "Dopamine",
    rationale: "Dopamine acts as both a motivational modulator in the CNS and a critical emergency clinical vasopressor to restore safe blood pressure levels."
  },
  {
    question: "What primary enzymatic pathways are disrupted by Aspirin (C9H8O4) to intercept local swelling and somatic pain triggers?",
    options: ["COX-1 and COX-2 enzymes", "Bacterial transpeptidase", "Adenosine neurological receptors", "TRPV1 thermal pathways"],
    answer: "COX-1 and COX-2 enzymes",
    rationale: "Aspirin blocks Cyclooxygenase (COX) enzymes, shutting down the biosynthesis of inflammatory prostaglandins."
  },
  {
    question: "Capsaicin selectively binds to which specialized receptor network to generate a false metabolic sensation of scorching heat?",
    options: ["Adenosine receptor grids", "TRPV1 thermal pathways", "Enteric motor systems", "Carbon fullerene matrix"],
    answer: "TRPV1 thermal pathways",
    rationale: "Capsaicin is a lipophilic vanilloid that targets TRPV1 receptors, lowering their activation threshold so ambient body heat registers as burning pain."
  },
  {
    question: "Which compound acts as the fundamental metabolic energy vehicle and is administered as an intravenous dextrose solution?",
    options: ["Ethanol", "Acetone", "Glucose", "Caffeine"],
    answer: "Glucose",
    rationale: "Glucose is the essential hexose monosaccharide metabolized downstream during cellular respiration loops to rapidly counteract hypoglycemia."
  },
  {
    question: "What compound serves as the direct, structural biochemical precursor required for the natural biosynthesis of melatonin?",
    options: ["Serotonin", "Dopamine", "Aspirin", "Capsaicin"],
    answer: "Serotonin",
    rationale: "Serotonin undergoes enzymatic conversion within the pineal gland to synthesize melatonin, directly regulating sleep cycles."
  },
  {
    question: "Due to its supreme miscibility with water and rapid evaporation profile, which chemical solvent is the laboratory standard for rinsing glassware?",
    options: ["Ethanol", "Acetone", "Capsaicin", "Penicillin"],
    answer: "Acetone",
    rationale: "Acetone (simplest aliphatic ketone) dissolves organic residues and bonds with water molecules, evaporating instantly for spotless glass sterilization."
  },
  {
    question: "What revolutionary nanotech structures are engineered into lithium-ion battery anode meshes to significantly raise charge capacity cycles?",
    options: ["Carbon Nanotubes", "Thiazolidine Cores", "Purine Alkaloid Systems", "Hexose Carbohydrate Loops"],
    answer: "Carbon Nanotubes",
    rationale: "Cylindrical carbon fullerene lattices provide elite electrical transport architectures and mechanical strength to support superior cycling loads."
  },
  {
    question: "What is the primary industrial origin matrix for the active components used in manufacturing modern Penicillin drugs?",
    options: ["Synthetic Salicylate Modification", "Penicillium Chrysogenum Fungi", "Cumene Process Oxidation", "Arc Discharge / CVD Synthesis"],
    answer: "Penicillium Chrysogenum Fungi",
    rationale: "Penicillin is derived from the deep strain fermentation biotechnology of Penicillium chrysogenum mold strains."
  },
  {
    question: "The chemical formula 'C2H6O' corresponds to which highly combustible, clean-burning alkyl alcohol structural system?",
    options: ["Glucose", "Ethanol", "Acetone", "Caffeine"],
    answer: "Ethanol",
    rationale: "Ethanol features a basic primary hydroxyl group anchored to an ethyl chain, forming a highly volatile bio-solvent fuel intermediate."
  },
  {
    question: "Why is Buckminsterfullerene (C60) highly valued in defensive defense electronics and high-powered optics technology?",
    options: ["It shows non-linear light absorption indexes", "It triggers the human peristaltic reflex system", "It permanently deactivates cell-wall synthesis", "It acts as a primary vasopressor agent"],
    answer: "It shows non-linear light absorption indexes",
    rationale: "The symmetrical carbon geometry of C60 creates non-linear optical properties, causing the material to darken instantly when struck by high-energy laser paths."
  }
];

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

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Quiz React State Engines
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Client-Side AI Insight Engine States
  const [aiInsights, setAiInsights] = useState(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const stageRef = useRef(null);
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

  // Topic-Wise AI Analysis Simulator
  const runAiAnalysis = useCallback((moleculeName) => {
    setIsAiAnalyzing(true);
    setAiInsights(null);
    
    setTimeout(() => {
      const databaseMatch = MOLECULE_DATABASE[moleculeName] || dynamicDetails;
      
      if (databaseMatch) {
        setAiInsights({
          modelUsed: "Gemini-Pro-Bio-v2 (API Link Simulated)",
          structuralAnalysis: `The chemical structure ${databaseMatch.formula || 'unspecified'} acts as a high-affinity ligand within its stereochemical class. Its specific atomic arrangement dictates narrow spatial constraints across receptor docking pockets.`,
          bioMechanism: databaseMatch.description || "Dynamic cloud properties registered for predictive biological interactions.",
          safetyProfile: `Handled standardly as an active chemical compound intermediate. Prevent uncontrolled exposure across non-sterile target biological pathways.`
        });
      } else {
        setAiInsights({
          modelUsed: "Gemini-Pro-Bio-v2 (API Link Simulated)",
          structuralAnalysis: `Custom entry resolved via external cloud schema parameters. The molecule presents standard structural covalent bounds configurations.`,
          bioMechanism: `Active tracking indicates interaction behavior linked directly to structural valence density mapping.`,
          safetyProfile: `Observe conventional materials safety data handling protocols (MSDS verification recommended).`
        });
      }
      setIsAiAnalyzing(false);
    }, 1100);
  }, [dynamicDetails]);

  // Trigger AI analysis on active structural variation
  useEffect(() => {
    runAiAnalysis(selectedMol);
  }, [selectedMol, runAiAnalysis]);

  // Core Molecular Component Geometry Rendering Helper
  const renderComponent = useCallback((component) => {
    componentRef.current = component;
    component.addRepresentation(renderStyle, { 
      radiusScale: renderStyle === 'spacefill' ? 0.8 : 1.3, 
      aspectRatio: 1.5,
      multipleBond: "symmetric",
      colorScheme: "element", 
      quality: window.innerWidth < 768 ? "low" : "high"
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

  // Extracted Core Structural Engine Runner wrapped with useCallback
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

  // Safe callback ref strategy for perfect Canvas DOM initialization
  const initCanvasRef = (element) => {
    if (element && !stageRef.current) {
      const isMobileDevice = window.innerWidth < 768;
      
      stageRef.current = new NGL.Stage(element, { 
        backgroundColor: '#0a0d12', 
        sampleLevel: isMobileDevice ? 0 : 3, 
        impostor: !isMobileDevice 
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
      
      setTimeout(() => {
        loadStructure();
      }, 50);
    }
  };

  // Clear & Redraw Metric Measurement Layers
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

  // Trigger whenever structural choice dependencies update
  useEffect(() => {
    loadStructure();
  }, [loadStructure]);

  // Global Animation Toggle Controller Loop
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

  const handleOptionClick = (option) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const handleAnswerSubmit = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    
    if (selectedOption === quizQuestions[currentQuestionIdx].answer) {
      setQuizScore(prev => prev + 1);
    }
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    
    if (currentQuestionIdx + 1 < quizQuestions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const filteredMolecules = Object.keys(MOLECULE_DATABASE).filter(name => {
    if (activeTab === 'All') return true;
    return MOLECULE_DATABASE[name].category === activeTab;
  });

  const isMobile = windowWidth < 1024;

  return (
    <div style={{...styles.appContainer, height: isMobile ? 'auto' : '100vh', overflowY: isMobile ? 'auto' : 'hidden'}}>
      {/* Top Brand Header */}
      <header style={styles.topHeader}>
        <div style={styles.brandGroup}>
          <div style={styles.logoBadge}>⚛️</div>
          <div>
            <h1 style={styles.appTitle}>Chemistry Architecture Studio</h1>
            <p style={styles.appSubtitle}>High-Fidelity Bio-Spatial Analytics & Lattice Mapping</p>
          </div>
        </div>

        {/* Live PubChem Cloud Search Engine Hook */}
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Query any global molecule (e.g. Nicotine, Water)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </div>
      </header>

      {/* Main Studio Console Layout Workspace */}
      <div style={{...styles.mainWorkspace, flexDirection: isMobile ? 'column' : 'row'}}>
        
        {/* Left Control Deck Panel */}
        <div style={{...styles.leftSidebar, width: isMobile ? '100%' : '320px', height: isMobile ? 'auto' : 'calc(100vh - 70px)'}}>
          
          {/* Classification Categorization Navigation Tabs */}
          <div style={styles.tabBar}>
            {['All', 'Neurochemistry', 'Pharmaceuticals', 'Complex Bio-agents', 'Chemical Solvents', 'Nanotech'].map((tab) => (
              <button
                key={tab}
                style={{
                  ...styles.tabButton,
                  backgroundColor: activeTab === tab ? '#00ffcc' : 'transparent',
                  color: activeTab === tab ? '#0a0d12' : '#94a3b8',
                  fontWeight: activeTab === tab ? 'bold' : 'normal'
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Molecule Directory List */}
          <div style={styles.moleculeGrid}>
            {filteredMolecules.map((name) => (
              <button
                key={name}
                style={{
                  ...styles.molCard,
                  border: selectedMol === name ? '1px solid #00ffcc' : '1px solid #1f293d',
                  backgroundColor: selectedMol === name ? '#111c2e' : '#0f141c'
                }}
                onClick={() => {
                  setDynamicDetails(null);
                  setSelectedMol(name);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: selectedMol === name ? '#00ffcc' : '#f8fafc', fontWeight: 'bold' }}>{name}</span>
                  <span style={styles.formulaBadge}>{MOLECULE_DATABASE[name]?.formula || 'Live'}</span>
                </div>
                <div style={styles.cardSubtext}>{MOLECULE_DATABASE[name]?.sub || 'Dynamic Cloud Spec'}</div>
              </button>
            ))}
          </div>

          {/* Atomic Interaction Readout HUD Layer */}
          <div style={styles.hudContainer}>
            <h4 style={styles.hudTitle}>📡 Atomic Interceptor HUD</h4>
            {hoveredAtom ? (
              <div style={styles.hudMetaList}>
                <div><span style={styles.hudLabel}>Element Lattice:</span> <strong style={{color: '#00ffcc'}}>{hoveredAtom.element}</strong></div>
                <div><span style={styles.hudLabel}>Index Sequence:</span> <span>#{hoveredAtom.index}</span></div>
                <div><span style={styles.hudLabel}>Spatial Vector:</span> <span>X:{hoveredAtom.x} | Y:{hoveredAtom.y} | Z:{hoveredAtom.z}</span></div>
              </div>
            ) : (
              <p style={styles.hudPlaceholder}>Hover across atom configurations to track real-time spatial properties.</p>
            )}
          </div>
        </div>

        {/* Center 3D Bio-Spatial Viewport Deck Container */}
        <div style={styles.viewportArea}>
          {/* Configuration Topology Control Deck Toolbar */}
          <div style={styles.toolbarDeck}>
            <div style={styles.toolBtnGroup}>
              <button style={{...styles.toolBtn, backgroundColor: renderStyle==='ball+stick'?'#ff2a6d':'#1e293b'}} onClick={() => setRenderStyle('ball+stick')}>Ball & Stick</button>
              <button style={{...styles.toolBtn, backgroundColor: renderStyle==='spacefill'?'#ff2a6d':'#1e293b'}} onClick={() => setRenderStyle('spacefill')}>Spacefill (vdw)</button>
              <button style={{...styles.toolBtn, backgroundColor: renderStyle==='licorice'?'#ff2a6d':'#1e293b'}} onClick={() => setRenderStyle('licorice')}>Licorice Wire</button>
            </div>

            <div style={styles.toolBtnGroup}>
              <button style={styles.navActionBtn} onClick={() => triggerCameraAction('zoomIn')}>＋ Zoom In</button>
              <button style={styles.navActionBtn} onClick={() => triggerCameraAction('zoomOut')}>－ Zoom Out</button>
              <button style={styles.navActionBtn} onClick={() => triggerCameraAction('reset')}>🔄 Auto Align</button>
              <button style={{...styles.navActionBtn, color: isSpinning ? '#00ffcc' : '#ffffff'}} onClick={() => triggerCameraAction('spin')}>
                {isSpinning ? '⏸ Pause Spin' : '▶ Continuous Spin'}
              </button>
            </div>
          </div>

          {/* Actual Canvas Container Core */}
          <div style={styles.canvasWrapper}>
            <div ref={initCanvasRef} style={{ width: '100%', height: '100%' }} />
            {isLoading && (
              <div style={styles.loadingOvercast}>
                <div style={styles.spinnerIcon} />
                <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>Resolving Spatial Vector Lattices...</span>
              </div>
            )}
          </div>

          {/* Live Vector Metric Analysis HUD */}
          <div style={styles.metricAnalysisBar}>
            <div style={{ fontWeight: 'bold', color: '#ff2a6d', marginBottom: '4px', fontSize: '0.85rem', letterSpacing: '1px' }}>
              📐 LIVE INTRA-MOLECULAR SPATIAL DISTANCE METRICS
            </div>
            {selectedAtoms.length === 0 && <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Select any two atomic coordinates sequentially to calculate atomic distance constraints.</p>}
            {selectedAtoms.length === 1 && <p style={{ margin: 0, color: '#00ffcc', fontSize: '0.9rem' }}>Target 1 secured [Atom Vector {selectedAtoms[0].element} #{selectedAtoms[0].index}]. Awaiting final coordinate connection point selection...</p>}
            {selectedAtoms.length === 2 && (
              <div>
                <div style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '6px' }}>
                  Distance path between <strong style={{color:'#00ffcc'}}>{selectedAtoms[0].element} ({selectedAtoms[0].index})</strong> and <strong style={{color:'#00ffcc'}}>{selectedAtoms[1].element} ({selectedAtoms[1].index})</strong>: <strong style={{color:'#ff2a6d', fontSize:'1.2rem'}}>{calculatedDistance} Å</strong> (Angstroms)
                </div>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.88rem', padding: '10px', backgroundColor: '#0f141c', borderRadius: '6px', borderLeft: '3px solid #ff2a6d', lineHeight: '1.4' }}>
                  {distanceInterpretation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Structured Property Details & Quiz Engine Sidebar */}
        <div style={{...styles.rightSidebar, width: isMobile ? '100%' : '380px', height: isMobile ? 'auto' : 'calc(100vh - 70px)'}}>
          
          {/* Main Molecule Property Spec Cards */}
          <div style={styles.detailHeader}>
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={styles.detailTitle}>{selectedMol}</h2>
                <div style={styles.detailSub}>{currentDetails.sub}</div>
              </div>
              <span style={styles.categoryLabel}>{currentDetails.category}</span>
            </div>
          </div>

          <div style={styles.specsTable}>
            <div style={styles.tableRow}><span style={styles.rowLabel}>Chemical Formula</span><strong style={styles.rowVal}>{currentDetails.formula}</strong></div>
            <div style={styles.tableRow}><span style={styles.rowLabel}>Molecular Mass</span><strong style={styles.rowVal}>{currentDetails.weight}</strong></div>
            <div style={styles.tableRow}><span style={styles.rowLabel}>System Architecture</span><span style={styles.rowVal}>{currentDetails.type}</span></div>
            <div style={styles.tableRow}><span style={styles.rowLabel}>Primary Extraction Source</span><span style={styles.rowVal}>{currentDetails.source}</span></div>
          </div>

          <p style={styles.descriptionText}>{currentDetails.description}</p>

          <h4 style={styles.sectionHeaderTitle}>💼 High-Value Applied Operational Use-Cases</h4>
          <div style={styles.useCaseList}>
            {currentDetails.useCases.map((uc, i) => (
              <div key={i} style={styles.useCaseBlock}>
                <div style={styles.useCaseArea}>{uc.area}</div>
                <div style={styles.useCaseDetail}>{uc.detail}</div>
              </div>
            ))}
          </div>

          {/* ========================================================== */}
          {/* Premium Topic-Wise AI Explanation Interface */}
          {/* ========================================================== */}
          <div style={styles.aiWidgetCard}>
            <div style={styles.aiHeaderRow}>
              <h3 style={styles.aiWidgetTitle}>🤖 Topic-Wise AI Explanation Engine</h3>
              <span style={{ ...styles.aiBadge, color: isAiAnalyzing ? '#ff2a6d' : '#00ffcc' }}>
                {isAiAnalyzing ? "PROCESSING..." : "MODEL ACTIVE"}
              </span>
            </div>

            {isAiAnalyzing ? (
              <div style={styles.aiLoadingFrame}>
                <div style={styles.aiMiniSpinner} />
                <span style={styles.aiLoadingText}>AI agent parsing structural properties...</span>
              </div>
            ) : aiInsights ? (
              <div style={styles.aiContentContainer}>
                <div>
                  <div style={styles.aiSectionTitle}>🧬 STRUCTURAL ANALYSIS COGNITION</div>
                  <p style={styles.aiSectionBody}>{aiInsights.structuralAnalysis}</p>
                </div>

                <div style={styles.aiHighlightedBlock}>
                  <div style={{ ...styles.aiSectionTitle, color: '#00ffcc' }}>💡 BIOLOGICAL MECHANISM TARGETING</div>
                  <p style={{ ...styles.aiSectionBody, color: '#94a3b8' }}>{aiInsights.bioMechanism}</p>
                </div>

                <div>
                  <div style={{ ...styles.aiSectionTitle, color: '#e2e8f0' }}>⚠️ CLINICAL SAFETY PROFILE</div>
                  <p style={{ ...styles.aiSectionBody, color: '#64748b' }}>{aiInsights.safetyProfile}</p>
                </div>

                <div style={styles.aiFooter}>
                  Engine Backend: <span style={{ color: '#94a3b8' }}>{aiInsights.modelUsed}</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* ========================================================== */}
          {/* Premium Interactive Bio-Spatial Quiz Core Integration */}
          {/* ========================================================== */}
          <div style={styles.quizWrapperCard}>
            <div style={styles.quizHeaderRow}>
              <h3 style={styles.quizWidgetTitle}>🧠 Spatial Architecture Quiz</h3>
              <span style={styles.quizCounterText}>
                {!quizCompleted ? `Q: ${currentQuestionIdx + 1} / ${quizQuestions.length}` : 'Done'}
              </span>
            </div>

            {!quizCompleted ? (
              <div>
                <p style={styles.quizQuestionText}>{quizQuestions[currentQuestionIdx].question}</p>

                <div style={styles.quizOptionsStack}>
                  {quizQuestions[currentQuestionIdx].options.map((option, idx) => {
                    let optionStyle = { ...styles.quizOptionBtn };

                    if (selectedOption === option && !isAnswerSubmitted) {
                      optionStyle.border = '1px solid #00ffcc';
                      optionStyle.backgroundColor = '#0b2625';
                    }
                    if (isAnswerSubmitted) {
                      if (option === quizQuestions[currentQuestionIdx].answer) {
                        optionStyle.border = '1px solid #10b981';
                        optionStyle.backgroundColor = '#062f22';
                        optionStyle.color = '#10b981';
                      } else if (selectedOption === option) {
                        optionStyle.border = '1px solid #ef4444';
                        optionStyle.backgroundColor = '#3b1212';
                        optionStyle.color = '#f87171';
                      }
                    }

                    return (
                      <button 
                        key={idx} 
                        style={optionStyle} 
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswerSubmitted}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {!isAnswerSubmitted ? (
                    <button
                      style={{
                        ...styles.quizActionBtn,
                        backgroundColor: selectedOption ? '#00ffcc' : '#1e293b',
                        color: selectedOption ? '#0a0d12' : '#64748b',
                        cursor: selectedOption ? 'pointer' : 'not-allowed'
                      }}
                      onClick={handleAnswerSubmit}
                      disabled={!selectedOption}
                    >
                      Lock In Answer
                    </button>
                  ) : (
                    <div>
                      <div style={{
                        ...styles.quizRationaleBox,
                        borderLeft: `4px solid ${selectedOption === quizQuestions[currentQuestionIdx].answer ? '#10b981' : '#ef4444'}`
                      }}>
                        <b style={{ color: '#f1f5f9' }}>
                          {selectedOption === quizQuestions[currentQuestionIdx].answer ? '✓ Correct Matrix Verification: ' : '✗ Structural Discrepancy: '}
                        </b>
                        {quizQuestions[currentQuestionIdx].rationale}
                      </div>
                      
                      <button style={styles.quizNextBtn} onClick={handleNextQuestion}>
                        {currentQuestionIdx + 1 === quizQuestions.length ? 'Finalize Evaluation' : 'Advance to Next Question'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏆</div>
                <h4 style={{ color: '#f8fafc', margin: '0 0 4px 0', fontSize: '1.1rem' }}>Performance Analysis Complete</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '16px' }}>
                  Lattice competency score: <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>{quizScore} / {quizQuestions.length}</span>
                </p>
                
                <div style={styles.progressBarBg}>
                  <div style={{ ...styles.progressBarFill, width: `${(quizScore / quizQuestions.length) * 100}%` }}></div>
                </div>

                <button style={styles.quizResetBtn} onClick={resetQuiz}>
                  Reinitialize Quiz Loop
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Unified Dark High-Tech Aesthetic Style Architecture
const styles = {
  appContainer: {
    backgroundColor: '#0a0d12',
    color: '#cbd5e1',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column'
  },
  topHeader: {
    height: '70px',
    backgroundColor: '#0f141c',
    borderBottom: '1px solid #1f293d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    boxSizing: 'border-box'
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoBadge: {
    fontSize: '1.8rem'
  },
  appTitle: {
    color: '#ffffff',
    fontSize: '1.15rem',
    margin: 0,
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  },
  appSubtitle: {
    color: '#94a3b8',
    fontSize: '0.78rem',
    margin: '2px 0 0 0'
  },
  searchContainer: {
    position: 'relative',
    width: '340px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.9rem',
    opacity: 0.6
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#0a0d12',
    border: '1px solid #24334d',
    borderRadius: '8px',
    padding: '8px 12px 8px 36px',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },
  mainWorkspace: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#0a0d12'
  },
  leftSidebar: {
    backgroundColor: '#0f141c',
    borderRight: '1px solid #1f293d',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  tabBar: {
    display: 'flex',
    gap: '4px',
    padding: '12px',
    overflowX: 'auto',
    borderBottom: '1px solid #1f293d',
    whiteSpace: 'nowrap'
  },
  tabButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.78rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  moleculeGrid: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  molCard: {
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    boxSizing: 'border-box'
  },
  formulaBadge: {
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontWeight: 'bold'
  },
  cardSubtext: {
    color: '#64748b',
    fontSize: '0.75rem'
  },
  hudContainer: {
    padding: '14px',
    backgroundColor: '#0a0d12',
    borderTop: '1px solid #1f293d',
    fontSize: '0.8rem'
  },
  hudTitle: {
    margin: '0 0 8px 0',
    color: '#94a3b8',
    fontWeight: 'bold'
  },
  hudMetaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: '#cbd5e1'
  },
  hudLabel: {
    color: '#64748b',
    marginRight: '6px'
  },
  hudPlaceholder: {
    margin: 0,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: '1.3'
  },
  viewportArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0a0d12',
    position: 'relative'
  },
  toolbarDeck: {
    padding: '10px 16px',
    backgroundColor: '#0f141c',
    borderBottom: '1px solid #1f293d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  toolBtnGroup: {
    display: 'flex',
    gap: '6px'
  },
  toolBtn: {
    padding: '6px 12px',
    borderRadius: '5px',
    fontSize: '0.78rem',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  navActionBtn: {
    padding: '6px 10px',
    borderRadius: '5px',
    fontSize: '0.78rem',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  canvasWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0a0d12',
    minHeight: '350px'
  },
  loadingOvercast: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10, 13, 18, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '14px',
    zIndex: 10
  },
  spinnerIcon: {
    width: '32px',
    height: '32px',
    border: '3px solid #1f293d',
    borderTop: '3px solid #00ffcc',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  metricAnalysisBar: {
    backgroundColor: '#0f141c',
    borderTop: '1px solid #1f293d',
    padding: '16px 20px',
    boxSizing: 'border-box'
  },
  rightSidebar: {
    backgroundColor: '#0f141c',
    borderLeft: '1px solid #1f293d',
    padding: '20px',
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailHeader: {
    borderBottom: '1px solid #1f293d',
    paddingBottom: '12px'
  },
  detailTitle: {
    color: '#ffffff',
    fontSize: '1.5rem',
    margin: 0,
    fontWeight: 'bold'
  },
  detailSub: {
    color: '#00ffcc',
    fontSize: '0.8rem',
    marginTop: '4px'
  },
  categoryLabel: {
    fontSize: '0.72rem',
    backgroundColor: '#1e293b',
    color: '#cbd5e1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  specsTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#0a0d12',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #1f293d'
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    lineHeight: '1.4'
  },
  rowLabel: {
    color: '#64748b'
  },
  rowVal: {
    color: '#e2e8f0',
    textAlign: 'right'
  },
  descriptionText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#94a3b8',
    margin: 0
  },
  sectionHeaderTitle: {
    margin: '8px 0 0 0',
    fontSize: '0.85rem',
    color: '#ffffff',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  useCaseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  useCaseBlock: {
    backgroundColor: '#141b26',
    padding: '10px 12px',
    borderRadius: '6px',
    borderLeft: '3px solid #00ffcc'
  },
  useCaseArea: {
    fontSize: '0.78rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '2px'
  },
  useCaseDetail: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: '1.4'
  },
  aiWidgetCard: {
    backgroundColor: '#0a0d12',
    border: '1px solid #1f293d',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    marginTop: '4px'
  },
  aiHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1f293d',
    paddingBottom: '8px'
  },
  aiWidgetTitle: {
    color: '#00ffcc',
    margin: 0,
    fontSize: '0.92rem',
    fontWeight: 'bold'
  },
  aiBadge: {
    fontSize: '0.68rem',
    backgroundColor: '#1e293b',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  aiLoadingFrame: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
    gap: '10px'
  },
  aiMiniSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #1f293d',
    borderTop: '2px solid #00ffcc',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite'
  },
  aiLoadingText: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontStyle: 'italic'
  },
  aiContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontSize: '0.82rem'
  },
  aiSectionTitle: {
    color: '#ff2a6d',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    marginBottom: '3px',
    letterSpacing: '0.5px'
  },
  aiSectionBody: {
    margin: 0,
    color: '#cbd5e1',
    lineHeight: '1.4'
  },
  aiHighlightedBlock: {
    backgroundColor: '#111c2e',
    padding: '10px',
    borderRadius: '6px',
    borderLeft: '3px solid #00ffcc'
  },
  aiFooter: {
    fontSize: '0.65rem',
    color: '#475569',
    textAlign: 'right',
    marginTop: '4px',
    borderTop: '1px solid #1f293d',
    paddingTop: '6px'
  },
  quizWrapperCard: {
    backgroundColor: '#0a0d12',
    border: '1px solid #1f293d',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '4px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
  },
  quizHeaderRow: {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '16px', 
    borderBottom: '1px solid #1f293d', 
    paddingBottom: '10px'
  },
  quizWidgetTitle: {
    color: '#00ffcc', 
    margin: 0, 
    fontSize: '0.95rem', 
    fontWeight: 'bold'
  },
  quizCounterText: {
    color: '#64748b', 
    fontSize: '0.8rem'
  },
  quizQuestionText: {
    color: '#f8fafc', 
    fontSize: '0.9rem', 
    lineHeight: '1.5', 
    marginBottom: '16px'
  },
  quizOptionsStack: {
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px', 
    marginBottom: '16px'
  },
  quizOptionBtn: {
    padding: '12px 14px',
    borderRadius: '8px',
    backgroundColor: '#161f30',
    border: '1px solid #24334d',
    color: '#cbd5e1',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    fontSize: '0.85rem',
    width: '100%',
    boxSizing: 'border-box'
  },
  quizActionBtn: {
    width: '100%',
    padding: '11px',
    borderRadius: '6px',
    fontWeight: 'bold',
    border: 'none',
    fontSize: '0.85rem',
    transition: 'all 0.2s'
  },
  quizRationaleBox: {
    padding: '12px',
    backgroundColor: '#0f141c',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '0.82rem',
    color: '#94a3b8',
    lineHeight: '1.45'
  },
  quizNextBtn: {
    width: '100%',
    padding: '11px',
    borderRadius: '6px',
    backgroundColor: '#ff2a6d',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer'
  },
  progressBarBg: {
    width: '100%', 
    height: '6px', 
    backgroundColor: '#1e293b', 
    borderRadius: '3px', 
    marginBottom: '20px', 
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%', 
    backgroundColor: '#00ffcc',
    transition: 'width 0.4s ease'
  },
  quizResetBtn: {
    padding: '8px 20px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    border: '1px solid #ff2a6d',
    color: '#ff2a6d',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.82rem'
  }
};

export default App;