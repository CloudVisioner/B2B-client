// Utility functions
// Add your utility functions here

export function formatDate(date: string | Date): string {
  // Add date formatting logic
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount: number): string {
  // Add currency formatting logic
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Add more utility functions as needed
