import crypto from 'crypto';

export interface HikvisionDevice {
    deviceIndexCode: string;
    deviceName: string;
    deviceType: string;
    status: number; // 1: online, 0: offline
    ip: string;
    port: number;
}

/**
 * Generates the signature for Hikvision OpenAPI (Artemis style)
 */
function generateSignature(
    method: string,
    path: string,
    secret: string,
    headers: Record<string, string>,
    body: string = '',
    accept = 'application/json',
    contentType = 'application/json'
) {
    let contentMd5 = '';
    if (body) {
        contentMd5 = crypto.createHash('md5').update(body).digest('base64');
        headers['Content-MD5'] = contentMd5;
    }

    // Normalize headers for case-insensitive lookup
    const normalizedHeaders: Record<string, string> = {};
    for (const k in headers) {
        normalizedHeaders[k.toLowerCase()] = headers[k];
    }

    const sigHeadersKey = Object.keys(headers).find(k => k.toLowerCase() === 'x-ca-signature-headers');
    const signingHeaderKeys = (headers[sigHeadersKey || ''] || '')
        .split(',')
        .filter(Boolean)
        .sort();

    let signedHeadersString = '';
    for (const key of signingHeaderKeys) {
        const lowerKey = key.toLowerCase();
        if (normalizedHeaders[lowerKey] !== undefined) {
            signedHeadersString += `${lowerKey}:${normalizedHeaders[lowerKey]}\n`;
        }
    }

    const signString = [
        method.toUpperCase(),
        accept,
        contentMd5,
        contentType,
        '', // Date empty
        signedHeadersString,
        path
    ].join('\n');

    return crypto
        .createHmac('sha256', secret)
        .update(signString)
        .digest('base64');
}

export async function fetchHikvision(path: string, options: RequestInit = {}) {
    const key = process.env.HIKVISION_API_KEY;
    const secret = process.env.HIKVISION_API_SECRET;
    const baseUrl = 'https://ius.hikcentralconnect.com';

    if (!key || !secret) {
        throw new Error('HIKVISION_API_KEY or HIKVISION_API_SECRET is not defined');
    }

    const method = options.method || 'GET';
    const timestamp = Date.now().toString();
    
    const headers: Record<string, string> = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-ca-key': key,
        'x-ca-timestamp': timestamp,
        'x-ca-signature-method': 'HmacSHA256',
        'x-ca-signature-headers': 'x-ca-signature-method,x-ca-timestamp',
    };

    // Merge custom headers
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const bodyString = options.body ? options.body.toString() : '';

    const signature = generateSignature(
        method,
        path,
        secret,
        headers,
        bodyString
    );

    headers['X-Ca-Signature'] = signature;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(`${baseUrl}${path}`, {
            ...options,
            headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.text();
            console.error('Hikvision API Error Context:', {
                status: response.status,
                path: path,
                headers: { ...headers, 'X-Ca-Signature': '***' }
            });
            throw new Error(`Hikvision API error: ${response.status} ${error}`);
        }

        return response.json();
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Hikvision API request timed out after 10 seconds');
        }
        throw error;
    }
}

/**
 * Gets the list of devices from Hikvision
 */
export async function getHikvisionDevices(): Promise<HikvisionDevice[]> {
    // UPDATED: Path for Hik-Connect Teams OpenAPI (HCCGW)
    const path = '/api/hccgw/resource/v1/devices/get'; 
    try {
        const data = await fetchHikvision(path, {
            method: 'POST',
            body: JSON.stringify({
                pageIndex: 1,
                pageSize: 100
            })
        });

        console.log('Raw Hikvision Response:', JSON.stringify(data));
        
        // Map Hik-Connect response structure
        // Usually data.data.list or data.data
        const list = data.data?.list || data.data || [];
        return Array.isArray(list) ? list : [];
    } catch (error) {
        console.error('Error fetching Hikvision devices:', error);
        return [];
    }
}
