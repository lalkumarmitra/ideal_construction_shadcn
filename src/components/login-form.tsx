import { useAuth } from "@/Auth/AuthProvider";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2, LockIcon } from "lucide-react";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	const {handleLogin,isLoading} = useAuth();
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget);
		handleLogin(formData);
	}
	return (
		<form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-balance text-sm text-muted-foreground"> Enter login details below to login to your account </p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="username">Email or Phone</Label>
					<Input disabled={isLoading} name="username" id="username" type="text" placeholder="Email or phone number" required />
				</div>
				<div className="grid gap-2">
					<div className="flex items-center">
						<Label htmlFor="password">Password</Label>
						<a href="#" className="ml-auto text-sm underline-offset-4 hover:underline" > Forgot your password? </a>
					</div>
					<Input disabled={isLoading} name="password" id="password" type="password" placeholder="enter your password here" required />
				</div>
				<Button disabled={isLoading} type="submit" className="w-full">{isLoading && <Loader2 className="size-4 mr-2 inline animate-spin" />} Login </Button>
				<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
					<span className="relative z-10 bg-background px-2 text-muted-foreground"> Or continue with </span>
				</div>
				<Button disabled variant="outline" className="w-full"> <LockIcon className="size-4 mr-4 inline" /> Login with Google </Button>
			</div>
			<div className="text-center text-sm"> Don&apos;t have an account?{" "}
				<a href="#" className="underline underline-offset-4"> Sign up </a>
			</div>
		</form>
	)
}
