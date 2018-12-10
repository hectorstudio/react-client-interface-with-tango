import React, { Component } from 'react';
import './InfoPage.css'

const InfoPage = ({}) =>{
        return <p>You need to specify the tango database in the url for webjive to work, such as https://{window.location.hostname}{process.env.REACT_APP_BASE_URL}<b>tangoDB</b>/. It is important to have a / after the tangoDB for webjive to work.</p>;
}
export default InfoPage;

