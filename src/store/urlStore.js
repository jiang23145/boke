import {defineStore} from 'pinia'
import { ref, computed } from 'vue'
export const userheaders = defineStore('Token',()=>{

const token=ref('')
const name=ref('')
const islogin = ref(false)
const content=ref('')
const driftName= ref('')
const connect = ref('')
const messages= ref([])
return {token,name,islogin,content,driftName,connect,messages}
},{
    persist:{
    key: 'my',
    paths: ['token']
    }
}
)

