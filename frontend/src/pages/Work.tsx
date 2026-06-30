import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../assets/bg-image-03.png";
import RagImage from "../assets/rag.png";
import MlImage from "../assets/ml.png";
import StudioImage from "../assets/studio.png";
import Video from "../assets/demo.mov";

const Work = () => {
  const work = [
    {
      id: 1,
      title: "AI-Powered LEGO Train Control System",
      number: "01",
      path: import.meta.env.VITE_LEGO_REPO,
      desc: `AI-powered application that controls a LEGO train using NLP. The system integrates Amazon Bedrock to interpret user input and trigger train actions via Bluetooth.`,
    },
    {
      id: 2,
      title: "RAG-Powered Knowledge System",
      number: "02",
      link: import.meta.env.VITE_RAG_URL,
      path: import.meta.env.VITE_RAG_REPO,
      desc: `A Retrieval-Augmented Generation (RAG) web application built with Amazon Bedrock Knowledge Bases that performs semantic retrieval and generates grounded responses using an LLM.`,
      image: RagImage,
    },
    {
      id: 3,
      title: "House Price Prediction App",
      number: "03",
      link: import.meta.env.VITE_ML_URL,
      path: import.meta.env.VITE_ML_REPO,
      desc: `A house price prediction web application that provides real-time house price predictions based on user inputs, using a ML model deployed on AWS serverless infrastructure.`,
      image: MlImage,
    },
    {
      id: 4,
      title: "AI Caption Studio",
      number: "04",
      link: import.meta.env.VITE_STUDIO_URL,
      path: import.meta.env.VITE_STUDIO_REPO,
      desc: `AI Caption Studio is a web application that allows users to upload images and automatically generate AI-powered captions and hashtags.`,
      image: StudioImage,
    },
  ];

  return (
    <div className="md:flex md:flex-col xl:grid xl:grid-cols-4 text-main font-custom min-h-screen xl:h-screen">
      {/* left */}
      <div className="flex flex-col gap-4 col-span-2 px-4 py-6">
        {/* back button */}
        <Link to="/" className="self-start">
          <Icon icon="ic:baseline-arrow-back-ios-new" className="cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7.5 h-7.5" />
        </Link>
        {/* page title */}
        <div className="relative flex flex-col justify-center items-center flex-1 gap-6 py-20 xl:py-0">
          <img src={Image} alt="Image" className="absolute opacity-10 w-60 xl:w-150" />
          <p className="text-6xl md:text-8xl font-semibold">Work</p>
          <p className="px-4">Cloud-native and AI-powered projects built on AWS.</p>
        </div>
      </div>
      {/* right */}
      <div className="flex flex-col gap-16 col-span-2 xl:overflow-y-auto px-8 py-10 md:px-30 md:py-30">
        {work.map((item, index) => (
          <div key={item.id} className="relative flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
              {/* title */}
              <p className="relative z-10 text-lg font-semibold">{item.title}</p>
              {/* bg number */}
              <div
                className="absolute z-0 text-[17rem] top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-gray-100 pointer-events-none
                            md:top-auto md:left-auto md:translate-x-0 md:translate-y-0 md:text-9xl md:mt-0"
              >
                {item.number}
              </div>
              {/* git link */}
              <div className="flex items-center gap-3">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <Icon icon="akar-icons:link-out" className="relative z-10 cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7 h-7" />
                </a>
                <a href={item.path} target="_blank" rel="noopener noreferrer">
                  <Icon icon="proicons:github" className="relative z-10 cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-8 h-8" />
                </a>
              </div>
            </div>
            {/* desc */}
            <div className="relative z-10 py-10">
              <p className="leading-loose">{item.desc}</p>
            </div>
            {/* portfolio image */}
            {index !== 0 && (
              <div className="pb-10">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="cursor-default">
                  <img src={item.image} alt="Image" className="cursor-pointer w-full" />
                </a>
              </div>
            )}
            {/* video */}
            {index === 0 && (
              <div className="pb-10 w-full">
                <video src={Video} controls preload="metadata" />
              </div>
            )}
            {/* underline */}
            <span className="bg-gray-200 w-full h-px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
