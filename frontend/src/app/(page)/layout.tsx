import ChatboxWidget from "@/components/features/ChatboxWidget";

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ChatboxWidget />
    </>
  );
}
