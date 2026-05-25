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
  Settings,
  ChevronDown,
  Maximize2,
  Minimize2,
  Download
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

const anchorSections = [
  {
    title: "Identificação & Resumo Geral",
    pages: "Geral",
    summary: "Artigo de referência principal que serve de base clínica, comportamental e técnica para o ecossistema ABA-Vision. Propõe um framework integrado de visão computacional voltado para avaliação automatizada e quantitativa de comportamentos atípicos em crianças autistas, mapeando as interações espaço-temporais de forma objetiva.",
    details: [
      {
        label: "Título Completo",
        value: "Computer Vision-Based Assessment of Autistic Children: Analyzing Interactions, Emotions, Human Pose, and Life Skills"
      },
      {
        label: "Journal / Conferência",
        value: "IEEE Access, Volume 11, 2023 (Páginas 47907-47929)"
      },
      {
        label: "Autores Principais",
        value: "Varun Ganjigunte Prakash (CogniAble), Manu Kohli, Swati Kohli, A. P. Prathosh (IISc Bengaluru), Tanu Wadhera, Diptanshu Das, Debasis Panigrahi, John Vijay Sagar Kommu (NIMHANS)."
      },
      {
        label: "DOI Clínico",
        value: "10.1109/ACCESS.2023.3269027"
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_1_1.png",
        caption: "Logo / Cabeçalho do artigo publicado na IEEE Access (2023)."
      }
    ]
  },
  {
    title: "I. Introdução",
    pages: "Págs 1-3",
    summary: "Discute a prevalência do Transtorno do Espectro Autista (TEA) e os gargalos dos métodos tradicionais de diagnóstico padrão-ouro (como ADOS-2, CARS-2 e VBMAPP). Estes são manuais, dependem de alta especialização clínica, são demorados, caros e propensos a variações subjetivas entre observadores.",
    details: [
      {
        label: "Motivação",
        value: "A necessidade de ferramentas quantitativas, reprodutíveis e de baixo custo que possam complementar o julgamento clínico tradicional, permitindo triagem contínua e avaliação longitudinal da terapia."
      },
      {
        label: "Inovação Proposta",
        value: "Um framework holístico que funde três trilhas de visão computacional: 1) Compreensão de Atividades, 2) Reconhecimento de Expressões Faciais (FER), e 3) Modelos de Atenção Conjunta (Gaze & Pointing)."
      }
    ],
    figures: []
  },
  {
    title: "II. Revisão de Literatura",
    pages: "Págs 3-5",
    summary: "Revisa os fundamentos de intervenções comportamentais (focando em Análise do Comportamento Aplicada - Terapia ABA) e detalha o estado da arte de técnicas de visão computacional aplicadas ao TEA, mapeando as limitações históricas de pesquisas anteriores.",
    details: [
      {
        label: "Gargalos em Pose (HPE)",
        value: "Limitações clássicas de HPE (como AlphaPose, OpenPose) no rastreamento infantil: movimentos menores e mais rápidos, alta taxa de oclusão por objetos de brinquedo e mesas, e ausência de datasets específicos de crianças."
      },
      {
        label: "Limitações de Ação e Emoção",
        value: "Modelos clássicos de ação operam apenas em vídeos curtos e trimados, enquanto sessões de terapia real duram mais de 30 minutos. Além disso, modelos FER tradicionais falham em capturar atipicidades em expressões faciais autistas (como choro/riso atípicos)."
      }
    ],
    figures: []
  },
  {
    title: "III. Procedimento do Estudo & Formulação do Problema",
    pages: "Pág 5",
    summary: "Apresenta o protocolo ético do estudo experimental e define o problema matematicamente. Descreve o mapeamento de sequências temporais de vídeo multifatoriais em uma estrutura de grafos ou séries temporais contínuas.",
    details: [
      {
        label: "Aspectos Éticos e Recrutamento",
        value: "Crianças com TEA recrutadas na SM Learning Skills Academy e no NIMHANS (Bangalore). O comitê de ética institucional aprovou o estudo e termo de consentimento foi assinado pelos responsáveis legais."
      },
      {
        label: "Formulação Matemática",
        value: "Dado um vídeo contínuo $V = \\{f_1, f_2, ..., f_T\\}$, o objetivo é mapear cada frame $f_t$ em uma tupla contendo a bounding box da criança $B_c(t)$, a ação da criança $A_c(t)$, a expressão emocional $E(t)$ e o vetor de foco de atenção conjunta $JA(t) = [Gaze(t), Point(t)]$, correlacionando-os espacialmente."
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_7_2.png",
        caption: "Figura 2: Fluxograma clínico de recrutamento, gravação e avaliação usando o modelo de compreensão de atividades."
      }
    ]
  },
  {
    title: "IV-A. Coleta e Processamento de Dados",
    pages: "Págs 5-6",
    summary: "Descreve a estruturação do conjunto de dados de treino e teste. Combina o conjunto público AVA (Atomic Visual Actions) com um conjunto de dados proprietário CogniAble gravado em sessões clínicas reais com terapeutas e crianças autistas.",
    details: [
      {
        label: "Base de Dados Utilizada",
        value: "21 vídeos gravados em clínica (NIMHANS) sob condições semi-controladas e 27 vídeos públicos adicionais (out-of-distribution) obtidos via YouTube e Vimeo para teste de robustez a variações de cenário, luz e câmera."
      },
      {
        label: "Anotação Manual",
        value: "Os vídeos de teste foram anotados manualmente quadro a quadro por especialistas clínicos para gerar os rótulos de verdade fundamental (Ground Truth) de ações, emoções e gestos direcionais."
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_8_1.png",
        caption: "Figura 3: Interface do console e anotação temporal do modelo de compreensão de atividades."
      }
    ]
  },
  {
    title: "IV-B. Modelo de Compreensão de Atividades",
    pages: "Págs 6-10",
    summary: "Explica a rede neural spatiotemporal para reconhecimento de ações da criança e do terapeuta. Utiliza uma YOLOv5 para obter bounding boxes das pessoas, seguida por um extrator de características espaciais ResNet-50 e um classificador temporal LSTM.",
    details: [
      {
        label: "Pipeline e 10 Ações Alvo",
        value: "Detecta e rastreia 10 classes de atividades cruciais na terapia ABA: sentar, correr, caminhar, bater/brigar, engajamento geral, interação com terapeuta, Watching, segurar brinquedos/objetos, e uso de telefone (pelo terapeuta)."
      },
      {
        label: "Visualização via Scatter Plots",
        value: "O principal output do modelo é um Scatter Plot temporal que mapeia a ocorrência contínua de ações de engajamento e não-engajamento ao longo da sessão. Isso permite aos clínicos avaliar o tempo ativo de aprendizado da criança e monitorar a postura profissional do terapeuta (ex: uso de celular em serviço)."
      },
      {
        label: "Métrica de Validação (t-IoU)",
        value: "Como as ações têm durações variáveis e sobreposições, a correspondência é avaliada usando a Intersecção sobre União Temporal ($t\\text{-}IoU$). O limiar de verdadeiro positivo é definido como $t\\text{-}IoU \\ge 0.30$, garantindo alinhamento fino das bordas temporais."
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_9_1.png",
        caption: "Figura 4: Arquitetura detalhada do pipeline espaço-temporal (YOLO + ResNet + LSTM) para detecção de ações."
      },
      {
        name: "extracted_prakash_fig_9_3.png",
        caption: "Figura 4 (Continuação): Fluxo de processamento e fusão de bounding boxes entre criança e terapeuta."
      },
      {
        name: "extracted_prakash_fig_10_2.png",
        caption: "Figura 5: Exemplo de gráfico de dispersão gerado, indicando comportamentos disruptivos de bater (hitting) e correr (running) de um aluno."
      },
      {
        name: "extracted_prakash_fig_11_1.png",
        caption: "Figura 6: Scatter plot regular de interação contínua entre criança (círculos) e terapeuta (triângulos)."
      },
      {
        name: "extracted_prakash_fig_11_3.png",
        caption: "Figura 7: Gráfico setorial (Pizza) de porcentagem de engajamento acumulado na sessão."
      }
    ]
  },
  {
    title: "IV-C. Modelo de Reconhecimento de Expressões Faciais (FER)",
    pages: "Págs 10-12",
    summary: "Desenvolve um detector de emoções especializado em crianças autistas (que expressam afetividade de forma atípica). Supera o viés de modelos comerciais pré-treinados em adultos neurotípicos criando um dataset estendido com crianças pequenas chocado com o FER2013 público.",
    details: [
      {
        label: "Dataset Ampliado",
        value: "Adiciona 9.882 imagens de crianças chorando (crying) e 10.268 de crianças rindo (laughing), extraídas de conjuntos como Kinetics, HMDB e dados clínicos CogniAble, totalizando 9 expressões (adicionando choro/riso às 7 emoções básicas do FER2013)."
      },
      {
        label: "Métrica de Confiabilidade Clínica",
        value: "A rede é treinada com técnicas de Flip, variação de brilho e rotação para evitar overfitting. No teste clínico, uma predição só é válida se a classe for idêntica à anotação e o nível de confiança (probabilidade de saída do Softmax) for $\\ge 85\\%$, filtrando ruídos de micro-expressões sem relevância clínica."
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_12_1.png",
        caption: "Figura 8: Matriz de confusão da classificação das 9 expressões faciais (FER+ estendido)."
      }
    ]
  },
  {
    title: "IV-D. Modelos de Atenção Conjunta (Joint Attention)",
    pages: "Págs 12-14",
    summary: "Detesta um dos marcadores diagnósticos mais difíceis do autismo: a capacidade da criança de compartilhar atenção visual. O modelo divide isso em duas sub-redes: 1) Gaze-Follow (Seguir o Olhar) e 2) Pointing (Gestos de Apontar).",
    details: [
      {
        label: "1. Gaze-Follow (Rastreamento de Olhar)",
        value: "Estima a pose 3D da cabeça usando marcos faciais e o algoritmo Perspective-n-Point (PnP) para calcular os ângulos de Yaw, Pitch e Roll. Em vez de rastrear pupilas (que exige câmeras infravermelhas de alto custo), o modelo monitora a mudança de sinal (sign change) no ângulo Yaw. Uma transição rápida de Yaw positivo para negativo indica rotação cefálica para acompanhar o terapeuta ou o objeto."
      },
      {
        label: "2. Pointing (Detecção de Apontamento)",
        value: "Usa uma rede Faster R-CNN com backbone ResNet-50 v1, finotunada em um dataset massivo de 24.369 imagens anotadas de mãos/dedos apontando. O modelo atinge a precisão média de $mAP@0.5IoU = 0.917$ e sensibilidade (recall) de $77\\%$, capturando o pointing mesmo em ângulos oblíquos."
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_13_1.png",
        caption: "Figura 11: Ilustração de modelos de atenção conjunta (rastreamento de olhar baseada em yaw e bounding boxes de face/cabeça)."
      },
      {
        name: "extracted_prakash_fig_13_3.png",
        caption: "Figura 11 (Continuação): Exemplos de detecção do modelo de apontamento de dedo com oclusão parcial."
      }
    ]
  },
  {
    title: "V. Resultados, Discussão & Limitações",
    pages: "Págs 14-19",
    summary: "Valida o framework contra anotações padrão-ouro clínicas e discute a generalização do modelo em dados públicos fora do domínio de treino. Expõe os resultados quantitativos de cada bloco e propõe direcionamentos futuros.",
    details: [
      {
        label: "Resultados de Ação",
        value: "O modelo spatiotemporal atinge precisões e sensibilidades superiores a 70% nas 10 ações alvo nos vídeos clínicos. Na validação adversária com vídeos públicos (onde a câmera treme e há várias pessoas em tela), a precisão manteve-se alta, confirmando a robustez."
      },
      {
        label: "Resultados de Emoção",
        value: "O classificador FER estendido obteve acurácia de 73.9% no teste de imagens estáticas, mas no teste de vídeo clínico obteve estabilidade com acurácia média superior a 93% nas classes Happy, Sad, Surprise e Neutral usando o filtro de confiança de 85%."
      },
      {
        label: "Impacto Prático e Limitações",
        value: "Demonstra que a automação reduz o tempo gasto por psicólogos e terapeutas em tarefas de anotação de sessões de terapia em até 70%. Limitações citadas incluem: vulnerabilidade a oclusões totais e a necessidade de múltiplas câmeras para mapeamento de salas inteiras."
      }
    ],
    figures: [
      {
        name: "extracted_prakash_fig_14_2.png",
        caption: "Figura 12: Resultados quantitativos e percentual de acerto por classe de emoção."
      },
      {
        name: "extracted_prakash_fig_15_1.png",
        caption: "Figura 13: Matriz de confusão de teste da detecção de ações da criança."
      }
    ]
  }
]

