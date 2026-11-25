import './globals.css';

export const metadata = {
  title: 'SkillGap - AI-Driven Global Talent Ecosystem',
  description: 'Global AI Recruitment Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}