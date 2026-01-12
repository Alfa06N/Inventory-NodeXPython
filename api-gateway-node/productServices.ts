const URL = process.env.PYTHON_SERVICE_URL || "http://python-api:8000";

interface Product {
  name: string;
  cost_price: number;
  current_stock: number;
}

interface ProductResponse extends Product {
  id: number;
}

interface ServiceResponse<T> {
  data: T | any;
  status: number;
  ok: boolean;
}

interface MovementResponse {
  id: number;
  type: string;
  quantity: number;
  reason: string;
  created_at: string;
}

export async function getProducts(): Promise<
  ServiceResponse<ProductResponse[]>
> {
  const response = await fetch(`${URL}/products`, { method: "GET" });

  const data = await response.json().catch(() => ({}));

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
}

export async function createProduct(
  productData: Product
): Promise<ServiceResponse<ProductResponse>> {
  const response = await fetch(`${URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json().catch(() => {});

  return {
    data: result,
    status: response.status,
    ok: response.ok,
  };
}

export async function updateProduct(
  id: number,
  data: Product
): Promise<ServiceResponse<ProductResponse>> {
  const response = await fetch(`${URL}/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  return {
    data: result,
    status: response.status,
    ok: response.ok,
  };
}

export async function deleteProduct(
  id: number,
  data: Product
): Promise<ServiceResponse<ProductResponse>> {
  const response = await fetch(`${URL}/product/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json().catch(() => ({}));

  return {
    data: result,
    status: response.status,
    ok: response.ok,
  };
}

export async function stockDecrease(
  id: number,
  discount: number
): Promise<ServiceResponse<ProductResponse>> {
  const response = await fetch(`${URL}/product/${id}/stock-decrease`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ discount }),
  });

  const result = await response.json().catch(() => ({}));

  return {
    data: result,
    ok: response.ok,
    status: response.status,
  };
}

export async function stockIncrease(
  id: number,
  increase: number
): Promise<ServiceResponse<ProductResponse>> {
  const response = await fetch(`${URL}/product/${id}/stock-increase`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ increase }),
  });

  const result = await response.json().catch(() => ({}));

  return {
    data: result,
    ok: response.ok,
    status: response.status,
  };
}

export async function getMovements(
  id: number
): Promise<ServiceResponse<MovementResponse>> {
  const response = await fetch(`${URL}/product/${id}/movements`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json().catch(() => ({}));
  return {
    data: result,
    ok: response.ok,
    status: response.status,
  };
}
