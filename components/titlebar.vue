<template>
  <div data-tauri-drag-region class="titlebar">
    <div class="titlebar-buttons">
      <div class="titlebar-button close" @click="handleClose"></div>
      <div class="titlebar-button minimize" @click="handleMinimize"></div>
    </div>
    <div class="app-name">Oxide Secret Manager</div>
  </div>
</template>

<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'

const handleMinimize = () => {
  appWindow.minimize()
}

const handleClose = () => {
  appWindow.close()
}
</script>

<style scoped>
.titlebar {
  z-index: 999999;
  height: 30px;
  background: #111827;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 10px;
}

.titlebar-buttons {
  display: flex;
  gap: 8px;
}

.titlebar-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ff5f57;
  cursor: pointer;
}

.titlebar-button.minimize {
  background-color: #ffbd2e;
}

.titlebar-button:hover {
  opacity: 0.8;
}

.app-name {
  margin-left: auto;
  padding-right: 3px;
  font-size: 14px;
  color: #f3f3f4;
}
</style>