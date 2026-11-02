import { config } from "./config";

export const contact = {
  email: "nvminh162@gmail.com",
  phone: "+840353999798",
  phoneDisplay: "(VN) +84 0353.999.798",
  handle: "@nvminh162",
  social: {
    get github() {
      return `https://github.com/${config.githubUsername}`;
    },
    linkedin: "https://www.linkedin.com/in/nvminh162",
    facebook: "https://www.facebook.com/nvminh162",
    instagram: "https://www.instagram.com/nvminh162",
    x: "https://x.com/nvminh162",
    whatsapp: "https://wa.me/840353999798",
    tiktok: "https://www.tiktok.com/@nvminh162",
    zalo: "https://zalo.me/0353999798",
    telegram: "https://t.me/nvminh162",
    leetcode: "https://leetcode.com/nvminh162",
    codesandbox: "https://codesandbox.io/u/nvminh162",
  },
} as const;

export type ContactLink = {
  id: string;
  href: string;
  icon: string;
  label: string;
  external?: boolean;
};

export type ContactGroup = {
  title: string;
  links: ContactLink[];
};

export const PRIMARY_CONTACTS: ContactLink[] = [
  {
    id: "email",
    href: `mailto:${contact.email}`,
    icon: "/assets/contact/email.svg",
    label: contact.email,
    external: false,
  },
  {
    id: "phone",
    href: `tel:${contact.phone}`,
    icon: "/assets/contact/phone.svg",
    label: contact.phoneDisplay,
    external: false,
  },
];

export const SOCIAL_ROW1: ContactLink[] = [
  {
    id: "facebook",
    href: contact.social.facebook,
    icon: "/assets/contact/facebook.svg",
    label: "Facebook",
  },
  {
    id: "instagram",
    href: contact.social.instagram,
    icon: "/assets/contact/instagram.svg",
    label: "Instagram",
  },
  {
    id: "x",
    href: contact.social.x,
    icon: "/assets/contact/x.svg",
    label: "X",
  },
  {
    id: "whatsapp",
    href: contact.social.whatsapp,
    icon: "/assets/contact/whatsapp.svg",
    label: "WhatsApp",
  },
  {
    id: "tiktok",
    href: contact.social.tiktok,
    icon: "/assets/contact/tiktok.svg",
    label: "TikTok",
  },
];

export const SOCIAL_ROW2: ContactLink[] = [
  {
    id: "linkedin",
    href: contact.social.linkedin,
    icon: "/assets/contact/linkedin.svg",
    label: "LinkedIn",
  },
  {
    id: "telegram",
    href: contact.social.telegram,
    icon: "/assets/contact/telegram.svg",
    label: "Telegram",
  },
  {
    id: "zalo",
    href: contact.social.zalo,
    icon: "/assets/contact/zalo.svg",
    label: "Zalo",
  },
  {
    id: "github",
    href: contact.social.github,
    icon: "/assets/contact/github.svg",
    label: "GitHub",
  },
  {
    id: "leetcode",
    href: contact.social.leetcode,
    icon: "/assets/contact/leetcode.svg",
    label: "LeetCode",
  },
];

export const ALL_CONTACT_GROUPS: ContactGroup[] = [
  { title: "Direct", links: PRIMARY_CONTACTS },
  { title: "Social", links: SOCIAL_ROW1 },
  { title: "Work", links: SOCIAL_ROW2 },
];
