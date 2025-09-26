import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NavigationBar() {

    const navlinks = [
        {
            href: "/",
            label: "Home"
        },
        
        {
            href: "/",
            label: "Products"
        },
        {
            href: "/",
            label: "About"
        },
        {
            href: "/",
            label: "Contact"
        }
    ]
  return (
    <nav className="flex justify-between items-center p-4 w-full h-30 bg-gradient-to-b from-black to-black/0 fixed z-50 text-sm">
        {/* logo */}
        <p className="text-white font-semibold">250 Kicks</p>

        {/* navlink */}
        <div className="flex items-center gap-10 text-white uppercase ">
            {navlinks.map((link) => (
                <Link 
                    href={link.href} 
                    key={link.href} 
                    className="relative pb-1 group transition-all duration-150 translate-y-1 hover:translate-y-0"
                >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#CA425A] transition-all duration-300 ease-out group-hover:w-full"></span>
                </Link>
            ))}
        </div>

        {/* Account */}
        <Link href="/dashboards/seller" className="bg-white text-[#CA425A] p-3 px-10 flex items-center gap-2 hover:bg-[#CA425A] hover:text-white transition-all duration-150">
        <PersonIcon />
            Account
        </Link>
    </nav>
  );
}