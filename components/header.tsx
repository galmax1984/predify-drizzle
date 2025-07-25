
import { SidebarTrigger } from './ui/sidebar';
import { UserNav } from './user-nav';
import { SessionProvider } from 'next-auth/react';

export default function Header() {
 return (
    <header className="w-full sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 px-4 sm:px-6">
        <SidebarTrigger />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
