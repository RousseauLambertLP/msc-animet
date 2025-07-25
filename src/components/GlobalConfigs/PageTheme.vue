<template>
  <div id="theme">
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn
          size="34"
          class="rounded-circle"
          v-bind="props"
          @click="toggleThemeDarkMode"
        >
          <v-icon
            size="24"
            :class="{ 'theme-icon': true, 'theme-icon-dark': isDark }"
          >
            mdi-theme-light-dark
          </v-icon>
        </v-btn>
      </template>
      <span>{{
        isDark ? t('MP4CreateLightMode') : t('MP4CreateDarkMode')
      }}</span>
    </v-tooltip>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { isDarkTheme } from '@/components/Composables/isDarkTheme'

export default {
  setup() {
    const { t } = useI18n()

    const { isDark, theme } = isDarkTheme()

    const toggleThemeDarkMode = () => {
      theme.global.name.value = isDark.value ? 'light' : 'dark'
      localStorage.setItem('user-theme', theme.global.name.value)
    }

    const getMediaPreference = () => {
      const hasDarkPreference = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      return hasDarkPreference ? 'dark' : 'light'
    }

    const getTheme = () => {
      return localStorage.getItem('user-theme')
    }

    const userThemeChoice = getTheme()
    if (
      !userThemeChoice ||
      (userThemeChoice !== 'light' && userThemeChoice !== 'dark')
    ) {
      theme.global.name.value = getMediaPreference()
      localStorage.setItem('user-theme', theme.global.name.value)
    } else {
      theme.global.name.value = userThemeChoice
    }

    return {
      isDark,
      toggleThemeDarkMode,
      t,
    }
  },
}
</script>

<style scoped>
#theme {
  pointer-events: auto;
  z-index: 4;
}

.theme-icon {
  transition: transform 0.3s ease;
  transform: rotate(-190deg);
}

.theme-icon-dark {
  transform: rotate(0deg);
}
</style>
