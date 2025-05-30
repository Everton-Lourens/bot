import { IHttpClientProvider } from '@/providers/http-client-provider/i-http-client-provider'

interface IRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  driverLicense: string
  isAdmin: boolean
}

export function createNewUserService(
  { name, email, password, confirmPassword, driverLicense, isAdmin }: IRequest,
  httpClientProvider: IHttpClientProvider,
) {
  return httpClientProvider.post('/users', {
    name,
    email,
    password,
    confirmPassword,
    driverLicense,
    isAdmin,
  })
}
