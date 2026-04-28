import React from 'react'
import Login from './auth/login'
import Signup from './auth/Signup'

const Auth = () => {
  const [isLogin, setIsLogin] = React.useState(true)

  return (
    <div>
      {isLogin ? <Login /> : <Signup />}
     
    </div>
  )
}

export default Auth
