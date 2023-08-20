'use client'

import { useCallback, useEffect, useState } from "react"
import { useForm, FieldValues, SubmitHandler } from "react-hook-form"
import Input from "./inputs/Input"
import Button from "./Button"
import { AuthSocialButton } from "./AuthSocialButton"
import {BsGithub, BsGoogle} from "react-icons/bs"
import axios from "axios"
import { toast } from "react-hot-toast"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Variant = "LOGIN" | "REGISTER"

const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')  
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if(session?.status === 'authenticated'){
      router.push('/users')
    }
  },[session?.status,router])

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
  
    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(()=> signIn('credentials',data))
      .catch(()=> toast.error("Algo salió mal"))
      .finally(() => {setIsLoading(false)})
    }
    if(variant === 'LOGIN'){
        signIn('credentials',{
            ...data,
            redirect: false
        })
        .then((callback) =>{
            if(callback?.error){
                toast.error('Credenciales invalidas')
            }

            if(callback?.ok && !callback?.error){
                toast.success('Sesión iniciada')
                router.push('/users')
            }
        })
        .finally(() => {setIsLoading(false)})
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)
    signIn(action,{redirect:false})
    .then((callback) =>{
        if(callback?.error){
            toast.error('Credenciales invalidas')
        }

        if(callback?.ok && !callback?.error){
            toast.success('Sesión iniciada')
        }
    })
    .finally(() => {setIsLoading(false)})
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
                            O
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