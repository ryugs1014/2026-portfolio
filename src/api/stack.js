import stackData from '@/data/stacks.json';

export const fetchStacks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(stackData);
    }, 200);
  });
};
