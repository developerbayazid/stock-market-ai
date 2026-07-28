'use client';
import { dates } from '@/utils/dates';
import Image from 'next/image';
import { useState } from 'react';
import './style.css';

export default function Home() {
    const [ticker, setTicker] = useState('');
    const [tickers, setTickers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiMessage, setApiMessage] = useState('Querying Stocks API...');
    const [report, setReport] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (ticker.length > 2) {
            setTickers([...tickers, ticker.toUpperCase()]);

            setTicker('');

            setError('');
        } else {
            setError(
                'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.',
            );
        }
    }

    async function generateReport() {
        try {
            setLoading(true);

            setApiMessage('Querying Stocks API...');

            /*
                Step 1:
                Get stock data
            */

            const stockResponse = await fetch(
                'https://cloudflare-worker-ai.bayazidhasanbd1971.workers.dev/stock',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tickers: tickers,
                        startDate: dates.startDate,
                        endDate: dates.endDate,
                    }),
                },
            );

            const stockData = await stockResponse.json();

            setApiMessage('Creating report...');

            /*
                Step 2:
                Send data to OpenAI
            */

            // const reportResponse = await fetch('/api/report', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(stockData),
            // });

            // const reportData = await reportResponse.json();
            // console.log(reportData);
            // console.log(typeof reportData.report);

            // setReport(reportData.report);

            const messages = [
                {
                    role: 'developer',
                    content:
                        'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.',
                },
                {
                    role: 'user',
                    content: `${JSON.stringify(stockData)} ###
                        OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
                        ###
                        Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
                        ###`,
                },
            ];

            const url =
                'https://cloudflare-worker-ai.bayazidhasanbd1971.workers.dev/report';
            const reportRs = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages),
            });

            const data = await reportRs.json();

            if (!reportRs.ok) {
                throw new Error(`Worker error: ${data.error}`);
            }

            setReport(data);
            console.log(data);
        } catch (error) {
            console.log(error);

            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <header>
                <Image
                    src={`/logo-dave-text.png`}
                    width={`1000`}
                    height={`200`}
                    alt=""
                />
                {/* <h2 className="bg-black py-6">Predict stock price</h2> */}
            </header>
            <main>
                {!loading && !report && (
                    <section className="action-panel">
                        <form id="ticker-input-form" onSubmit={handleSubmit}>
                            <label
                                style={{
                                    color: error ? 'red' : 'inherit',
                                }}
                            >
                                {error ||
                                    'Add up to 3 stock tickers below to get a super accurate stock predictions report👇'}
                            </label>

                            <div className="form-input-control">
                                <input
                                    type="text"
                                    id="ticker-input"
                                    placeholder="MSFT"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value)}
                                />

                                <button
                                    className="add-ticker-btn"
                                    type="submit"
                                >
                                    <Image
                                        src={'/images/add.svg'}
                                        alt="loading"
                                        width={50}
                                        height={50}
                                    />
                                    .
                                </button>
                            </div>
                        </form>

                        <p className="ticker-choice-display">
                            {tickers.length === 0
                                ? 'Your tickers will appear here...'
                                : tickers.map((item) => (
                                      <span className="ticker" key={item}>
                                          {item}
                                      </span>
                                  ))}
                        </p>

                        <button
                            className="generate-report-btn"
                            disabled={tickers.length === 0}
                            onClick={generateReport}
                        >
                            Generate Report
                        </button>

                        <p className="tag-line">
                            Always correct 15% of the time!
                        </p>
                    </section>
                )}

                {loading && (
                    <section className="loading-panel">
                        <Image
                            src={'/images/loader.svg'}
                            alt="loading"
                            width={100}
                            height={100}
                        />

                        <div id="api-message">{apiMessage}</div>
                    </section>
                )}

                {report && (
                    <section className="output-panel">
                        <h2>Your Report 😜</h2>

                        <p>{report}</p>

                        <button
                            onClick={() => {
                                setReport('');
                                setTickers([]);
                            }}
                        >
                            New Report
                        </button>
                    </section>
                )}
            </main>

            <footer>© This is not real financial advice!</footer>
        </div>
    );
}
