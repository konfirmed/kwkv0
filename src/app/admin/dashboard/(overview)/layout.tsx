import '@/app/kwk/ui/global.css';
import { inter } from '@/app/kwk/ui/fonts';
import Nav from '@/app/kwk/components/Nav';
 
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