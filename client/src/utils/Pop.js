import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const colorConfig = {
  confirmButtonColor: 'var(--bs-success)',
  cancelButtonColor: 'var(--bs-danger)',
  background: 'var(--bs-black)',
  color: 'var(--bs-text)'
}


export default class Pop {
  static success(title, message) {
    Pop.toast(title ?? 'Success!', message, 'success')
  }

  static error(error, hint) {
    Pop.toast('Oh No!', error?.message ?? 'something went wrong', 'error', hint ?? 'Refresh the page and try again. If issue persists please let us know')
  }

  static toast(title = 'Toast is ready', text = '', icon = 'info', footer = '', position = 'bottom') {
    // @ts-ignore
    Swal.fire({
      title,
      text,
      icon,
      footer,
      toast: true,
      timer: 4000,
      position,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
      ...colorConfig
    })
  }
}
