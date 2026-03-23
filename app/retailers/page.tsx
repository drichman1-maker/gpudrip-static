import { redirect } from 'next/navigation'

// Default to Amazon when visiting /retailers
export default function RetailersIndex() {
  redirect('/retailers/amazon')
}
