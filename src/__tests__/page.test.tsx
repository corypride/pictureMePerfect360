import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the components
jest.mock('@/components/layout/header', () => () => <div>Header</div>)
jest.mock('@/components/layout/footer', () => () => <div>Footer</div>)
jest.mock('@/components/sections/hero-section', () => () => <div>Hero Section</div>)
jest.mock('@/components/sections/gallery-section', () => () => <div>Gallery Section</div>)
jest.mock('@/components/sections/packages-section', () => () => <div>Packages Section</div>)
jest.mock('@/components/sections/booking-section', () => () => <div>Booking Section</div>)

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
  })

  it('displays all main sections', () => {
    render(<Home />)
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Hero Section')).toBeInTheDocument()
    expect(screen.getByText('Gallery Section')).toBeInTheDocument()
    expect(screen.getByText('Packages Section')).toBeInTheDocument()
    expect(screen.getByText('Booking Section')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})