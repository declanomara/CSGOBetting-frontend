import React, { useState, useEffect } from 'react';
import MatchCard from './MatchCard';


const MatchGrid = ({ matches }) => {
    const [gridSize, setGridSize] = useState({ columns: 4 });

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 600) {
                setGridSize({ columns: 1 });
            } else if (screenWidth < 900) {
                setGridSize({ columns: 2 });
            } else {
                setGridSize({ columns: 4 });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const { columns } = gridSize;

    const gridBackgroundColor = '#222'; // New background color
    const gridPadding = '20px'; // New padding value

    return (
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridGap: '10px', background: gridBackgroundColor, padding: gridPadding }}>
            {matches.map((match, index) => (
                <MatchCard key={index} match={match} numCols={ columns }/>
            ))}
        </div>
    );
};

export default MatchGrid;
