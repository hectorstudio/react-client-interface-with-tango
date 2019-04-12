import React from 'react';
import './InfoPage.css'

const InfoPage = () =>{
        return <p>You need to specify the beamline in the url for webjive to work, such as https://{window.location.hostname}/<b>beamline</b>/. It is important to have a / after the beamline for webjive to work.</p>;
}
export default InfoPage;

