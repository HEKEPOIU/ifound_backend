import csrf from 'csurf'

const csrfProtection = csrf();

export { csrfProtection }
