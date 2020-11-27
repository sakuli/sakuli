export const timeout = (
  updateInterval: number,
  maxDuration: number,
  action: (...params: any) => Promise<boolean>
) => {
  return new Promise((resolve, reject) => {
    let interval: NodeJS.Timeout;
    let timerCleaned = false;

    function executeInterval() {
      action().then(validateResult).catch(handleRejection);
    }

    function validateResult(result: boolean) {
      if (!result) {
        interval = setTimeout(executeInterval, updateInterval);
      } else {
        cleanupTimer();
        resolve(result);
      }
    }

    function handleRejection() {
      if (!timerCleaned) {
        interval = setTimeout(executeInterval, updateInterval);
      }
    }

    function cleanupTimer() {
      timerCleaned = true;
      if (maxTimeout) {
        clearTimeout(maxTimeout);
      }
      if (interval) {
        clearTimeout(interval);
      }
    }

    const maxTimeout = setTimeout(() => {
      cleanupTimer();
      reject(`Action timed out after ${maxDuration} ms`);
    }, maxDuration);

    executeInterval();
  });
};
