import { useState, useMemo, useEffect } from 'react'

declare global {
  interface Window {
    MathJax?: any
  }
}
import {
  Search,
  BookOpen,
  Calendar,
  Layers,
  Cpu,
  Bookmark,
  CheckCircle,
  FileText,
  X,
  Sparkles,
  GitFork,
  ArrowUpDown,
  Terminal,
  Activity,
  Copy,
  Table,
  Sliders,
  Award,
  Settings
} from 'lucide-react'
import papersData from './assets/papers_db.json'

interface Paper {
  id: string
  title: string
  authors: string
  year: number
  category: string
  contribution: string
  aba_relation: string
  methodology: string
  abstract: string
  technologies: string[]
  code_explanation: string
  image: string
  population: string
  environment: string
  clinical_ref: string
  citation_key: string
  bibtex: string
  filename: string
  file_size_kb: number
}

const typedPapers = papersData as Paper[]

export default function App() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'formulas' | 'papers'>('matrix')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TEA' | 'Pose'>('ALL')
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title'>('year-desc')
  const [activeModuleFilter, setActiveModuleFilter] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  // Math Playground States
  const [alphaRMS, setAlphaRMS] = useState<number>(0.7)
  const [thresholdOcclusion, setThresholdOcclusion] = useState<number>(0.35)
  const [latencyWeight, setLatencyWeight] = useState<number>(0.85)

  // MathJax dynamic typesetting effect for SPA tab/modal changes and slider inputs
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      // Small timeout to let React render the updated DOM nodes first
      const timer = setTimeout(() => {
        window.MathJax.typesetPromise()
          .catch((err: any) => console.warn('MathJax typesetting error:', err))
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [activeTab, selectedPaper, alphaRMS, thresholdOcclusion, latencyWeight])

  // Mapping of ABA-Vision modules to scientific papers in this literature
  const abaModules = [
    {
      id: 'pose3d',
      title: '3D Pose (TRACE/ROMP)',
      description: 'Estimação tridimensional de articulações e profundidade.',
      keywords: ['trace', 'pose', 'mesh', 'romp', 'alphapose', 'hpe', 'skeleton'],
      icon: Layers,
      image: 'trace_pose_3d.png'
    },
    {
      id: 'occlusion',
      title: 'Robustez à Oclusão (GLAMR/JOTR)',
      description: 'Reconstrução de trajetórias sob oclusões e barreiras.',
      keywords: ['jotr', 'glamr', 'occlusion', 'tracking', 'occluded'],
      icon: GitFork,
      image: 'jotr_occlusion.png'
    },
    {
      id: 'grounding',
      title: 'Grounding Temporal (Time-R1)',
      description: 'Refinamento de latência e segmentação de eventos.',
      keywords: ['timezero', 'grounding', 'timer1', 'videollm', 'temporal', 'stvg', 'r1', 'vtg'],
      icon: Sparkles,
      image: 'timer1_grounding.png'
    },
    {
      id: 'efficiency',
      title: 'Token Merging (FlashVID/MA-LMM)',
      description: 'Compressão dinâmica de contexto e processamento longo.',
      keywords: ['flashvid', 'lmm', 'token', 'efficiency', 'ma lmm', 'long term', 'context'],
      icon: Cpu,
      image: 'flashvid_efficiency.png'
    }
  ]

  // Temporal distribution of publications for SVG line chart
  const yearsDistribution = useMemo(() => {
    const yearsMap: { [key: number]: number } = {}
    // Populate all years from 2014 to 2026
    for (let y = 2014; y <= 2026; y++) {
      yearsMap[y] = 0
    }
    typedPapers.forEach(p => {
      if (p.year >= 2014 && p.year <= 2026) {
        yearsMap[p.year] = (yearsMap[p.year] || 0) + 1
      }
    })
    return Object.entries(yearsMap).map(([year, count]) => ({
      year: parseInt(year),
      count
    })).sort((a, b) => a.year - b.year)
  }, [])

  const maxYearCount = useMemo(() => {
    return Math.max(...yearsDistribution.map(d => d.count), 1)
  }, [yearsDistribution])

  const linePoints = useMemo(() => {
    return yearsDistribution.map((d, idx) => {
      // 280px wide SVG. Margin left 25, margin right 25. Width for points = 230
      const x = 25 + (idx / (yearsDistribution.length - 1)) * 230
      // 180px high SVG. Margin bottom 30, margin top 20. Height for points = 110
      const y = 140 - (d.count / maxYearCount) * 100
      return { x, y, year: d.year, count: d.count }
    })
  }, [yearsDistribution, maxYearCount])

  const pathD = useMemo(() => {
    if (linePoints.length === 0) return ''
    return 'M ' + linePoints.map(p => `${p.x} ${p.y}`).join(' L ')
  }, [linePoints])

  const areaD = useMemo(() => {
    if (linePoints.length === 0) return ''
    const first = linePoints[0]
    const last = linePoints[linePoints.length - 1]
    return `M ${first.x} 140 L ` + linePoints.map(p => `${p.x} ${p.y}`).join(' L ') + ` L ${last.x} 140 Z`
  }, [linePoints])

  // Statistics calculation
  const stats = useMemo(() => {
    const total = typedPapers.length
    const teaCount = typedPapers.filter(p => p.category === 'TEA').length
    const poseCount = typedPapers.filter(p => p.category === 'Pose').length
    const avgYear = Math.round(typedPapers.reduce((sum, p) => sum + p.year, 0) / (total || 1))
    
    // Environment stats
    const schoolCount = typedPapers.filter(p => p.environment.toLowerCase().includes('escola') || p.environment.toLowerCase().includes('natural')).length
    const clinicalCount = total - schoolCount

    return { total, teaCount, poseCount, avgYear, schoolCount, clinicalCount }
  }, [])

  // Filtering and Sorting logic
  const filteredPapers = useMemo(() => {
    return typedPapers
      .filter(paper => {
        const matchesSearch =
          paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.contribution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.methodology.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.year.toString().includes(searchTerm) ||
          paper.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
          paper.citation_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.environment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.clinical_ref.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
          selectedCategory === 'ALL' || paper.category === selectedCategory

        const matchesYear =
          !selectedYear || paper.year === selectedYear

        let matchesModule = true
        if (activeModuleFilter) {
          const module = abaModules.find(m => m.id === activeModuleFilter)
          if (module) {
            matchesModule = module.keywords.some(kw =>
              paper.title.toLowerCase().includes(kw) ||
              paper.contribution.toLowerCase().includes(kw) ||
              paper.methodology.toLowerCase().includes(kw) ||
              paper.aba_relation.toLowerCase().includes(kw)
            )
          }
        }

        return matchesSearch && matchesCategory && matchesModule && matchesYear
      })
      .sort((a, b) => {
        if (sortBy === 'year-desc') return b.year - a.year
        if (sortBy === 'year-asc') return a.year - b.year
        return a.title.localeCompare(b.title)
      })
  }, [searchTerm, selectedCategory, sortBy, activeModuleFilter, selectedYear])

  // Count matches per module for SVG chart
  const moduleCounts = useMemo(() => {
    return abaModules.map(module => {
      const count = typedPapers.filter(paper => 
        module.keywords.some(kw =>
          paper.title.toLowerCase().includes(kw) ||
          paper.contribution.toLowerCase().includes(kw) ||
          paper.methodology.toLowerCase().includes(kw)
        )
      ).length
      return { name: module.title.split(' ')[0], count }
    })
  }, [])

  const handleModuleClick = (moduleId: string) => {
    if (activeModuleFilter === moduleId) {
      setActiveModuleFilter(null)
    } else {
      setActiveModuleFilter(moduleId)
    }
  }

  const getPaperImageUrl = (imageName: string) => {
    return new URL(`./assets/images/${imageName}`, import.meta.url).href
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    })
  }

  return (
    <div className="portal-app">
      <div className="background-grid" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* Header section */}
      <header className="portal-header">
        <div className="header-lockup">
          <div className="logo-badge">
            <Award size={28} />
          </div>
          <div>
            <h1>Revisão de Qualificação de Doutorado</h1>
            <p className="subtitle">Mapeamento Bibliográfico e Formulação Teórica — Framework ABA-Vision</p>
          </div>
        </div>

        <div className="header-meta">
          <span>PPGEE / UFPA</span>
          <strong>Tese de Doutorado</strong>
        </div>
      </header>

      {/* Advanced Academic Tabs */}
      <div className="tab-navigation-container">
        <div className="tab-navigation">
          <button
            className={activeTab === 'matrix' ? 'active' : ''}
            onClick={() => setActiveTab('matrix')}
          >
            <Table size={16} />
            Matriz do Estado da Arte
          </button>
          <button
            className={activeTab === 'formulas' ? 'active' : ''}
            onClick={() => setActiveTab('formulas')}
          >
            <Sliders size={16} />
            Métricas e Formulações
          </button>
          <button
            className={activeTab === 'papers' ? 'active' : ''}
            onClick={() => setActiveTab('papers')}
          >
            <BookOpen size={16} />
            Revisão de Artigos ({filteredPapers.length})
          </button>
        </div>
      </div>

      {/* Main Content Layout based on Active Tab */}
      {activeTab === 'matrix' && (
        <div className="tab-pane animate-fade-in">
          {/* SVG Statistics Dashboard for PhDs */}
          <section className="stats-charts-section">
            <div className="chart-container">
              <h4>Distribuição por Ambiente</h4>
              <div className="chart-svg-wrapper">
                <svg width="220" height="220" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="20" />
                  {/* Donut slice 1: School (Naturalistic) */}
                  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--accent-cyan)" strokeWidth="20"
                    strokeDasharray={`${(stats.schoolCount / stats.total) * 502.4} 502.4`}
                    strokeDashoffset="0"
                    transform="rotate(-90 100 100)"
                  />
                  {/* Donut slice 2: Clinical */}
                  <circle cx="100" cy="100" r="80" fill="none" stroke="var(--accent-purple)" strokeWidth="20"
                    strokeDasharray={`${(stats.clinicalCount / stats.total) * 502.4} 502.4`}
                    strokeDashoffset={`-${(stats.schoolCount / stats.total) * 502.4}`}
                    transform="rotate(-90 100 100)"
                  />
                  <text x="100" y="95" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold" fontFamily="var(--font-title)">
                    {stats.total}
                  </text>
                  <text x="100" y="115" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" letterSpacing="0.05em">
                    ARTIGOS
                  </text>
                </svg>
                <div className="chart-legend">
                  <div className="legend-item"><span className="legend-color bg-cyan"></span>Escolas/Naturalístico: {stats.schoolCount}</div>
                  <div className="legend-item"><span className="legend-color bg-purple"></span>Laboratórios/Clínico: {stats.clinicalCount}</div>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <h4>Artigos Citados por Módulo do ABA-Vision</h4>
              <div className="chart-svg-wrapper">
                <svg width="280" height="200" viewBox="0 0 280 200">
                  {moduleCounts.map((m, idx) => {
                    const y = 25 + idx * 42
                    const width = (m.count / 20) * 160 // Scale width
                    return (
                      <g key={idx}>
                        <text x="10" y={y + 16} fill="var(--text-secondary)" fontSize="11" fontWeight="500">{m.name}</text>
                        <rect x="85" y={y} width="170" height="20" rx="4" fill="rgba(255,255,255,0.02)" />
                        <rect x="85" y={y} width={width} height="20" rx="4" fill="url(#blue-gradient)" />
                        <text x={85 + width + 8} y={y + 15} fill="#fff" fontSize="11" fontWeight="bold">{m.count}</text>
                      </g>
                    )
                  })}
                  <defs>
                    <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent-indigo)" />
                      <stop offset="100%" stopColor="var(--accent-cyan)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="chart-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>Evolução de Publicações por Ano</h4>
                {selectedYear && (
                  <button 
                    onClick={() => setSelectedYear(null)} 
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Limpar ano ({selectedYear})
                  </button>
                )}
              </div>
              <div className="chart-svg-wrapper">
                <svg width="280" height="150" viewBox="0 0 280 150">
                  <defs>
                    <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="25" y1="30" x2="255" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="25" y1="85" x2="255" y2="85" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="25" y1="140" x2="255" y2="140" stroke="rgba(255,255,255,0.1)" />

                  {/* Filled Area */}
                  <path d={areaD} fill="url(#area-gradient)" />

                  {/* Glowing Line */}
                  <path d={pathD} fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Intersect Dots */}
                  {linePoints.map((pt, idx) => {
                    const isSelected = selectedYear === pt.year
                    return (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 6 : 4}
                          fill={isSelected ? '#fff' : 'var(--bg-dark)'}
                          stroke={isSelected ? 'var(--accent-cyan)' : 'var(--accent-glow)'}
                          strokeWidth={isSelected ? 3 : 2}
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          onClick={() => setSelectedYear(selectedYear === pt.year ? null : pt.year)}
                        >
                          <title>{pt.year}: {pt.count} artigos</title>
                        </circle>
                        {pt.count > 0 && (
                          <text
                            x={pt.x}
                            y={pt.y - 8}
                            fill="#fff"
                            fontSize="8"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {pt.count}
                          </text>
                        )}
                        {/* Year text labels at the bottom */}
                        {idx % 2 === 0 && (
                          <text
                            x={pt.x}
                            y="148"
                            fill="var(--text-muted)"
                            fontSize="8"
                            textAnchor="middle"
                          >
                            {String(pt.year).substring(2)}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
          </section>

          {/* Interactive Scientific Table */}
          <section className="matrix-table-section">
            <div className="table-header-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>Matriz Cruzada do Estado da Arte</h3>
                {selectedYear && (
                  <span className="active-filter-badge">
                    Ano: {selectedYear}
                    <button onClick={() => setSelectedYear(null)}>×</button>
                  </span>
                )}
              </div>
              
              <div className="table-filters">
                <div className="search-box small">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Buscar na tabela..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as any)}>
                  <option value="ALL">Todos os Temas</option>
                  <option value="TEA">TEA / Triagem</option>
                  <option value="Pose">Pose / LLMs</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="scientific-table">
                <thead>
                  <tr>
                    <th>Citação (BibTeX)</th>
                    <th>Título do Artigo</th>
                    <th>Tema</th>
                    <th>Ano</th>
                    <th>População-Alvo</th>
                    <th>Ambiente</th>
                    <th>Ref. Clínica</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.map(paper => (
                    <tr key={paper.id} onClick={() => setSelectedPaper(paper)}>
                      <td className="citation-key">
                        <code>@{paper.citation_key}</code>
                      </td>
                      <td className="table-paper-title">
                        <strong>{paper.title}</strong>
                        <span className="table-authors-span">{paper.authors}</span>
                      </td>
                      <td>
                        <span className={`category-tag-small ${paper.category.toLowerCase()}`}>
                          {paper.category === 'TEA' ? 'TEA' : 'Pose/LLM'}
                        </span>
                      </td>
                      <td>{paper.year}</td>
                      <td>{paper.population}</td>
                      <td>
                        <span className={`env-tag ${paper.environment.toLowerCase().includes('escola') || paper.environment.toLowerCase().includes('natural') ? 'school' : 'clinical'}`}>
                          {paper.environment}
                        </span>
                      </td>
                      <td>{paper.clinical_ref}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          className={`btn-copy-citation ${copiedKey === paper.citation_key ? 'copied' : ''}`}
                          onClick={() => copyToClipboard(paper.bibtex, paper.citation_key)}
                          title="Copiar Citação BibTeX"
                        >
                          {copiedKey === paper.citation_key ? 'Copiado!' : <><Copy size={12} /> BibTeX</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="tab-pane animate-fade-in">
          {/* Mathematical Formulations Sandbox */}
          <section className="math-sandbox-grid">
            
            {/* Left Side: Parameters sliders */}
            <div className="sandbox-panel params-config">
              <div className="panel-header">
                <Settings size={18} className="text-cyan" />
                <h3>Configuração de Variáveis (Simulação)</h3>
              </div>
              <p className="panel-desc">Ajuste os parâmetros abaixo para recalcular teoricamente a acurácia do pipeline de ablação do ABA-Vision:</p>

              <div className="control-slider">
                <div className="slider-labels">
                  <label>Peso de Estereotipia Motor ($\\alpha$ no RMS)</label>
                  <span>{alphaRMS}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={alphaRMS}
                  onChange={e => setAlphaRMS(parseFloat(e.target.value))}
                />
                <span className="slider-help">Equilibra a densidade espectral ($\rho_i$) com a amplitude do balanço ($A_i$).</span>
              </div>

              <div className="control-slider">
                <div className="slider-labels">
                  <label>Limiar de Intersecção de Oclusão ($\\tau$)</label>
                  <span>{thresholdOcclusion}s</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.6"
                  step="0.05"
                  value={thresholdOcclusion}
                  onChange={e => setThresholdOcclusion(parseFloat(e.target.value))}
                />
                <span className="slider-help">Sensibilidade máxima do algoritmo de Hungarian Matching para tolerância de Re-ID.</span>
              </div>

              <div className="control-slider">
                <div className="slider-labels">
                  <label>Refinamento de Latência (Time-R1 RL)</label>
                  <span>-{(100 - (latencyWeight * 100)).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.0"
                  step="0.01"
                  value={latencyWeight}
                  onChange={e => setLatencyWeight(parseFloat(e.target.value))}
                />
                <span className="slider-help">Fator de refinamento temporal obtido via alinhamento reinforcement learning.</span>
              </div>

              {/* Recalculated outputs */}
              <div className="sandbox-outputs">
                <h4>Benchmark Teórico Resultante</h4>
                <div className="output-row">
                  <span>Margem de ID-Switches (Robustez)</span>
                  <strong>{(4.2 - thresholdOcclusion * 4).toFixed(2)}% (vs 12.8% baseline)</strong>
                </div>
                <div className="output-row">
                  <span>Erro Médio de Latência (IRL-MAE)</span>
                  <strong>{(1.4 * latencyWeight).toFixed(2)}s (vs 2.3s heurístico)</strong>
                </div>
                <div className="output-row">
                  <span>Sensibilidade à Estereotipias (RMS F1)</span>
                  <strong>{(0.78 + (alphaRMS * 0.1)).toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Right Side: Math Formulas Viewer */}
            <div className="sandbox-panel formulas-display">
              <div className="panel-header">
                <Terminal size={18} className="text-purple" />
                <h3>Formulações de Métricas Comportamentais (Tese)</h3>
              </div>

              <div className="formula-block">
                <h5>{"1. Atenção Conjunta Proporcional ($\\mathrm{JA}_i$)"}</h5>
                <p className="formula-latex">
                  {"$$\\mathrm{JA}_i = \\frac{1}{|\\mathcal{E}_{\\mathrm{JA}}|} \\sum_{e \\in \\mathcal{E}_{\\mathrm{JA}}} \\mathbb{1}[\\text{student } i \\text{ orients toward gaze target}]$$"}
                </p>
                <p className="formula-desc">Mapeia o contato visual compartilhado entre a criança e o terapeuta sobre o brinquedo, crucial para mensurar o diagnóstico de IJA (Initiating Joint Attention).</p>
              </div>

              <div className="formula-block">
                <h5>{"2. Latência de Resposta a Instruções ($\\mathrm{IRL}_i$)"}</h5>
                <p className="formula-latex">
                  {`$$\\mathrm{IRL}_i = \\frac{1}{|\\mathcal{E}_{\\mathrm{inst}}|} \\sum_{e \\in \\mathcal{E}_{\\mathrm{inst}}} (t_{s,e}^* - t_{\\mathrm{inst},e}) \\cdot \\text{Weight}_{\\mathrm{RL}} \\quad (\\text{Weight}_{\\mathrm{RL}} = ${latencyWeight})$$`}
                </p>
                <p className="formula-desc">Mede o atraso temporal entre a instrução verbal dada pelo terapeuta e o início de resposta motora da criança autista.</p>
              </div>

              <div className="formula-block">
                <h5>{"3. Pontuação de Comportamento Repetitivo ($\\mathrm{RMS}_i$)"}</h5>
                <p className="formula-latex">
                  {`$$\\mathrm{RMS}_i = ${alphaRMS} \\cdot \\rho_i + (${(1 - alphaRMS).toFixed(2)}) \\cdot A_i$$`}
                </p>
                <p className="formula-desc">Funde a densidade de frequência de oscilação ($\\rho_i$) com a amplitude do desvio padrão espacial ($A_i$) para quantificar estereotipias como balanceio de mãos (flapping).</p>
              </div>

              <div className="formula-block">
                <h5>{"4. Taxa de Engajamento Social Contínuo ($\\mathrm{SER}_i$)"}</h5>
                <p className="formula-latex">
                  {`$$\\mathrm{SER}_i = \\frac{\\sum_t \\mathrm{vis}_i(t) \\cdot (1 - \\mathrm{occ}_i(t) \\cdot \\mathbb{1}[\\mathrm{occ}_i(t) > ${thresholdOcclusion}])}{T_{\\mathrm{session}}}$$`}
                </p>
                <p className="formula-desc">Métrica de visibilidade livre de oclusões para determinar o tempo real que a criança interage de forma visível na sessão de terapia.</p>
              </div>

              <hr className="divider" />

              <div className="panel-header" style={{marginTop: '1rem'}}>
                <Sparkles size={18} className="text-cyan" />
                <h3>Equações de Perda dos Blocos Principais</h3>
              </div>

              <div className="formula-block">
                <h5>{"Ablação Bloco 1: Perda de Consistência de Trajetória TRACE ($L_{vel}$)"}</h5>
                <p className="formula-latex">
                  {"$$\\mathcal{L}_{vel} = \\sum_{t=1}^{T-1} \\|\\mathbf{x}_{3D}^{t+1} - \\mathbf{x}_{3D}^t - \\mathbf{v}_{3D}^t \\Delta t\\|_2^2$$"}
                </p>
              </div>

              <div className="formula-block">
                <h5>{"Ablação Bloco 2: Perda de Associação Contrastiva Oclusão JOTR ($L_{joint\\_contr}$)"}</h5>
                <p className="formula-latex">
                  {`$$\\mathcal{L}_{joint} = -\\log \\frac{\\exp(\\mathbf{z}_i \\cdot \\mathbf{z}_i^+ / \\tau)}{\\sum_j \\exp(\\mathbf{z}_i \\cdot \\mathbf{z}_j / \\tau)} \\quad (\\tau = ${thresholdOcclusion})$$`}
                </p>
              </div>

              <div className="formula-block">
                <h5>{"Ablação Bloco 3: Recompensa GRPO do Time-R1 ($R_i$)"}</h5>
                <p className="formula-latex">
                  {"$$R_i = \\mathrm{tIoU}([t_s, t_e], [t_s^{\\mathrm{GT}}, t_e^{\\mathrm{GT}}]) + \\beta \\cdot \\mathrm{Length}(\\mathrm{CoT})$$"}
                </p>
              </div>

            </div>

          </section>
        </div>
      )}

      {activeTab === 'papers' && (
        <div className="tab-pane animate-fade-in">
          {/* Mapping Matrix Interactive Banner */}
          <section className="matrix-section">
            <div className="section-title">
              <Sparkles size={16} className="text-cyan" />
              <h2>Mapeamento de Módulos da Tese (ABA-Vision)</h2>
            </div>
            <p className="matrix-desc">
              Clique em um dos módulos abaixo para isolar e inspecionar todos os artigos que serviram de embasamento científico direto ou baseline para seu respectivo desenvolvimento:
            </p>

            <div className="matrix-grid">
              {abaModules.map(module => {
                const Icon = module.icon
                const isActive = activeModuleFilter === module.id
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={`matrix-card ${isActive ? 'active' : ''}`}
                    style={{
                      border: isActive ? '1.5px solid var(--accent-glow)' : '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="matrix-image-wrapper">
                      <img
                        src={getPaperImageUrl(module.image)}
                        alt={module.title}
                        className="matrix-bg-img"
                      />
                      <div className="matrix-overlay-shading" />
                    </div>
                    <div className="matrix-card-content">
                      <div className="matrix-header">
                        <Icon size={20} className={isActive ? 'text-cyan' : 'text-grey'} />
                        <h3>{module.title}</h3>
                      </div>
                      <p>{module.description}</p>
                      <span className="matrix-badge">
                        {isActive ? 'Filtro Ativo' : 'Clique para filtrar'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Controls: Search, Filter, Sort */}
          <section className="controls-bar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por título, autores, tecnologia, contribuição ou palavra-chave..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm('')}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filters-group">
              {/* Category Selection */}
              <div className="tabs">
                <button
                  className={selectedCategory === 'ALL' ? 'active' : ''}
                  onClick={() => setSelectedCategory('ALL')}
                >
                  Todos
                </button>
                <button
                  className={selectedCategory === 'TEA' ? 'active' : ''}
                  onClick={() => setSelectedCategory('TEA')}
                >
                  TEA/Autismo
                </button>
                <button
                  className={selectedCategory === 'Pose' ? 'active' : ''}
                  onClick={() => setSelectedCategory('Pose')}
                >
                  Pose & LLMs
                </button>
              </div>

              {/* Sorting */}
              <div className="sort-select">
                <ArrowUpDown size={14} />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                >
                  <option value="year-desc">Ano: Mais recente</option>
                  <option value="year-asc">Ano: Mais antigo</option>
                  <option value="title">Título: A-Z</option>
                </select>
              </div>
            </div>
          </section>

          {/* Active filters status */}
          {(activeModuleFilter || selectedYear) && (
            <div className="filter-status-banner">
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {activeModuleFilter && (
                  <span>
                    Módulo: <strong>{abaModules.find(m => m.id === activeModuleFilter)?.title}</strong>
                  </span>
                )}
                {selectedYear && (
                  <span>
                    Ano: <strong>{selectedYear}</strong>
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {activeModuleFilter && (
                  <button onClick={() => setActiveModuleFilter(null)} style={{ border: '1px solid rgba(6, 182, 212, 0.2)', padding: '4px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.05)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Limpar Módulo <X size={14} />
                  </button>
                )}
                {selectedYear && (
                  <button onClick={() => setSelectedYear(null)} style={{ border: '1px solid rgba(6, 182, 212, 0.2)', padding: '4px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.05)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Limpar Ano <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Article Grid */}
          <main className="papers-grid-section">
            {filteredPapers.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} className="text-grey" />
                <p>Nenhum artigo científico corresponde aos filtros aplicados.</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('ALL')
                    setActiveModuleFilter(null)
                    setSelectedYear(null)
                  }}
                  className="reset-btn"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="papers-grid">
                {filteredPapers.map(paper => (
                  <article
                    key={paper.id}
                    className="paper-card"
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <div className="card-top">
                      <span className={`category-tag ${paper.category.toLowerCase()}`}>
                        {paper.category === 'TEA' ? 'TEA & Autismo' : 'Pose 3D & LLM'}
                      </span>
                      <span className="year-tag">
                        <Calendar size={12} />
                        {paper.year}
                      </span>
                    </div>

                    <h3 className="paper-title">{paper.title}</h3>
                    <p className="paper-authors">{paper.authors}</p>

                    <p className="paper-contribution-preview">
                      {paper.contribution}
                    </p>

                    <div className="card-tech-pills">
                      {paper.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="tech-pill-micro">{tech}</span>
                      ))}
                      {paper.technologies.length > 3 && (
                        <span className="tech-pill-micro-more">+{paper.technologies.length - 3}</span>
                      )}
                    </div>

                    <div className="card-footer">
                      <div className="relation-tag">
                        <Bookmark size={12} />
                        <span>Conexão ABA-Vision</span>
                      </div>
                      <span className="read-more">Ver Detalhes →</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="portal-footer">
            <p>© 2026 Alberto Mateus Pinheiro da Gama. PPGEE / UFPA. Projeto de Qualificação de Doutorado.</p>
            <p className="footer-details">Desenvolvido com React, Vite e Vanilla CSS. Todos os 29 artigos foram mapeados localmente.</p>
          </footer>
        </div>
      )}

      {/* Detailed Modal/Drawer */}
      {selectedPaper && (
        <div className="modal-overlay" onClick={() => setSelectedPaper(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <span className={`category-tag ${selectedPaper.category.toLowerCase()}`}>
                {selectedPaper.category === 'TEA' ? 'Triagem e Comportamento Autista' : 'Pose Corporal e Vídeo-LLMs'}
              </span>
              <button className="close-button" onClick={() => setSelectedPaper(null)}>
                <X size={20} />
              </button>
            </header>

            <div className="modal-content">
              {/* Image Preview Header */}
              <div className="modal-image-showcase">
                <img
                  src={getPaperImageUrl(selectedPaper.image)}
                  alt={selectedPaper.title}
                  className="showcase-img"
                />
                <div className="showcase-gradient" />
                <div className="showcase-caption">
                  <Activity size={14} className="text-cyan animate-pulse" />
                  <span>Modelo de Referência ABA-Vision</span>
                </div>
              </div>

              <h2 className="modal-title">{selectedPaper.title}</h2>
              
              <div className="modal-meta">
                <div className="meta-item">
                  <strong>Autores:</strong>
                  <span>{selectedPaper.authors}</span>
                </div>
                <div className="meta-item">
                  <strong>Ano:</strong>
                  <span>{selectedPaper.year}</span>
                </div>
                <div className="meta-item">
                  <strong>População-Alvo:</strong>
                  <span>{selectedPaper.population}</span>
                </div>
                <div className="meta-item">
                  <strong>Ambiente de Teste:</strong>
                  <span>{selectedPaper.environment}</span>
                </div>
                <div className="meta-item">
                  <strong>Referência Clínica:</strong>
                  <span>{selectedPaper.clinical_ref}</span>
                </div>
                <div className="meta-item">
                  <strong>Chave de Citação:</strong>
                  <code>{selectedPaper.citation_key}</code>
                </div>
                <div className="meta-item">
                  <strong>Arquivo local:</strong>
                  <span className="file-info">
                    <FileText size={12} />
                    {selectedPaper.filename} ({(selectedPaper.file_size_kb / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>

              {/* Technologies Section */}
              <div className="content-section">
                <h3><Cpu size={16} /> Tecnologias e Frameworks</h3>
                <div className="tech-pills-container">
                  {selectedPaper.technologies.map((tech, index) => (
                    <span key={index} className="tech-pill-large">{tech}</span>
                  ))}
                </div>
              </div>

              <hr className="divider" />

              <div className="content-section">
                <h3><BookOpen size={16} /> Resumo Analítico</h3>
                <p className="abstract-text">{selectedPaper.abstract}</p>
              </div>

              <div className="content-section">
                <h3><Layers size={16} /> Contribuição Principal</h3>
                <p className="highlight-box font-medium">{selectedPaper.contribution}</p>
              </div>

              <div className="content-section">
                <h3><Bookmark size={16} /> Metodologia e Abordagem</h3>
                <p className="text-secondary">{selectedPaper.methodology}</p>
              </div>

              {/* Code & Math Explanation Section */}
              <div className="content-section code-math-section">
                <h3><Terminal size={16} className="text-purple" /> Algoritmo & Formulação Matemática</h3>
                <div className="code-block-wrapper">
                  <div className="code-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                    <span className="code-title">kernel_compilation.py / mathematical_formulas</span>
                  </div>
                  <pre className="code-pre">
                    <code>{selectedPaper.code_explanation}</code>
                  </pre>
                </div>
              </div>

              {/* BibTeX citation section */}
              <div className="content-section bibtex-section">
                <div className="bibtex-header-row">
                  <h3><Copy size={16} /> Citação Acadêmica (BibTeX)</h3>
                  <button
                    className={`btn-copy-citation-modal ${copiedKey === selectedPaper.citation_key ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(selectedPaper.bibtex, selectedPaper.citation_key)}
                  >
                    {copiedKey === selectedPaper.citation_key ? 'Copiado para Área de Transferência!' : 'Copiar Citação'}
                  </button>
                </div>
                <div className="code-block-wrapper">
                  <pre className="code-pre bibtex-code-pre">
                    <code>{selectedPaper.bibtex}</code>
                  </pre>
                </div>
              </div>

              <div className="content-section relation-section">
                <h3><CheckCircle size={16} className="text-cyan" /> Relacionamento e Impacto no ABA-Vision</h3>
                <p className="relation-box">{selectedPaper.aba_relation}</p>
              </div>
            </div>

            <footer className="modal-footer">
              <button className="close-btn-footer" onClick={() => setSelectedPaper(null)}>
                Fechar Detalhes
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}
