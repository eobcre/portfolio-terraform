import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Image from "../assets/bg-image-02.png";

const Experience = () => {
  const experience = [
    {
      id: 1,
      date: "Dec 2023 ー May 2025",
      title: "Software Engineer",
      desc: `Designed, architected, and operated production-grade financial systems on AWS, supporting scalable and secure cloud-native workloads. 
             Developed a configurable Form Builder platform with role-based access control, workflow automation, and event-driven notifications.`,
      certification: ["- AWS Certified Machine Learning Engineer Associate", "- AWS Certified Solutions Architect Associate", "- AWS Certified Developer Associate", "- AWS Certified AI Foundations", "- AWS Certified Cloud Practitioner "],
    },
    {
      id: 2,
      date: "Oct 2022 ー Dec 2023",
      title: "Software Engineer Internship - Team Lead",
      desc: `Led development of a cloud-deployed beauty services platform on AWS, delivering a scalable full stack application. 
             Collaborated cross-functionally to ensure cohesive architecture, system reliability, and optimized user experience.`,
    },
  ];

  return (
    <div className="md:flex md:flex-col xl:grid xl:grid-cols-4 text-main font-custom min-h-screen xl:h-screen">
      {/* left */}
      <div className="flex flex-col gap-14 col-span-2 px-4 py-6">
        {/* back button */}
        <div>
          <Link to="/" className="self-start">
            <Icon icon="ic:baseline-arrow-back-ios-new" className="cursor-pointer hover:opacity-60 transition-all duration-300 ease-out w-7.5 h-7.5" />
          </Link>
        </div>
        {/* page title */}
        <div className="relative flex flex-col justify-center items-center flex-1 gap-6 py-20 xl:py-0">
          <img src={Image} alt="Image" className="absolute opacity-10 w-100 xl:w-140" />
          <p className="text-6xl md:text-8xl font-semibold">Experience</p>
          <p className="px-4 w-full lg:w-150">2+ years of experience delivering web applications on AWS, expanding into AI and generative cloud systems.</p>
        </div>
      </div>
      {/* right */}
      <div className="flex flex-col gap-16 col-span-2 xl:overflow-y-auto px-8 py-10 md:px-30 md:py-30">
        {experience.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-4">
            <p className="text-sm">{item.date}</p>
            <p className="text-lg font-semibold">{item.title}</p>
            <p className="leading-loose">{item.desc}</p>
            {index === 0 && (
              <div className="leading-relaxed">
                <p className="font-semibold">Certifications :</p>
                <ul>
                  {item.certification?.map((cert) => (
                    <li key={cert}>{cert}</li>
                  ))}
                </ul>
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

export default Experience;
