
'use client';

// import { login } from '@/services/auth.service';
import { saveSession } from '@/lib/session';
import { usersService } from '@/services/users.service';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Box, Loader2, X } from 'lucide-react';
import RegisterForm from '@/components/auth/register-form';
// import { companies } from '@/lib/mock-data';
import { logUser } from '@/types/auth.types';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  // const [userId, setUserId] = useState('');
  // const [password, setPassword] = useState('');
  const [user, setUser] = useState<logUser>({
    cedula: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await usersService.login(user);

      saveSession(response);

      toast({
        title: 'Inicio de sesion Exitoso',
        description: `Bienvenido, ${response.user.name}`,
      });

      window.location.replace('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de Autenticación',
        description: error?.message || 'Usuario o contraseña incorrectos.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = () => {
    if (forgotEmail) {
        console.log(`Password reset link sent to: ${forgotEmail}`)
        toast({
            title: 'Enlace Enviado',
            description: `Se ha enviado un enlace para restablecer la contraseña a ${forgotEmail}.`,
        });
        setIsForgotOpen(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Por favor, introduce un correo electrónico.',
        });
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
            <Box className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline mt-2">Activos Pro</CardTitle>
            <CardDescription>
                Introduce tus credenciales para acceder al panel.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Usuario</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Tu documento"
                required
                value={user.cedula}
                onChange={(e) => setUser({
                      ...user,
                      cedula: Number(e.target.value)
                  })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                     <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-xs">
                                ¿Olvidaste tu contraseña?
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Recuperar Contraseña</DialogTitle>
                                <DialogDescription>
                                    Introduce tu correo electrónico para enviarte un enlace de recuperación.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                <Label htmlFor="forgot-email">Correo Electrónico</Label>
                                <Input 
                                    id="forgot-email"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button onClick={handleForgotPassword}>Enviar Enlace</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
              <Input
                id="password"
                type="password"
                required
                value={user.password}
                onChange={(e) => setUser({
                      ...user,
                      password: e.target.value
                  })
                }
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm">
        </CardFooter>
      </Card>
    </div>
  );
}
