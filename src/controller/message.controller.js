import { ref } from "vue";
import apiConfig from '../config/apiConfig.js';

export function MessageController(){
    const messageObj = ref([])
    const error = ref(null)

    const createMsg = async (data) => {
        try {
            const create = await apiConfig.post('/', data)
            messageObj.value = create.data.data;
            await getAllMsg()
            error.value = null
        } catch (err) {
            error.value = err;
            console.log("Faield To Create : ", err)
        }
    }
    
     const getAllMsg = async () => {
        try {
            const fetch = await apiConfig.get('/')
            messageObj.value = fetch.data.data;
            error.value = null
        } catch (err) {
            error.value = err;
            console.log("Faield To Create : ", err)
        }
    }
    
    

    return  {
        createMsg,
        getAllMsg,
        messageObj,
        error
    }
}