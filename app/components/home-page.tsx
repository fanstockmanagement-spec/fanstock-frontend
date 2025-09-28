import Link from "next/link";
import HeroPage from "./hero-page";
import NavigationBar from "./navigation-bar";
import ShoeCard from "./shoe-card";
import LogoScroll from "./logo-scroll";
import Image from "next/image";

export default function HomePage() {
  return <div className="text-sm bg-[#F9F9F9]">
    <NavigationBar />
    <HeroPage />

    <section className="flex flex-col gap-4 max-w-7xl mx-auto min-h-screen mt-10 p-4">
      <div className="flex flex-wrap justify-between w-full gap-4">
        <h1 className="text-2xl font-bold uppercase">New Releases</h1>
        <Link href="/new-releases" className="text-gray-400 underline">Browse All</Link>
      </div>
      <div className="gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ShoeCard key={index} />
        ))}
      </div>
    </section>

    {/* become a member */}

    <section className="bg-black text-white w-full mt-40 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <span className="flex flex-col justify-center items-start gap-5">
          <h1 className="text-6xl font-bold">Become <br />A member</h1>
          <p className="text-gray-300">Lorem Quisquam, quos. Lorem ipsum doeat, iure, tempora necessitati <br /> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos., sed commodi.</p>
          <button className="bg-white text-black p-3 px-10 cursor-pointer mt-5">Become a Member</button>
        </span>
        <span className="flex items-center justify-center">
          <LogoScroll />
        </span>
      </div>
    </section>
  </div>;
}