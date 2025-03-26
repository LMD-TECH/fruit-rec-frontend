import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegisterForm } from '../components/register-form'
import { useCustomQuery } from '@/context/querycontext'
import { toast } from 'sonner'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        replace: vi.fn(),
        push: vi.fn(),
    }),
}))

vi.mock('@/context/querycontext')
vi.mock('sonner')

describe('RegisterForm', () => {
    const mockOnMutate = vi.fn()
    const mockRouter = { replace: vi.fn() }

    beforeEach(() => {
        vi.clearAllMocks();
        (useCustomQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ onMutate: mockOnMutate })
    })

    it('renders register form correctly', () => {
        render(<RegisterForm />)

        expect(screen.getByTestId('lastName')).toBeDefined()
        expect(screen.getByTestId('firstName')).toBeDefined()
        expect(screen.getByTestId('email')).toBeDefined()
        expect(screen.getByTestId('phone')).toBeDefined()
        expect(screen.getByTestId('password')).toBeDefined()
        expect(screen.getByTestId('confirm-password')).toBeDefined()
        expect(screen.getByText('Soumettre')).toBeDefined()
        expect(screen.getByText(/Tu es déjà inscrit ?/)).toBeDefined()
    })

    it('handles successful registration', async () => {
        const successResponse = {
            message: 'Inscription réussie',
            status_code: 200,
            email: {
                to: 'test@example.com',
                is_sent: true
            }
        }

        mockOnMutate.mockResolvedValueOnce(successResponse)

        render(<RegisterForm />)

        // Fill in the form
        fireEvent.change(screen.getByTestId('lastName'), {
            target: { value: 'Doe' }
        })
        fireEvent.change(screen.getByTestId('firstName'), {
            target: { value: 'John' }
        })
        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'test@example.com' }
        })
        fireEvent.change(screen.getByTestId('phone'), {
            target: { value: '1234567890' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'password123' }
        })
        fireEvent.change(screen.getByTestId('confirm-password'), {
            target: { value: 'password123' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        await waitFor(() => {
            expect(mockOnMutate).toHaveBeenCalledWith({
                body: expect.any(FormData),
                contentType: 'multipart/form-data',
                endpoint: '/api/auth/register'
            })
            expect(toast).toHaveBeenCalledWith('Inscription réussie')
            // expect(mockRouter.replace).toHaveBeenCalledWith('/auth/login')
        })
    })

    it('shows error when passwords do not match', async () => {
        render(<RegisterForm />)

        fireEvent.change(screen.getByTestId('lastName'), {
            target: { value: 'Doe' }
        })
        fireEvent.change(screen.getByTestId('firstName'), {
            target: { value: 'John' }
        })
        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'test@example.com' }
        })
        fireEvent.change(screen.getByTestId('phone'), {
            target: { value: '1234567890' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'password123' }
        })
        fireEvent.change(screen.getByTestId('confirm-password'), {
            target: { value: 'differentpassword' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith('Les mots de passes ne correspondent pas !', {
                style: {
                    backgroundColor: 'red',
                    color: 'white'
                }
            })
        })
    })

    it('handles registration error', async () => {
        const errorResponse = {
            message: 'Erreur lors de l\'inscription',
            status_code: 400,
            error: 'Email déjà utilisé'
        }

        mockOnMutate.mockResolvedValueOnce(errorResponse)

        render(<RegisterForm />)

        // Fill in the form
        fireEvent.change(screen.getByTestId('lastName'), {
            target: { value: 'Doe' }
        })
        fireEvent.change(screen.getByTestId('firstName'), {
            target: { value: 'John' }
        })
        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'existing@example.com' }
        })
        fireEvent.change(screen.getByTestId('phone'), {
            target: { value: '1234567890' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'password123' }
        })
        fireEvent.change(screen.getByTestId('confirm-password'), {
            target: { value: 'password123' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith('Une erreur s\'est produite !', {
                description: 'Email déjà utilisé',
                style: {
                    backgroundColor: 'red',
                    color: 'white'
                }
            })
        })
    })

    it('shows loading state during form submission', async () => {
        mockOnMutate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

        render(<RegisterForm />)

        // Fill in the form
        fireEvent.change(screen.getByTestId('lastName'), {
            target: { value: 'Doe' }
        })
        fireEvent.change(screen.getByTestId('firstName'), {
            target: { value: 'John' }
        })
        fireEvent.change(screen.getByTestId('email'), {
            target: { value: 'test@example.com' }
        })
        fireEvent.change(screen.getByTestId('phone'), {
            target: { value: '1234567890' }
        })
        fireEvent.change(screen.getByTestId('password'), {
            target: { value: 'password123' }
        })
        fireEvent.change(screen.getByTestId('confirm-password'), {
            target: { value: 'password123' }
        })

        fireEvent.click(screen.getByText('Soumettre'))

        expect(screen.getByText('Soumission...')).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeDisabled()
    })
}) 