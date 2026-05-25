import { useState, useMemo } from 'react'
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
  BookMarked,
  Terminal,
  Activity
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
  filename: string
  file_size_kb: number
}

const typedPapers = papersData as Paper[]

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TEA' | 'Pose'>('ALL')
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title'>('year-desc')
  const [activeModuleFilter, setActiveModuleFilter] = useState<string | null>(null)

  // Mapping of ABA-Vision modules to scientific papers in this literature
  const abaModules = [
    {
      id: 'pose3d',
      title: '3D Pose (TRACE/ROMP)',
      description: 'Estimação tridimensional de articulações e profundidade.',
      keywords: ['trace', 'pose', 'mesh', 'romp', 'alphapose', 'hpe'],
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
      keywords: ['timezero', 'grounding', 'timer1', 'videollm', 'temporal', 'stvg', 'r1'],
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

  // Statistics calculation
  const stats = useMemo(() => {
    const total = typedPapers.length
    const teaCount = typedPapers.filter(p => p.category === 'TEA').length
    const poseCount = typedPapers.filter(p => p.category === 'Pose').length
    const avgYear = Math.round(typedPapers.reduce((sum, p) => sum + p.year, 0) / (total || 1))
    return { total, teaCount, poseCount, avgYear }
  }, [])

  // Filtering and Sorting logic
  const filteredPapers = useMemo(() => {
    return typedPapers
      .filter(paper => {
        // Search Term Filter
        const matchesSearch =
          paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.contribution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.methodology.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paper.year.toString().includes(searchTerm) ||
          paper.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))

        // Category Filter
        const matchesCategory =
          selectedCategory === 'ALL' || paper.category === selectedCategory

        // Dynamic Module Filter
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

        return matchesSearch && matchesCategory && matchesModule
      })
      .sort((a, b) => {
        if (sortBy === 'year-desc') return b.year - a.year
        if (sortBy === 'year-asc') return a.year - b.year
        return a.title.localeCompare(b.title)
      })
  }, [searchTerm, selectedCategory, sortBy, activeModuleFilter])

  const handleModuleClick = (moduleId: string) => {
    if (activeModuleFilter === moduleId) {
      setActiveModuleFilter(null)
    } else {
      setActiveModuleFilter(moduleId)
    }
  }

  // Helper to dynamically get image URLs in Vite
  const getPaperImageUrl = (imageName: string) => {
    return new URL(`./assets/images/${imageName}`, import.meta.url).href
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
            <BookMarked size={28} />
          </div>
          <div>
            <h1>Portal do Estado da Arte</h1>
            <p className="subtitle">Mapeamento Bibliográfico e Revisão Científica — ABA-Vision Framework</p>
          </div>
        </div>

        <div className="header-meta">
          <span>PPGEE / UFPA</span>
          <strong>Tese de Doutorado</strong>
        </div>
      </header>

      {/* Stats Board */}
      <section className="stats-board">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Artigos Escaneados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-cyan">{stats.teaCount}</div>
          <div className="stat-label">Autismo e Triagem</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-purple">{stats.poseCount}</div>
          <div className="stat-label">Pose 3D e Vídeo-LLMs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgYear}</div>
          <div className="stat-label">Ano Médio de Publicação</div>
        </div>
      </section>

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
      {activeModuleFilter && (
        <div className="filter-status-banner">
          <span>
            Mostrando apenas artigos vinculados ao módulo:{' '}
            <strong>{abaModules.find(m => m.id === activeModuleFilter)?.title}</strong>
          </span>
          <button onClick={() => setActiveModuleFilter(null)}>
            Remover filtro <X size={14} />
          </button>
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

                {/* Micro tech pills on card */}
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
