import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../assets/bg-image-01.png";

const About = () => {
  return (
    <div className="md:flex md:flex-col xl:grid xl:grid-cols-4 text-main font-custom min-h-screen xl:h-screen">
      {/* left */}
      <div className="flex flex-col gap-4 col-span-2 px-4 py-6">
        {/* back button */}
        <Link to="/" className="self-start">
          <Icon icon="ic:baseline-arrow-back-ios-new" className="cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7.5 h-7.5" />
        </Link>
        {/* page title */}
        <div className="relative flex flex-col flex-1 justify-center items-center gap-6 font-semibold py-20 xl:py-0">
          <img src={Image} alt="Image" className="absolute opacity-10 w-80 xl:w-180" />
          <p className="text-6xl md:text-8xl">Hello!</p>
          <p className="text-6xl md:text-8xl">I'm Emmy.</p>
        </div>
      </div>
      {/* right */}
      <div className="relative flex flex-col justify-center items-center col-span-2 xl:overflow-y-auto px-8 py-18 md:px-30 md:py-30">
        <p className="leading-loose">
          I am an AI Cloud Engineer with a strong Full-Stack development background, focused on designing scalable AI-driven systems on AWS. My work centers around Retrieval-Augmented Generation (RAG)
          architectures using Amazon Bedrock, integrating LLM workflows with custom backend services and modern React frontends. With hands-on experience deploying production web applications on AWS ,
          I prioritize clean architecture, async API design, and cost-efficient cloud infrastructure. I am particularly interested in large-scale AI system design, LLM integration pipelines, and building reliable
          AI-powered cloud services.
        </p>
      </div>
    </div>
  );
};

export default About;
