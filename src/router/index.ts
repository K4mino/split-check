import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/Login.vue'
import AddExpensesPage from '../views/AddExpenses.vue'
import GroupsPage from '../views/Groups.vue'
import GroupPage from '../views/Group.vue'
import CreateGroupPage from '../views/CreateGroup.vue'
import ExpensePage from '../views/Expense.vue'
import { supabase } from '@/supabase';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/addexpenses',
    name: 'AddExpenses',
    component: AddExpensesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups',
    name: 'Groups',
    component: GroupsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:id',
    name: 'Group',
    component: GroupPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-group',
    name: 'CreateGroup',
    component: CreateGroupPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/:id',
    name: 'Expense',
    component: ExpensePage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const session = data.session

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !session) {
    return next('/login')
  }

  return next()
})


export default router
