<template>
  <div class="nav-bar">
    <h1 class="heading">Firebase</h1>
    <div class="router-panel">
      <button @click="$router.push('/register')">Register</button>
      <button @click="$router.push('/login')" :disabled="isUserLoggedIn">
        Login
      </button>
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
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.heading {
  font-size: 30px;
  color: #e6d1d0;
  font-weight: bold;
  letter-spacing: 1px;
  margin-left: 15px;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.router-panel {
  color: white;
  margin-right: 17px;
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

/* For mobile views */
@media only screen and (max-width: 600px) {
  .nav-bar {
    width: 600px;
    height: 70px;
  }
  .heading {
    margin-left: 10px;
  }

  .router-panel {
    margin-right: 0;
    position: static;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .router-panel button {
    margin-right: 5px;
    font-size: 16px;
    padding: 8px;
  }
}
</style>
