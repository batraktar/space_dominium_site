/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { useState } from "react";
import "./style.css";

export const HeroModule = ({ className, onServiceChange }) => {
const [activeService, setActiveService] = useState(0);

const services = [
    "UI/UX Design",
    "App and Web Development", 
    "Brand Design",
    "Content Strategy"
];

const handleServiceClick = (index) => {
    setActiveService(index);
    if (onServiceChange) {
    onServiceChange(index);
    }
};

return (
    <div className={`hero-module ${className}`}>
    {services.map((service, index) => (
        <div 
        key={index}
        className={`service-item ${index === 0 ? 'txt-uiux' : 'div-wrapper-2'} ${activeService === index ? 'active' : ''}`}
        onClick={() => handleServiceClick(index)}
        >
        <div className="text-wrapper-16">{service}</div>
        </div>
    ))}
    </div>
);
};
