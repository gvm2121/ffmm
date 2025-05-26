<!-- src/App.svelte -->
<script lang="ts">
import { onMount } from 'svelte';
import * as d3 from 'd3';
import { goto } from '$app/navigation';

let sidebarOpen= false;

function toggleSidebar(){
  sidebarOpen=!sidebarOpen;
}

  export let data: {
    categorias: string[],
    fondos: string[],
    serie: { scrap_date: string; installmentvalue: number }[],
    categoriaSeleccionada: string | null,
    fondoSeleccionado: string | null
  };
  
  let categoriaSeleccionada = data.categoriaSeleccionada ?? '';
  let fondoSeleccionado = data.fondoSeleccionado ?? '';
  let chartContainer: HTMLDivElement;

  function onChangeCategoria() {
    fondoSeleccionado = ''; // reset segundo select
    goto(`?categoria=${categoriaSeleccionada}`);
  }

  function onChangeFondo() {
    goto(`?categoria=${categoriaSeleccionada}&fondo=${fondoSeleccionado}`);
    console.log('Serie desde el servidor:', data.serie);
  }

  // 🔁 Ejecutar cuando llegan datos nuevos
  $: if (data.serie.length > 0) {
    drawLineChart();
  }

  function drawLineChart() {
    if (!chartContainer) return;

    // Limpiar gráfico anterior
    d3.select(chartContainer).selectAll('*').remove();


    // Parsear fechas
    const parsed = data.serie.map(d => ({
      date: new Date(d.scrap_date),
      value: d.installmentvalue
    }));

    // Dimensiones
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3.select(chartContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleTime()
      .domain(d3.extent(parsed, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsed, d => d.value)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Ejes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%d-%b')));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Línea
    const line = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value));

    svg.append('path')
      .datum(parsed)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  }
</script>

<div class="flex h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 w-64 bg-gray-800 text-gray-100 transform transition-transform duration-200 md:translate-x-0"
    class:translate-x-0={sidebarOpen}
    class:-translate-x-full={!sidebarOpen}
  >
    <div class="p-4 text-2xl font-bold">Cera.</div>
    <nav class="mt-6">
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">dashboard</span>Dashboard
      </a>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">home</span>Homepage
      </a>
      <div class="mt-4 px-4 uppercase text-xs text-gray-400">Community</div>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">favorite_border</span>Social wall
      </a>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">people</span>Members
      </a>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">groups</span>Groups
      </a>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">forum</span>Forums
      </a>
      <div class="mt-4 px-4 uppercase text-xs text-gray-400">Others</div>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">article</span>News <span class="ml-auto bg-green-500 text-xs px-2 py-0.5 rounded-full">Hot</span>
      </a>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">description</span>Pages
      </a>
      <a href="/" class="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700">
        <span class="material-icons mr-3">logout</span>Log out
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 flex flex-col md:pl-64">
    <!-- Mobile Header -->
    <header class="flex items-center justify-between bg-white p-4 shadow md:hidden">
      <button on:click={toggleSidebar} class="p-2 focus:outline-none">
        <span class="material-icons text-gray-800">menu</span>
      </button>
      <div class="flex items-center">
        <input
          type="text"
          placeholder="Search everything..."
          class="border rounded-lg px-3 py-1 mr-4 w-48 focus:outline-none focus:ring"
        />
        
      </div>
    </header>
    

    <!-- Desktop Topbar -->
    <nav class="hidden md:flex items-center justify-between bg-white p-4 shadow">
      <div class="flex items-center">
        <button on:click={toggleSidebar} class="md:hidden p-2 focus:outline-none">
          <span class="material-icons text-gray-800">menu</span>
        </button>
        <input
          type="text"
          placeholder="Search everything..."
          class="border rounded-lg px-3 py-1 w-64 focus:outline-none focus:ring"
        />
      </div>
      <div class="flex items-center space-x-4">
        <span class="material-icons cursor-pointer">notifications</span>
        <span class="material-icons cursor-pointer">mail</span>
        
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative bg-cover bg-center">
       <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 class="text-4xl font-bold">Intranet & Extranet<br /> Become Simple</h1>
        <p class="mt-4">Take full advantage of an intranet or extranet platform for your company. In a few steps.</p>
        <button class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Discover more</button>
      </div>
    </section>

    <!-- Members -->
    <section class="p-6 bg-gray-100 flex-1 overflow-auto">
      <div class="flex items-center justify-between mb-4"></div>
    
      <h2>Selecciona un administrador</h2>

      <div class="select-container">
        <!-- Primer Select -->
        <!-- Select 1: Administrador -->
        <select bind:value={categoriaSeleccionada} on:change={onChangeCategoria}>
        <option disabled value="">-- Selecciona un administrador --</option>
        {#each data.categorias as admin}
          <option value={admin}>{admin}</option>
        {/each}
        </select>
      
        <!-- Select 2: Fondo (condicional) -->
        {#if data.fondos.length > 0}
          <select bind:value={fondoSeleccionado} on:change={onChangeFondo}>
            <option disabled value="">-- Selecciona un fondo --</option>
            {#each data.fondos as fondo}
              <option value={fondo}>{fondo}</option>
            {/each}
          </select>
        {/if}
      </div>
      <!-- Contenedor D3 -->
        {#if data.serie.length > 0}
        <div class="d3-salida" bind:this={chartContainer}></div>
        {:else if fondoSeleccionado}
        <p>No hay datos disponibles para este fondo.</p>
        {/if}

      </section>
  </div>
</div>