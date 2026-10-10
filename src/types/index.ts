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

export interface CartItem {
  product: Product;
  quantity: number;
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

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  approvedSalesTotal: number;
  pendingAssistance: number;
  recentOrders: Order[];
  lowStockList: Product[];
}
