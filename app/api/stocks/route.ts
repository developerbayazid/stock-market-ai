import { dates } from '@/utils/dates';

export async function POST(request: Request) {
    try {
        const { tickers } = await request.json();

        if (!tickers || tickers.length === 0) {
            return Response.json(
                {
                    error: 'No tickers provided',
                },
                {
                    status: 400,
                },
            );
        }

        const stockData = await Promise.all(
            tickers.map(async (ticker: string) => {
                const url = `https://api.massive.com/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${ticker}`);
                }

                const data = await response.json();

                return data;
            }),
        );

        return Response.json(stockData);
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: 'Failed to fetch stock data',
            },
            {
                status: 500,
            },
        );
    }
}
