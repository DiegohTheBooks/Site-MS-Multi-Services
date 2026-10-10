import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure data folder exists
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'db.json');

// Interface types
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  price: number;
  promoPrice?: number | null;
  stock: number;
  minStockAlert: number;
  active: boolean;
  featured: boolean;
  images: string[];
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  active: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'entrada' | 'saida' | 'ajuste' | 'venda_pedido';
  quantity: number;
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  referenceId?: string;
  operator: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  deliveryType: 'entrega' | 'retirada';
  shippingAddress?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'cartao' | 'balcao';
  paymentStatus: 'pendente' | 'aprovado' | 'recusado' | 'cancelado';
  fulfillmentStatus: 'novo' | 'separacao' | 'enviado' | 'pronto_retirada' | 'entregue' | 'cancelado';
  pixPayload?: string;
  pixQrCodeUrl?: string;
  statusHistory: Array<{
    status: string;
    type: 'payment' | 'fulfillment';
    note?: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AssistanceRequest {
  id: string;
  requestNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deviceType: string;
  brandModel: string;
  serialNumber?: string;
  issueDescription: string;
  preferredService: string;
  status: 'aguardando_analise' | 'em_orcamento' | 'aprovado' | 'em_manutencao' | 'concluido' | 'cancelado';
  notes?: string;
  estimatedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  pixKey: string;
  pixKeyType: string;
  pixReceiver: string;
  mercadoPagoPublicKey?: string;
  mercadoPagoSandbox: boolean;
  freeShippingMinimum: number;
  defaultShippingFee: number;
  pickupAddress: string;
}

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  stockMovements: StockMovement[];
  orders: Order[];
  assistanceRequests: AssistanceRequest[];
  settings: StoreSettings;
  adminTokens: Record<string, { email: string; createdAt: string }>;
}

