// SweetAlert helper functions
// You can use sweetalert2 or create your own alert system

/**
 * Show success alert
 */
export async function sweetTopSmallSuccessAlert(message: string, duration: number = 2000): Promise<void> {
  // Implement with sweetalert2 or your alert system
  console.log('Success:', message);
  // Example with sweetalert2:
  // await Swal.fire({
  //   icon: 'success',
  //   title: message,
  //   timer: duration,
  //   showConfirmButton: false,
  //   position: 'top-end',
  // });
}

/**
 * Show error alert
 */
export async function sweetMixinErrorAlert(message: string): Promise<void> {
  // Implement with sweetalert2 or your alert system
  console.error('Error:', message);
  // Example with sweetalert2:
  // await Swal.fire({
  //   icon: 'error',
  //   title: 'Error',
  //   text: message,
  // });
}

// Add more alert functions as needed
