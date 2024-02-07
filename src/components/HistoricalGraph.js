import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function fromTimestamp(timestamp) {
    // Convert a Unix timestamp in seconds to a human-readable date e.g. "1h ago", "5s ago", etc.
    
    let nowSeconds = Math.floor(Date.now() / 1000);
    let difference = Math.max(nowSeconds - timestamp, 0);

    if (difference < 60) {
        return `${difference}s ago`;
    }
    if (difference < 3600) {
        return `${Math.floor(difference / 60)}m ago`;
    }
    if (difference < 86400) {
        return `${Math.floor(difference / 3600)}h ago`;
    }
    return `${Math.floor(difference / 86400)}d ago`;
}

export function HistoricalGraph({ match }) {
    const [data, setData] = useState(null);

    const options = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        scales: {
            x: {
                display: true,
                ticks: {
                    callback: function (value, index, values) {
                        if (index === 0 || index === values.length - 1) {
                            return fromTimestamp(value);
                        }
                        return '';
                    },
                },
                
                min: data ? data.labels[0] : 0,
                max: data ? data.labels[data.labels.length - 1] : 1,
            },
            y: {
                beginAtZero: true,
                min: 0,
                max: 1,
                ticks: {
                    // stepSize: 0.25,
                    values: [0, 0.25, 0.5, 0.75, 1]
                },
    
            },
        },
        events: ['click', 'mousemove', 'mouseout', 'touchstart', 'touchmove'],
        elements: {
            point: {
                radius: 0,
            },
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        let label = '';
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(2);
                        }
                        return label;
                    },
                    title: function (context) {
                        if (context[0].parsed.x!== null) {
                            return fromTimestamp(context[0].parsed.x);
                        }
                        return '';
                    },
                },
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // The goal is to create a sliding window that begins no later than 1hr before the match and ends at the current time
                let now = Math.floor(Date.now() / 1000);
                let fiveHoursAgo = now - 5*60*60;
                let after;
                // If 5 hours ago is before the match, use that as the start time, otherwise use the match time
                let matchTime = new Date(match.time).getTime() / 1000;
                if (fiveHoursAgo < matchTime) {
                    after = fiveHoursAgo;
                }
                else {
                    after = matchTime;
                }
                let before = after + 5*60*60;

                console.log(`http://dserver:8000/matches/${match.id}/historical?after=${after}&before=${before}`)

                const response = await fetch(`http://dserver:8000/matches/${match.id}/historical?after=${after}&before=${before}`);
                const result = await response.json();

                let xData = result.map((data) => data.last_updated);
                let y1Data = result.map((data) => data.bovada_odds[0]);
                let y2Data = result.map((data) => data.bovada_odds[1]);

                let data = {
                    labels: xData,
                    datasets: [
                        {
                            label: `${match.competitors[0]} Odds`,
                            data: y1Data,
                            backgroundColor: '#de9b35',
                            borderColor: '#de9b35',
                            borderWidth: 1,
                            showLine: true,
                        },
                        {
                            label: `${match.competitors[1]} Odds`,
                            data: y2Data,
                            backgroundColor: '#5d79ae',
                            borderColor: '#5d79ae',
                            borderWidth: 1,
                            showLine: true,
                        },
                    ],
                };
                setData(data);
            } catch (error) {
                // console.error('Error fetching data:', error);
                
            }
        };

        fetchData();
    }, [match]);

    return data ? <Scatter options={options} data={data} /> : null;
}
