import React, { useRef } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import bridge from "@vkontakte/vk-bridge";

const images = [
    "img/11.png",
    "img/12.png",
    "img/13.png",
    "img/14.png",
    "img/15.png",
];

function App() {
    const sliderRef = useRef(null);

    const handleShare = (src) => {
        if (navigator.share) {
            navigator.share({
                title: "Поделиться изображением",
                text: "Посмотрите это изображение!",
                url: src, // Ссылка на изображение
            })
                .then(() => console.log("Успешно поделились"))
                .catch((error) => console.error("Ошибка при попытке поделиться", error));
        } else {
            alert("Ваше устройство не поддерживает функцию поделиться.");
        }
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
                                Поделиться
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
