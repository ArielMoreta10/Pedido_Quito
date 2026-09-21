/* =====================================================
   CONFIGURACIÓN
===================================================== */

/*
    Cantidad de girasoles.

    380 = bastante lleno
    500 = muy frondoso
    600 = extremadamente lleno

    Recomendado: 500
*/

const TOTAL_FLOWERS = 500;


/*
    Próximo aniversario:

    21 de septiembre
*/

const ANNIVERSARY_MONTH = 8; // Septiembre = 8
const ANNIVERSARY_DAY = 21;


/* =====================================================
   ELEMENTOS
===================================================== */

const startScreen =
    document.getElementById("startScreen");

const card =
    document.getElementById("card");

const bouquet =
    document.getElementById("bouquet");

const flowersContainer =
    document.getElementById("flowers");


/* =====================================================
   GIRASOLES DEL FONDO
===================================================== */

function createBackgroundHearts() {

    const container =
        document.getElementById("floatingHearts");


    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const heart =
            document.createElement("div");


        heart.className =
            "floatingHeart";


        heart.textContent =
            "🌻";


        heart.style.left =
            Math.random() * 100 + "%";


        heart.style.fontSize =
            (
                12 +
                Math.random() * 28
            ) + "px";


        heart.style.animationDuration =
            (
                8 +
                Math.random() * 14
            ) + "s";


        heart.style.animationDelay =
            (
                -Math.random() * 15
            ) + "s";


        container.appendChild(
            heart
        );

    }

}


/* =====================================================
   GENERAR POSICIONES DEL ÁRBOL
===================================================== */

/*
    Ahora la copa ocupa una zona mucho
    más grande del tallo.

    Los girasoles empiezan arriba y
    bajan aproximadamente hasta la
    mitad del tallo.

    La distribución se mantiene
    equilibrada a izquierda y derecha.
*/

function generateTreePositions(amount) {

    const positions = [];


    while (
        positions.length < amount
    ) {

        /*
            Posición horizontal.

            Más amplia para que los
            girasoles no se acumulen
            en un solo lado.
        */

        const x =
            Math.random() * 42 - 21;


        /*
            Posición vertical.

            Antes:

            -12.5 → 12.5

            Ahora hacemos una copa
            mucho más alta.
        */

        const y =
            Math.random() * 34 - 17;


        /*
            Normalizamos la altura.

            0 = parte inferior
            1 = parte superior
        */

        const normalizedY =
            (
                y + 17
            ) / 34;


        /*
            Forma de la copa.

            Usamos una curva suave
            para mantener la parte
            superior frondosa.
        */

        const centerFactor =
            Math.sin(
                normalizedY * Math.PI
            );


        /*
            Anchura de la copa.

            En la zona central es muy
            ancha.

            Arriba y abajo se estrecha,
            pero nunca demasiado.
        */

        const maxWidth =
            8 +
            centerFactor * 14;


        /*
            Irregularidad natural.

            Algunos girasoles pueden
            sobresalir de la copa.
        */

        const irregularity =
            Math.random() * 4;


        const finalWidth =
            maxWidth +
            irregularity;


        /*
            Comprobamos si el girasol
            pertenece a la copa.
        */

        if (
            Math.abs(x) <= finalWidth
        ) {

            positions.push({
                x: x,
                y: y
            });

        }

    }


    /*
        Mezclamos las posiciones.

        Esto evita que la animación
        cree primero demasiadas flores
        en una misma zona.
    */

    for (
        let i = positions.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            positions[i],
            positions[j]
        ] =
        [
            positions[j],
            positions[i]
        ];

    }


    return positions;

}


/* =====================================================
   CREAR UNA FLOR
===================================================== */

