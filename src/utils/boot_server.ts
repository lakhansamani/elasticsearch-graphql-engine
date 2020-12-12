import { getMappings } from '../elasticsearch/mappings';

export const bootServer = async (): Promise<void> => {
  try {
    const mappings = await getMappings();
    console.log(JSON.stringify(mappings));
  } catch (err) {
    throw err;
  }
};
