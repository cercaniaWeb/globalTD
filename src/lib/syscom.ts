export interface SyscomProduct {
    producto_id: string;
    id?: string;
    modelo: string;
    total_existencia: number;
    titulo: string;
    marca: string;
    sat_key: string;
    img_portada: string;
    precio: string;
    precio_cliente?: string;
    precios?: { precio_1?: string };
    moneda?: string;
}

export async function getSyscomAccessToken() {
    const clientId = process.env.SYSCOM_CLIENT_ID;
    const clientSecret = process.env.SYSCOM_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('SYSCOM_CLIENT_ID or SYSCOM_CLIENT_SECRET is not defined');
    }

    const response = await fetch('https://developers.syscom.mx/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get SYSCOM access token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function getCctvProducts() {
    const token = await getSyscomAccessToken();

    // Categoría 22 es comúnmente CCTV en Syscom
    const response = await fetch('https://developers.syscom.mx/api/v1/productos?categoria=22', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products from SYSCOM');
    }

    const data = await response.json();
    return data.productos as SyscomProduct[];
}