const defaultInitialData: DatabaseSchema = {
  categories: [
    {
      id: "cat-smartphones",
      name: "Smartphones & Tablets",
      slug: "smartphones-tablets",
      description: "Aparelhos selecionados, procedência comprovada e garantia",
      order: 1,
      active: true
    },
    {
      id: "cat-audio",
      name: "Áudio & Som Premium",
      slug: "audio-som",
      description: "Headphones de alta fidelidade, fones TWS e caixas de som",
      order: 2,
      active: true
    },
    {
      id: "cat-perifericos",
      name: "Periféricos & Setup",
      slug: "perifericos-setup",
      description: "Teclados mecânicos, mouses gamer, suportes e cabos",
      order: 3,
      active: true
    },
    {
      id: "cat-carregadores",
      name: "Carregadores & Cabos",
      slug: "carregadores-cabos",
      description: "Tecnologia GaN de carregamento ultrarrápido e cabos reforçados",
      order: 4,
      active: true
    },
    {
      id: "cat-pecas",
      name: "Componentes & Peças",
      slug: "pecas-componentes",
      description: "SSDs, memórias, baterias e telas originais",
      order: 5,
      active: true
    }
  ],
  products: [
    {
      id: "prod-smartphone-obsidian",
      sku: "MS-TEL-001",
      name: "Smartphone Obsidian Pro Titan 5G 256GB",
      slug: "smartphone-obsidian-pro-titan-5g-256gb",
      description: "Equipamento flagship com chassi em titânio e acabamento escuro acetinado. Câmera tripla de nível profissional, tela AMOLED de 120Hz com vidro temperado cerâmico e processador de 4nm de máxima eficiência.",
      categoryId: "cat-smartphones",
      price: 4299.00,
      promoPrice: 3899.00,
      stock: 8,
      minStockAlert: 3,
      active: true,
      featured: true,
      images: [
        "/src/assets/images/product_flagship_smartphone_1791603859685.jpg"
      ],
      specifications: {
        "Armazenamento": "256 GB NVMe",
        "Memória RAM": "12 GB LPDDR5X",
        "Processador": "Octa-core 4nm",
        "Conectividade": "5G, Wi-Fi 6E, Bluetooth 5.3, NFC",
        "Bateria": "5000 mAh com carga ultrarrápida 67W",
        "Garantia": "12 meses MS Multi Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-headphone-aurora",
      sku: "MS-AUD-002",
      name: "Headphone Aurora ANC Gold Series Bluetooth 5.3",
      slug: "headphone-aurora-anc-gold-series-bluetooth",
      description: "Cancelamento ativo de ruído híbrido de até 42dB, drivers acústicos de 40mm com câmara de ressonância afinada, acabamento premium preto fosco com aros dourados e almofadas em couro sintético com memória de forma.",
      categoryId: "cat-audio",
      price: 689.00,
      promoPrice: 549.00,
      stock: 14,
      minStockAlert: 5,
      active: true,
      featured: true,
      images: [
        "/src/assets/images/product_headphone_gold_1791603839090.jpg"
      ],
      specifications: {
        "Autonomia": "Até 60 horas sem ANC / 45 horas com ANC",
        "Conectividade": "Bluetooth 5.3 + Cabo P2 banhado a ouro 3.5mm",
        "Microfones": "4 microfones beamforming com redução de vento",
        "Carregamento": "USB-C (10 min de carga = 5 horas de reprodução)",
        "Garantia": "6 meses MS Multi Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-teclado-vulcan",
      sku: "MS-PER-003",
      name: "Teclado Mecânico Vulcan RGB Gold Switch Brown",
      slug: "teclado-mecanico-vulcan-rgb-gold-switch-brown",
      description: "Construção com chassi em alumínio escovado de padrão aeronáutico, switches táteis balanceados (Switch Brown), teclas em PBT double-shot de altíssima durabilidade e iluminação âmbar/dourada personalizável.",
      categoryId: "cat-perifericos",
      price: 420.00,
      promoPrice: 379.00,
      stock: 12,
      minStockAlert: 4,
      active: true,
      featured: true,
      images: [
        "/src/assets/images/product_keyboard_mechanical_1791603850646.jpg"
      ],
      specifications: {
        "Layout": "ABNT2 com Ç nativo",
        "Switches": "Mechanical Brown Tátil (Hot-Swappable)",
        "Keycaps": "PBT Double-Shot resistente a desgaste",
        "Conexão": "Cabo USB-C trançado destacável de 1.8m",
        "Software": "Suporte a macros e perfis de iluminação na memória onboard",
        "Garantia": "12 meses MS Multi Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-carregador-gan",
      sku: "MS-CAR-004",
      name: "Carregador GaN Turbo 65W Duplo USB-C + USB-A",
      slug: "carregador-gan-turbo-65w-duplo-usbc-usba",
      description: "Tecnologia de semicondutores de Nitreto de Gálio (GaN) que proporciona tamanho compacto e eficiência térmica superior. Permite carregar simultaneamente notebooks, tablets e smartphones na velocidade máxima de entrega de energia.",
      categoryId: "cat-carregadores",
      price: 199.00,
      promoPrice: 159.00,
      stock: 22,
      minStockAlert: 6,
      active: true,
      featured: false,
      images: [
        "/src/assets/images/ms_hero_tech_banner_1791603825951.jpg"
      ],
      specifications: {
        "Potência Total": "65W Max Power Delivery 3.0 / PPS / QC 4+",
        "Portas": "2x USB-C (65W) + 1x USB-A (22.5W)",
        "Proteções": "Sobretensão, curto-circuito, sobreaquecimento e controle inteligente de temperatura",
        "Certificação": "Homologado Anatel",
        "Garantia": "6 meses MS Multi Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-ssd-nvme",
      sku: "MS-PEC-005",
      name: "SSD NVMe M.2 PCIe Gen 4.0 1TB Pro Extreme 7400MB/s",
      slug: "ssd-nvme-m2-pcie-gen-4-1tb-pro-extreme",
      description: "Taxas ultrarrápidas de leitura sequencial de até 7.400 MB/s e gravação de até 6.500 MB/s. Equipado com dissipador de grafeno ultrafino para compatibilidade com notebooks, consoles de última geração e desktops profissionais.",
      categoryId: "cat-pecas",
      price: 599.00,
      promoPrice: 529.00,
      stock: 7,
      minStockAlert: 3,
      active: true,
      featured: true,
      images: [
        "/src/assets/images/ms_hero_tech_banner_1791603825951.jpg"
      ],
      specifications: {
        "Interface": "PCIe Gen 4.0 x4, NVMe 1.4",
        "Velocidade": "Leitura 7.400 MB/s | Gravação 6.500 MB/s",
        "Formato": "M.2 2280",
        "Durabilidade (TBW)": "600 TBW",
        "Garantia": "24 meses MS Multi Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-cabo-trancado",
      sku: "MS-CAR-006",
      name: "Cabo Trançado Reforçado 100W USB-C 2.0m Pro Armor",
      slug: "cabo-trancado-reforcado-100w-usbc-2m",
      description: "Cabo de alimentação e dados de alta potência (100W/5A) com blindagem quádrupla e revestimento em nylon balístico de alta resistência, suportando mais de 30.000 dobras em testes laboratoriais.",
      categoryId: "cat-carregadores",
      price: 79.00,
      promoPrice: 65.00,
      stock: 35,
      minStockAlert: 8,
      active: true,
      featured: false,
      images: [
        "/src/assets/images/ms_hero_tech_banner_1791603825951.jpg"
      ],
      specifications: {
        "Comprimento": "2.0 Metros",
        "Potência": "Suporte a até 100W (20V / 5A)",
        "Material": "Nylon Trançado e conectores em liga de alumínio",
        "Compatibilidade": "MacBook, notebooks USB-C, smartphones e tablets",
        "Garantia": "12 meses MS Multi Services"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  stockMovements: [
    {
      id: "mov-init-1",
      productId: "prod-smartphone-obsidian",
      productName: "Smartphone Obsidian Pro Titan 5G 256GB",
      sku: "MS-TEL-001",
      type: "entrada",
      quantity: 8,
      balanceBefore: 0,
      balanceAfter: 8,
      reason: "Estoque inicial de abertura de catálogo",
      operator: "Administração MS",
      createdAt: new Date().toISOString()
    },
    {
      id: "mov-init-2",
      productId: "prod-headphone-aurora",
      productName: "Headphone Aurora ANC Gold Series Bluetooth 5.3",
      sku: "MS-AUD-002",
      type: "entrada",
      quantity: 14,
      balanceBefore: 0,
      balanceAfter: 14,
      reason: "Estoque inicial de abertura de catálogo",
      operator: "Administração MS",
      createdAt: new Date().toISOString()
    },
    {
      id: "mov-init-3",
      productId: "prod-teclado-vulcan",
      productName: "Teclado Mecânico Vulcan RGB Gold Switch Brown",
      sku: "MS-PER-003",
      type: "entrada",
      quantity: 12,
      balanceBefore: 0,
      balanceAfter: 12,
      reason: "Estoque inicial de abertura de catálogo",
      operator: "Administração MS",
      createdAt: new Date().toISOString()
    }
  ],
  orders: [
    {
      id: "ord-seed-01",
      orderNumber: "MS-2026-00101",
      customer: {
        name: "Carlos Eduardo Silva",
        email: "carlos.silva@exemplo.com.br",
        phone: "(11) 98765-4321",
        cpf: "123.456.789-00"
      },
      deliveryType: "entrega",
      shippingAddress: {
        cep: "01310-100",
        street: "Avenida Paulista",
        number: "1000",
        complement: "Apto 42",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP"
      },
      items: [
        {
          productId: "prod-headphone-aurora",
          sku: "MS-AUD-002",
          name: "Headphone Aurora ANC Gold Series Bluetooth 5.3",
          price: 549.00,
          quantity: 1,
          total: 549.00,
          image: "/src/assets/images/product_headphone_gold_1791603839090.jpg"
        }
      ],
      subtotal: 549.00,
      shippingFee: 0,
      discount: 0,
      total: 549.00,
      paymentMethod: "pix",
      paymentStatus: "aprovado",
      fulfillmentStatus: "separacao",
      pixPayload: "00020126580014BR.GOV.BCB.PIX0136msmultiservices@pix.com5204000053039865405549.005802BR5917MS MULTI SERVICES6009SAO PAULO62070503***6304ABCD",
      statusHistory: [
        {
          status: "pendente",
          type: "payment",
          note: "Aguardando confirmação PIX",
          updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          status: "aprovado",
          type: "payment",
          note: "Pagamento Pix identificado e compensado",
          updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          status: "separacao",
          type: "fulfillment",
          note: "Produto separado e conferido na bancada técnica",
          updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ],
  assistanceRequests: [
    {
      id: "ast-001",
      requestNumber: "OS-MS-2026-089",
      customerName: "Renata Vasconcelos",
      customerPhone: "(11) 99123-8877",
      customerEmail: "renata.v@exemplo.com",
      deviceType: "Smartphone",
      brandModel: "iPhone 13 Pro 128GB",
      serialNumber: "F2LX9009N70M",
      issueDescription: "Aparelho sofreu queda, vidro frontal trincado e touch falhando no canto superior direito.",
      preferredService: "Troca de Tela Original",
      status: "em_orcamento",
      notes: "Peça disponível em estoque. Avaliando se há danos ao sensor Face ID.",
      estimatedPrice: 650.00,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  settings: {
    storeName: "MS Multi Services",
    tagline: "Tecnologia, Produtos de Alta Performance & Assistência Técnica Especializada",
    logoUrl: "https://i.postimg.cc/MTnJQTSJ/MS.jpg",
    cnpj: "48.912.345/0001-90",
    phone: "(11) 3456-7890",
    whatsapp: "5511999998888",
    email: "contato@msmultiservices.com.br",
    address: "Rua do Comércio Tecnológico, 350 - Centro Comercial MS - São Paulo / SP",
    openingHours: "Segunda a Sexta: 08:30 às 18:30 | Sábados: 09:00 às 14:00",
    heroBannerTitle: "Tecnologia de Ponta, Produtos Selecionados & Suporte Especializado",
    heroBannerSubtitle: "Eletrônicos e acessórios com procedência garantida e o suporte técnico de quem realmente entende do assunto.",
    pixKey: "contato@msmultiservices.com.br",
    pixKeyType: "E-mail",
    pixReceiver: "MS Multi Services LTDA",
    mercadoPagoSandbox: true,
    freeShippingMinimum: 299.00,
    defaultShippingFee: 24.90,
    pickupAddress: "Balcão MS Multi Services: Rua do Comércio Tecnológico, 350 - Retirada em até 2 horas úteis."
  },
  adminTokens: {
    "admin-session-token-demo-2026": {
      email: "admin@msmultiservices.com.br",
      createdAt: new Date().toISOString()
    }
  }
};

// Database helper functions with write-through file persistence
function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultInitialData, null, 2), 'utf-8');
      return defaultInitialData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return data;
  } catch (err) {
    console.error("Error reading database file, using defaults:", err);
    return defaultInitialData;
  }
}

function writeDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// Authentication middleware for admin routes
function requireAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Acesso não autorizado. Token ausente." });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  const db = readDB();

  if (token === "admin-session-token-demo-2026" || db.adminTokens[token]) {
    return next();
  }

  return res.status(401).json({ error: "Sessão inválida ou expirada. Faça login novamente." });
}

// Helper to generate unique order codes
function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `MS-${year}-${randomSuffix}`;
}

// Helper to generate simulated Pix payload (EMV standard format)
function generatePixPayload(amount: number, orderCode: string, pixKey: string, receiver: string): string {
  const sanitizedAmount = amount.toFixed(2);
  return `00020126580014BR.GOV.BCB.PIX0136${pixKey}520400005303986540${sanitizedAmount.length < 10 ? '0' : ''}${sanitizedAmount.length}${sanitizedAmount}5802BR59${receiver.length < 10 ? '0' : ''}${receiver.length}${receiver}6009SAO PAULO62070503${orderCode}6304${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
}

// ======================== API ROUTES ========================

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MS Multi Services API', timestamp: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (_req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// Categories
app.get('/api/categories', (_req, res) => {
  const db = readDB();
  res.json(db.categories);
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  const { name, slug, description, active } = req.body;
  if (!name) {
    return res.status(400).json({ error: "O nome da categoria é obrigatório." });
  }

  const db = readDB();
  const id = `cat-${Date.now()}`;
  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  const newCat: Category = {
    id,
    name,
    slug: generatedSlug,
    description: description || '',
    order: db.categories.length + 1,
    active: active !== false
  };

  db.categories.push(newCat);
  writeDB(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.categories.findIndex(c => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: "Categoria não encontrada." });
  }

  db.categories[idx] = { ...db.categories[idx], ...req.body, id };
  writeDB(db);
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDB();

  // Check if any product is assigned to this category
  const hasProducts = db.products.some(p => p.categoryId === id);
  if (hasProducts) {
    return res.status(400).json({ 
      error: "Não é possível excluir esta categoria porque há produtos vinculados a ela. Mova os produtos primeiro." 
    });
  }

  db.categories = db.categories.filter(c => c.id !== id);
  writeDB(db);
  res.json({ success: true, message: "Categoria removida com sucesso." });
});

// Products
app.get('/api/products', (req, res) => {
  const db = readDB();
  const { q, category, sort, inStock, featured, includeInactive } = req.query;

  let filtered = [...db.products];

  // Inactive filter for public storefront
  if (includeInactive !== 'true') {
    filtered = filtered.filter(p => p.active);
  }

  // Category filter
  if (category && category !== 'todas') {
    filtered = filtered.filter(p => p.categoryId === category || p.slug === category);
  }

  // In stock only
  if (inStock === 'true') {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Featured only
  if (featured === 'true') {
    filtered = filtered.filter(p => p.featured);
  }

  // Text search in name, description, SKU
  if (q && typeof q === 'string') {
    const term = q.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term)
    );
  }

  // Sorting
  if (sort === 'preco-asc') {
    filtered.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
  } else if (sort === 'preco-desc') {
    filtered.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
  } else if (sort === 'nome-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'novidades') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(filtered);
});

app.get('/api/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const db = readDB();
  const product = db.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  res.json(product);
});

app.post('/api/products', requireAdminAuth, (req, res) => {
  const { 
    name, 
    sku, 
    categoryId, 
    price, 
    promoPrice, 
    stock, 
    minStockAlert, 
    description, 
    images, 
    specifications, 
    active, 
    featured 
  } = req.body;

  if (!name || !sku || price === undefined) {
    return res.status(400).json({ error: "Nome, SKU e Preço de venda são obrigatórios." });
  }

  const db = readDB();

  // Validate SKU uniqueness
  if (db.products.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
    return res.status(400).json({ error: `O SKU '${sku}' já está em uso por outro produto.` });
  }

  const id = `prod-${Date.now()}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const initialStock = Number(stock) || 0;

  const newProduct: Product = {
    id,
    sku,
    name,
    slug,
    description: description || '',
    categoryId: categoryId || (db.categories[0]?.id || 'cat-geral'),
    price: Number(price),
    promoPrice: promoPrice ? Number(promoPrice) : null,
    stock: initialStock,
    minStockAlert: Number(minStockAlert) || 3,
    active: active !== false,
    featured: featured === true,
    images: Array.isArray(images) && images.length > 0 ? images : ["/src/assets/images/ms_hero_tech_banner_1791603825951.jpg"],
    specifications: specifications || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.push(newProduct);

  // If initial stock > 0, register initial stock movement audit record
  if (initialStock > 0) {
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: id,
      productName: name,
      sku,
      type: 'entrada',
      quantity: initialStock,
      balanceBefore: 0,
      balanceAfter: initialStock,
      reason: "Cadastro inicial do produto",
      operator: "Admin MS",
      createdAt: new Date().toISOString()
    };
    db.stockMovements.unshift(movement);
  }

  writeDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  const current = db.products[idx];
  const { 
    name, 
    sku, 
    categoryId, 
    price, 
    promoPrice, 
    minStockAlert, 
    description, 
    images, 
    specifications, 
    active, 
    featured 
  } = req.body;

  // If SKU changed, verify uniqueness
  if (sku && sku !== current.sku) {
    if (db.products.some(p => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== id)) {
      return res.status(400).json({ error: `O SKU '${sku}' já está em uso por outro produto.` });
    }
  }

  db.products[idx] = {
    ...current,
    name: name !== undefined ? name : current.name,
    sku: sku !== undefined ? sku : current.sku,
    categoryId: categoryId !== undefined ? categoryId : current.categoryId,
    price: price !== undefined ? Number(price) : current.price,
    promoPrice: promoPrice !== undefined ? (promoPrice ? Number(promoPrice) : null) : current.promoPrice,
    minStockAlert: minStockAlert !== undefined ? Number(minStockAlert) : current.minStockAlert,
    description: description !== undefined ? description : current.description,
    images: images !== undefined ? images : current.images,
    specifications: specifications !== undefined ? specifications : current.specifications,
    active: active !== undefined ? active : current.active,
    featured: featured !== undefined ? featured : current.featured,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const product = db.products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  // Check if product exists in any historic order
  const inOrders = db.orders.some(o => o.items.some(it => it.productId === id));
  if (inOrders) {
    // If it has order history, archive/deactivate rather than breaking historical receipts
    product.active = false;
    writeDB(db);
    return res.json({ 
      success: true, 
      message: "Produto desativado com sucesso (arquivado para manter histórico de pedidos)." 
    });
  }

  db.products = db.products.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true, message: "Produto excluído com sucesso." });
});

// Stock Management (Audited movements)
app.get('/api/stock/history', requireAdminAuth, (_req, res) => {
  const db = readDB();
  res.json(db.stockMovements);
});

app.post('/api/stock/adjust', requireAdminAuth, (req, res) => {
  const { productId, type, quantity, reason, operator } = req.body;
  const qty = Number(quantity);

  if (!productId || !type || isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: "Dados inválidos para ajuste de estoque." });
  }

  if (!reason || reason.trim().length < 3) {
    return res.status(400).json({ error: "Justificativa obrigatória (mínimo 3 caracteres)." });
  }

  const db = readDB();
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado." });
  }

  const balanceBefore = product.stock;
  let balanceAfter = balanceBefore;

  if (type === 'entrada') {
    balanceAfter = balanceBefore + qty;
  } else if (type === 'saida') {
    if (balanceBefore < qty) {
      return res.status(400).json({ 
        error: `Saldo insuficiente. Saldo atual é ${balanceBefore}, tentativa de saída de ${qty}.` 
      });
    }
    balanceAfter = balanceBefore - qty;
  } else if (type === 'ajuste') {
    // For manual inventory recount, qty is the new target balance
    balanceAfter = qty;
  } else {
    return res.status(400).json({ error: "Tipo de movimentação inválido." });
  }

  product.stock = balanceAfter;
  product.updatedAt = new Date().toISOString();

  const movement: StockMovement = {
    id: `mov-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    type,
    quantity: type === 'ajuste' ? Math.abs(balanceAfter - balanceBefore) : qty,
    balanceBefore,
    balanceAfter,
    reason: reason.trim(),
    operator: operator || 'Operador MS',
    createdAt: new Date().toISOString()
  };

  db.stockMovements.unshift(movement);
  writeDB(db);

  res.json({
    success: true,
    movement,
    newStock: balanceAfter,
    product
  });
});

// Checkout and Orders
app.post('/api/orders', (req, res) => {
  const { 
    customer, 
    deliveryType, 
    shippingAddress, 
    items, 
    paymentMethod 
  } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.email) {
    return res.status(400).json({ error: "Dados do comprador incompletos." });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "O carrinho de compras está vazio." });
  }

  if (deliveryType === 'entrega' && (!shippingAddress || !shippingAddress.cep || !shippingAddress.street)) {
    return res.status(400).json({ error: "Endereço de entrega obrigatório para a modalidade Entrega." });
  }

  const db = readDB();

  // ATOMIC STOCK AND PRICE VALIDATION ON SERVER
  // We NEVER trust client unit prices! We recalculate everything from DB.
  const verifiedItems: OrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const requestedItem of items) {
    const product = db.products.find(p => p.id === requestedItem.productId);
    if (!product) {
      return res.status(400).json({ 
        error: `Produto de ID '${requestedItem.productId}' não foi encontrado no catálogo.` 
      });
    }

    if (!product.active) {
      return res.status(400).json({ 
        error: `O produto '${product.name}' não está mais ativo para venda.` 
      });
    }

    const requestedQty = Math.max(1, Number(requestedItem.quantity) || 1);
    if (product.stock < requestedQty) {
      return res.status(400).json({ 
        error: `Estoque insuficiente para '${product.name}'. Disponível: ${product.stock}, solicitado: ${requestedQty}.` 
      });
    }

    // Official server price
    const unitPrice = (product.promoPrice !== null && product.promoPrice !== undefined && product.promoPrice > 0)
      ? product.promoPrice 
      : product.price;

    const itemTotal = unitPrice * requestedQty;
    calculatedSubtotal += itemTotal;

    verifiedItems.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: unitPrice,
      quantity: requestedQty,
      total: itemTotal,
      image: product.images[0]
    });
  }

  // Calculate Shipping fee based on settings and delivery option
  let shippingFee = 0;
  if (deliveryType === 'entrega') {
    if (calculatedSubtotal >= (db.settings.freeShippingMinimum || 299)) {
      shippingFee = 0; // Free shipping threshold met
    } else {
      shippingFee = db.settings.defaultShippingFee || 24.90;
    }
  }

  const total = calculatedSubtotal + shippingFee;
  const orderNumber = generateOrderNumber();
  const orderId = `ord-${Date.now()}`;

  // Deduct stock atomically and record stock movements
  for (const item of verifiedItems) {
    const product = db.products.find(p => p.id === item.productId)!;
    const balanceBefore = product.stock;
    const balanceAfter = balanceBefore - item.quantity;
    product.stock = balanceAfter;
    product.updatedAt = new Date().toISOString();

    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      type: 'venda_pedido',
      quantity: item.quantity,
      balanceBefore,
      balanceAfter,
      reason: `Saída por venda online - Pedido ${orderNumber}`,
      referenceId: orderNumber,
      operator: "Sistema Loja MS",
      createdAt: new Date().toISOString()
    };
    db.stockMovements.unshift(movement);
  }

  // Generate Pix payload if PIX selected
  const pixPayload = paymentMethod === 'pix' 
    ? generatePixPayload(total, orderNumber, db.settings.pixKey, db.settings.pixReceiver)
    : undefined;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      cpf: customer.cpf ? customer.cpf.trim() : ''
    },
    deliveryType,
    shippingAddress: deliveryType === 'entrega' ? shippingAddress : undefined,
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    shippingFee,
    discount: 0,
    total,
    paymentMethod,
    paymentStatus: 'pendente',
    fulfillmentStatus: 'novo',
    pixPayload,
    statusHistory: [
      {
        status: "pendente",
        type: "payment",
        note: paymentMethod === 'pix' ? "Código PIX gerado. Aguardando pagamento." : "Pedido registrado no checkout.",
        updatedAt: new Date().toISOString()
      },
      {
        status: "novo",
        type: "fulfillment",
        note: "Pedido recebido com sucesso no sistema.",
        updatedAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  writeDB(db);

  res.status(201).json(newOrder);
});

// Orders list (Admin or customer lookup)
app.get('/api/orders', (req, res) => {
  const db = readDB();
  const { code, phone } = req.query;

  // Customer tracking query without admin login
  if (code && typeof code === 'string') {
    const order = db.orders.find(o => o.orderNumber.toUpperCase() === code.toUpperCase().trim());
    if (!order) {
      return res.status(404).json({ error: "Pedido não localizado com o código informado." });
    }
    return res.json([order]);
  }

  if (phone && typeof phone === 'string') {
    const cleanQuery = phone.replace(/\D/g, '');
    const userOrders = db.orders.filter(o => o.customer.phone.replace(/\D/g, '').includes(cleanQuery));
    return res.json(userOrders);
  }

  // Admin access to all orders
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Acesso administrativo obrigatório para listar todos os pedidos." });
  }

  res.json(db.orders);
});

app.get('/api/orders/:idOrNumber', (req, res) => {
  const { idOrNumber } = req.params;
  const db = readDB();
  const order = db.orders.find(o => o.id === idOrNumber || o.orderNumber === idOrNumber);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado." });
  }

  res.json(order);
});

app.put('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { paymentStatus, fulfillmentStatus, note } = req.body;

  const db = readDB();
  const order = db.orders.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado." });
  }

  const timestamp = new Date().toISOString();

  if (paymentStatus && paymentStatus !== order.paymentStatus) {
    order.paymentStatus = paymentStatus;
    order.statusHistory.unshift({
      status: paymentStatus,
      type: 'payment',
      note: note || `Status de pagamento atualizado para '${paymentStatus}'.`,
      updatedAt: timestamp
    });
  }

  if (fulfillmentStatus && fulfillmentStatus !== order.fulfillmentStatus) {
    order.fulfillmentStatus = fulfillmentStatus;
    order.statusHistory.unshift({
      status: fulfillmentStatus,
      type: 'fulfillment',
      note: note || `Status de atendimento atualizado para '${fulfillmentStatus}'.`,
      updatedAt: timestamp
    });
  }

  order.updatedAt = timestamp;
  writeDB(db);

  res.json(order);
});

// Webhook simulation / Payment verification
app.post('/api/payments/webhook', (req, res) => {
  const { orderNumber, status, transactionId } = req.body;

  if (!orderNumber || !status) {
    return res.status(400).json({ error: "Parâmetros do webhook inválidos." });
  }

  const db = readDB();
  const order = db.orders.find(o => o.orderNumber === orderNumber);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado." });
  }

  const targetStatus = status === 'approved' ? 'aprovado' : (status === 'rejected' ? 'recusado' : 'pendente');
  order.paymentStatus = targetStatus;

  if (targetStatus === 'aprovado' && order.fulfillmentStatus === 'novo') {
    order.fulfillmentStatus = 'separacao';
  }

  order.statusHistory.unshift({
    status: targetStatus,
    type: 'payment',
    note: `Confirmação de pagamento via gateway (Transação: ${transactionId || 'GW-' + Date.now()})`,
    updatedAt: new Date().toISOString()
  });

  order.updatedAt = new Date().toISOString();
  writeDB(db);

  res.json({ success: true, orderNumber, newPaymentStatus: targetStatus });
});

// Technical Assistance requests
app.get('/api/assistance/requests', requireAdminAuth, (_req, res) => {
  const db = readDB();
  res.json(db.assistanceRequests);
});

app.post('/api/assistance/requests', (req, res) => {
  const { 
    customerName, 
    customerPhone, 
    customerEmail, 
    deviceType, 
    brandModel, 
    serialNumber, 
    issueDescription, 
    preferredService 
  } = req.body;

  if (!customerName || !customerPhone || !deviceType || !issueDescription) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios para solicitar o orçamento." });
  }

  const db = readDB();
  const seq = Math.floor(100 + Math.random() * 900);
  const requestNumber = `OS-MS-${new Date().getFullYear()}-${seq}`;

  const newRequest: AssistanceRequest = {
    id: `ast-${Date.now()}`,
    requestNumber,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerEmail: customerEmail ? customerEmail.trim() : '',
    deviceType,
    brandModel: brandModel ? brandModel.trim() : '',
    serialNumber: serialNumber ? serialNumber.trim() : undefined,
    issueDescription: issueDescription.trim(),
    preferredService: preferredService || 'Análise Técnica Geral',
    status: 'aguardando_analise',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.assistanceRequests.unshift(newRequest);
  writeDB(db);

  res.status(201).json(newRequest);
});

app.put('/api/assistance/requests/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const item = db.assistanceRequests.find(a => a.id === id);

  if (!item) {
    return res.status(404).json({ error: "Solicitação não encontrada." });
  }

  const { status, notes, estimatedPrice } = req.body;

  if (status) item.status = status;
  if (notes !== undefined) item.notes = notes;
  if (estimatedPrice !== undefined) item.estimatedPrice = Number(estimatedPrice);

  item.updatedAt = new Date().toISOString();
  writeDB(db);

  res.json(item);
});

// Dashboard metrics (REAL database aggregations, not fake counters)
app.get('/api/dashboard/stats', requireAdminAuth, (_req, res) => {
  const db = readDB();

  const totalProducts = db.products.length;
  const activeProducts = db.products.filter(p => p.active).length;
  const lowStockProducts = db.products.filter(p => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const outOfStockProducts = db.products.filter(p => p.stock === 0).length;

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter(o => o.fulfillmentStatus === 'novo' || o.paymentStatus === 'pendente').length;
  const approvedSalesTotal = db.orders
    .filter(o => o.paymentStatus === 'aprovado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingAssistance = db.assistanceRequests.filter(a => a.status === 'aguardando_analise' || a.status === 'em_orcamento').length;

  res.json({
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    totalOrders,
    pendingOrders,
    approvedSalesTotal,
    pendingAssistance,
    recentOrders: db.orders.slice(0, 5),
    lowStockList: db.products.filter(p => p.stock <= p.minStockAlert).slice(0, 6)
  });
});

// Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple, robust credentials for store owner
  if (
    (email === 'admin@msmultiservices.com.br' || email === 'admin') &&
    (password === 'admin123456' || password === 'ms2026')
  ) {
    const token = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const db = readDB();
    db.adminTokens[token] = {
      email,
      createdAt: new Date().toISOString()
    };
    writeDB(db);

    return res.json({
      success: true,
      token,
      user: {
        name: "Administrador MS",
        email: "admin@msmultiservices.com.br",
        role: "admin"
      }
    });
  }

  return res.status(401).json({ error: "Credenciais inválidas. Verifique seu e-mail e senha." });
});

app.get('/api/auth/me', requireAdminAuth, (_req, res) => {
  res.json({
    authenticated: true,
    user: {
      name: "Administrador MS",
      email: "admin@msmultiservices.com.br",
      role: "admin"
    }
  });
});

// ======================== FRONTEND VITE INTEGRATION ========================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[MS Multi Services] Server running on http://localhost:${PORT}`);
  });
}

startServer();