function createFlower(
    x,
    y,
    index
) {

    const flower =
        document.createElement(
            "div"
        );


    flower.className =
        "flower";


    /* =================================================
       POSICIÓN
    ================================================= */

    /*
        La copa queda encima
        del tallo.
    */

    const left =
        50 +
        x * 1.25;


    const top =
        39 -
        y * 1.45;


    flower.style.left =
        left + "%";


    flower.style.top =
        top + "%";


    /* =================================================
       TAMAÑO
    ================================================= */

    /*
        Variación de tamaño para
        que las flores no sean idénticas.
    */

    const scale =
        0.60 +
        Math.random() * 0.55;


    flower.dataset.scale =
        scale;


    /* =================================================
       ROTACIÓN
    ================================================= */

    /*
        Cada girasol tiene una pequeña
        inclinación aleatoria.

        Esto hace que la copa se vea
        más natural.
    */

    const rotation =
        Math.random() * 30 - 15;


    flower.dataset.rotation =
        rotation;


    flower.style.transform =
        `
        translate(-50%, -50%)
        scale(0)
        rotate(${rotation}deg)
        `;


    /* =================================================
       PÉTALOS
    ================================================= */

    /*
        Los pétalos pertenecen a cada
        girasol.

        El tallo ya no tiene pétalos.
    */

    for (
        let p = 1;
        p <= 8;
        p++
    ) {

        const petal =
            document.createElement(
                "div"
            );


        petal.className =
            `petal p${p}`;


        flower.appendChild(
            petal
        );

    }


    /* =================================================
       CENTRO
    ================================================= */

    const center =
        document.createElement(
            "div"
        );


    center.className =
        "center";


    flower.appendChild(
        center
    );


    /* =================================================
       AGREGAR AL DOM
    ================================================= */

    flowersContainer.appendChild(
        flower
    );


    /* =================================================
       DELAY
    ================================================= */

    /*
        Las flores aparecen una por una.

        Las primeras aparecen cerca
        del inicio de la animación.
    */

    flower.dataset.delay =
        2500 +
        index * 12;


    return flower;

}


/* =====================================================
   CREAR TODAS LAS FLORES
===================================================== */

function createFlowers() {

    /*
        Generamos la copa.
    */

    const positions =
        generateTreePositions(
            TOTAL_FLOWERS
        );


    const flowers = [];


    /*
        Creamos todas las flores.
    */

    positions.forEach(
        (
            position,
            index
        ) => {

            const flower =
                createFlower(
                    position.x,
                    position.y,
                    index
                );


            flowers.push(
                flower
            );

        }
    );


    /* =================================================
       ANIMACIÓN DE LAS FLORES
    ================================================= */

    flowers.forEach(
        flower => {

            const delay =
                Number(
                    flower.dataset.delay
                );


            setTimeout(
                () => {

                    const scale =
                        Number(
                            flower.dataset.scale
                        );


                    const rotation =
                        Number(
                            flower.dataset.rotation
                        );


                    flower.classList.add(
                        "visible"
                    );


                    flower.style.transform =
                        `
                        translate(-50%, -50%)
                        scale(${scale})
                        rotate(${rotation}deg)
                        `;

                },

                delay
            );

        }
    );


    /* =================================================
       FINAL DE LA ANIMACIÓN
    ================================================= */

    const totalTime =
        2500 +
        TOTAL_FLOWERS * 12 +
        1500;


    setTimeout(
        () => {

            finishBouquet();

        },

        totalTime
    );

}


/* =====================================================
   TERMINAR RAMO
===================================================== */

function finishBouquet() {

    /*
        Brillito final.
    */

    card.classList.add(
        "finished"
    );


    /*
        Esperamos un momento.
    */

    setTimeout(
        () => {

            /*
                Movemos el árbol
                hacia la derecha.
            */

            bouquet.classList.add(
                "moveRight"
            );

        },

        800
    );


    /*
        Después aparece la carta.
    */

    setTimeout(
        () => {

            card.classList.add(
                "letterVisible"
            );


            writeLetter();

        },

        2200
    );

}


/* =====================================================
   MÁQUINA DE ESCRIBIR
===================================================== */

function typeText(
    element,
    text,
    speed
) {

    return new Promise(
        resolve => {

            let index = 0;


            const timer =
                setInterval(
                    () => {

                        element.textContent +=
                            text.charAt(
                                index
                            );


                        index++;


                        if (
                            index >=
                            text.length
                        ) {

                            clearInterval(
                                timer
                            );


                            resolve();

                        }

                    },

                    speed
                );

        }
    );

}


/* =====================================================
   CARTA
===================================================== */

