import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SignUpForm from '@/components/Auth/SignUpForm'
import LogInForm from '@/components/Auth/LogInForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/signup',
      component: SignUpForm
    },
    {
      path: '/login',
      component: LogInForm
    }
  ]
})
