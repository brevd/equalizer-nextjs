import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, User, HomeIcon } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/account", title: "Account", icon: User },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Entities",
    links: [
      {
        href: "/bill-mates-to-groups",
        title: "Bill Mates To Groups",
        icon: Globe,
      },
      {
        href: "/budgets",
        title: "Budgets",
        icon: Globe,
      },
      {
        href: "/categories",
        title: "Categories",
        icon: Globe,
      },
      {
        href: "/bill-groups",
        title: "Bill Groups",
        icon: Globe,
      },
      {
        href: "/bill-mates",
        title: "Bill Mates",
        icon: Globe,
      },
    ],
  },

];