async function writeLetter() {

    const title =
        document.getElementById(
            "title"
        );


    const text1 =
        document.getElementById(
            "text1"
        );


    const text2 =
        document.getElementById(
            "text2"
        );


    const text3 =
        document.getElementById(
            "text3"
        );


    const text4 =
        document.getElementById(
            "text4"
        );


    /* =================================================
       MENSAJE
    ================================================= */


    await typeText(
        title,

        "Para la mas trabajadora de Machala 🌻",

        55
    );


    await wait(
        400
    );


    await typeText(
        text1,

        "Aprovechando que soy electronico...",

        45
    );


    await wait(
        300
    );


    await typeText(
        text2,

        "Para que te llegue en esta ocasión tus flores amarillas.",

        35
    );


    await wait(
        300
    );


    await typeText(
        text3,

        "Espero que sigas siendo una mujer fuerte, feliz y trabajadora.",

        35
    );


    await wait(
        500
    );


    await typeText(
        text4,

        "Disfruta tus florecitas virtuales❤️",

        70
    );

}


/* =====================================================
   ESPERAR
===================================================== */

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =====================================================
   CONTADOR REGRESIVO
===================================================== */

/*
    Calcula automáticamente el próximo
    21 de septiembre.

    Ejemplo:

    20 de septiembre
    ↓
    0 días, 23 horas...

    21 de septiembre
    ↓
    comienza nuevamente la cuenta
    para el siguiente año.
*/

function getNextAnniversary() {

    const now =
        new Date();


    let year =
        now.getFullYear();


    let target =
        new Date(
            year,
            ANNIVERSARY_MONTH,
            ANNIVERSARY_DAY,
            0,
            0,
            0
        );


    /*
        Si ya pasó el 21 de septiembre
        de este año, apuntamos al próximo.
    */

    if (
        now >= target
    ) {

        target =
            new Date(
                year + 1,
                ANNIVERSARY_MONTH,
                ANNIVERSARY_DAY,
                0,
                0,
                0
            );

    }


    return target;

}


/* =====================================================
   ACTUALIZAR CONTADOR
===================================================== */

function updateCounter() {

    const now =
        new Date();


    const target =
        getNextAnniversary();


    const difference =
        target - now;


    /*
        Si llegó el momento.
    */

    if (
        difference <= 0
    ) {

        document.getElementById(
            "counter"
        ).textContent =
            "¡Llegó el día! 🌻";


        return;

    }


    /*
        Convertimos a segundos.
    */

    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    /*
        Días.
    */

    const days =
        Math.floor(
            totalSeconds /
            86400
        );


    /*
        Horas restantes.
    */

    const hours =
        Math.floor(
            (
                totalSeconds %
                86400
            ) / 3600
        );


    /*
        Minutos restantes.
    */

    const minutes =
        Math.floor(
            (
                totalSeconds %
                3600
            ) / 60
        );


    /*
        Segundos restantes.
    */

    const seconds =
        totalSeconds %
        60;


    /*
        Mostrar.
    */

    document.getElementById(
        "counter"
    ).textContent =

        `${days} días ` +

        `${hours} horas ` +

        `${minutes} minutos ` +

        `${seconds} segundos`;

}


/* =====================================================
   INICIAR EXPERIENCIA
===================================================== */

let started =
    false;


function startExperience() {

    /*
        Evitar doble clic.
    */

    if (
        started
    ) {

        return;

    }


    started =
        true;


    /* =================================================
       OCULTAR PANTALLA INICIAL
    ================================================= */

    startScreen.classList.add(
        "hide"
    );


    /* =================================================
       MOSTRAR TARJETA
    ================================================= */

    setTimeout(
        () => {

            card.classList.add(
                "show"
            );

        },

        300
    );


    /* =================================================
       CRECER TALLO
    ================================================= */

    setTimeout(
        () => {

            card.classList.add(
                "grow"
            );

        },

        1200
    );


    /* =================================================
       CREAR GIRASOLES
    ================================================= */

    setTimeout(
        () => {

            createFlowers();

        },

        2800
    );

}


/* =====================================================
   EVENTOS
===================================================== */

startScreen.addEventListener(
    "click",
    startExperience
);


startScreen.addEventListener(
    "touchstart",
    startExperience,
    {
        passive: true
    }
);


/* =====================================================
   INICIO
===================================================== */

createBackgroundHearts();


updateCounter();


setInterval(
    updateCounter,
    1000
);		
