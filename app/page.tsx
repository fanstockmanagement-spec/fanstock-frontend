import Image from "next/image";
import HomePage from "./components/home-page";
import LandingPage from "./components/landingPage";

export default function Home() {
  return (
    <main className="items-center justify-items-center min-h-screen">
        <LandingPage />
    </main>
  );
}
