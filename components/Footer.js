import CopyChars from "./CopyChars";
import InteractiveDotGrid from "./InteractiveDotGrid";
import { RunawayText } from "./RunAwayText";
import { Instagram, Facebook, Linkedin, Circle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const socialPlatforms = [
    {
      name: "Awwwards",
      icon: "W.",
      href: "https://awwwards.com",
      customIcon: true,
    },
    {
      name: "Clutch",
      icon: "C",
      href: "https://clutch.co",
      customIcon: true,
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com",
    },
    {
      name: "Dribbble",
      icon: Circle,
      href: "https://dribbble.com",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com",
    },
  ];

  return (
    <div className="overflow-hidden md:ml-[5rem]">
      <InteractiveDotGrid className=" overflow-visible items-center  items-center justify-center">
        <CopyChars delay={0.5}>
          <RunawayText>
            <h1 className="text-[3.2rem]   lg:text-[10rem] pl-4 md:px-[16rem] items-center justify-center ">
              Let&rsquo;s Connect
            </h1>
          </RunawayText>
        </CopyChars>
      </InteractiveDotGrid>

      <footer className=" py-12 px-6">
        <div className="">
          {/* Header Section */}
          <div className="flex items-center justify-end mb-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white  overflow-hidden">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Team member 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Team member 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Team member 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-700 text-sm">
                  {"We're always up for a coffee and a chat,"}
                </p>
                <p className="text-sm">
                  <Link
                    href="/contact"
                    className="text-blue-500 md:text-[1.2rem] font-bold hover:text-blue-600 hover:underline transition-colors"
                  >
                    Send us a message
                  </Link>
                  <span className="text-gray-700">
                    {" "}
                    and we&rsquo;ll get back to you!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialPlatforms.map((platform, index) => (
              <Link
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className=" border border-foreground rounded-lg p-8 h-48 md:h-80 flex flex-col items-center justify-center hover:shadow-xl hover:border-gray-300 transition-all duration-300 ">
                  <div className="flex-1 flex items-center justify-center mb-4">
                    {platform.customIcon ? (
                      <div className="text-4xl font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                        {platform.icon}
                      </div>
                    ) : (
                      <platform.icon className="w-12 h-12 text-gray-700 group-hover:text-gray-900 transition-colors" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                      {platform.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
