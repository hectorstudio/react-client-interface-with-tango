import React, { Component } from 'react';
import './InfoPage.css'

const InfoPage = ({}) =>{
        return <p>You need to specify the beamline in the url for webjive to work, such as https://{window.location.hostname}{process.env.REACT_APP_BASE_URL}<b>beamline</b>/. It is important to have a / after the beamline for webjive to work.</p>;
}
export default InfoPage;

