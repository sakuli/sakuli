export const timeout = <T>(
  updateInterval: number,
  maxDuration: number,
  action: (...params: any) => Promise<T>
) => {
  return new Promise<T>((resolve, reject) => {
    let interval: NodeJS.Timeout;
    let timerCleaned = false;

    function executeInterval() {
      action().then(validateResult).catch(handleRejection);
    }

    function validateResult(result: T) {
      if (!result && !timerCleaned) {
        interval = global.setTimeout(executeInterval, updateInterval);
      } else {
        cleanupTimer();
        resolve(result);
      }
    }

    function handleRejection() {
      if (!timerCleaned) {
        interval = global.setTimeout(executeInterval, updateInterval);
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
      reject(Error(`Action timed out after ${maxDuration} ms`));
    }, maxDuration);

    executeInterval();
  });
};
