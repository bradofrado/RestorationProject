import '~/styles/globals.css';
import { Layout as LayoutComponent } from '~/utils/components/page/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LayoutComponent>{children}</LayoutComponent>;
}
