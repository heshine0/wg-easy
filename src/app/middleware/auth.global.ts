export default defineNuxtRouteMiddleware(async (to) => {
  const baseURL = useRuntimeConfig().app.baseURL || '/';

  // api & setup handled server side
  if (to.path.startsWith(`${baseURL}api/`) || to.path.startsWith(`${baseURL}setup`)) {
    return;
  }

  const event = useRequestEvent();

  const authStore = useAuthStore();
  authStore.userData = await authStore.getSession(event);

  // skip login if already logged in
  if (to.path === `${baseURL}login`) {
    if (authStore.userData?.username) {
      return navigateTo('/', { redirectCode: 302 });
    }
    return;
  }

  // Require auth for every page other than Login
  if (!authStore.userData?.username) {
    return navigateTo('/login', { redirectCode: 302 });
  }

  // Check for admin access
  if (to.path.startsWith(`${baseURL}admin`)) {
    if (!hasPermissions(authStore.userData, 'admin', 'any')) {
      return abortNavigation('Not allowed to access Admin Panel');
    }
  }
});
