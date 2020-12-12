export const bootTimeValidation = (): void => {
  if (!process.env.ELASTICSEARCH_URL) {
    throw new Error(`☠️ Please add elasticsearch url`);
  }
};
