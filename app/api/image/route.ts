import { client } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        const result = await client.images.generate({
            model: 'gpt-image-2',
            prompt,
        });

        if (!result.data || result.data.length === 0) {
            throw new Error('No image was generated.');
        }

        const imageBase64 = result.data[0].b64_json;

        return Response.json({
            image: imageBase64,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: 'Failed to generate image' },
            { status: 500 },
        );
    }
}
