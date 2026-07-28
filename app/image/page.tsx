'use client';

import { useState } from 'react';

export default function ImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    async function generateImage() {
        if (!prompt) return;

        setLoading(true);

        try {
            const response = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                }),
            });

            const data = await response.json();
            console.log(data);

            setImage(data.image);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main
            style={{
                maxWidth: 700,
                margin: '40px auto',
                textAlign: 'center',
            }}
        >
            <h1 className="text-4xl font-bold">ArtMatch 👩‍🎨</h1>

            <div
                style={{
                    border: '4px solid black',
                    minHeight: 200,
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: 'black',
                }}
            >
                {loading ? (
                    <h2 className="text-white">Generating...</h2>
                ) : image ? (
                    <img
                        src={`data:image/png;base64,${image}`}
                        alt="Generated"
                        style={{ width: '300px', height: '300px' }}
                    />
                ) : (
                    <h2 className="text-white">
                        Describe a famous painting without saying its name or
                        the artist!
                    </h2>
                )}
            </div>

            <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A woman with long brown hair..."
                style={{
                    width: '100%',
                    padding: 15,
                    border: '2px solid black',
                }}
            />

            <br />
            <br />

            <button
                className="bg-green-400 px-6 py-3 hover:cursor-pointer"
                onClick={generateImage}
            >
                Create
            </button>
        </main>
    );
}
