import React from "react";
import { SolarArrowUp } from "../../components/SolarArrowUp";
import { Contact } from "./sections/Contact";
import { Div } from "./sections/Div";
import { DivWrapper } from "./sections/DivWrapper";
import { Frame } from "./sections/Frame";
import { FrameWrapper } from "./sections/FrameWrapper";
import { HeroTestApproved } from "./sections/HeroTestApproved";
import { PropertySocnetWrapper } from "./sections/PropertySocnetWrapper";
import "./style.css";

export const MainPage = () => {
    return (
        <div className="main-page" data-model-id="328:10">
            <div className="overlap-3">
                <div className="frame-44" />

                <Frame />
                <FrameWrapper />
            </div>

            <div className="overlap-4">
                <HeroTestApproved />
                <div className="frame-45">
                    <div className="frame-46">
                        <div className="frame-47">
                            <div className="text-wrapper-19">Home</div>
                        </div>

                        <div className="frame-48">
                            <div className="text-wrapper-19">Studio</div>
                        </div>

                        <div className="frame-49">
                            <div className="text-wrapper-19">Work</div>
                        </div>

                        <div className="frame-50">
                            <div className="text-wrapper-19">Services</div>
                        </div>

                        <div className="frame-51">
                            <div className="text-wrapper-19">News</div>
                        </div>

                        <div className="frame-52">
                            <div className="text-wrapper-19">Contact</div>
                        </div>
                    </div>
                </div>

                <div className="frame-53">
                    <div className="frame-54">
                        <div className="text-wrapper-20">Lets talk</div>
                    </div>
                </div>
            </div>

            <div className="overlap-5">
                <div className="frame-55" />

                <PropertySocnetWrapper />
                <DivWrapper />
                <Contact />
            </div>

            <Div />
            <SolarArrowUp
                className="solar-arrow-up-outline"
                solarArrowUp="https://c.animaapp.com/meaj648nc30xDr/img/solar-arrow-up-outline-1.svg"
            />
        </div>
    );
};
