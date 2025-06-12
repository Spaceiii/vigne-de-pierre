<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <!-- Toggle simple -->
      <div class="mode-toggle">
        <button
          @click="mode = 'login'"
          :class="{ active: mode === 'login' }"
          class="toggle-btn"
        >
          {{ $t('auth.login') }}
        </button>
        <button
          @click="mode = 'register'"
          :class="{ active: mode === 'register' }"
          class="toggle-btn"
        >
          {{ $t('auth.register') }}
        </button>
      </div>

      <!-- Titre -->
      <div class="title-section">
        <h1 class="auth-title">
          {{ mode === 'login' ? $t('auth.welcomeBack') : $t('auth.joinUs') }}
        </h1>
        <p class="auth-subtitle">
          {{ mode === 'login' ? $t('auth.signInSubtitle') : $t('auth.createAccountSubtitle') }}
        </p>
      </div>

      <!-- Formulaire -->
      <div class="form-container">
        <Transition name="fade" mode="out-in">
          <form v-if="mode === 'login'" @submit.prevent="handleLogin" key="login" class="auth-form">
            <div class="input-group">
              <input
                v-model="email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                required
                class="modern-input"
              />
              <input
                v-model="password"
                type="password"
                :placeholder="$t('auth.passwordPlaceholder')"
                required
                class="modern-input"
              />
            </div>
            <button type="submit" class="submit-btn">
              {{ $t('auth.signIn') }}
            </button>
          </form>

          <form v-else @submit.prevent="handleRegister" key="register" class="auth-form">
            <div class="input-group">
              <div class="input-row">
                <input
                  v-model="firstName"
                  type="text"
                  :placeholder="$t('auth.firstNamePlaceholder')"
                  required
                  class="modern-input"
                />
                <input
                  v-model="lastName"
                  type="text"
                  :placeholder="$t('auth.lastNamePlaceholder')"
                  required
                  class="modern-input"
                />
              </div>
              <input
                v-model="email"
                type="email"
                :placeholder="$t('auth.emailPlaceholder')"
                required
                class="modern-input"
              />
              <input
                v-model="password"
                type="password"
                :placeholder="$t('auth.passwordPlaceholder')"
                required
                minlength="6"
                class="modern-input"
              />
            </div>
            <button type="submit" class="submit-btn">
              {{ $t('auth.createAccount') }}
            </button>
          </form>
        </Transition>
      </div>

      <!-- Message d'erreur -->
      <Transition name="error-fade">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const mode = ref<'login' | 'register'>('login');
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const error = ref('');

const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  error.value = '';
  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = t('auth.invalidCredentials');
  }
}

async function handleRegister() {
  error.value = '';
  try {
    await auth.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err) {
    error.value = t('auth.registrationFailed');
  }
}

onMounted(() => {
  if (auth.token) {
    router.push('/');
  }
})

</script>

<style scoped>
.auth-wrapper {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
}

.auth-container {
  max-width: 500px;
  width: 100%;
  background: var(--primary-bg-start);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* Toggle */
.mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 2rem;
  gap: 4px;
}

.toggle-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: var(--primary-bg-start);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Titre */
.title-section {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

/* Formulaire */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.modern-input {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.modern-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.modern-input:focus {
  outline: none;
  border-color: #297e00;
  box-shadow: 0 0 0 2px rgba(41, 126, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

/* Bouton */
.submit-btn {
  background: #297e00;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(41, 126, 0, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Message d'erreur */
.error-message {
  background: rgba(255, 99, 71, 0.1);
  border: 1px solid rgba(255, 99, 71, 0.3);
  border-radius: 10px;
  padding: 0.8rem;
  color: #ff6347;
  text-align: center;
  font-weight: 500;
  margin-top: 1rem;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .auth-wrapper {
    padding: 1rem;
  }

  .auth-container {
    padding: 2rem 1.5rem;
  }

  .input-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1.5rem 1rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
