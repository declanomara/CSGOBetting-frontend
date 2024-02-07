import React, { useEffect, useState } from 'react';

const BetComponent = ( match ) => {
    const [betPlaced, setBetPlaced] = useState(false);
    const [betInfo, setBetInfo] = useState([-1, -1]);
    const [betAmount, setBetAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getBetData = () => {
        // Logic for getting bet data
        let url = `http://dserver:8000/bets/${match.id}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            if (data) {
                if ("error" in data) {
                    setBetPlaced(false);
                    setBetInfo(data.error);
                }
                else {
                    setBetPlaced(true);
                    setBetInfo([data.side, data.amount]);
                }
            }
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error getting bet data:', error);
        })
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getBetData();
        }, 10000);
        getBetData();

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handlePlaceBet = (side) => {
        // Logic for placing the bet
        let url = `http://dserver:8000/bets?match_id=${match.id}&amount=${betAmount}&side=${side}`;
        console.log(url);

        setIsLoading(true);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Include any additional data you want to send with the request
            })
        })
            .then(response => response.json())
            .then(() => {
                // Handle the response from the server
                // setBetPlaced(true);
                // setBetInfo('Bet placed successfully!');
                getBetData();
            })
            .catch(error => {
                // Handle any errors that occur during the request
                console.error('Error placing bet:', error);
            })
            .finally(() => {
                setIsLoading(false);
            }
        );
    };

    const handleCancelBet = () => {
        // Logic for canceling the bet
        let url = `http://dserver:8000/bets?match_id=${match.id}`;
        console.log(url);

        setIsLoading(true);
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(() => {
                // Handle the response from the server
                // setBetPlaced(false);
                // setBetInfo('Bet canceled successfully!');
                getBetData();
            })
            .catch(error => {
                // Handle any errors that occur during the request
                console.error('Error canceling bet:', error);
            }).
            finally(() => {
                setIsLoading(false);
            }
        );
    };

    let betSideColor = betInfo[0] === 1 ? '#de9b35' : '#5d79ae';

    return (
        <div style={{width: "90%"}}>
            {isLoading ? <div style={{ height: '125px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><circle cx="18" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle><circle cx="6" cy="12" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0"/></circle></svg>
            </div> : (
                <>
                    {betPlaced ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <span style={{ color: 'white', marginTop: "auto", marginBottom: "10px"}}>You have bet ${betInfo[1]} on <span style={{color: betSideColor}}>{match.competitors[betInfo[0]-1]}</span></span>
                            <button style={{ color: '#f44336', backgroundColor: 'transparent', border: '1px solid #f44336', padding: '10px', borderRadius: '5px', width: '100%', margin: "2px", transform: 'translateY(0)', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={handleCancelBet} onMouseDown={e => e.target.style.transform = 'translateY(2px)'} onMouseUp={e => e.target.style.transform = 'translateY(0)'}>Cancel Bet</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width:"100%" }}>
                                <span style={{ color: 'white', marginRight: '5px' }}>$</span>
                                <input type="text" style={{width: '100%', backgroundColor: '#333', border: '1px solid #444', padding: '10px', borderRadius: '5px', color:"white"}} value={betAmount} onChange={e => setBetAmount(e.target.value)} placeholder="Enter bet amount" />
                            </div>
                            <button style={{ color: '#de9b35', backgroundColor: 'transparent', border: '1px solid #de9b35', padding: '10px', borderRadius: '5px', width: '100%', margin: "2px", transform: 'translateY(0)', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => handlePlaceBet(1)} onMouseDown={e => e.target.style.transform = 'translateY(2px)'} onMouseUp={e => e.target.style.transform = 'translateY(0)'}>Bet on {match.competitors[0]}</button>
                            <button style={{ color: '#5d79ae', backgroundColor: 'transparent', border: '1px solid #5d79ae', padding: '10px', borderRadius: '5px', width: '100%', margin: "2px", transform: 'translateY(0)', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => handlePlaceBet(2)} onMouseDown={e => e.target.style.transform = 'translateY(2px)'} onMouseUp={e => e.target.style.transform = 'translateY(0)'}>Bet on {match.competitors[1]}</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default BetComponent;