import React, { useRef } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import fileSaver from "file-saver/dist/FileSaver";
import {useEffect, useState} from "react";
import bridge from "@vkontakte/vk-bridge";

const images = [
    "img/11.png",
    "img/12.png",
    "img/13.png",
    "img/14.png",
    "img/15.png",
];

function App() {
    const [vkUser, setVkUser] = useState(null);

    useEffect(() => {
        async function fetchUser(){
            const user = await bridge.send('VKWebAppGetUserInfo');
            setVkUser(user);
        }
        fetchUser();
        },
        []
    )

    const sliderRef = useRef(null);

    const downloadImage = (src) => {
        const imageSplit = src.split('/');
        fileSaver.saveAs(src, "Воспоминание");
    };

    const handleShare = (src) => {
        downloadImage(src);
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="slider-container">
            {/* Кнопка "влево" */}
            <button
                className="arrow-button left"
                onClick={() => sliderRef.current.slickPrev()}
            >
                &lt;
            </button>

            <Slider ref={sliderRef} {...settings} className="slider">
                {images.map((src, index) => (
                    <div key={index} className="slide">
                        <img src={src} alt={`Slide ${index + 1}`} className="slide-image" />
                        {index !== 0 && index !== images.length - 1 && (
                            <button
                                className="share-button"
                                onClick={() => handleShare(src)}
                            >
                                Скачать картинку
                            </button>
                        )}
                    </div>
                ))}
            </Slider>

            {/* Кнопка "вправо" */}
            <button
                className="arrow-button right"
                onClick={() => sliderRef.current.slickNext()}
            >
                &gt;
            </button>
        </div>
    );
}

export default App;
