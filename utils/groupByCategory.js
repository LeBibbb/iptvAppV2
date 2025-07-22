// utils/groupByCategory.js

export function groupByCategory(items, categoryKey = 'category') {
  return items.reduce((acc, item) => {
    const category = item[categoryKey] || 'Inconnu';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
}
