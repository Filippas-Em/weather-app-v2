"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Select() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selected = searchParams.get("selected") || "";
    const linksRef = useRef([]);

    useEffect(() => {
        if (!selected) {
            router.replace(`${pathname}?selected=today`);
        }
    }, [selected, pathname, router]);

    const links = [
        { name: 'Today', value: 'today', href: '/?selected=today' },
        { name: 'Tomorrow', value: 'tomorrow', href: '/?selected=tomorrow' },
        { name: 'This Week', value: 'week', href: '/?selected=week' },
    ];

    return (
        <nav className="nav-container">
            <div className="menu">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        ref={el => linksRef.current[index] = el}
                        className={`menu-item ${selected === link.value ? 'selected' : ''}`}
                    >
                        {link.name}
                    </Link>
                ))}
                <span 
                    className="underline"
                    style={{
                        left: linksRef.current[links.findIndex(link => link.value === (selected || 'today'))]?.offsetLeft || 0,
                        width: linksRef.current[links.findIndex(link => link.value === (selected || 'today'))]?.offsetWidth || 0
                    }}
                />
            </div>
        </nav>
    );
}