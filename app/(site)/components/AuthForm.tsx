'use client'

import { useCallback, useState } from "react"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import Input from "./inputs/Input"
import Button from "./Button"
import { AuthSocialButton } from "./AuthSocialButton"
import {BsGithub, BsGoogle} from "react-icons/bs"


type Variant = "LOGIN" | "REGISTER"

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN')  
  const [isLoading, setIsLoading] = useState(false)

  const toggleVariant = useCallback(()=>{
    if(variant == 'LOGIN'){
        setVariant('REGISTER')
    } else {
        setVariant('LOGIN')
    }
  },[variant])

  const {
    register,
    handleSubmit,
    formState:{
        errors
    }

  } = useForm<FieldValues>({
    defaultValues:{
        name: '',
        email: '',
        password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    if(variant == 'REGISTER'){
        //Axios register
    }
    if(variant == 'LOGIN'){
        //NextAuth SignIn
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)
    //NextAuth social signin
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {variant == 'REGISTER' && (
                    <Input id="name" label="Nombre" register={register} errors={errors} disabled={isLoading}/>
                    )}
                <Input id="email" label="Correo electronico" type="email" register={register} disabled={isLoading} errors={errors}/>
                <Input id="password" label="Contraseña" type="password" register={register} disabled={isLoading} errors={errors}/>
                <div>
                    <Button disabled={isLoading} fullWidth type="submit">
                        {variant == 'LOGIN' ? "Inicia sesión" : "Registrate"}
                    </Button>
                </div>
            </form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500 ">
                            O continua con
                        </span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')}/>
                    <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')}/>
                </div>
            </div>
            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                <div>
                    {variant == 'LOGIN' ? "Nuevo en Lussenger? uwu" : "Ya tenes una cuenta? uwu"}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer">
                    {variant == 'LOGIN' ? "Crea una cuenta" : "Inicia sesión"}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthForm