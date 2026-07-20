export const contractAddress = "0x940f0995c0Ef0AFAEE8654435A08Dd89941336B6";

export const shortenAddr = (addr: string) => {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};