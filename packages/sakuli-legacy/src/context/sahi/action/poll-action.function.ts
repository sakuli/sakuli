export const timeout = (
  updateInterval: number,
  maxDuration: number,
  action: (...params: any) => Promise<boolean>
) => {
  return new Promise((resolve, reject) => {
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      if (interval) {
        clearTimeout(interval);
      }
      reject(`Action timed out after ${maxDuration}`);
    }, maxDuration);
    const startInterval = () => {
      interval = setTimeout(function intervalFunc() {
        action()
          .then((result) => {
            if (!result) {
              interval = setTimeout(intervalFunc, updateInterval);
            } else {
              clearTimeout(timeout);
              clearTimeout(interval);
              resolve();
            }
          })
          .catch(() => {
            interval = setTimeout(intervalFunc, updateInterval);
          });
      }, updateInterval);
    };

    action()
      .then((result) => {
        if (result) {
          clearTimeout(timeout);
          resolve();
        } else {
          startInterval();
        }
      })
      .catch(() => {
        startInterval();
      });
  });
};
