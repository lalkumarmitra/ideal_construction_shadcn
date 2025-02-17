import { LoginForm } from "@/components/login-form"
import sideImage from "@/assets/Gemini_Generated_Image_fjvzp0fjvzp0fjvz.jpeg"
import logo from "@/assets/logo_sm_transparent.png"

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100svh-7rem)] lg:grid-cols-2 bg-background">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center w-full items-center">
          <img src={logo} className="size-40 lg:hidden aspect-square object-contain" />
        </div>
        <div className="flex flex-1 items-center  justify-center">
          <div className="w-full max-w-xs ">
            <LoginForm className="" />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={sideImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2]"
        />
      </div>
    </div>
  )
}
