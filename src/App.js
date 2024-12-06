import React, {useEffect, useRef, useState} from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import bridge from "@vkontakte/vk-bridge";
import usersData from "./users-data.json";

function App() {
    const sliderRef = useRef(null);
    const [vkUser, setVkUser] = useState(null);
    const [imgs, setImages] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                setVkUser(user);
                console.log("Получены данные пользователя:");
            } catch (error) {
                console.error("Ошибка получения данных пользователя:", error);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (vkUser && usersData[vkUser.id.toString()]) {
            setImages(usersData[vkUser.id.toString()]);
        }
        else {
            setImages(usersData.default);
        }
    }, [vkUser]);

    const downloadImage = (src) => {
        bridge.send("VKWebAppDownloadFile",{
            url: src,
            filename: "Воспоминание",
            extension: "png",
        }).then((data) => {
            if (data.result) {
                console.log("File downloaded successfully");
            }
        }).catch((error) => {
            console.error("Error downloading file:", error);
        });
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
                {imgs.map((src, index) => (
                    <div key={index} className="slide">
                        <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="slide-image"
                        />
                        {index !== 0 && index !== imgs.length - 1 && (
                            <button
                                className="share-button"
                                onClick={() => handleShare(src)}
                            >
                                Скачать картинку
                            </button>
                        )}
                        {index === imgs.length - 1 && imgs[0] === "img/31.avif" && (
                            <button
                                className="default-button"
                                onClick={() =>{
                                    sliderRef.current.slickGoTo(0);
                                    setImages(usersData.default);
                                }}
                            >
                                Смотреть общие итоги корпуса
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
