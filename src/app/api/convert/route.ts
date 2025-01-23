import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import YAML from 'yaml';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing "url" query parameter' }, { status: 400 });
    }

    try {
        // Fetch the data from the provided URL
        const response = await axios.get(url);
        const result = YAML.parse(response.data);

        const thirtyMinutes = 60 * 30;
        const sixtyMinutes = 60 * 60;

        // Return the parsed YAML data as JSON with caching headers
        return NextResponse.json(result, {
            headers: {
                'Cache-Control': `s-maxage=${thirtyMinutes}, stale-while-revalidate=${sixtyMinutes}`,
            },
        });
    } catch (error: any) {
        // Handle errors
        return NextResponse.json(
            { error: 'Failed to fetch or parse data', details: error.message },
            { status: 500 }
        );
    }
}
