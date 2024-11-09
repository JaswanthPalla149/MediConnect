import React from 'react';
import YogaData from './YogaData';


const YogaCard = ({name, image, description})=>{
    return(
        <div style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem'}} >
            <img src = {image} style = {{transform: 'scale(1.1)', borderRadius: '20%'}}/>
            <h2 style = {{fontSize: '1.2rem', color: 'white'}}>{name}</h2>
        </div>
    )
}

export default YogaCard