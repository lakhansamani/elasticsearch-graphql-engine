import { getMappings } from './mappings';

export const bootServer = async (): Promise<void> => {
  try {
    const mappings = await getMappings();
    console.log(mappings);
  } catch (err) {
    throw err;
  }
};
