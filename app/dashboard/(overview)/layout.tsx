import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Nav from '@/components/Nav';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Nav />
        {children}</body>
    </html>
  );
}