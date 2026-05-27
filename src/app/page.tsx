// Old code, delete after test pls
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Dashboard from './dashboard/page'; 
// import { Loader2 } from 'lucide-react';

// export default function HomePage() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isAuthenticated');
//     const userRole = localStorage.getItem('userRole');

//     if (loggedIn === 'true') {
//       if (userRole === 'estandar') {
//         router.replace('/assets');
//       } else {
//         setIsAuthenticated(true);
//       }
//     } else {
//       router.replace('/login');
//     }
//   }, [router]);

//   if (isAuthenticated === null) {
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-background">
//             <Loader2 className="h-16 w-16 animate-spin text-primary" />
//         </div>
//     );
//   }

//   return <Dashboard />;
// }

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}

