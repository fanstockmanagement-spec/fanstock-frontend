import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NavigationBar() {

    const navlinks = [
        {
            href: "/",
            label: "Home"
        },
        
        {
            href: "/new-releases",
            label: "New Releases"
        },
        {
            href: "/",
            label: "Stores"
        },
        {
            href: "/",
            label: "Contact"
        }
    ]
  return (
    <nav className="flex justify-between items-center p-4 w-full h-16 bg-white/20 backdrop-blur-md fixed z-50 text-sm">
        {/* logo */}
        <Link href="/" className="text-black font-semibold">250 Kicks</Link>

        {/* navlink */}
        <div className="flex items-center gap-10 text-white uppercase ">
            {navlinks.map((link) => (
                <Link 
                    href={link.href} 
                    key={link.href} 
                    className="relative text-[12px] pb-1 text-black group transition-all duration-150 translate-y-1 hover:translate-y-0"
                >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CA425A] transition-all duration-300 ease-out group-hover:w-full"></span>

                </Link>
            ))}
        </div>

        {/* Account */}
        <Link href="/sign-in" className="bg-white text-[#CA425A] p-3 px-10 flex items-center gap-2 hover:bg-[#CA425A] hover:text-white transition-all duration-150">
        <PersonIcon />
            Account
        </Link>
    </nav>
  );
}