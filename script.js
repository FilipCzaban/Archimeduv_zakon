/**
 * ARCHIMÉDŮV ZÁKON - INTERAKTIVNÍ LOGIKA WEBU
 * 
 * Tento skript obsluhuje:
 * 1. Responzivní mobilní navigaci
 * 2. Zvýrazňování částí fyzikálního vzorce
 * 3. Interaktivní kalkulačku vztlakové síly
 * 4. Fyzikální simulátor (akvárium) s pohybem tělesa a silovými šipkami
 * 5. Vzdělávací kvíz s vyhodnocením
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. NAVIGACE & MENU
       ========================================================================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');

    // Mobilní menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    // Zavření menu po kliknutí na odkaz a hladký posun
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
            
            // Aktivní třída na odkazech
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Změna aktivního menu podle scrollování na stránce
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       2. INTERAKTIVNÍ VZOREC
       ========================================================================== */
    const formulaVariables = document.querySelectorAll('.formula-display span[data-var]');
    const explanationItems = document.querySelectorAll('.explanation-item');

    formulaVariables.forEach(variable => {
        variable.addEventListener('mouseenter', () => {
            const varName = variable.getAttribute('data-var');
            
            // Reset
            explanationItems.forEach(item => item.classList.remove('active-var', 'active-main-var'));
            
            // Aktivace odpovídající vysvětlující karty
            const targetCard = document.getElementById(`exp-${varName}`);
            if (targetCard) {
                if (varName === 'fvz') {
                    targetCard.classList.add('active-main-var');
                } else {
                    targetCard.classList.add('active-var');
                }
            }
        });

        variable.addEventListener('mouseleave', () => {
            explanationItems.forEach(item => item.classList.remove('active-var', 'active-main-var'));
        });
    });


    /* ==========================================================================
       3. RYCHLÁ KALKULAČKA VZTLAKU
       ========================================================================== */
    const calcRhoInput = document.getElementById('calc-rho');
    const calcVInput = document.getElementById('calc-v');
    const calcGInput = document.getElementById('calc-g');
    
    const valCalcRho = document.getElementById('val-calc-rho');
    const valCalcV = document.getElementById('val-calc-v');
    const valCalcVLiters = document.getElementById('val-calc-v-liters');
    
    const calcResultFvz = document.getElementById('calc-result-fvz');
    const mathRho = document.getElementById('math-rho');
    const mathV = document.getElementById('math-v');
    const mathG = document.getElementById('math-g');
    const calcResultText = document.getElementById('result-text');

    function calculateBuoyancy() {
        const rho = parseFloat(calcRhoInput.value);
        const v = parseFloat(calcVInput.value);
        const g = parseFloat(calcGInput.value);

        // Výpočet Fvz = rho * V * g
        const fvz = rho * v * g;

        // Aktualizace textů
        valCalcRho.textContent = rho;
        valCalcV.textContent = v.toFixed(3);
        valCalcVLiters.textContent = Math.round(v * 1000); // 1 m³ = 1000 litrů

        // Zobrazení ve vzorci
        mathRho.textContent = rho;
        mathV.textContent = v.toFixed(3);
        mathG.textContent = g;

        // Formátovaný výsledek
        calcResultFvz.textContent = fvz.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

        // Ekvivalent hmotnosti k nadlehčení (m = Fvz / g)
        const massEquivalent = fvz / g;
        calcResultText.innerHTML = `Tato vztlaková síla by dokázala ve zvolené kapalině nadlehčit těleso o hmotnosti až <strong>${Math.round(massEquivalent).toLocaleString('cs-CZ')} kg</strong>.`;
    }

    // Event listenery pro kalkulačku
    calcRhoInput.addEventListener('input', calculateBuoyancy);
    calcVInput.addEventListener('input', calculateBuoyancy);
    calcGInput.addEventListener('change', calculateBuoyancy);

    // Presety pro kalkulačku
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktivní třída
            document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Nastavení hodnoty
            calcRhoInput.value = btn.getAttribute('data-val');
            calculateBuoyancy();
        });
    });

    // Prvotní výpočet
    calculateBuoyancy();


    /* ==========================================================================
       4. INTERAKTIVNÍ SIMULÁTOR (AKVÁRIUM)
       ========================================================================== */
    // DOM prvky simulace
    const simRhoLiqInput = document.getElementById('sim-rho-liq');
    const simRhoObjInput = document.getElementById('sim-rho-obj');
    const simVolObjInput = document.getElementById('sim-vol-obj');

    const valSimRhoLiq = document.getElementById('val-sim-rho-liq');
    const valSimRhoObj = document.getElementById('val-sim-rho-obj');
    const valSimVolObj = document.getElementById('val-sim-vol-obj');

    const simFgVal = document.getElementById('sim-fg-val');
    const simFvzVal = document.getElementById('sim-fvz-val');
    const simFresVal = document.getElementById('sim-fres-val');

    const aquariumStatus = document.getElementById('aquarium-status');
    const aquariumSubmerged = document.getElementById('aquarium-submerged');
    const aquariumTank = document.getElementById('aquarium-tank');
    const floatingObject = document.getElementById('floating-object');
    const objectLabel = document.getElementById('object-label');
    const objectMass = document.getElementById('object-mass');

    const arrowGravity = document.getElementById('arrow-gravity');
    const arrowBuoyant = document.getElementById('arrow-buoyant');
    const analysisText = document.getElementById('analysis-text');

    const gConst = 9.81; // Použijeme standardní zrychlení pro simulaci

    function updateSimulation() {
        const rhoLiq = parseFloat(simRhoLiqInput.value);
        const rhoObj = parseFloat(simRhoObjInput.value);
        const volObjLiters = parseFloat(simVolObjInput.value); // v dm³ (litrech)
        
        // Převod na SI jednotky
        const volObjM3 = volObjLiters / 1000; // 1 dm³ = 0.001 m³
        
        // Fyzikální výpočty
        const mass = volObjM3 * rhoObj; // m = V * rho
        const fg = mass * gConst;       // Fg = m * g
        
        let fvz = 0;
        let resForce = 0;
        let submergedFraction = 0;
        let state = "";
        let analysisHTML = "";

        // Určení stavu tělesa
        if (rhoObj < rhoLiq) {
            // 1. Těleso PLAVE na hladině (částečně vynořené)
            state = "plave";
            submergedFraction = rhoObj / rhoLiq;
            fvz = fg; // Vztlaková síla přesně vyrovná gravitační sílu
            resForce = 0;
            
            aquariumStatus.textContent = "Těleso plave";
            aquariumStatus.style.borderColor = "var(--color-accent)";
            aquariumStatus.style.color = "var(--color-accent)";
            aquariumStatus.style.background = "rgba(100, 255, 218, 0.1)";
            
            analysisHTML = `Hustota tělesa (<strong>${rhoObj} kg/m³</strong>) je <strong>menší</strong> než hustota kapaliny (<strong>${rhoLiq} kg/m³</strong>). Vztlaková síla se v rovnovážném stavu přesně vyrovná s gravitační silou (obě jsou <strong>${fg.toFixed(1)} N</strong>). Těleso plave a je ponořeno přesně z <strong>${Math.round(submergedFraction * 100)} %</strong> svého objemu.`;
        } 
        else if (Math.abs(rhoObj - rhoLiq) < 0.01) {
            // 2. Těleso se VZNÁŠÍ v kapalině (rovnováha kdekoli)
            state = "vznasi-se";
            submergedFraction = 1.0;
            fvz = fg;
            resForce = 0;
            
            aquariumStatus.textContent = "Těleso se vznáší";
            aquariumStatus.style.borderColor = "var(--color-primary)";
            aquariumStatus.style.color = "var(--color-primary)";
            aquariumStatus.style.background = "rgba(0, 240, 255, 0.1)";

            analysisHTML = `Hustota tělesa se <strong>rovná</strong> hustotě kapaliny (<strong>${rhoObj} kg/m³</strong>). Síly gravitační a vztlaková jsou v dokonalé rovnováze. Těleso se vznáší uvnitř kapaliny v libovolné hloubce a je ponořeno z <strong>100 %</strong>.`;
        } 
        else {
            // 3. Těleso KLESÁ ke dnu
            state = "potapi-se";
            submergedFraction = 1.0;
            // Vztlaková síla při plném ponoření
            fvz = volObjM3 * rhoLiq * gConst;
            resForce = fg - fvz; // Výsledná síla směřující dolů
            
            aquariumStatus.textContent = "Těleso klesá ke dnu";
            aquariumStatus.style.borderColor = "var(--color-gravity)";
            aquariumStatus.style.color = "var(--color-gravity)";
            aquariumStatus.style.background = "rgba(255, 77, 109, 0.1)";

            analysisHTML = `Hustota tělesa (<strong>${rhoObj} kg/m³</strong>) je <strong>větší</strong> než hustota kapaliny (<strong>${rhoLiq} kg/m³</strong>). Gravitační síla (<strong>${fg.toFixed(1)} N</strong>) překonává maximální vztlakovou sílu (<strong>${fvz.toFixed(1)} N</strong>). Výsledná síla o velikosti <strong>${resForce.toFixed(1)} N</strong> táhne těleso dolů ke dnu.`;
        }

        // Vizuální aktualizace textových hodnot
        valSimRhoLiq.textContent = rhoLiq;
        valSimRhoObj.textContent = rhoObj;
        valSimVolObj.textContent = volObjLiters;

        simFgVal.textContent = fg.toFixed(1);
        simFvzVal.textContent = fvz.toFixed(1);
        simFresVal.textContent = resForce.toFixed(1);
        
        aquariumSubmerged.textContent = `Ponořeno: ${Math.round(submergedFraction * 100)} %`;
        analysisText.innerHTML = analysisHTML;
        
        objectMass.textContent = `${mass.toFixed(1)} kg`;

        // Změna textury / vzhledu kostky na základě hustoty (materiálu)
        floatingObject.className = "floating-object"; // reset
        if (rhoObj <= 300) {
            objectLabel.textContent = "Korek";
            floatingObject.style.background = "linear-gradient(135deg, #e3c099 0%, #b89168 100%)";
            floatingObject.style.borderColor = "#805c3c";
        } else if (rhoObj <= 850) {
            objectLabel.textContent = "Dřevo";
            floatingObject.style.background = "linear-gradient(135deg, #d4a373 0%, #a3704c 100%)";
            floatingObject.style.borderColor = "#5c3d24";
        } else if (rhoObj <= 950) {
            objectLabel.textContent = "Led";
            floatingObject.style.background = "linear-gradient(135deg, rgba(200, 240, 255, 0.8) 0%, rgba(150, 220, 255, 0.9) 100%)";
            floatingObject.style.borderColor = "#a5e2f5";
        } else if (rhoObj > rhoLiq) {
            objectLabel.textContent = "Kámen / Kov";
            floatingObject.classList.add("sinking");
            floatingObject.style.background = "linear-gradient(135deg, #78716c 0%, #44403c 100%)";
            floatingObject.style.borderColor = "#1c1917";
        } else {
            objectLabel.textContent = "Plast";
            floatingObject.style.background = "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)";
            floatingObject.style.borderColor = "#0369a1";
        }

        // Dynamická vizuální velikost kostky na základě objemu (od 10 do 300 dm³)
        // Rozsah velikosti kostky je 60px až 140px
        const minSize = 60;
        const maxSize = 140;
        const size = minSize + ((volObjLiters - 10) / (300 - 10)) * (maxSize - minSize);
        
        floatingObject.style.width = `${size}px`;
        floatingObject.style.height = `${size}px`;
        floatingObject.style.left = `calc(50% - ${size / 2}px)`;

        // Hladina vody je pevně na 70 % výšky akvária.
        // Celková výška akvária v pixelech:
        const tankHeight = aquariumTank.clientHeight;
        const waterHeight = tankHeight * 0.7; // 70 % výšky

        // Výpočet pozice "bottom" kostky v pixelech
        let bottomPos = 15; // Výchozí: na dně (nad pískem 15px)

        if (state === "plave") {
            // Spodní hrana kostky je: výška vody - ponořená část kostky
            const submergedHeight = size * submergedFraction;
            bottomPos = waterHeight - submergedHeight;
        } 
        else if (state === "vznasi-se") {
            // Vznáší se uprostřed vodního sloupce
            bottomPos = (waterHeight / 2) - (size / 2);
        } 
        else if (state === "potapi-se") {
            // Leží na dně
            bottomPos = 15; // Nad pískem
        }

        floatingObject.style.bottom = `${bottomPos}px`;

        // ----------------------------------------------------
        // LOGIKA SILOVÝCH ŠIPEK
        // ----------------------------------------------------
        // Šipky jsou nyní umístěny po stranách kostky.
        // Měřítko je nastaveno tak, aby se šipky vešly do akvária i při krajních hodnotách.
        const gravityArrowHeight = Math.min(110, 35 + (fg / 3000) * 75);
        arrowGravity.style.height = `${gravityArrowHeight}px`;
        const lineGrav = arrowGravity.querySelector('.arrow-line');
        if (lineGrav) {
            lineGrav.style.height = `${gravityArrowHeight - 25}px`; // Výška čáry (odečtení špičky a popisku)
        }

        const buoyantArrowHeight = fvz > 0 ? Math.min(110, 35 + (fvz / 3000) * 75) : 0;
        arrowBuoyant.style.height = `${buoyantArrowHeight}px`;
        const lineBuoy = arrowBuoyant.querySelector('.arrow-line');
        if (lineBuoy) {
            lineBuoy.style.height = `${buoyantArrowHeight - 25}px`;
        }
        arrowBuoyant.style.display = buoyantArrowHeight > 0 ? 'flex' : 'none';

        // Vizuální kompenzace posunutí šipek, aby vycházely z centra tělesa
        // Šipky jsou absolutně pozicovány vůči .arrow-container
        // Fg směřuje dolů, takže její top = 0 a roste dolů
        // Fvz směřuje nahoru, takže její bottom = 0 a roste nahoru
    }

    // Event listenery pro ovládací prvky simulátoru
    simRhoLiqInput.addEventListener('input', updateSimulation);
    simRhoObjInput.addEventListener('input', updateSimulation);
    simVolObjInput.addEventListener('input', updateSimulation);

    // Presety kapaliny v simulátoru
    document.querySelectorAll('.chip-preset').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip-preset').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            simRhoLiqInput.value = chip.getAttribute('data-val');
            updateSimulation();
        });
    });

    // Presety materiálů tělesa v simulátoru
    document.querySelectorAll('.chip-preset-obj').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip-preset-obj').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            simRhoObjInput.value = chip.getAttribute('data-val');
            updateSimulation();
        });
    });

    // Sledování velikosti kontejneru pro případ resize okna
    window.addEventListener('resize', updateSimulation);

    // Prvotní inicializace simulace
    updateSimulation();


    /* ==========================================================================
       5. INTERAKTIVNÍ MINI KVÍZ
       ========================================================================== */
    const quizQuestions = [
        {
            question: "Který z následujících faktorů NEOPLIVŇUJE velikost vztlakové síly působící na těleso?",
            options: [
                "Objem ponořené části tělesa",
                "Hustota kapaliny",
                "Hustota samotného tělesa",
                "Tíhové zrychlení planety"
            ],
            correctIndex: 2,
            explanation: "Vztlaková síla závisí pouze na hustotě kapaliny, ponořeném objemu tělesa a gravitačním zrychlení (vzorec Fvz = rho * V * g). Hustota samotného tělesa určuje jeho tíhovou sílu (hmotnost), ale nikoli samotný vztlak."
        },
        {
            question: "Ledová kra plave na mořské hladině. Které tvrzení o silách je správné?",
            options: [
                "Vztlaková síla je větší než gravitační síla kře.",
                "Gravitační síla kře je větší než vztlaková síla.",
                "Obě síly (vztlaková i gravitační) jsou v rovnováze a mají stejnou velikost.",
                "Vztlaková síla na kru nepůsobí, protože je z ledu."
            ],
            correctIndex: 2,
            explanation: "Když těleso na hladině plave (je v klidu, nestoupá ani neklesá), síly působící na těleso jsou v rovnováze. Výslednice sil je nulová, což znamená, že vztlaková síla přesně vyrovnává tíhu kře."
        },
        {
            question: "Proč obří ocelová zaoceánská loď plave na hladině vody, zatímco malý ocelový hřebík se ihned potopí?",
            options: [
                "Ocel na lodi je speciálně chemicky upravená, aby byla lehčí.",
                "Loď obsahuje obrovské množství vzduchu, takže její celková průměrná hustota je menší než hustota vody.",
                "Na loď působí magnetické pole Země, které ji nadnáší.",
                "Větší předměty mají přirozeně větší schopnost plavat bez ohledu na hustotu."
            ],
            correctIndex: 1,
            explanation: "Trup lodi sice tvoří těžká ocel, ale její vnitřek je vyplněn vzduchem. Z fyzikálního hlediska musíme posuzovat loď jako celek. Její celková průměrná hustota (hmotnost lodi dělená jejím celkovým objemem) je mnohem menší než hustota vody."
        },
        {
            question: "Ponoříte stejnou kostku nejprve do čisté sladké vody (hustota 1000 kg/m³) a poté do olivového oleje (hustota 920 kg/m³). Ve které kapalině na ni bude působit větší vztlaková síla?",
            options: [
                "V obou kapalinách bude vztlaková síla naprosto shodná.",
                "V olivovém oleji, protože olej je mastný.",
                "Ve sladké čisté vodě.",
                "Vztlaková síla bude nulová v obou případech."
            ],
            correctIndex: 2,
            explanation: "Vztlaková síla je přímo úměrná hustotě kapaliny. Vzhledem k tomu, že voda má vyšší hustotu (1000 kg/m³) než olivový olej (920 kg/m³), vytlačená voda o stejném objemu bude mít větší hmotnost a vyvine větší vztlakovou sílu."
        },
        {
            question: "Co by se stalo s dřevěnou kostkou plovoucí na vodě, kdybychom celý experiment přenesli na Měsíc, kde je gravitace 6krát slabší?",
            options: [
                "Kostka by se okamžitě potopila na dno.",
                "Kostka by plavala na hladině, ale byla by ponořená do stejné hloubky jako na Zemi.",
                "Kostka by byla z vody vytlačena výše a plavala by téměř celá nad hladinou.",
                "Kostka by se vznášela ve vzduchu nad nádobou."
            ],
            correctIndex: 1,
            explanation: "Na Měsíci se gravitační zrychlení (g) sníží 6krát. To znamená, že gravitační síla kostky bude 6krát menší. Zároveň však bude 6krát menší i vztlaková síla kapaliny (Fvz = rho * V * g). Poměr těchto sil se nezmění, takže kostka bude plavat ponořená ze stejné části jako na Zemi."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let isQuestionAnswered = false;

    // Prvky kvízu
    const quizProgress = document.getElementById('quiz-progress');
    const quizStepsCounter = document.getElementById('quiz-steps-counter');
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    
    const quizExplanationBox = document.getElementById('quiz-explanation-box');
    const quizFeedbackStatus = document.getElementById('quiz-feedback-status');
    const quizExplanationText = document.getElementById('quiz-explanation-text');
    const quizNextBtn = document.getElementById('quiz-next-btn');

    const quizResultsScreen = document.getElementById('quiz-results');
    const quizBody = document.getElementById('quiz-body');
    const quizFooter = document.getElementById('quiz-footer');
    const quizFinalScore = document.getElementById('quiz-final-score');
    const quizFinalMessage = document.getElementById('quiz-final-message');
    const quizRestartBtn = document.getElementById('quiz-restart-btn');

    function loadQuestion() {
        isQuestionAnswered = false;
        
        // Skrytí vysvětlení a tlačítka Další
        quizExplanationBox.classList.add('hidden');
        quizNextBtn.classList.add('hidden');
        
        // Získání aktuální otázky
        const currentQ = quizQuestions[currentQuestionIndex];
        
        // Aktualizace záhlaví a progress baru
        const progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
        quizProgress.style.width = `${progressPercent}%`;
        quizStepsCounter.textContent = `Otázka ${currentQuestionIndex + 1} z ${quizQuestions.length}`;
        
        // Text otázky
        quizQuestionText.textContent = currentQ.question;
        
        // Vymazání předchozích možností
        quizOptionsContainer.innerHTML = '';
        
        // Vykreslení nových možností
        currentQ.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.dataset.index = index;
            
            button.addEventListener('click', () => handleOptionClick(index, button));
            quizOptionsContainer.appendChild(button);
        });
    }

    function handleOptionClick(selectedIndex, clickedButton) {
        if (isQuestionAnswered) return; // Zamezení opakovanému klikání
        
        isQuestionAnswered = true;
        const currentQ = quizQuestions[currentQuestionIndex];
        const correctIndex = currentQ.correctIndex;
        
        // Všechny možnosti pro případný styling
        const buttons = quizOptionsContainer.querySelectorAll('.option-btn');
        
        if (selectedIndex === correctIndex) {
            // Správná odpověď
            clickedButton.classList.add('correct');
            score++;
            
            quizFeedbackStatus.textContent = "Správná odpověď! 🎉";
            quizExplanationBox.className = "quiz-explanation-box correct-box";
        } else {
            // Špatná odpověď
            clickedButton.classList.add('wrong');
            // Zvýraznění správné odpovědi
            buttons[correctIndex].classList.add('correct');
            
            quizFeedbackStatus.textContent = "Nesprávná odpověď. ❌";
            quizExplanationBox.className = "quiz-explanation-box wrong-box";
        }
        
        // Zablokování ostatních tlačítek hover stylů
        buttons.forEach(btn => btn.style.cursor = 'default');
        
        // Zobrazení vysvětlení
        quizExplanationText.textContent = currentQ.explanation;
        quizExplanationBox.classList.remove('hidden');
        
        // Zobrazení tlačítka Další / Vyhodnotit
        quizNextBtn.classList.remove('hidden');
        if (currentQuestionIndex === quizQuestions.length - 1) {
            quizNextBtn.textContent = "Zobrazit výsledky";
        } else {
            quizNextBtn.textContent = "Další otázka";
        }
    }

    // Tlačítko "Další"
    quizNextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            // Konec kvízu - zobrazení výsledků
            showResults();
        }
    });

    function showResults() {
        quizBody.classList.add('hidden');
        quizFooter.classList.add('hidden');
        quizResultsScreen.classList.remove('hidden');
        
        // Nastavení progress baru na 100%
        quizProgress.style.width = '100%';
        quizStepsCounter.textContent = 'Kvíz dokončen!';
        
        quizFinalScore.textContent = `${score}/${quizQuestions.length}`;
        
        let message = "";
        if (score === quizQuestions.length) {
            message = "Naprosto fantastické! Jste mistr hydrostatiky. Archimédes by na vás byl pyšný a určitě by s vámi zvolal HEURÉKA!";
        } else if (score >= 3) {
            message = "Skvělá práce! Archimédovu zákonu rozumíte velmi dobře. Drobné detaily můžete doladit opětovným vyzkoušením simulátoru.";
        } else {
            message = "Dobrý pokus, ale některé principy vám ještě unikají. Doporučujeme si znovu pročíst vysvětlení vzorce, pohrát si se simulátorem a zkusit kvíz znovu.";
        }
        
        quizFinalMessage.textContent = message;
    }

    // Restartování kvízu
    quizRestartBtn.addEventListener('click', () => {
        score = 0;
        currentQuestionIndex = 0;
        quizBody.classList.remove('hidden');
        quizFooter.classList.remove('hidden');
        quizResultsScreen.classList.add('hidden');
        quizNextBtn.textContent = "Další otázka";
        loadQuestion();
    });

    // Spuštění první otázky kvízu
    loadQuestion();
});
