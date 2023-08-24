"use client";

import { useOrder } from "contexts/order";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tv } from "tailwind-variants";

interface linkProps {
  path: string;
  count: number;
  title: string;
  color: "orange" | "yellow" | "green";
}

export function Navigation({ prefix = "" }: { prefix?: string }) {
  const pathname = usePathname();
  const { quantityItems } = useOrder();

  const links: linkProps[] = [
    {
      path: `/${prefix}`,
      count: quantityItems.pending,
      title: "Pegar",
      color: "orange",
    },
    {
      path: `/${prefix}/revision`,
      count: quantityItems.revision,
      title: "Revisar",
      color: "yellow",
    },
    {
      path: `/${prefix}/complete`,
      count: quantityItems.complete,
      title: "Pronto",
      color: "green",
    },
  ];

  const linkClass = tv({
    base: `bg-white text-black group flex flex-col gap-1 items-center rounded-md py-2 px-3 w-15 transition-colors`,
    variants: {
      color: {
        orange:
          "data-[active=true]:bg-orange-barapi data-[active=true]:text-white",
        yellow:
          "data-[active=true]:bg-yellow-barapi data-[active=true]:text-white",
        green:
          "data-[active=true]:bg-green-barapi data-[active=true]:text-white",
      },
    },
  });
  const countClass = tv({
    base: "bg-orange text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors",
    variants: {
      color: {
        orange:
          "text-white bg-orange-barapi group-data-[active=true]:bg-white group-data-[active=true]:text-orange-barapi",
        yellow:
          "text-white bg-yellow-barapi group-data-[active=true]:bg-white group-data-[active=true]:text-yellow-barapi",
        green:
          "text-white bg-green-barapi group-data-[active=true]:bg-white group-data-[active=true]:text-green-barapi",
      },
    },
  });

  return (
    <nav className="fixed bottom-0 left-0 w-screen bg-white">
      <ul className="flex w-full justify-evenly p-1">
        {links.map(({ color, count, title, path }) => {
          return (
            <li key={path}>
              <Link
                href={path}
                data-active={pathname === path}
                className={linkClass({ color })}
              >
                <span className={countClass({ color })}>{count}</span>
                <span className="font-semibold text-sm">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
