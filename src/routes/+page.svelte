<script>
  import Login from './Login.svelte';
  import Register from './Register.svelte';
  let activeTab = 'login';
  const selectTab = tab => activeTab = tab;
</script>
  <div class="login-container">
    <!-- Lado izquierdo -->
    <div class="image-side">
      <img src="C:\Users\gvm21\Downloads\fotos_parcela_nueva\fotos_parcela_nuva.jpg" alt="iofrm logo" class="logo">
    </div>

    <!-- Lado derecho -->
    <div class="form-side">
      <h1>Monitor de fondos mutuos<br>Loggin platform.</h1>
      <p class="subtitle">No te pierdas oportunidades.</p>

      <div class="tabs">
        <button
        type="button"
        on:click={() => selectTab('login')}
        class:active={activeTab === 'login'}>
        Login
      </button>
       <button
      type="button"
      on:click={() => selectTab('register')}
      class:active={activeTab === 'register'}>
      Register
    </button>
  </div>
  {#if activeTab === 'login'}
  <Login />
  {:else}
  <Register />
  {/if}
      <div class="social-login">
        <span>Or login with</span>
        <a href="https://www.google.com/">Facebook</a>
        <a href="https://www.google.com/">Google</a>
        <a href="https://www.google.com/">Linkedin</a>
      </div>
    </div>
  </div>
  