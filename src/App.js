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
                console.log("Успешный успех: получены данные пользователя:");
            } catch (error) {
                console.error("Эх ты блин: ошибка получения данных пользователя:", error);
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

    // const downloadImages = (images) => {
    //     images.forEach((src, index) => {
    //         bridge.send("VKWebAppDownloadFile", {
    //             // url: `https://stage-app52792838-2318179587d2.pages.vk-apps.com/${src}`,
    //             url: "http://u993533i.beget.tech/1.png",
    //             filename: `Итоги года 2024 - ${index + 1}`,
    //             extension: "png"
    //         }).then((data) => {
    //             if (data.result) {
    //                 console.log(`Успешный успех: картинка ${index + 1} скачана`);
    //             }
    //         }).catch((error) => {
    //             console.error(`Эх ты блин: картинка ${index + 1} не скачана:`, error);
    //         });
    //     });
    // };
    //
    // const downloadSingleImage = (src, index) => {
    //     bridge.send("VKWebAppDownloadFile", {
    //         url: src,
    //         filename: `Итоги года 2024 - ${index + 1}`,
    //         extension: "png",
    //     }).then((data) => {
    //         if (data.result) {
    //             console.log(`Успешный успех: картинка ${index + 1} скачана`);
    //         }
    //     }).catch((error) => {
    //         console.error(`Эх ты блин: картинка ${index + 1} не скачана:`, error);
    //     });
    // };

    const uploadStory = (src, index) => {
        bridge.send("VKWebAppShowStoryBox", {
            background_type: "image",
            url: `https://stage-app52792838-2318179587d2.pages.vk-apps.com/${src}`,
            attachment: {
                text: "go_to",
                type: "url",
                url: "https://vk.com/app52792838"
            }
        }).then((data) => {
            if (data.result) {
                console.log(`Успешный успех: картинка ${index + 1} выложена в историю`);
            }
        }).catch((error) => {
            console.error(`Эх ты блин: картинка ${index + 1} не выложена в историю:`, error);
        })
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
                    <div
                        key={index} className="slide">
                        <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="slide-image"
                        />

                        {index !== 0 && index !== imgs.length - 1 && (
                            <button
                                className="share-button"
                                onClick={() => {uploadStory(src, index)}}
                            >Выложить в историю
                            </button>
                        )}

                        {index === imgs.length - 1 && imgs[0] === "img/31.avif" && (
                                <button
                                    className="change-button"
                                    onClick={() =>{
                                        sliderRef.current.slickGoTo(0);
                                        setImages(usersData.default);
                                    }}
                                >Смотреть общие итоги корпуса
                                </button>
                        )}

                        {index === imgs.length - 1 && imgs[0] === "img/11.avif"
                            && usersData[vkUser.id.toString()] && (
                                <button
                                    className="change-button"
                                    onClick={() =>{
                                        sliderRef.current.slickGoTo(0);
                                        setImages(usersData.vkUser.id.toString());
                                    }}
                                >Смотреть личные итоги
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
