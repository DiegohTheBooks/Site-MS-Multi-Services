import { 
  Product, 
  Category, 
  Order, 
  AssistanceRequest, 
  StoreSettings, 
  StockMovement, 
  DashboardStats 
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('ms_admin_token') || 'admin-session-token-demo-2026';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export const api = {
  // Store settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Falha ao carregar configurações da loja');
    return res.json();
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<{ success: boolean; settings: StoreSettings }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao atualizar configurações');
    }
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Falha ao carregar categorias');
    return res.json();
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao criar categoria');
    }
    return res.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao atualizar categoria');
    }
    return res.json();
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao excluir categoria');
    }
    return res.json();
  },

  // Products
  async getProducts(params?: {
    q?: string;
    category?: string;
    sort?: string;
    inStock?: boolean;
    featured?: boolean;
    includeInactive?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.inStock) query.append('inStock', 'true');
    if (params?.featured) query.append('featured', 'true');
    if (params?.includeInactive) query.append('includeInactive', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar catálogo de produtos');
    return res.json();
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    return res.json();
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao cadastrar produto');
    }
    return res.json();
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao atualizar produto');
    }
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao remover produto');
    }
    return res.json();
  },

  // Stock
  async getStockHistory(): Promise<StockMovement[]> {
    const res = await fetch(`${API_BASE}/stock/history`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Falha ao obter histórico de estoque');
    return res.json();
  },

  async adjustStock(data: {
    productId: string;
    type: 'entrada' | 'saida' | 'ajuste';
    quantity: number;
    reason: string;
    operator?: string;
  }): Promise<{ success: boolean; movement: StockMovement; newStock: number; product: Product }> {
    const res = await fetch(`${API_BASE}/stock/adjust`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao ajustar estoque');
    }
    return res.json();
  },

  // Orders
  async createOrder(payload: {
    customer: { name: string; email: string; phone: string; cpf?: string };
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
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: 'pix' | 'cartao' | 'balcao';
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao processar pedido');
    }
    return res.json();
  },

  async getOrders(query?: { code?: string; phone?: string }): Promise<Order[]> {
    const params = new URLSearchParams();
    if (query?.code) params.append('code', query.code);
    if (query?.phone) params.append('phone', query.phone);

    const headers: HeadersInit = query?.code || query?.phone 
      ? { 'Content-Type': 'application/json' }
      : getAuthHeaders();

    const res = await fetch(`${API_BASE}/orders?${params.toString()}`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao buscar pedidos');
    }
    return res.json();
  },

  async getOrderById(idOrNumber: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${idOrNumber}`);
    if (!res.ok) throw new Error('Pedido não encontrado');
    return res.json();
  },

  async updateOrderStatus(id: string, data: {
    paymentStatus?: string;
    fulfillmentStatus?: string;
    note?: string;
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao atualizar pedido');
    }
    return res.json();
  },

  async simulatePaymentWebhook(orderNumber: string, status: 'approved' | 'rejected'): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber,
        status,
        transactionId: `PAY-TEST-${Date.now()}`
      })
    });
    if (!res.ok) throw new Error('Erro ao disparar webhook');
    return res.json();
  },

  // Technical Assistance
  async submitAssistanceRequest(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deviceType: string;
    brandModel: string;
    serialNumber?: string;
    issueDescription: string;
    preferredService?: string;
  }): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/assistance/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao registrar solicitação');
    }
    return res.json();
  },

  async getAssistanceRequests(): Promise<AssistanceRequest[]> {
    const res = await fetch(`${API_BASE}/assistance/requests`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Falha ao carregar solicitações de assistência');
    return res.json();
  },

  async updateAssistanceRequest(id: string, data: Partial<AssistanceRequest>): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/assistance/requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao atualizar solicitação');
    }
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Falha ao carregar métricas do painel');
    return res.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Credenciais inválidas');
    }
    return res.json();
  },

  async checkAuth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
