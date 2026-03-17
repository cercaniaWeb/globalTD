import { NextResponse } from 'next/server';
import { getCctvProducts, SyscomProduct } from '@/lib/syscom';

export const revalidate = 300; // Cache la respuesta por 5 minutos para optimizar performance

export async function GET() {
    try {
        const products = await getCctvProducts();

        // Aplicamos el margen de utilidad corporativo (ejercicio: 25% por defecto)
        const margin = parseFloat(process.env.PROFIT_MARGIN || '1.25');
        const exchangeRate = parseFloat(process.env.USD_TO_MXN || '20.00');
        const productsWithMargin = products.map((p: SyscomProduct) => {
            const basePriceStr = p.precios?.precio_1 || p.precio || "0";
            const basePrice = parseFloat(basePriceStr) || 0;
            return {
                ...p,
                precio_cliente: basePrice > 0 ? (basePrice * margin * exchangeRate).toFixed(2) : "Consulte",
                moneda: 'MXN'
            };
        });

        return NextResponse.json(productsWithMargin);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown Error';
        console.error('Syscom API Error (Falling back to mock data):', message);

        // Fallback mock data para que el sistema siempre sea funcional
        const mockProducts = [
            {
                producto_id: "1",
                titulo: "Kit de 4 Cámaras Bala 1080p c/ DVR y Accesorios - HIKVISION",
                modelo: "KIT-BULLET-1080",
                marca: "HIKVISION",
                precio: "120.00",
                img_portada: "https://ftp3.syscom.mx/local/images/84105_138407_med.jpg",
                categorias: [{ nombre: "Videovigilancia" }, { nombre: "Kits" }]
            },
            {
                producto_id: "2",
                titulo: "Cámara Domo IP 4 Megapíxel / Lente 2.8 mm / Uso Exterior IP67",
                modelo: "IPC-D42M",
                marca: "EPCOM",
                precio: "55.00",
                img_portada: "https://ftp3.syscom.mx/local/images/128392_138407_med.jpg",
                categorias: [{ nombre: "Videovigilancia" }, { nombre: "Cámaras IP" }]
            },
            {
                producto_id: "3",
                titulo: "Terminal de Control de Acceso Facial con Medición de Temperatura",
                modelo: "DS-K1T671TM-3XF",
                marca: "HIKVISION",
                precio: "350.00",
                img_portada: "https://ftp3.syscom.mx/local/images/96112_138407_med.jpg",
                categorias: [{ nombre: "Control de Acceso" }, { nombre: "Biometría" }]
            },
            {
                producto_id: "4",
                titulo: "Bobina de Cable UTP Cat 6, Exterior, 305 Metros",
                modelo: "PRO-CAT6-EXT",
                marca: "LINKEDPRO",
                precio: "85.00",
                img_portada: "https://ftp3.syscom.mx/local/images/11100_138407_med.jpg",
                categorias: [{ nombre: "Redes" }, { nombre: "Cableado Estructurado" }]
            }
        ];

        const margin = parseFloat(process.env.PROFIT_MARGIN || '1.25');
        const exchangeRate = parseFloat(process.env.USD_TO_MXN || '20.00'); // Asumiendo base USD de Syscom a MXN
        const productsWithMargin = mockProducts.map(p => {
            const basePrice = parseFloat(p.precio) || 0;
            return {
                ...p,
                precio_cliente: basePrice > 0 ? (basePrice * margin * exchangeRate).toFixed(2) : "Consulte",
                moneda: 'MXN'
            };
        });

        return NextResponse.json(productsWithMargin);
    }
}
