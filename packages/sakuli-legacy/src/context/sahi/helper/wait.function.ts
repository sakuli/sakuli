export async function wait(milliseconds: number) {
  await new Promise<void>((res) => {
    setTimeout(() => res(), milliseconds);
  });
}
