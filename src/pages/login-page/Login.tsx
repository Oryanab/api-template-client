import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

const Login = () => {
    return (
        <div className=" bg-purple-400 h-[100vh] w-[100vw] flex items-center justify-center p-5">
            <div className="h-[500px] w-[500px] rounded-md shadow-2xl bg-slate-50 flex py-20 px-10">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Label
                            className="flex items-center gap-[2px] font-roboto font-light my-custom-style"
                            htmlFor="name"
                        >
                            Name <User color="black" size={20} />
                        </Label>
                        <Input id="name" defaultValue="Pedro Duarte" />
                    </TabsContent>
                    <TabsContent value="register">password</TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Login;
