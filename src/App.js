import React, {useEffect, useRef, useState, useCallback, useMemo} from "react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import html2canvas from "html2canvas";
import {ReactComponent as LogoL} from "./love.svg";
import {ReactComponent as LogoC} from "./com.svg";
import {ReactComponent as LogoOR} from "./or.svg";

import "./App.css";
import bridge from "@vkontakte/vk-bridge";
import {Toaster} from "react-hot-toast";
import {ChevronUp, ChevronDown, Share2} from "lucide-react";

// Импортируем CSV файл
import csvFile from "./final.csv";


// Картинки персонажей
const characterImages = {
    "Шрек": "/img/shrek.jpg",
    "Винни Пух": "/img/winnie.jpeg",
    "Муфаса": "/img/mufasa.png",
    "Губка Боб Квадратные Штаны": "/img/spongebob.jpg",
    "Гомер Симпсон": "/img/homer.png",
    "Кунг-фу панда": "/img/kungfupanda.png",
    "Чебурашка": "/img/cheburashka.png",
    "Покемон": "/img/pokemon.jpg",
    "Микки Маус": "/img/mickey.png",
    "Дональд Дак": "/img/donald.jpg",
    "Ну погоди!": "/img/nupogodi.png",
    "Багз Банни": "/img/bugsbunny.jpg",
    "Бэтмен": "/img/batman.png",
    "Пингвин": "/img/penguin.png",
    "Наш слоняра": "/img/elephant.png"
};

function getCharacterDescription(character) {
    const descriptions = {
        "Шрек": "Сильный и независимый, как Шрек, ты проходишь через любые преграды! Твоя экспедиционная сила сравнима с могучим ограми - ни один болотный переход, ни одна горная тропа тебе не страшны.",
        "Винни Пух": "Добрый и находчивый, ты всегда находишь правильный путь! Как этот милый медвежонок, ты смотришь на мир с открытым сердцем и детским любопытством.",
        "Муфаса": "Мудрый и благородный лидер экспедиций! Твоё царственное присутствие внушает уверенность всей группе. Как истинный король саванны, ты умеешь видеть далеко вперёд, предугадывать опасности и вести свою команду к новым горизонтам.",
        "Губка Боб Квадратные Штаны": "Энергичный и оптимистичный участник! Твой экспедиционный энтузиазм заразителен, как смех этого морского обитателя. Даже в самый дождливый поход ты приносишь солнечное настроение, превращая каждую трудность в весёлое приключение.",
        "Гомер Симпсон": "Неожиданные решения и незабываемые моменты! Твой экспедиционный стиль полон сюрпризов, как и этот любитель пончиков. Ты умеешь находить нестандартные пути, превращать обычные маршруты в комедийные сериалы приключений.",
        "Кунг-фу панда": "Гибкий и целеустремлённый путешественник! Как По из Долины Мира, ты сочетаешь в себе удивительную ловкость и непоколебимую решимость. Твой экспедиционный путь - это искусство баланса между физической выносливостью и внутренней гармонией.",
        "Чебурашка": "Уникальный и любимый всеми участник! Твоя экспедиционная индивидуальность не оставляет равнодушным никого в группе. Как этот милый неведомый зверёк, ты привносишь в каждый поход свою особую магию - ту, что превращает обычный поход в сказочное путешествие, полное тепла и дружбы!",
        "Покемон": "Всегда готов к новым приключениям! Твой экспедиционный дух не знает границ, как и этот неутомимый искатель. Ты ловишь каждый момент, исследуешь каждый поворот тропы, собирая коллекцию незабываемых впечатлений.",
        "Микки Маус": "Классика экспедиционного духа! Твоё путешествие исполнено элегантности и вечной молодости, как у этого диснеевского джентльмена. Ты умеешь превращать любой поход в настоящее шоу - с юмором, стилем и непременным хэппи-эндом.",
        "Дональд Дак": "Эмоциональный и запоминающийся! Твой экспедиционный характер взрывной и непредсказуемый, как у этого вспыльчивого утёнка. Но именно эта страсть к приключениям делает каждое твоё путешествие незабываемым спектаклем.",
        "Ну погоди!": "Динамичный и неутомимый! Твой экспедиционный стиль - это вечная погоня за новыми впечатлениями, как у знаменитого дуэта из мультфильма. Ты носишься по маршрутам с энергией зайца, преодолеваешь препятствия с ловкостью волка.",
        "Багз Банни": "Хитрый и весёлый компаньон! Твоя экспедиционная мудрость приправлена здоровой долей юмора, как у этого знаменитого кролика. Ты всегда находишь самый неожиданный выход из любой ситуации, превращая трудности в комичные сценки.",
        "Бэтмен": "Таинственный и решительный! Твой экспедиционный характер окутан благородной тайной, как у тёмного рыцаря Готэма. Ты появляешься там, где нужна помощь, преодолеваешь препятствия с бесшумной грацией.",
        "Пингвин": "Холоднокровный и расчётливый! Твой экспедиционный стиль точен и выверен, как у этого полярного аристократа. Ты неспешно, с достоинством преодолеваешь маршруты, тщательно планируя каждый шаг.",
        "Наш слоняра": "Мощный и незабываемый! Твоё экспедиционное присутствие величественно и внушительно, как у этого лесного гиганта. Ты несешь через любые преграды не только свой рюкзак, но и дух товарищества."
    };
    return descriptions[character] || "Твой уникальный экспедиционный дух!";
}

