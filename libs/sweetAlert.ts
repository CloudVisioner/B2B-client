export async function sweetTopSmallSuccessAlert(message: string, duration: number = 2000): Promise<void> {
  console.log('Success:', message);
}

export async function sweetMixinErrorAlert(message: string): Promise<void> {
  console.error('Error:', message);
}
