/* First setup of wg-easy */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const baseURL = useRuntimeConfig().app.baseURL || '/';

  // User can't be logged in, and public routes can be accessed whenever
  if (url.pathname.startsWith(`${baseURL}api/`) || url.pathname.startsWith('/_i18n/')) {
    return;
  }

  const { step, done } = await Database.general.getSetupStep();
  if (!done) {
    const setupRegex = new RegExp(`^${baseURL.replace(/\//g, '\\/')}setup\\/(\\d)$`);
    const parsedSetup = url.pathname.match(setupRegex);
    if (!parsedSetup) {
      return sendRedirect(event, `${baseURL}setup/1`, 302);
    }
    const [_, currentSetup] = parsedSetup;

    if (step.toString() === currentSetup) {
      return;
    }
    return sendRedirect(event, `${baseURL}setup/${step}`, 302);
  } else {
    // If already set up
    if (!url.pathname.startsWith(`${baseURL}setup/`)) {
      return;
    }
    return sendRedirect(event, `${baseURL}login`, 302);
  }
});
