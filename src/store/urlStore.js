import {defineStore} from 'pinia'
import { ref, computed, reactive } from 'vue'
export const userheaders = defineStore('Token',()=>{
const token=ref('')
const name=ref('')
const islogin = ref(false)
const content=ref('')
const driftName= ref('')
const connect = ref('')
const messages= reactive([])
const image = ref('')
return {token,name,islogin,content,driftName,connect,messages,image}
},{
    persist:{
    key: 'my',
    paths: ['token']
    }
}
)

