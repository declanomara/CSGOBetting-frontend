import React from 'react';
import { HistoricalGraph } from './HistoricalGraph';
import BettingControls from './BettingControls';

const MatchTable = ({ match }) => {
    let pools = match.existing_value.map(value => value.toFixed(2));
    let loungeOdds = match.lounge_odds.map(odds => (odds*100).toFixed(2));
    let bovadaOdds = match.bovada_odds.map(odds => (odds*100).toFixed(2));
    let expectedValue = match.expected_value.map(value => value.toFixed(2));

    return (
        <table style={{ width: '100%' }}>
            <tbody>
                <tr>
                    <td style={{ width: '35%', color: '#ccc' }}>Pools:</td>
                    <td style={{ width: '25%', color: '#4caf50' }}>${pools[0]}</td>
                    <td style={{ width: '25%', color: '#4caf50' }}>${pools[1]}</td>
                </tr>
                <tr>
                    <td style={{ width: '35%', color: '#ccc' }}>Lounge Odds:</td>
                    <td style={{ width: '25%', color: loungeOdds[0] < 50 ? '#f44336' : '#4caf50' }}>{loungeOdds[0]}%</td>
                    <td style={{ width: '25%', color: loungeOdds[1] < 50 ? '#f44336' : '#4caf50' }}>{loungeOdds[1]}%</td>
                </tr>
                <tr>
                    <td style={{ width: '35%', color: '#ccc' }}>Bovada Odds:</td>
                    <td style={{ width: '25%', color: bovadaOdds[0] < 50 ? '#f44336' : '#4caf50' }}>{bovadaOdds[0]}%</td>
                    <td style={{ width: '25%', color: bovadaOdds[1] < 50 ? '#f44336' : '#4caf50' }}>{bovadaOdds[1]}%</td>
                </tr>
                <tr>
                    <td style={{ width: '35%', color: '#ccc' }}>Expected Value:</td>
                    <td style={{ width: '25%', color: expectedValue[0] >= 0 ? '#4caf50' : '#f44336' }}>${expectedValue[0]}</td>
                    <td style={{ width: '25%', color: expectedValue[1] >= 0 ? '#4caf50' : '#f44336' }}>${expectedValue[1]}</td>
                </tr>
            </tbody>
        </table>
    );
};

const MatchCard = ({ match, numCols }) => {
    let status = match.status;
    // let title = `${match.competitors[0]} vs ${match.competitors[1]}`;
    let date = new Date(match.time).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    let id = match.id;

    let title = <><span style={{ color: "#de9b35" }}>{match.competitors[0]}</span> vs <span style={{ color: "#5d79ae" }}>{match.competitors[1]}</span></>

    if (status === "2") {
        title = <><span style={{ color: "#de9b35" }}>{match.competitors[0]}</span> vs <span style={{ color: "#5d79ae" }}>{match.competitors[1]}</span></>;
    }
    if (status === "3") {
        title = <><span style={{ color: "#de9b35" }}>{match.competitors[0]}</span> vs <span style={{ color: "#5d79ae" }}>{match.competitors[1]}</span></>;
    }

    let cardWidth = 95/numCols + 'vw';

   
    return (
        <div className="card" style={{borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', backgroundColor: '#333', color: '#fff', border: '1px solid #ccc', width: cardWidth}}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h2 style={{marginTop: '5px', marginBottom: '-10px', marginLeft: '10px', marginRight: '10px', fontSize: '16px'}}>{title}</h2>
                <p style={{fontSize: '12px', color: 'gray', marginBottom: '-12px'}}>{date} ({status})</p>
                <p style={{fontSize: '12px', color: 'gray', marginBottom: '2px'}}>Match ID:{id}</p>
            </div>
            <div className="card-body" style={{ borderTop: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: "15px"}}>
                <MatchTable match={match} />
                <div style={{ padding: '10px' , height: '25vh'}}> 
                    <HistoricalGraph match={match} />
                </div> 
                {new Date(match.time) > new Date() && <BettingControls {...match} style={{width: "100%"}} />}
                </div>
        </div>
    );
};

export default MatchCard;