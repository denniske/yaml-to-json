import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import YAML from 'yaml';

const ALLOWED_ORIGINS = [
    'https://app.aoe2companion.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
];

function getCORSHeaders(origin: string | null): Record<string, string> {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Vary': 'Origin',
        };
    }
    return {};
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const origin = req.headers.get('origin');

    if (!url) {
        return NextResponse.json(
            { error: 'Missing "url" query parameter' },
            {
                status: 400,
                headers: getCORSHeaders(origin),
            }
        );
    }

    try {
        const response = await axios.get(url);
        const result = YAML.parse(response.data);

        const thirtyMinutes = 60 * 30;
        const sixtyMinutes = 60 * 60;

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': `s-maxage=${thirtyMinutes}, stale-while-revalidate=${sixtyMinutes}`,
                ...getCORSHeaders(origin),
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to fetch or parse data', details: error.message },
            {
                status: 500,
                headers: getCORSHeaders(origin),
            }
        );
    }
}
