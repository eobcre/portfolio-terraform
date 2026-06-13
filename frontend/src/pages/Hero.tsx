import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Hero = () => {
  const cards = [
    { id: 1, bg: "bg-[url('./assets/01.jpg')]", order: "01", title: "About", path: "/about" },
    { id: 2, bg: "bg-[url('./assets/02.jpg')]", order: "02", title: "Experience", path: "experience" },
    { id: 3, bg: "bg-[url('./assets/03.jpg')]", order: "03", title: "Work", path: "work" },
    { id: 4, bg: "bg-[url('./assets/04.jpg')]", order: "04", title: "Contact", path: "contact" },
  ];

  return (
    <div className="flex flex-col items-center gap-6 font-custom md:px-8 py-10 h-screen">
      <div className="flex flex-col gap-2">
        <p className="text-main text-4xl md:text-7xl lg:text-8xl xl:text-9xl uppercase">Emmy Manning</p>
        <div className="flex justify-end items-center gap-2">
          <p className="text-main text-xl xl:text-2xl">AI Cloud Engineer ー</p>
          <a href={import.meta.env.VITE_LINKEDIN} target="_blank" rel="noopener noreferrer">
            <Icon icon="foundation:social-linkedin" className="text-main cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7.5 h-7.5 md:w-10 md:h-10" />
          </a>
          <a href={import.meta.env.VITE_GITHUB} target="_blank" rel="noopener noreferrer">
            <Icon icon="proicons:github" className="text-main cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7.5 h-7.5 md:w-10 md:h-10" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
        {cards.map((card, index) => (
          <Link key={card.id} to={card.path}>
            <div key={index} className={`bg-cover bg-center shadow-2xl xl:rounded cursor-pointer hover:opacity-70 transition-all duration-300 ease-out h-full ${card.bg}`}>
              <div className="px-4">
                <p className="text-white text-9xl">{card.order}</p>
                <p className="border border-white"></p>
                <p className="text-white text-3xl pt-2">{card.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <footer className="text-main font-[Arial]">© {new Date().getFullYear()} Emmy Manning</footer>
    </div>
  );
};

export default Hero;
