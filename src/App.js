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
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchUser() {
            const user = await bridge.send('VKWebAppGetUserInfo');
            setVkUser(user);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (vkUser && vkUser.id && usersData[vkUser.id]) {
            setImages(usersData[vkUser.id]);
        }
        else {
            setImages(usersData.default);
        }
    }, [vkUser]);

    // const downloadImage = (src) => {
    //     const imageSplit = src.split('/');
    //     fileSaver.saveAs(src, "Воспоминание");
    // };

    const downloadImage = (src) => {
        bridge.send("VKWebAppDownloadFile", {
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
                {images.map((src, index) => (
                    <div key={index} className="slide">
                        <img src={src} alt={`Slide ${index + 1}`} className="slide-image"/>
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
