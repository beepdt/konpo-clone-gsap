"use client";

export default function Hero() {
  return (
    <div className="hero ">
      <div className="space-y-0 md:space-y-0">
        {/* This is the hero info section with a grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 justify-center md:min-h-[420px] pt-8 mx-4 md:ml-[7rem] justify-between">
          <div className="header md:space-y-0 sm:col-span-2">
            <h1 className="text-[3.8rem] lg:text-[8rem] leading-none flex flex-col md:flex-row font-bold">
              <span>Capturing</span>
              <span className="text-blue-500">Memories</span>
            </h1>
            <h1 className="text-[3.8rem] lg:text-[5rem] leading-none font-bold md:pb-12 max-w-[80%]">
              across time
            </h1>
            <h2 className="text-[1.2rem] lg:text-[1.5rem] leading-none hidden sm:flex">
              Worked with 500+ Brands
            </h2>
          </div>

          <div className="site-info space-y-4 md:space-y-0 pb-2  sm:col-span-1">
            <div className="md:min-h-[240px]"></div>
            <div className="sm:pb-4">
              <h2 className="text-[1.5rem] lg:text-[2rem] leading-none ">
                A team focused on capturing moments you want to remember
              </h2>
            </div>

            <div className="border-b copy-divider"></div>

            <div className="site-info-copy md:pt-4">
              <p className="text-[1rem] lg:text-[1.4rem] leading-none">
                Award winning creative team
              </p>
              <p className="text-[1.2rem] lg:text-[1.2rem] leading-none font-bold">
                Operating since 2019
              </p>
            </div>
          </div>
        </div>
        <div className="border-b w-full carousel-divider md:mt-8 mb-4"></div>
        <div className=" md:ml-[5rem] py-4 md:py-4  wrapper opacity-0 slider ">
          <div className="carousel-reel  px-4"></div>
        </div>
      </div>

      <div className="images-container">
        <div className="img">
          <figure>
            <img src="/img1.jpg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img2.jpg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img3.jpg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img4.jpeg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img5.jpg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img6.jpg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img7.png" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img8.jpg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img9.jpeg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img10.jpeg" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img11.png" />
          </figure>
        </div>
        <div className="img">
          <figure>
            <img src="/img12.png" />
          </figure>
        </div>
      </div>
    </div>
  );
}
