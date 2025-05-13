import { useState } from 'react';

function App() {
    const [noodles, setNoodles] = useState<string>('');
    const [chunkSize, setChunkSize] = useState<number>(10);
    const [delay, setDelay] = useState<number>(500);
    const [streaming, setStreaming] = useState<boolean>(false);

    const startStream = async () => {
        setNoodles('');
        setStreaming(true);

        try {
            const response = await fetch(
                `http://localhost:3000/spaghetti?chunkSize=${chunkSize}&delay=${delay}`
            );
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                console.error('No reader available');
                return;
            }

            while (true) {
                const { value, done } = await reader.read();
                console.log('Value: ', value);
                console.log('Done: ', done);
                if (done) break;

                const chunk = decoder.decode(value); // ✅ decode fully
                console.log('Received chunk:', chunk); // ✅ log
                setNoodles((prev) => prev + chunk);
            }
        } catch (err) {
            console.error('Streaming failed', err);
        } finally {
            setStreaming(false);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
            <h1>🍝 Spaghetti Streamer</h1>

            <label>
                Chunk Size:
                <input
                    type="number"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Number(e.target.value))}
                />
            </label>
            <br />

            <label>
                Delay (ms):
                <input
                    type="number"
                    value={delay}
                    onChange={(e) => setDelay(Number(e.target.value))}
                />
            </label>
            <br />

            <button onClick={startStream} disabled={streaming}>
                {streaming ? 'Streaming...' : 'Start Streaming'}
            </button>

            <pre style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
                {noodles}
            </pre>
        </div>
    );
}

export default App;
