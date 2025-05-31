<script>
    let showPassword = false;
</script>
<form action="?/login" method="POST">
    <input class="email-field" type="email" placeholder="E-mail Address" required>
    <div class="password-field">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        required
      />
      <button
        type="button"
        class="toggle-password"
        on:click={() => (showPassword = !showPassword)}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {#if showPassword}
          <!-- Ojo abierto -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 5c-7 0-11 6-11 7s4 7 11 7 11-6 11-7-4-7-11-7zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5z"/>
            <circle fill="currentColor" cx="12" cy="12" r="2.5"/>
          </svg>
        {:else}
          <!-- Ojo tachado -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 6a9.77 9.77 0 0 1 6.85 2.85L21 6l1.5 1.5-1.93 1.93a9.95 9.95 0 0 1 1.38 2.57A12.37 12.37 0 0 1 12 18a12.37 12.37 0 0 1-8.95-3.03l-1.72 1.72L1.5 18l2.15-2.15A9.77 9.77 0 0 1 6 12a9.77 9.77 0 0 1-2.85-6.85L3 4.5 4.5 3l1.93 1.93A9.95 9.95 0 0 1 12 6zm0 10a4 4 0 0 0 4-4 3.93 3.93 0 0 0-.38-1.7L9.7 15.62A3.93 3.93 0 0 0 12 16zm-6-4a6 6 0 0 1 9.9-4.5L9.5 13.4A3.93 3.93 0 0 0 6 12z"/>
          </svg>
        {/if}
      </button>
    </div>
    <button type="submit">Login</button>
  </form>

  <style>
    form {
  width: 100%;
  max-width: 280px;    /* antes era 320px o 100% */
  margin: 0 auto;      /* centra el form si quieres */
}

.email-field {
  position: relative;
  width: 100%;
  max-width: 280px;    /* coincide con el form */
  margin-bottom: 1rem;
}

/* Ajusta sólo el campo password */
.password-field {
  position: relative;
  width: 100%;
  max-width: 280px;    /* coincide con el form */
  margin-bottom: 1rem;
}
.password-field input {
  padding: 0.5rem 2rem 0.5rem 1rem;  /* menos altura */
  font-size: 0.9rem;                /* letra un poco más pequeña */
  border-radius: 4px;
}

/* Ojo: reduce también el tamaño del SVG */
.password-field .toggle-password svg {
  width: 1rem;
  height: 1rem;
}
  </style>