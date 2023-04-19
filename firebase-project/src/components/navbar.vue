<template>
  <div class="nav-bar">
    <div class="title">Firebase</div>
    
    <div class="router-panel">
      <button @click="$router.push('/register')">Register</button>
      <button @click="$router.push('/login')">Login</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.nav-bar {
  background-color: black;
  max-width: 100%;
  height: 60px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.title {
  font-size: 30px;
  color: #e6d1d0;
  font-weight: bold;
  letter-spacing: 1px;
  display: flex;
  justify-content: flex-start;
  margin-right: 85%;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.router-panel {
  color: white;
  margin-right: 17px;
  position: absolute;
  right: 0;
  bottom: 10px;
  letter-spacing: 2px;
  font-size: 20px;
}

.router-panel button {
  color: #4f3c39;
  background-color: #008081;
  border: none;
  margin-right: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 14px;
  padding: 10px;
  font-weight: bold;
  letter-spacing: 2px;
}

.router-panel button:hover {
  background-color: #00b3b3;
}

.router-panel button.active {
  background-color: #00b3b3;
}


</style>
