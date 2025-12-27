import { createRouter, createWebHistory } from 'vue-router';
import down from '../components/makedown/hander.vue'

import displayMarkdown from '../components/makedown/displayMarkdown.vue';

const routes=[{path:'/down',component:down},{path:'/',component:()=>import('../components/index/index.vue')},{path:'/display',component:displayMarkdown},{path:'/nav',component:()=>import('../components/nav/toolbar.vue')
    ,children:[{path:'edit',component:()=>import('../components/editUser/editUSer.vue')},{path:'content',component:()=>import('../components/editUser/peopleContent.vue')}]},{path:'/friend',component:()=>import('../components/xingxi/friend.vue'),children:[{path:'chat/:name',name:'chat',component:()=>import('../components/xingxi/webScoket.vue')}]}
]
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
router.beforeEach((to, from, next) => {
 const my =localStorage.getItem("my")
 console.log(typeof my)
 const object=JSON.parse(my)

 if (to.path === '/') {
    next();
    return;
  }
  // 如果已登录且有权限，允许访问
  if (object.token) {
    next();
  } else {
    // 否则重定向到首页
    next("/");
  }
});
export default router