function App() {
    const [vkUser, setVkUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const cardRef = useRef(null);
    const storyCardRef = useRef(null);

    // Минимальное расстояние для свайпа
    const minSwipeDistance = 30;

    // Загрузка и парсинг CSV файла
    useEffect(() => {
        async function loadCSV() {
            try {
                const response = await fetch(csvFile);
                const csvText = await response.text();

                Papa.parse(csvText, {
                    delimiter: ';',
                    header: true,
                    complete: (results) => {
                        setCsvData(results.data);
                        setLoading(false);
                    },
                    error: (error) => {
                        console.error("Ошибка парсинга CSV:", error);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error("Ошибка загрузки CSV:", error);
                setLoading(false);
            }
        }

        loadCSV();
    }, []);

    // Получение данных пользователя VK
    useEffect(() => {
        async function fetchUser() {
            try {
                const user = await bridge.send('VKWebAppGetUserInfo');
                setVkUser(user);
                console.log("Данные пользователя получены:", user);
            } catch (error) {
                console.error("Ошибка получения данных пользователя:", error);
            }
        }

        fetchUser();
    }, []);

    // Поиск данных пользователя в CSV по ID
    useEffect(() => {
        if (vkUser && csvData.length > 0) {
            const userId = vkUser.id.toString();
            const foundUser = csvData.find(row => row.ID === userId);

            if (foundUser) {
                setUserData(foundUser);
                console.log("Данные пользователя найдены:", foundUser);
            } else {
                console.log("Пользователь не найден в базе данных");
            }
        }
    }, [vkUser, csvData]);

    const declineTimeUnit = (number, unit) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (unit === 'day') {
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'дней';
        }
        if (lastDigit === 1) {
            return 'день';
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'дня';
        }
        return 'дней';
    }

    if (unit === 'hour') {
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'часов';
        }
        if (lastDigit === 1) {
            return 'час';
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'часа';
        }
        return 'часов';
    }

    return unit;
    };

    // Плавный переход к слайду
    const goToSlide = (index) => {
        if (isAnimating || index === currentSlide) return;

        setIsAnimating(true);
        setCurrentSlide(index);

        setTimeout(() => {
            setIsAnimating(false);
        }, 500);
    };

    const pluralize = (number, words) => {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[
            number % 100 > 4 && number % 100 < 20
                ? 2
                : cases[number % 10 < 5 ? number % 10 : 5]
            ];
    };

    // Обработка свайпов
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || isAnimating) return;

        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > minSwipeDistance;
        const isDownSwipe = distance < -minSwipeDistance;

        if (isUpSwipe) {
            nextSlide();
        } else if (isDownSwipe) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        if (slides && currentSlide < slides.length - 1 && !isAnimating) {
            goToSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0 && !isAnimating) {
            goToSlide(currentSlide - 1);
        }
    };

    // Форматирование даты
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split('.');
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        return `${parseInt(day)} ${months[parseInt(month) - 1]}`;
    };

    // Форматирование чисел
    const formatNumber = (num) => {
        if (!num) return "0";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Поделиться в историю
    const shareToStory = useCallback(async () => {
        try {
            toast.loading("Создаём карточку для истории...");

            // Создаем canvas из карточки для истории
            const canvas = await html2canvas(storyCardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                allowTaint: true,
                logging: false,
                width: 1080,
                height: 1920
            });

            // Преобразуем в data URL
            const imageDataUrl = canvas.toDataURL('image/png');

            // Получаем чистый base64 (без префикса data:image/png;base64,)
            const base64Data = imageDataUrl.split(',')[1];

            // Пробуем разные варианты отправки
            try {
                // Вариант 1: Используем только blob (чистый base64)
                await bridge.send("VKWebAppShowStoryBox", {
                    background_type: "image",
                    blob: base64Data,
                    attachment: {
                        text: "go_to",
                        type: "url",
                        url: "https://vk.com/app54403723"
                    }
                });
            } catch (error) {
                console.log("Попытка 1 не удалась, пробуем вариант 2...");

                // Вариант 2: Используем URL с data URL
                await bridge.send("VKWebAppShowStoryBox", {
                    background_type: "image",
                    url: imageDataUrl,
                    attachment: {
                        text: "go_to",
                        type: "url",
                        url: "https://vk.com/app54403723"
                    }
                });
            }

            toast.dismiss();
            toast.success("Карточка опубликована в историю!");
        } catch (error) {
            console.error("Ошибка при публикации истории:", error);
            toast.dismiss();
            toast.error("Ошибка при публикации");
        }
    }, []);

    // Слайды для случая, когда пользователь не найден
    const notFoundSlides = useMemo(() => [
        { type: "notfound", bg: "https://sun9-13.userapi.com/s/v1/ig2/JjIVzFWYQRW3GFISpudhnuuCGZ7LDaHLGdFOrp9l5xPgAkv5VkqEJgpfHItyavC6v8TWrrF2z4eWD8mW5XgW7Uc9.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920&from=bu&cs=1080x0" },
        { type: "notfound", bg: "https://sun9-75.userapi.com/s/v1/ig2/ry9MGrEaBIyPfqyPe9v1eL6wEZ20cE32IIncE0Pz8-dJ5jg46LX_djvjT02C63NvWikTUTOTG8uzsnIBLZ9p__iz.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
        { type: "notfound", bg: "https://sun9-70.userapi.com/s/v1/ig2/o4WlDVHU1hu3wgK3ak1urqi4TuNn7ciLhCFEgLyPGsz12I7nEBa21XVuvh1urQTtOUFsUB7eIhlDIU1oodTd5s93.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
        { type: "notfound", bg: "https://sun9-80.userapi.com/s/v1/ig2/BZ07mWa-vwUtEfkdx1ayvnJ97E1Ew_QWw9B24JV0F5qGJYGktippfDrmoz3azkYUCm0hsBycFtgLV6jfeozgOydD.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920&from=bu&cs=1080x0" },
        { type: "notfound", bg: "https://sun9-36.userapi.com/s/v1/ig2/5mYtKQgQGsQhTuUgCfQCbqHFAoHhMkkQuNlVEUGvyJjNAMdi4wGW06FcHgomNx-lYXVvjtzKLgr9IAHOViiFOxfi.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920&from=bu&cs=1080x0" },
        { type: "notfound", bg: "https://sun9-88.userapi.com/s/v1/ig2/rhq2lZLXcUNdX2wyWnhosDryJrK8Cgokf2Ksb_zZ8yub7SSnIXlcXhv_8LAAEIzJUWA3lgOXXeBJFTSTRd9WcW5S.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
        { type: "notfound", bg: "https://sun9-43.userapi.com/s/v1/ig2/ZTZpJ7FOuhSIFoPU13bYbJDhJwgletvKiF-YxhBWjEbs7FUtfAjgYD2-e-2C4dxeoUorEa1DZYsN9wCEfeSh-uTV.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
        { type: "notfound", bg: "https://sun9-30.userapi.com/s/v1/ig2/8uNp_Nyhiaj96ZSpLtCkmsdPukfaFkadko2byxfPGs0j5gYa-HZebD2sQBzg7peO2VwMzL9WCg_Lh3kPNKhCJsUJ.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
        { type: "notfound", bg: "https://sun9-63.userapi.com/s/v1/ig2/YZai0iUMIY-1DG_FgzAms1Fe8-0a-GD5x5lJPgdApOgA7H_eLzZBeFHKAVAFdfaVP2J8KvVlLqZvcdGl5ZFnCSog.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
        { type: "notfound", bg: "https://sun9-83.userapi.com/s/v1/ig2/iKIrDRW24rCA2xihXIEZVha5UzxT9bwzjopt5uOL9PQ_F2zBoCS_CH4f6ngoCgXQKZ_gXjszCBJAD6p-M-Yks063.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1440x0" },
    ], []);

    // Массив слайдов для найденного пользователя
    const userSlides = userData ? [
        {
            type: "main",
            bg: "https://sun9-76.userapi.com/s/v1/ig2/ZdMp3o1ZttZ9W68DTKQVWI-NdLndKJDAl3ilwqnkKV3fzfh_gcqWAmhbK656V6fLBu4QziSiriLSb1Lq4DPK-hx_.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920&from=bu&cs=1080x0"
        },
        {
            type: "firstExp",
            title: "Твоя первая экспедиция",
            expName: userData.FirstExp,
            expPhoto: userData.FirstExpPhoto,
            expDate: formatDate(userData.FirstExpDate),
            bg: "https://sun1-89.userapi.com/s/v1/ig2/ZaPf_bYakSoZ9QjJtNOQ0RAezZrXoiVRtDys-sLD651guNw-QJ7iIZMt-2zCzbKvqGQVF1TWpJlzr0w6AmgmoeM8.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0"
        },
        {
            type: "time",
            title: "Ты провёл в экспедициях",
            days: userData.Days,
            hours: userData.Hours,
            bg: "https://sun9-5.userapi.com/s/v1/ig2/76Q2JljyMECn6FJFMFtfZWxdTVferFuPXS48OTYlHSnjJdJ41CT60VBWmnO6NzgYO-qFORrX_RufLfLSYfjZWx8E.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0"
        },
        {
            type: "stats",
            title: "На твоём счету:",
            expeditions: userData.TotalExps,
            regions: userData.TotalRegions,
            bg: "https://sun9-67.userapi.com/s/v1/ig2/Q31sCdqGWS66KTo6STYChq5xgFq869jgDi7t_EVcviMcylIhrBCjTJa75K5M4x0Ty1oMsLGONoMUufkZA61EHfuX.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0"
        },
        {
            type: "people",
            title: "Вот столько человек побывало с тобой в экспедициях",
            people: userData.People,
            bg: "https://sun9-83.userapi.com/s/v1/ig2/NVyrnrZ0iqbsYij5toeeQ-ggPCiGD3k-vXUpTB86lqtvvEjDl8997gQ9VuLAMbuIaDOtwF8JVTE1P1paRdpwMCY0.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0"
        },
        {
            type: "likes",
            title: "Столько лайков и комментариев ты оставил",
            likes: userData.Likes,
            comments: userData.Comments,
            bg: "https://sun1-28.userapi.com/s/v1/ig2/QCTR7jU6heasZ68YTgb2UI1xgy7WR_QMOqfZbPe9dzPCqXk_gNNGjAu1SlMnPcrBe5yG5YhcGGMktZ94rX1B1BPq.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0"
        },
        {
            type: "character",
            title: "Твой экспедиционный тотем",
            character: userData.Animal,
            characterImage: characterImages[userData.Animal] || "/img/default.png",
            bg: "https://sun9-32.userapi.com/s/v1/ig2/6N4doeaeCG6wPsAfJ53Qzv4B-AbfgJKmd7qfQWNXNNAOg7YNww69zY9h7VXO-hbF8_XDSZxpKp12d0vjTMJs4J7V.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0",
            description: getCharacterDescription(userData.Animal)
        },
        {
            type: "share",
            bg: "https://sun9-2.userapi.com/s/v1/ig2/FNbpa-6UPylCJinS8iWRZ2FZdoUUSAAX-H7sx0zUS5X49HNFq_HM8Gf19siJb7c4D-dwzjkedyo-WW-2DUqMXIT3.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920&from=bu&cs=1080x0"
        },
    ] : [];

    // Определяем, какие слайды показывать
    const slides = userData ? userSlides : notFoundSlides;

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p className="loading-text">Загружаем твои экспедиции...</p>
            </div>
        );
    }

    const currentSlideData = slides[currentSlide];

    return (
        <div
            className="app-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                    },
                }}
            />

            {/* Карточка */}
            <div className={`card-wrapper ${isAnimating ? 'animating' : ''}`}>
                <div
                    ref={cardRef}
                    className="card"
                    style={{backgroundImage: `url(${currentSlideData?.bg})`}}
                    key={currentSlide}
                >
                    <div className="card-content">
                        {/* Если пользователь найден - показываем обычные слайды */}
                        {userData && (
                            <>
                                {/* Главный слайд */}
                                {currentSlideData?.type === "main" && (
                                    <div className="main-content">
                                        <h1 className="main-title">{currentSlideData.title}</h1>
                                        <p className="main-subtitle">{currentSlideData.subtitle}</p>
                                    </div>
                                )}

                                {/* Первая экспедиция */}
                                {currentSlideData?.type === "firstExp" && (
                                    <div className="first-exp-figma">
                                        {/* Верхняя белая плашка */}
                                        <div className="white-pill-first">
                                            {currentSlideData.title}
                                        </div>

                                        {/* Фото */}
                                        {currentSlideData.expPhoto && (
                                            <div className="figma-photo-wrapper">
                                                <img
                                                    src={currentSlideData.expPhoto}
                                                    alt={currentSlideData.expName}
                                                    className="figma-photo"
                                                />
                                            </div>
                                        )}

                                        <div className="white-pill-name" style={{left: "21%", bottom: "38%"}}>
                                            {currentSlideData.expName}
                                        </div>

                                        {/* Стрелка */}
                                        <div className="arrow-down"/>

                                        {/* Нижняя белая карточка */}
                                        <div className="white-card">
                                            <div className="exp-date">
                                                Это было аж {currentSlideData.expDate}!
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Слайд с временем */}
                                {currentSlideData?.type === "time" && (
                                    <div className="time-content">
                                        <h2 className="like-number-likes">{currentSlideData.title}</h2>
                                        <div className="time-stats">
                                            <div className={"days"}>
                                                <div className="big-number-days">{formatNumber(currentSlideData.days)}</div>
                                                <div className="time-label">
                                                    {declineTimeUnit(currentSlideData.days, 'day')}
                                                </div>
                                            </div>
                                            <LogoOR className={"likes-coms-or"}></LogoOR>
                                            <div className={"days"}>
                                                <div className="big-number-days">{formatNumber(currentSlideData.hours)}</div>
                                                <div className="time-label">
                                                    {declineTimeUnit(currentSlideData.hours, 'hour')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Слайд со статистикой */}
                                {currentSlideData?.type === "stats" && (
                                    <div className="stats-content">
                                        <h2 className="like-number-likes">{currentSlideData.title}</h2>
                                        <div className="stats-grid">
                                            <div className="stat-item">
                                                <div className="like-item">
                                                    <div className="stat-number">{formatNumber(currentSlideData.expeditions)}</div>
                                                </div>
                                                <div className="time-label">
                                                    {pluralize(currentSlideData.expeditions, [
                                                        'экспедиция',
                                                        'экспедиции',
                                                        'экспедиций'
                                                    ])}
                                                </div>
                                            </div>
                                            <div className="stat-item">
                                                <div className="like-item">
                                                    <div className="stat-number">{formatNumber(currentSlideData.regions)}</div>
                                                </div>
                                                <div className="time-label">
                                                    {pluralize(currentSlideData.regions, [
                                                        'регион',
                                                        'региона',
                                                        'регионов'
                                                    ])}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Слайд с людьми */}
                                {currentSlideData?.type === "people" && (
                                    <div className="people-content">
                                        <h2 className="like-number-likes">{currentSlideData.title}</h2>
                                        <div className="like-item">
                                            <div className="people-number">{formatNumber(currentSlideData.people)}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Слайд с лайками */}
                                {currentSlideData?.type === "likes" && (() => {
                                    const likesNum = parseInt(currentSlideData.likes) || 0;
                                    const commentsNum = parseInt(currentSlideData.comments) || 0;
                                    const hasLikesOrComments = likesNum > 0 || commentsNum > 0;

                                    return (
                                        <div className="likes-content">
                                            <div className="attention">Внимание!</div>
                                            {hasLikesOrComments ? (
                                                <>
                                                    <div className="likes-grid">
                                                        <LogoL src={"/img/love.svg"} className={"likes-coms"} stroke-width="3px" stroke="#ffffff"></LogoL>
                                                        <LogoC src={"/img/com.svg"} className={"likes-coms"}></LogoC>
                                                        <div className="like-item">
                                                            <div className="like-number">{formatNumber(currentSlideData.likes)}</div>
                                                        </div>
                                                        <div className="like-item">
                                                            <div className="like-number">{formatNumber(currentSlideData.comments)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="like-number-likes-l">
                                                        Столько лайков и комментариев ты оставил за год
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="like-number-likes-l">
                                                    В этом году ты к сожалению не сильно много лайкал и комментировал, но в следующем у тебя всё впереди!
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Слайд с персонажем */}
                                {currentSlideData?.type === "character" && (
                                    <div className="character-content">
                                        <h2 className="like-number-hero">{currentSlideData.title}</h2>
                                        <div className="character-card">
                                            <img
                                                src={currentSlideData.characterImage}
                                                alt={currentSlideData.character}
                                                className="character-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="character-placeholder">
                                                            <div class="placeholder-icon">🐾</div>
                                                            <h3>${currentSlideData.character}</h3>
                                                        </div>
                                                    `;
                                                }}
                                            />
                                            <div className="character-name">{currentSlideData.character}</div>
                                            <div>
                                                <p className="character-name-dis">{currentSlideData.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentSlideData?.type === "share" && (
                                    <div className="share-content">
                                        <button className="share-story-button" onClick={shareToStory}>
                                            <Share2 size={20}/>
                                            Поделиться в историю
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Если пользователь НЕ найден - показываем слайды с фото */}
                        {!userData && !loading && currentSlideData?.type === "notfound"}
                    </div>
                </div>
            </div>

            {/* Карточка для истории (только для найденных пользователей) */}
            {userData && (
                <div
                    ref={storyCardRef}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: '-9999px',
                        width: '1080px',
                        height: '1920px',
                        backgroundImage: 'url(https://sun9-67.userapi.com/s/v1/ig2/Q31sCdqGWS66KTo6STYChq5xgFq869jgDi7t_EVcviMcylIhrBCjTJa75K5M4x0Ty1oMsLGONoMUufkZA61EHfuX.jpg?quality=95&as=32x57,48x85,72x128,108x192,160x284,240x427,360x640,480x853,540x960,640x1138,720x1280,1080x1920,1280x2276,1440x2560&from=bu&cs=1280x0)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        padding: '80px',
                        boxSizing: 'border-box',
                        color: 'white',
                        fontFamily: 'Monserat, sans-serif'
                    }}
                >
                    <h1 style={{
                        fontSize: '100px',
                        textAlign: 'center',
                        marginBottom: '5px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        marginTop: '300px'
                    }}>
                        Мои итоги
                    </h1>
                    <div style={{
                        fontSize: '50px',
                        lineHeight: '1.6',
                        backgroundColor: 'rgba(12,26,80,0.6)',
                        padding: '25px',
                        borderRadius: '20px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{marginBottom: '25px'}}>
                            <strong>Первая экспедиция:</strong> {userData?.FirstExp} {userData.FirstExpDate}
                        </div>
                        <div style={{marginBottom: '25px'}}>
                            <strong>Дней в экспедициях:</strong> {formatNumber(userData?.Days)}
                        </div>
                        <div style={{marginBottom: '25px'}}>
                            <strong>Часов в экспедициях:</strong> {formatNumber(userData?.Hours)}
                        </div>
                        <div style={{marginBottom: '25px'}}>
                            <strong>Количество экспедиций:</strong> {formatNumber(userData?.TotalExps)}
                        </div>
                        <div style={{marginBottom: '25px'}}>
                            <strong>Регионов посещено:</strong> {formatNumber(userData?.TotalRegions)}
                        </div>
                        <div style={{marginBottom: '25px'}}>
                            <strong>Участников побывало с тобой:</strong> {formatNumber(userData?.People)}
                        </div>
                        {parseInt(userData?.Likes) > 0 && (
                            <div style={{marginBottom: '25px'}}>
                                <strong>Лайков оставлено:</strong> {formatNumber(userData?.Likes)}
                            </div>
                        )}
                        {parseInt(userData?.Comments) > 0 && (
                            <div style={{marginBottom: '25px'}}>
                                <strong>Комментариев оставлено:</strong> {formatNumber(userData?.Comments)}
                            </div>
                        )}
                        <div style={{marginBottom: '25px'}}>
                            <strong>Тотем:</strong> {userData?.Animal}
                        </div>
                    </div>
                </div>
            )}

            {/* Навигация */}
            <div className="navigation">
                <button
                    className="nav-button prev"
                    onClick={prevSlide}
                    disabled={currentSlide === 0 || isAnimating}
                >
                    <ChevronUp size={24}/>
                </button>
                <div className="nav-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`nav-dot ${index === currentSlide ? 'active' : ''} ${isAnimating ? 'disabled' : ''}`}
                            onClick={() => !isAnimating && goToSlide(index)}
                            disabled={isAnimating}
                        />
                    ))}
                </div>
                <button
                    className="nav-button next"
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1 || isAnimating}
                >
                    <ChevronDown size={24}/>
                </button>
            </div>

            {/* Счетчик */}
            <div className="slide-counter">
                <span className="current">{currentSlide + 1}</span>
                <span className="separator">/</span>
                <span className="total">{slides.length}</span>
            </div>
        </div>
    );
}

export default App;