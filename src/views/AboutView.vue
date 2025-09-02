<template>
  <section class="about-container">
    <div class="about-content">
      <h2 class="title">Acerca del sistema web</h2>
      <p class="Description">
        Este es un sistema web con fines demostrativos, diseñado para crear transacciones y luego ejecutarlas en el
        cajero automático (ATM).
      </p>
      <ul class="features">
        <h3 class="title">Funcionalidades</h3>
        <li>✔ Crea transacciones</li>
        <li>✔ Consulta detalles de la transacción</li>
        <li>✔ Comparte código QR de la transacción</li>
        <h3 class="title">Transacciones soportadas</h3>
        <li>✔ Retiros ATM</li>
        <li>✔ Depósitos ATM</li>
        <li>✔ Pagos de tarjetas ATM</li>
      </ul>
      <p class="mission">
        Versión 0.1.0
      </p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.about-container {
  width: 100%;
  height: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: auto;
}

.about-content {
  text-align: justify;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.features {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.features li {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #444;
}

.mission {
  font-style: italic;
  color: #666;

}
</style>
