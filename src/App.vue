<template>
  <main class="main-wrapper">
    <header>
      <nav class="nav-wrapper">
        <RouterLink to="/" class="btn" exact-active-class="-active">Валюты</RouterLink>
        <RouterLink to="/converter" class="btn secondary" exact-active-class="-active">Конвертер</RouterLink>
      </nav>
    </header>

    <RouterView />
  </main>
</template>

<style scoped></style>

<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<style scoped lang="scss">
.main-wrapper {
  background-color: #fafafa;
  width: 100%;
  min-height: 100vh;
  padding: 40px 80px;
}

.btn {
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 0 12px;
  height: 36px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 0px 0px 10px 0px #46464626;

  &.-active {
    background: #e28049;
    color: white;
  }
}

.nav-wrapper {
  display: flex;
  margin-bottom: 32px;

  & .btn:first-child {
    margin-right: 12px;
  }
}

@media (max-width: 705px) {
  .main-wrapper {
    padding: 32px 16px;
  }
}
</style>
