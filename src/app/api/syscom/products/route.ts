import { NextResponse } from 'next/server';
import { getCctvProducts } from '@/lib/syscom';

export async function GET() {
    try {
        const products = await getCctvProducts();

        // Aplicamos el margen de utilidad corporativo (ejercicio: 25%)
        const margin = 1.25;
        const productsWithMargin = products.map(p => {
            const basePrice = parseFloat(p.precio) || 0;
            return {
                ...p,
                precio_cliente: basePrice > 0 ? (basePrice * margin).toFixed(2) : "Consulte",
                moneda: 'USD'
            };
        });

        return NextResponse.json(productsWithMargin);
    } catch (error: any) {
        console.error('Syscom API Error:', error.message);
        return NextResponse.json(
            { error: 'No se pudieron cargar los productos. Verifique las credenciales de la API.' },
            { status: 500 }
        );
    }
}
