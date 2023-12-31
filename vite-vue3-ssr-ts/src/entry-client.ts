import { createApp } from "./main";

const { app, router, store } = createApp();

router.isReady().then(() => {
  router.beforeResolve(async (to, from) => {
    let diffed = false;
    const activated = to.matched.filter((c, i) => {
      return (
        diffed || (diffed = from.matched[i] !== c) || (diffed = !!c.meta.diffed)
      );
    });

    const matchedComponents = activated.flatMap((record: any) =>
      Object.values(record.components)
    );

    if (!activated.length) return true;
    await Promise.all(
      matchedComponents.map((c: any) => {
        if (c.asyncData) {
          return c.asyncData({ route: to, store });
        }
        return true;
      })
    );
  });
  app.mount("#app");
  console.log("hydrated");
});

store.state.value = JSON.parse(
  document.getElementById("app-state")?.innerText as string
);
