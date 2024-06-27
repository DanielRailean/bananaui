<script lang="ts">
	import TreeWrapper from './../../lib/components/treeWrapper.svelte';
	import Header from './../../lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import { userToken } from '$lib/stores';
  import {addToast} from '$lib/stores'
  let token: any = {
    username: "",
    header: "",
    body: "",
    signature: "",
    token: "",
  }
  onMount(()=> {
    token.token = $userToken
    const split = $userToken?.split('.')
    if(!split)
    {
      addToast({message: 'no token!'})
      return
    }
    token.header = JSON.parse(atob(split[0]))
    token.body = JSON.parse(atob(split[1]))
    token.signature = split[2]
    token.username = token.body.name
  })
</script>

<TreeWrapper data={token} expandLevel={2}/>