const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const slideClass = isDark ? ".slide-dark" : ".slide-light";

const sections = [
    {
        id: "slider-gallery",
        type: "slides",
        slides: null,
        currentSlide: 0,
    },
    {
        id: "slider-text",
        type: "static",
        slides: null,
        currentSlide: 0,
        duration: 2000
    },
    {
        id: "slider-sponsor",
        type: "slides",
        slides: null,
        currentSlide: 0,
    }
];

sections.forEach(section => {
    const element = document.getElementById(section.id);
    if (section.type === "slides") {
        const allSlides = element.querySelectorAll(slideClass);
        section.slides = [...allSlides].filter(img =>
            getComputedStyle(img).display !== "none"
        );
    }
    section.element = element;
});

let currentSectionIndex = 0;
const slideInterval = 3000;

sections.forEach((section, index) => {
    if (index !== 0) {
        section.element.classList.add("hidden");
    }
})

function nextSlide() {
    const section = sections[currentSectionIndex];
    if (section.type === "slides" && section.slides && section.slides.length > 0) {
        section.slides[section.currentSlide].classList.remove("opacity-100");
        section.slides[section.currentSlide].classList.add("opacity-0");
        section.currentSlide++;
        if (section.currentSlide >= section.slides.length) {
            section.currentSlide = 0;
            moveNextSection();
        } else {
            section.slides[section.currentSlide].classList.remove("opacity-0");
            section.slides[section.currentSlide].classList.add("opacity-100");
        }
    } else {
        moveNextSection();
    }
}


function moveNextSection() {
    sections[currentSectionIndex].element.classList.add("hidden");
    const currentSection = sections[currentSectionIndex];
    if (currentSection.type === "slides" && currentSection.slides.length > 0) {
        currentSection.slides[0].classList.add("opacity-100");
        currentSection.slides[0].classList.remove("opacity-0");
    }

    currentSectionIndex =
        (currentSectionIndex + 1) % sections.length;

    sections[currentSectionIndex].element.classList.remove("hidden");

    if (sections[currentSectionIndex].type === "static") {
        setTimeout(moveNextSection, sections[currentSectionIndex].duration);
    }
}

setInterval(nextSlide, slideInterval);