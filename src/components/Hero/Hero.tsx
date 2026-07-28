import { useState } from "react";
import slidesData from "../../utils/mockHero.json";
import "./Hero.css";

interface Slide {
  id: string;
  image: string;
  headline: string;
  subtext: string;
}

const slides: Slide[] = slidesData;

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const goPrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="hero">
      <button className="hero-arrow hero-arrow-left" onClick={goPrev}>
        <img src="/images/arrow-left.svg" alt="Previous slide" />
      </button>

      <div className="hero-track"
          style={{transform: `translateX(-${current*100}%)`}}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="hero-slide"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
          <div className="hero-slide-content">
            <p className="hero-headline">{slide.headline}</p>
            <p className="hero-subtext">{slide.subtext}</p>
          </div>
        </div>
        ))}
      </div>  
      <button className="hero-arrow hero-arrow-right" onClick={goNext}>
        <img src="/images/arrow-right.svg" alt="Next slide" />
      </button>

      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`hero-dot ${index === current ? "hero-dot-active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;