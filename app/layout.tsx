import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Nav from '@/components/Nav';
import Provider from '@/components/Provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${inter.className} antialiased`}>
          <Nav />
          {children}
        </body>
      </Provider>
    </html>
  );
}
