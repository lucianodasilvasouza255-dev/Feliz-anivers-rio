
const wordHeart = document.getElementById("wordHeart");
const heartButton = document.getElementById("heartButton");
const container = document.querySelector(".container");
const subtitle = document.getElementById("subtitle");
const message = document.getElementById("message");

const loveWords = [
    "EU TE AMO",
    "I LOVE YOU",
    "愛してる",
    "TE AMO",
    "JE T'AIME",
    "TI AMO",
    "ICH LIEBE DICH",
    "사랑해",
    "Я ТЕБЯ ЛЮБЛЮ",
    "我爱你",
    "IK HOU VAN JOU",
    "ILY",
    "好きだよ",
    "LOVE YOU"
];

function createHeart() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = wordHeart.ownerSVGElement;
    const heartPath = svg.querySelector("#heartClip path");

    wordHeart.replaceChildren();

    if (!heartPath) {
        console.error("Contorno do coração não encontrado.");
        return;
    }

    const fontSize = 13;
    const gap = 5;
    const rowHeight = 18;
    let wordIndex = 0;

    // Verifica se um ponto está dentro do coração.
    function isInsideHeart(x, y) {
        const point = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        return heartPath.isPointInFill(point);
    }

    // Descobre todos os segmentos preenchidos de cada linha.
    function getSegments(y) {
        const segments = [];
        let start = null;

        for (let x = 0; x <= 300; x++) {
            const inside = isInsideHeart(x, y);

            if (inside && start === null) {
                start = x;
            }

            if ((!inside || x === 300) && start !== null) {
                const end = inside && x === 300 ? x : x - 1;

                if (end - start >= 20) {
                    segments.push({
                        left: start + 3,
                        right: end - 3
                    });
                }

                start = null;
            }
        }

        return segments;
    }

    // Mede uma palavra usando a fonte real do SVG.
    function createWord(word, y) {
        const text = document.createElementNS(svgNS, "text");

        text.setAttribute("class", "word");
        text.setAttribute("font-size", fontSize);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("y", y);
        text.textContent = word;

        wordHeart.appendChild(text);

        return {
            element: text,
            width: text.getComputedTextLength()
        };
    }

    // Preenche cada faixa horizontal sem ultrapassar suas bordas.
    function fillSegment(segment, y) {
        const available = segment.right - segment.left;
        const placed = [];
        let used = 0;
        let checked = 0;

        while (checked < loveWords.length) {
            const word = loveWords[wordIndex % loveWords.length];
            const candidate = createWord(word, y);

            const needed = candidate.width +
                (placed.length ? gap : 0);

            if (used + needed <= available) {
                placed.push(candidate);
                used += needed;
                wordIndex++;
                checked = 0;
            } else {
                candidate.element.remove();
                wordIndex++;
                checked++;
            }

            if (used >= available * 0.94) break;
        }

        if (placed.length === 0) return;

        used -= gap;

        let x = (segment.left + segment.right - used) / 2;

        for (const word of placed) {
            word.element.setAttribute(
                "x",
                x + word.width / 2
            );

            x += word.width + gap;
        }
    }

    // Começa perto do topo e acompanha o formato até a ponta.
    for (let y = 24; y <= 258; y += rowHeight) {
        const segments = getSegments(y);

        for (const segment of segments) {
            fillSegment(segment, y);
        }
    }
}

// Revela a mensagem de aniversário.
function openLoveLetter() {
    if (container.classList.contains("opened")) {
        return;
    }

    container.classList.add("opened");
    subtitle.textContent = "Uma mensagem do meu coração";
    message.setAttribute("aria-hidden", "false");
    heartButton.setAttribute("aria-label", "Surpresa revelada");
}

createHeart();

heartButton.addEventListener("click", openLoveLetter);
