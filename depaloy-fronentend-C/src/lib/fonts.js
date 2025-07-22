// lib/fonts.js
import { Poppins, Roboto, Volkhov, Jost } from 'next/font/google'

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

// export const inter = Inter({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   display: 'swap',
// })

export const volkhov = Volkhov({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '700'], // You can adjust weights as needed (Jost supports 100-900)
  display: 'swap',
})