export default function App() {
  const [activeTab, setActiveTab] = useState<'anchor' | 'matrix' | 'formulas' | 'papers'>('anchor')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TEA' | 'Pose'>('ALL')
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title'>('year-desc')
  const [activeModuleFilter, setActiveModuleFilter] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [showProposedDetails, setShowProposedDetails] = useState(false)

  // Anchor Paper states
  const [activeSection, setActiveSection] = useState<number | null>(0)
  const [fullscreenPdf, setFullscreenPdf] = useState(false)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const [zoomCaption, setZoomCaption] = useState<string | null>(null)

  // Modal Tab state
  const [modalTab, setModalTab] = useState<'info' | 'pdf'>('info')

  useEffect(() => {
    if (!selectedPaper) {
      setModalTab('info')
    }
  }, [selectedPaper])

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

  const architectureNodes: Array<{
    id: string
    moduleId?: string
    title: string
    subtitle: string
    x: number
    y: number
    width: number
    height: number
  }> = [
    {
      id: 'capture',
      title: 'Video clinico',
      subtitle: 'sessao ABA',
      x: 18,
      y: 90,
      width: 126,
      height: 58
    },
    {
      id: 'pose',
      moduleId: 'pose3d',
      title: '3D Pose',
      subtitle: 'TRACE / ROMP',
      x: 180,
      y: 28,
      width: 132,
      height: 58
    },
    {
      id: 'occlusion',
      moduleId: 'occlusion',
      title: 'Occlusion',
      subtitle: 'GLAMR / JOTR',
      x: 180,
      y: 150,
      width: 132,
      height: 58
    },
    {
      id: 'grounding',
      moduleId: 'grounding',
      title: 'Temporal Grounding',
      subtitle: 'Time-R1',
      x: 350,
      y: 90,
      width: 152,
      height: 58
    },
    {
      id: 'efficiency',
      moduleId: 'efficiency',
      title: 'Token Merging',
      subtitle: 'FlashVID / MA-LMM',
      x: 540,
      y: 90,
      width: 156,
      height: 58
    },
    {
      id: 'output',
      title: 'Metricas ABA',
      subtitle: 'JA, IRL, RMS, SER',
      x: 734,
      y: 90,
      width: 136,
      height: 58
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

  const rmsWavePoints = useMemo(() => {
    return Array.from({ length: 72 }, (_, index) => {
      const x = 12 + index * 3.8
      const highFrequency = Math.sin(index * 0.92) * (14 + alphaRMS * 18)
      const drift = Math.sin(index * 0.16) * ((1 - alphaRMS) * 34)
      const y = 62 + highFrequency + drift
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
  }, [alphaRMS])

  const rmsBaselinePoints = useMemo(() => {
    return Array.from({ length: 72 }, (_, index) => {
      const x = 12 + index * 3.8
      const y = 62 + Math.sin(index * 0.16) * 24
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
  }, [])

  const occlusionMatched = thresholdOcclusion >= 0.38
  const occlusionConfidence = Math.round(Math.min(98, Math.max(42, 58 + thresholdOcclusion * 70)))
  const latencyBoundaryX = 52 + ((latencyWeight - 0.7) / 0.3) * 128

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

  const getPublicAssetUrl = (assetPath: string) => {
    const baseUrl = ((import.meta as any).env?.BASE_URL ?? '/')
    return `${baseUrl}${assetPath.replace(/^\/+/, '')}`
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
            className={activeTab === 'anchor' ? 'active' : ''}
            onClick={() => setActiveTab('anchor')}
          >
            <Award size={16} />
            Artigo Âncora (Referência)
          </button>
          <button
            className={activeTab === 'matrix' ? 'active' : ''}
            onClick={() => setActiveTab('matrix')}
          >
            <Table size={16} />
            Matriz do Estado da Arte ({typedPapers.length})
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
      {activeTab === 'anchor' && (
        <div className="tab-pane animate-fade-in">
          <div className="anchor-dashboard">
            {/* Header Card */}
            <div className="anchor-header-card">
              <span className="anchor-journal-badge">
                <Award size={14} /> Artigo Âncora & Referência Principal da Tese
              </span>
              <h2 className="anchor-title">
                Computer Vision-Based Assessment of Autistic Children: Analyzing Interactions, Emotions, Human Pose, and Life Skills
              </h2>
              
              <div className="authors-wrap">
                {['Varun Ganjigunte Prakash', 'Manu Kohli', 'Swati Kohli', 'A. P. Prathosh', 'Tanu Wadhera', 'Diptanshu Das', 'Debasis Panigrahi', 'John Vijay Sagar Kommu'].map((author, index) => (
                  <span key={index} className="author-badge">{author}</span>
                ))}
              </div>

              <div className="institutions-list">
                <h4 className="institutions-title">Instituições Participantes</h4>
                <div className="institutions-grid">
                  <div className="institution-item">
                    <span className="institution-number">1</span>
                    <span>CogniAble, Gurugram, Haryana, India</span>
                  </div>
                  <div className="institution-item">
                    <span className="institution-number">2</span>
                    <span>Department of Electrical Communication Engineering, IISc, Bengaluru, India</span>
                  </div>
                  <div className="institution-item">
                    <span className="institution-number">3</span>
                    <span>ECE Department, Indian Institute of Information Technology Una (IIITU), India</span>
                  </div>
                  <div className="institution-item">
                    <span className="institution-number">4</span>
                    <span>Institute of NeuroDevelopment, Kolkata, West Bengal, India</span>
                  </div>
                  <div className="institution-item">
                    <span className="institution-number">5</span>
                    <span>Jagannath Hospital, Bhubaneswar, Odisha, India</span>
                  </div>
                  <div className="institution-item">
                    <span className="institution-number">6</span>
                    <span>Department of Child and Adolescent Psychiatry, NIMHANS, Bengaluru, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side: Section Explorer */}
            <div className="anchor-section-explorer">
              <h3 className="explorer-title">
                <Cpu size={20} className="text-cyan animate-pulse" />
                Explorador Detalhado de Seções (Destrinchado Quadro a Quadro)
              </h3>
              
              <div className="section-accordion">
                {anchorSections.map((section, idx) => {
                  const isActive = activeSection === idx
                  return (
                    <div
                      key={idx}
                      className={`section-accordion-item ${isActive ? 'active' : ''}`}
                    >
                      <button
                        className="section-header"
                        onClick={() => setActiveSection(isActive ? null : idx)}
                      >
                        <div className="section-header-left">
                          <span className="section-num-tag">{idx === 0 ? "INFO" : `SEC ${idx}`}</span>
                          <span className="section-title-text">{section.title}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="section-pages-tag">{section.pages}</span>
                          <ChevronDown size={18} className="section-chevron" />
                        </div>
                      </button>
                      
                      {isActive && (
                        <div className="section-content">
                          <div className="section-summary-box">
                            <p>{section.summary}</p>
                          </div>
                          
                          <div className="section-details-grid">
                            {section.details && section.details.map((detail, dIdx) => (
                              <div
                                key={dIdx}
                                className={`section-detail-col ${detail.label.toLowerCase().includes('resumo') || detail.label.toLowerCase().includes('instituições') || detail.label.toLowerCase().includes('autores') || detail.label.toLowerCase().includes('título') || detail.label.toLowerCase().includes('fórmula') || detail.label.toLowerCase().includes('pipeline') || detail.label.toLowerCase().includes('gaze-follow') ? 'full-width' : ''}`}
                              >
                                <h4>{detail.label}</h4>
                                <p>{detail.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Images Extracted Inline */}
                          {section.figures && section.figures.length > 0 && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                              <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Activity size={12} className="text-cyan" /> Figuras Extraídas Diretamente do PDF
                              </h5>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                {section.figures.map((fig, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="gallery-item"
                                    onClick={() => {
                                      setZoomImage(fig.name)
                                      setZoomCaption(fig.caption)
                                    }}
                                  >
                                    <div className="gallery-img-container" style={{ height: '140px' }}>
                                      <img
                                        src={getPaperImageUrl(fig.name)}
                                        alt={fig.caption}
                                        className="gallery-img"
                                      />
                                    </div>
                                    <div className="gallery-caption" style={{ padding: '0.6rem' }}>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>{fig.caption}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side: Side Panel */}
            <div className="anchor-side-panel">
              {/* Clinical Specs */}
              <div className="side-card">
                <h3><Sliders size={18} className="text-cyan" /> Metadados Clínicos</h3>
                <div className="clinical-metadata-list">
                  <div className="clinical-meta-item">
                    <span className="clinical-meta-label">População-Alvo</span>
                    <span className="clinical-meta-value">Crianças de 1 a 5 anos com suspeita ou diagnóstico de TEA.</span>
                  </div>
                  <div className="clinical-meta-item">
                    <span className="clinical-meta-label">Escalas Mapeadas</span>
                    <span className="clinical-meta-value">
                      <code>ADOS-2</code> <code>CARS-2</code> <code>VBMAPP</code>
                    </span>
                  </div>
                  <div className="clinical-meta-item">
                    <span className="clinical-meta-label">Aprovação Ética</span>
                    <span className="clinical-meta-value">Aprovado pelo NIMHANS (Ethics Board) em 26/06/2021. Protocolo Clínico Nº 3.05.</span>
                  </div>
                  <div className="clinical-meta-item">
                    <span className="clinical-meta-label">Tamanho do Dataset</span>
                    <span className="clinical-meta-value">48 vídeos totais de teste (21 clínicos, 27 públicos) anotados a nível de frame.</span>
                  </div>
                </div>
              </div>

              {/* General Figures Sidebar */}
              <div className="side-card">
                <h3><Layers size={18} className="text-purple" /> Galeria de Figuras (Preview)</h3>
                <div className="gallery-grid">
                  {[
                    { name: 'extracted_prakash_fig_7_2.png', title: 'Fluxograma Geral', desc: 'Protocolo de gravação de sessões clínicas.' },
                    { name: 'extracted_prakash_fig_9_1.png', title: 'Arquitetura de Atividade', desc: 'ResNet-50 + LSTM para segmentação de ações.' },
                    { name: 'extracted_prakash_fig_10_2.png', title: 'Gráficos de Dispersão', desc: 'Exemplo de scatter plot contendo hitting/running.' },
                    { name: 'extracted_prakash_fig_13_3.png', title: 'Pointing e Gaze Follow', desc: 'Mecanismo de detector de pose de cabeça e dedos.' }
                  ].map((fig, idx) => (
                    <div
                      key={idx}
                      className="gallery-item"
                      onClick={() => {
                        setZoomImage(fig.name)
                        setZoomCaption(`${fig.title} - ${fig.desc}`)
                      }}
                    >
                      <div className="gallery-img-container" style={{ height: '110px' }}>
                        <img
                          src={getPaperImageUrl(fig.name)}
                          alt={fig.title}
                          className="gallery-img"
                        />
                      </div>
                      <div className="gallery-caption" style={{ padding: '0.5rem 0.75rem' }}>
                        <h4 style={{ fontSize: '0.8rem', margin: 0 }}>{fig.title}</h4>
                        <p style={{ fontSize: '0.7rem', margin: 0, color: 'var(--text-muted)' }}>{fig.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: PDF Viewer */}
            <div className="anchor-pdf-viewer-section">
              <div className="pdf-viewer-card">
                <div className="pdf-viewer-header">
                  <div className="pdf-viewer-title">
                    <FileText size={20} className="text-cyan" />
                    <span>Visualizar PDF Completo na Íntegra (23 Páginas)</span>
                  </div>
                  <div className="pdf-viewer-controls">
                    <button
                      className="pdf-btn"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = getPublicAssetUrl('papers/Computer_Vision-Based_Assessment_of_Autistic_Children_Analyzing_Interactions_Emotions_Human_Pose_and_Life_Skills (2).pdf')
                        link.download = 'Computer_Vision-Based_Assessment_of_Autistic_Children.pdf'
                        link.click()
                      }}
                    >
                      <Download size={14} /> Baixar PDF
                    </button>
                    <button
                      className="pdf-btn primary"
                      onClick={() => setFullscreenPdf(true)}
                    >
                      <Maximize2 size={14} /> Modo Tela Cheia
                    </button>
                  </div>
                </div>

                <div className={`pdf-iframe-container ${fullscreenPdf ? 'fullscreen' : ''}`}>
                  {fullscreenPdf && (
                    <button
                      className="pdf-fullscreen-exit-btn"
                      onClick={() => setFullscreenPdf(false)}
                    >
                      <Minimize2 size={14} /> Sair da Tela Cheia
                    </button>
                  )}
                  <iframe
                    src={getPublicAssetUrl('papers/Computer_Vision-Based_Assessment_of_Autistic_Children_Analyzing_Interactions_Emotions_Human_Pose_and_Life_Skills (2).pdf')}
                    className="pdf-iframe"
                    title="Prakash et al. 2023 PDF"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <tr className="proposed-framework-row" onClick={() => setShowProposedDetails(true)}>
                    <td className="citation-key proposed-citation">
                      <code>@abaVisionProposed2026</code>
                      <span className="proposed-pin-badge">Tese</span>
                    </td>
                    <td className="table-paper-title">
                      <strong>ABA-Vision (Proposto)</strong>
                      <span className="table-authors-span">Framework integrador da qualificacao: pose 3D, oclusao, grounding temporal e eficiencia multimodal.</span>
                    </td>
                    <td>
                      <span className="category-tag-small proposed">Framework</span>
                    </td>
                    <td>2026</td>
                    <td>Criancas autistas em terapia ABA</td>
                    <td>
                      <span className="env-tag hybrid">Clinico + Naturalistico</span>
                    </td>
                    <td>JA / IRL / RMS / SER</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        className="btn-copy-citation proposed-action"
                        onClick={() => setShowProposedDetails(true)}
                        title="Abrir detalhamento do framework proposto"
                      >
                        <Sparkles size={12} /> Ver Tese
                      </button>
                    </td>
                  </tr>
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

            <div className="sandbox-panel visual-simulations">
              <div className="panel-header">
                <Activity size={18} className="text-cyan" />
                <h3>Simulacoes Visuais Interativas</h3>
              </div>

              <div className="simulation-card">
                <div className="simulation-copy">
                  <h4>Estereotipia Wave (RMS)</h4>
                  <p>O slider de RMS mistura oscilacao rapida de flapping com deriva postural ampla.</p>
                </div>
                <svg className="simulation-svg" viewBox="0 0 300 124" role="img" aria-label="Onda RMS simulando flapping repetitivo">
                  <defs>
                    <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="55%" stopColor="var(--accent-cyan)" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                  <line x1="12" y1="62" x2="288" y2="62" className="simulation-axis" />
                  <polyline points={rmsBaselinePoints} className="simulation-wave-baseline" />
                  <polyline points={rmsWavePoints} className="simulation-wave-active" />
                  <text x="14" y="18" className="simulation-label">alpha = {alphaRMS.toFixed(2)}</text>
                  <text x="205" y="111" className="simulation-readout">RMS F1 {(0.78 + alphaRMS * 0.1).toFixed(2)}</text>
                </svg>
              </div>

              <div className="simulation-card">
                <div className="simulation-copy">
                  <h4>Tracking Matching (Oclusao & SER)</h4>
                  <p>O limiar controla se a trajetoria e re-associada apos atravessar a zona ocluida.</p>
                </div>
                <svg className="simulation-svg" viewBox="0 0 300 124" role="img" aria-label="Simulacao de reidentificacao atraves de oclusao">
                  <rect x="124" y="16" width="52" height="92" rx="8" className="occlusion-zone" />
                  <path d="M 22 86 C 68 18, 110 26, 138 58" className="tracking-path stable" />
                  <path
                    d={occlusionMatched ? 'M 162 62 C 190 91, 236 92, 278 34' : 'M 162 62 C 190 105, 232 108, 278 98'}
                    className={occlusionMatched ? 'tracking-path stable' : 'tracking-path lost'}
                  />
                  <circle cx="54" cy="52" r="8" className="tracking-dot stable" />
                  <circle cx="246" cy={occlusionMatched ? 54 : 94} r="8" className={occlusionMatched ? 'tracking-dot stable' : 'tracking-dot lost'} />
                  <text x="22" y="112" className="simulation-label">tau = {thresholdOcclusion.toFixed(2)}s</text>
                  <text x="178" y="24" className={occlusionMatched ? 'simulation-status good' : 'simulation-status bad'}>
                    {occlusionMatched ? `Re-ID ${occlusionConfidence}%` : 'ID perdido'}
                  </text>
                </svg>
              </div>

              <div className="simulation-card">
                <div className="simulation-copy">
                  <h4>Latencia Temporal (IRL)</h4>
                  <p>O peso Time-R1 desloca a fronteira estimada entre instrucao e resposta motora.</p>
                </div>
                <svg className="simulation-svg" viewBox="0 0 300 124" role="img" aria-label="Linha do tempo de latencia de resposta">
                  <line x1="24" y1="70" x2="278" y2="70" className="timeline-axis" />
                  <line x1="64" y1="34" x2="64" y2="96" className="timeline-marker instruction" />
                  <line x1={latencyBoundaryX} y1="26" x2={latencyBoundaryX} y2="104" className="timeline-marker response" />
                  <rect x="64" y="56" width={Math.max(0, latencyBoundaryX - 64)} height="28" rx="14" className="latency-window" />
                  <circle cx="64" cy="70" r="7" className="timeline-dot instruction" />
                  <circle cx={latencyBoundaryX} cy="70" r="7" className="timeline-dot response" />
                  <text x="32" y="28" className="simulation-label">t_inst</text>
                  <text x={Math.min(214, latencyBoundaryX + 9)} y="28" className="simulation-label">resposta</text>
                  <text x="158" y="112" className="simulation-readout">IRL-MAE {(1.4 * latencyWeight).toFixed(2)}s</text>
                </svg>
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
          <section className="architecture-section">
            <div className="section-title">
              <Cpu size={16} className="text-cyan" />
              <h2>Arquitetura Interativa ABA-Vision</h2>
            </div>
            <p className="matrix-desc">
              Clique em qualquer bloco cientifico do pipeline para filtrar os artigos que fundamentam aquele modulo da proposta.
            </p>

            <div className="architecture-svg-shell">
              <svg className="architecture-svg" viewBox="0 0 888 240" role="img" aria-label="Diagrama interativo do pipeline ABA-Vision">
                <defs>
                  <linearGradient id="architectureNodeFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.24)" />
                    <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
                  </linearGradient>
                  <marker id="architecture-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L9,3 z" fill="rgba(129, 140, 248, 0.65)" />
                  </marker>
                </defs>

                <path d="M144 119 C158 72, 166 56, 180 57" className="architecture-link" markerEnd="url(#architecture-arrow)" />
                <path d="M144 119 C158 164, 166 180, 180 179" className="architecture-link" markerEnd="url(#architecture-arrow)" />
                <path d="M312 57 C340 58, 338 119, 350 119" className="architecture-link" markerEnd="url(#architecture-arrow)" />
                <path d="M312 179 C340 178, 338 119, 350 119" className="architecture-link" markerEnd="url(#architecture-arrow)" />
                <path d="M502 119 L540 119" className="architecture-link" markerEnd="url(#architecture-arrow)" />
                <path d="M696 119 L734 119" className="architecture-link" markerEnd="url(#architecture-arrow)" />

                {architectureNodes.map(node => {
                  const isActive = Boolean(node.moduleId && activeModuleFilter === node.moduleId)
                  const isClickable = Boolean(node.moduleId)
                  return (
                    <g
                      key={node.id}
                      className={`architecture-node ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : 'passive'}`}
                      role={isClickable ? 'button' : 'img'}
                      tabIndex={isClickable ? 0 : -1}
                      onClick={() => {
                        if (node.moduleId) handleModuleClick(node.moduleId)
                      }}
                      onKeyDown={event => {
                        if (node.moduleId && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault()
                          handleModuleClick(node.moduleId)
                        }
                      }}
                    >
                      <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="12" />
                      <text x={node.x + node.width / 2} y={node.y + 24} textAnchor="middle" className="architecture-title">
                        {node.title}
                      </text>
                      <text x={node.x + node.width / 2} y={node.y + 43} textAnchor="middle" className="architecture-subtitle">
                        {node.subtitle}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className="architecture-legend">
              <span>Entrada clinica</span>
              <span>Modulos filtraveis</span>
              <span>Metricas comportamentais da tese</span>
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

      {showProposedDetails && (
        <div className="modal-overlay" onClick={() => setShowProposedDetails(false)}>
          <div className="modal-card proposed-modal-card" onClick={e => e.stopPropagation()}>
            <header className="modal-header proposed-modal-header">
              <span className="category-tag proposed">Framework Proposto</span>
              <button className="close-button" onClick={() => setShowProposedDetails(false)}>
                <X size={20} />
              </button>
            </header>

            <div className="modal-content">
              <div className="proposed-hero">
                <div>
                  <span className="proposed-eyebrow">ABA-Vision (Proposto)</span>
                  <h2 className="modal-title">Framework integrado para avaliacao comportamental automatizada em terapia ABA</h2>
                  <p>
                    A proposta consolida as lacunas da revisao em um pipeline unico: estimacao corporal 3D, robustez a oclusao,
                    grounding temporal de instrucoes e compressao eficiente de contexto multimodal.
                  </p>
                </div>
                <div className="proposed-score">
                  <strong>4/4</strong>
                  <span>lacunas cobertas</span>
                </div>
              </div>

              <div className="proposed-breakdown-grid">
                <div className="proposed-breakdown-card">
                  <Layers size={18} className="text-cyan" />
                  <h3>Modalidade</h3>
                  <p>Integra pose 3D, trajetoria, expressao facial, objetos terapeuticos e eventos verbais em uma leitura multimodal da sessao.</p>
                </div>
                <div className="proposed-breakdown-card">
                  <BookOpen size={18} className="text-purple" />
                  <h3>Clinica ABA</h3>
                  <p>Traduz evidencias em metricas operacionais como atencao conjunta, latencia de resposta, estereotipias e engajamento social.</p>
                </div>
                <div className="proposed-breakdown-card">
                  <GitFork size={18} className="text-cyan" />
                  <h3>Ambiente real</h3>
                  <p>Foi desenhado para lidar com oclusoes, movimento livre, objetos de sala e variacao entre crianca, terapeuta e cuidador.</p>
                </div>
                <div className="proposed-breakdown-card">
                  <Cpu size={18} className="text-purple" />
                  <h3>Escalabilidade</h3>
                  <p>Usa token merging e selecao temporal para reduzir custo computacional sem perder eventos clinicos relevantes.</p>
                </div>
              </div>

              <div className="proposed-gap-strip">
                <span><CheckCircle size={14} /> 3D Pose</span>
                <span><CheckCircle size={14} /> Occlusao/Re-ID</span>
                <span><CheckCircle size={14} /> Grounding temporal</span>
                <span><CheckCircle size={14} /> Token efficiency</span>
              </div>
            </div>

            <footer className="modal-footer">
              <button className="close-btn-footer" onClick={() => setShowProposedDetails(false)}>
                Fechar Framework
              </button>
            </footer>
          </div>
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

            {/* Modal Tabs */}
            <div className="modal-tab-nav" style={{ padding: '0 2rem' }}>
              <button
                className={`modal-tab-btn ${modalTab === 'info' ? 'active' : ''}`}
                onClick={() => setModalTab('info')}
              >
                Ficha Técnica & Análise
              </button>
              <button
                className={`modal-tab-btn ${modalTab === 'pdf' ? 'active' : ''}`}
                onClick={() => setModalTab('pdf')}
              >
                Visualizar PDF na Íntegra
              </button>
            </div>

            {modalTab === 'info' ? (
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
            ) : (
              <div className="modal-content" style={{ padding: '0 2rem 2rem 2rem' }}>
                <div className="pdf-iframe-container" style={{ height: '70vh', marginTop: '1rem' }}>
                  <iframe
                    src={getPublicAssetUrl(`papers/${encodeURIComponent(selectedPaper.filename)}`)}
                    className="pdf-iframe"
                    title={`PDF: ${selectedPaper.title}`}
                  />
                </div>
              </div>
            )}

            <footer className="modal-footer">
              <button className="close-btn-footer" onClick={() => setSelectedPaper(null)}>
                Fechar Detalhes
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Lightbox Image Zoom Modal */}
      {zoomImage && (
        <div className="lightbox-overlay" onClick={() => setZoomImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setZoomImage(null)}>
              <X size={18} /> Fechar
            </button>
            <img
              src={getPaperImageUrl(zoomImage)}
              alt={zoomCaption || ""}
              className="lightbox-img"
            />
            {zoomCaption && (
              <div className="lightbox-caption">
                <p>{zoomCaption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
