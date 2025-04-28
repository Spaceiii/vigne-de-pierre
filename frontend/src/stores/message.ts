import {defineStore} from "pinia";
import {computed, ref} from "vue";

type MessageType = {
  id: number,
  type: 'error' | 'warning' | 'info',
  content: string
}

export const useMessageStore = defineStore('message', () =>{
  // Define the state
  const messages = ref<MessageType[]>([])
  const nextId = ref(0)

  // Define the getters
  const hasMessage = computed(() => messages.value.length > 0)


  // Define the mutations

  /**
   * Create a message
   */
  function createError(messageContent: string) {
    messages.value.push({type: 'error', content: messageContent, id: nextId.value++})
  }

  /**
   * Create a warning
   */
  function createWarning(messageContent: string) {
    messages.value.push({type: 'warning', content: messageContent, id: nextId.value++})
  }

  /**
   * Create an info
   */
  function createInfo(messageContent: string) {
    messages.value.push({type: 'info', content: messageContent, id: nextId.value++})
  }


  /**
   * Clear the message
   */
  function clearMessage(id: number) {
    messages.value = messages.value.filter(item => item.id !== id)
  }

  return {
    // Expose the state
    hasMessage,

    // Expose the getters
    messages,

    // Expose the mutations
    createError,
    createWarning,
    createInfo,
    clearMessage,
  }
})
