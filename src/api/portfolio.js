import portfolioData from '@/data/portfolios.json';

export const fetchPortfolios = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(portfolioData);
    }, 300);
  });
};

export const fetchPortfolioById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentIndex = portfolioData.findIndex((item) => item.id === id);

      if (currentIndex === -1) {
        resolve(null);
        return;
      }

      const data = portfolioData[currentIndex];

      const nextData =
        currentIndex < portfolioData.length - 1
          ? portfolioData[currentIndex + 1]
          : portfolioData[0];

      resolve({
        ...data,
        next: {
          id: nextData.id,
          title: nextData['work-title'],
          color: nextData['main-color'],
          theme: nextData['color-theme'],
        },
      });
    }, 300);
  });
};
